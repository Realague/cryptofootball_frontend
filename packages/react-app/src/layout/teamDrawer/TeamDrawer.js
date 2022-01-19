import React from 'react'
import {
	Avatar,
	Box,
	Divider,
	Drawer,
	Grid,
	IconButton,
	ListItem, ListItemAvatar,
	ListItemIcon,
	ListItemText,
	Stack,
	Typography
} from '@mui/material'
import {theme} from '../../theme'
import {AddCircle, ChevronLeft, ChevronRight, ImageAspectRatio, Inbox, List, Mail} from '@mui/icons-material'
import {drawerTeamWidth} from '../../App'
import {styled} from '@mui/material/styles'
import {useDispatch, useSelector} from 'react-redux'
import {useTheme} from '@emotion/react'
import DroppableBox from '../../components/droppableBox/DroppableBox'
import {ItemTypes} from '../../components/Constants'
import Strategy from '../../enums/Strategy'
import Button from '@mui/material/Button'
import {addPlayerToTeam, resetTeam, setStrategy} from '../../features/gameSlice'
import PlayerListItem from './components/PlayerListItem'
import Position from '../../enums/Position'
import {useSnackbar} from 'notistack'

const DrawerHeader = styled('div')(({theme}) => ({
	display: 'flex',
	alignItems: 'center',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
	justifyContent: 'flex-start',
}))

const TeamDrawer = ({open, changeState}) => {
	const {isDraggingPlayer, team} = useSelector(state => state.game)
	const theme = useTheme()
	const dispatch = useDispatch()
	const { enqueueSnackbar } = useSnackbar()

	const onPlayerDropped = (player) => {
		const usedStrategy = Strategy.Strategies.find(s => s.id === team.strategy)

		if (usedStrategy.composition[player.position] <= team.players.filter(p => p.position === player.position).length) {
			enqueueSnackbar('Too many players on this position', { variant: 'error' })
			return
		}

		if (team.players.filter(p => p.id === player.id).length) {
			enqueueSnackbar('Cannot use the same user more than once', { variant: 'error' })
			return
		}

		dispatch(addPlayerToTeam(player))
		enqueueSnackbar('Player added !', { variant: 'success' })

	}

	const selectStrategy = (strategy) => {
		dispatch(setStrategy(strategy.id))
	}

	const resetStrategy = () => {
		dispatch(resetTeam())
	}

	return (
		<Drawer
			sx={{
				width: drawerTeamWidth,
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: drawerTeamWidth,
				},
			}}
			variant="persistent"
			anchor="right"
			open={open}
		>
			<DrawerHeader sx={{
				display: 'flex',
				justifyContent: 'space-between'
			}}>
				<IconButton onClick={() => changeState()}>
					{theme.direction === 'rtl' ? <ChevronLeft/> : <ChevronRight/>}
				</IconButton>
				<Typography variant="h6" color="secondary">
                    Team
				</Typography>
				<Box/>
			</DrawerHeader>
			<Divider/>
			<Stack p={2} spacing={2} sx={{
				display: 'flex',
				width: '100%',
				height: '100%',
				justifyContent: 'center',
				alignItems: 'center',
			}}>
				{
					isDraggingPlayer ?
						<DroppableBox onDrop={(i) => onPlayerDropped(i)} type={ItemTypes.PLAYER}>
							<AddCircle sx={{
								height: '70px',
								width: '70px',
							}}/>
							<Typography fontSize={20} color="secondary" variant="button">
                                Drop the player here to add in team
							</Typography>
						</DroppableBox>
						:
						<>
							<Box sx={{
								flexGrow: 1,
								width: '100%',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'flex-start'
							}}>
								{
									(team && team.strategy === undefined) ?
										<Stack>
											<Typography variant="subtitle1">
                                                You have to select your strategy first
											</Typography>
											<Grid container spacing={2} p={2}>
												{
													Strategy.Strategies.map(s => (
														<Grid key={s.id} item>
															<Button
																onClick={() => selectStrategy(s)}
																variant="contained"
																color="secondary"
															>
																{s.name}
															</Button>
														</Grid>
													))
												}
											</Grid>

										</Stack>
										: // strategy selected
										<Stack alignItems="center" sx={{ width: '100%' }} spacing={2}>
											<Button
												onClick={() => resetStrategy()}
												variant="contained"
												color="secondary"
											>
                                                Reset team
											</Button>
											<Divider variant="middle" flexItem/>

											{
												Object.keys(Strategy.Strategies[team.strategy].composition).map(k => {
													return (
														<Stack key={k} spacing={2} width="100%">
															<Stack direction="row" spacing={2} alignItems="center">
																<Typography variant="subtitle2">{ Position.Positions[k].name }</Typography>
																<Typography variant="subtitle2">
																	{team.players.filter(p => p.position === k).length} / {Strategy.Strategies[team.strategy].composition[k]}
																</Typography>
															</Stack>
															{
																team.players.filter(p => p.position === k).map(p => (
																	<PlayerListItem key={p.id} player={p} />
																))
															}
														</Stack>
													)
												})
											}

										</Stack>

								}
							</Box>
						</>
				}
			</Stack>

		</Drawer>
	)
}

export default TeamDrawer
