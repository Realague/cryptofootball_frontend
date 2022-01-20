import React, { useEffect } from 'react'
import { Box, Divider, Grid, Slide, Stack, Typography } from '@mui/material'
import Strategy from '../../../enums/Strategy'
import Button from '@mui/material/Button'
import Position from '../../../enums/Position'
import LayoutContent from '../../../components/LayoutContent'
import PlayerListItem from './PlayerListItem'
import { useDispatch, useSelector } from 'react-redux'
import { resetTeam, setStrategy } from '../../../features/gameSlice'
import footballHeroesService from '../../../services/FootballPlayerService'

const DrawerContent = ({ lastPlayerDropped }) => {
	const { team } = useSelector(state => state.game)
	const dispatch = useDispatch()

	useEffect(() => {
		footballHeroesService.getCompositionList().then(r => console.log(r))
	}, [])

	const selectStrategy = async (strategy) => {
		dispatch(setStrategy(strategy.id))
	}

	const resetStrategy = () => {
		dispatch(resetTeam())
	}

	return (
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
											<Typography variant="subtitle2">{Position.Positions[k].name}</Typography>
											<Typography variant="subtitle2">
												{team.players.filter(p => p.position === k).length} / {Strategy.Strategies[team.strategy].composition[k]}
											</Typography>
										</Stack>
										{
											team.players.filter(p => p.position === k).map(p => {
												return lastPlayerDropped.id === p.id ?
													<Slide appear in key={p.id} direction="right">
														<LayoutContent>
															<PlayerListItem player={p}/>
														</LayoutContent>
													</Slide>
													:
													<PlayerListItem player={p}/>
											})
										}
									</Stack>
								)
							})
						}

					</Stack>

			}
		</Box>
	)
}

export default DrawerContent
