import React, { useEffect, useState } from 'react'
import { Box, Divider, Grid, Slide, Stack, Typography, useMediaQuery } from '@mui/material'
import Strategy from '../../../enums/Strategy'
import Button from '@mui/material/Button'
import Position from '../../../enums/Position'
import LayoutContent from '../../../components/LayoutContent'
import PlayerListItem from './PlayerListItem'
import { useDispatch, useSelector } from 'react-redux'
import { removePlayerFromTeamById, resetTeam, setStrategy } from '../../../features/gameSlice'
import footballHeroesService from '../../../services/FootballPlayerService'
import { useTheme } from '@emotion/react'
import { Remove } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const DrawerContent = ({ lastPlayerDropped }) => {
	const { team, collection } = useSelector(state => state.game)
	const dispatch = useDispatch()
	const theme = useTheme()
	const [compositions, setCompositions] = useState([])
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const navigate = useNavigate()


	useEffect(() => {
		fetch().finally(() => setCompositions(Strategy.Strategies))
		return () => setCompositions([])
	}, [])

	const fetch = async () => {
		if (Strategy.Strategies.length === 0) {
			const response = await footballHeroesService.getCompositionList()
			response.forEach(compo => {
				Strategy.Strategies.push(new Strategy(Strategy.Strategies.length,
					`${compo.attackerNb} - ${compo.midfielderNb} - ${compo.defenderNb}`, {
						[Position.Attacker.id]: compo.attackerNb,
						[Position.Midfielder.id]: compo.midfielderNb,
						[Position.Defender.id]: compo.defenderNb,
						[Position.GoalKeeper.id]: 1,
					}))
			})
		}
	}

	const selectStrategy = async (strategy) => {
		dispatch(setStrategy(strategy.id))
	}

	const resetStrategy = () => {
		dispatch(resetTeam())
	}

	const destroyTeam = async () => {
		await footballHeroesService.resetTeam()
	}

	const saveTeam = async () => {
		if (team.players.length !== 11) {
			return
		}
		const composition = {
			goalkeeper: undefined,
			defenders: [],
			midfielders: [],
			attackers: [],
		}
		team.players.forEach(p => {
			switch (+p.position) {
			case Position.Attacker.id:
				composition.attackers.push(+p.id)
				break
			case Position.Midfielder.id:
				composition.midfielders.push(+p.id)
				break
			case Position.Defender.id:
				composition.defenders.push(+p.id)
				break
			case Position.GoalKeeper.id:
				composition.goalkeeper = +p.id
				break
			}
		})
		await footballHeroesService.setPlayerTeam(
			+team.strategy,
			+composition.goalkeeper,
			composition.defenders,
			composition.midfielders,
			composition.attackers,
		)
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
				(collection.length === 0) ?
					<Stack
						sx={{
							height: '100vh',
							alignItems: 'center',
							justifyContent: 'center',
						}}
						spacing={2}
						p={2}
					>
						<Typography textAlign='center' variant="body2">
							You don't have any player in your collection
						</Typography>
						<Typography textAlign='center'>
							you can open the mint's page by clicking on the button below
						</Typography>
						<Button
							variant="contained"
							onClick={() => {
								navigate('/mint')
							}}
						>
							Mint player
						</Button>
					</Stack>
					:
					(team && team.strategy === undefined) ?
						<Stack>
							<Typography variant="subtitle1">
                            You have to select your strategy first
							</Typography>
							<Grid container spacing={2} p={2}>
								{
									compositions.map(s => (
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
						<Stack alignItems="center" sx={{ width: '100%', backgroundColor: theme.palette.background.valueOf() }} spacing={2}>
							<Stack direction={isMobile ? 'column' : 'row'} spacing={1} alignItems="center">
								<Button
									disabled={team.players.length !== 11}
									onClick={() => saveTeam()}
									variant="contained"
									color="secondary"
								>
								Save team
								</Button>
								<Button
									onClick={() => resetStrategy()}
									variant="contained"
									color="primary"
								>
								Reset team
								</Button>
								<Button
									disabled={team.players.length === 0}
									onClick={() => destroyTeam()}
									variant="contained"
									color="error"
								>
								Disband team
								</Button>
							</Stack>

							<Divider variant="middle" flexItem/>

							<Stack spacing={1} sx={{
								overflowY: 'scroll',
								width: '100%',
								height: '80vh',
							}}>
								{
									compositions[team.strategy] !== undefined && Object.keys(compositions[team.strategy].composition).map(role => {
										return (
											<React.Fragment key={role}>
												<Stack key={role} direction="row" spacing={2} alignItems="center">
													<Typography variant="subtitle2">{Position.Positions[role].name}</Typography>
													<Typography variant="subtitle2">
														{team.players.filter(p => p.position === role).length} / {Strategy.Strategies[team.strategy].composition[role]}
													</Typography>
												</Stack>
												{
													team.players.filter(p => p.position === role).map(p => {
														return (lastPlayerDropped !== undefined && lastPlayerDropped.id === p.id) ?
															<Slide appear in key={p.id} direction="right">
																<LayoutContent>
																	<PlayerListItem
																		player={p}
																		icon={<Remove/>}
																		onClick={() => dispatch(removePlayerFromTeamById(p.id))}/>
																</LayoutContent>
															</Slide>
															:
															<PlayerListItem
																icon={<Remove/>}
																onClick={() => dispatch(removePlayerFromTeamById(p.id))}
																key={p.id} player={p}/>
													})
												}
											</React.Fragment>
										)
									})
								}
							</Stack>
						</Stack>

			}
		</Box>
	)
}

export default DrawerContent
