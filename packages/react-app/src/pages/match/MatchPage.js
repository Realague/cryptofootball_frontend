import React, { useEffect, useState } from 'react'
import { Button, CircularProgress, Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material'
import Box from '@mui/material/Box'
import { useSelector } from 'react-redux'
import footballHeroesService from '../../services/FootballPlayerService'
import TabOpponent  from './components/TabOpponent'
import PlayerIcon from './components/PlayerIcon'
import { useTheme } from '@emotion/react'
import LoadingButton from '@mui/lab/LoadingButton'
import TokenImage from '../../images/token.png'

const MatchPage = () => {
	const { team } = useSelector(state => state.game)
	const { teamDrawerOpen, isInTransaction } = useSelector(state => state.settings)
	const [opponents, setOpponents] = useState([])
	const [myComposition, setMyComposition] = useState(undefined)
	const [selectedOpponent, setSelectedOpponent] = useState(undefined)
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('md'))
	const [isFetchingOpponents, setIsFetchingOpponents] = useState(true)
	const [matchAvailable, setMatchAvailable] = useState(0)
	const [refreshPrice, setRefreshPrice] = useState(0)

	useEffect(() => {
		fetchOpponents()
		fetchAvailableMatchs()
	}, [])

	useEffect(() => {
		if (team !== undefined) {
			footballHeroesService.convertPlayersIdToComposition(team).then(c => setMyComposition(c))
		}
		footballHeroesService.getRefreshFees().then(price => setRefreshPrice(price))
	}, [team])

	const fetchAvailableMatchs = () => {
		footballHeroesService.getMatchAvailable().then(amount =>  setMatchAvailable(amount))
	}

	const fetchOpponents = async () => {
		setIsFetchingOpponents(true)
		const tempOpponents = []
		const teamsId = await footballHeroesService.getOpponentFootballTeams()

		for (const id of teamsId) {
			const jobsDefenders = []
			const jobsAttackers = []
			const jobsMidfielders = []
			const jobGoalKeeper = []
			const team = await footballHeroesService.getOpponentFootballTeam(id)
			const teamData = {
				id,
				defenders: [],
				attackers: [],
				midfielders: [],
				goalkeeper: undefined,
				score : team.averageScore,
				rewards: team.rewards
			}
			for (const defenderId of team.defenders) {
				jobsDefenders.push(footballHeroesService.getOpponentPlayer(defenderId))
			}
			for (const attackerId of team.attackers) {
				jobsAttackers.push(footballHeroesService.getOpponentPlayer(attackerId))
			}
			for (const midfielderId of team.midfielders) {
				jobsMidfielders.push(footballHeroesService.getOpponentPlayer(midfielderId))
			}
			jobGoalKeeper.push(footballHeroesService.getOpponentPlayer(team.goalKeeper))
			teamData.defenders = await Promise.all(jobsDefenders)
			teamData.attackers = await Promise.all(jobsAttackers)
			teamData.midfielders = await Promise.all(jobsMidfielders)
			teamData.goalkeeper = (await Promise.all(jobGoalKeeper))[0]
			tempOpponents.push(teamData)
		}
		setOpponents(tempOpponents)
		if (tempOpponents.length > 0 && selectedOpponent === undefined) {
			const composition = { }
			for (const key of ['defenders', 'midfielders', 'attackers']) {
				composition[key] = tempOpponents[0][key].map(c => ({ ...c }))
			}
			composition.goalkeeper = tempOpponents[0].goalkeeper
			setSelectedOpponent(composition)
		}
		setIsFetchingOpponents(false)
	}


	if (team.strategy === undefined || team.players.length === 0) {
		return (
			<Box display="flex" justifyContent="center" direction="column" width="100%" p={2}>
				<Typography variant="h6">
					You need to create a team in order to play.
				</Typography>
			</Box>
		)
	}

	const selectOpponent = async (compo) => {
		const composition = { }
		for (const key of ['defenders', 'midfielders', 'attackers']) {
			composition[key] = compo[key].map(c => ({ ...c }))
		}
		composition.goalkeeper = compo.goalkeeper
		setSelectedOpponent(composition)
	}

	const MapPositionContainer = ({ children }) => {
		return (
			<Grid item xs={3}>
				<Stack alignItems="center" justifyContent="center" height="100%" spacing={4}>
					{ children }
				</Stack>
			</Grid>
		)
	}

	const RenderTeam = ({ composition, reversed = false }) => {
		return (
			<Stack direction={reversed ? 'row-reverse' : 'row'} width="50%">
				<MapPositionContainer>
					{
						composition.goalkeeper !== undefined &&
						<PlayerIcon isNpc={reversed} player={composition.goalkeeper}/>
					}
				</MapPositionContainer>
				{
					['defenders', 'midfielders', 'attackers'].map((position, i) => (
						<MapPositionContainer key={i}>
							{
								composition[position].map((p, indexPlayer) => (
									<PlayerIcon isNpc={reversed} key={reversed ? i + indexPlayer + 30 : p.id} player={p}/>)
								)
							}
						</MapPositionContainer>
					))
				}
			</Stack>
		)
	}

	return (
		<Stack justifyContent="center" alignItems="center" width="100%" p={2} spacing={1}>
			<Stack
				direction="row"
				width={isMobile ? '90%' : '100%' }
				justifyContent={isMobile ? 'center' : ''}
			>
				<Stack width="60%" hidden={isMobile}  spacing={1} p={teamDrawerOpen ? 2 : 0}>
					<Typography variant="h4" color="secondary">Match</Typography>
					<Divider flexItem/>
					<Grid  container sx={{
						background: 'url("/stadium.png")',
						height: teamDrawerOpen ? '350px' : '500px',
						backgroundSize: '100% 100%',
						backgroundRepeat: 'no-repeat',
					}}>
						{
							myComposition !== undefined &&
						<RenderTeam composition={myComposition} />
						}
						{
							selectedOpponent !== undefined &&
						<RenderTeam composition={selectedOpponent} reversed />
 					}

					</Grid>
				</Stack>
				<Stack width={isMobile ? '100%': '40%'} justifyContent="flex-start" alignItems="center" spacing={2}>
					<Typography variant="h5" color="secondary">Opponents</Typography>
					<Stack spacing={1}>
						<Divider/>
						<Stack direction="row" width="100%" justifyContent="space-between" alignItems="center" spacing={2}>
							<Stack direction="row" alignItems="center" spacing={0.5}>
								<Typography alignSelf="center" variant="body2">
									My team score:
								</Typography>
								<Typography variant="body2" sx={{
									textShadow: '0 0 1px yellow',
								}}>
									{
										Math.round(
											team.players.reduce((prev, current) => (prev || 0) + +current.score, 0) / 11
										)
									}
								</Typography>
							</Stack>
							<Typography alignSelf="center" variant="body2">
							Match available: {matchAvailable} / {
									[2, 3, 4, 5, 6][
										Math.round(
											team.players.reduce((prev, current) => (prev || 0) + +current.frame, 0) / 11
										)
									]
								}
							</Typography>
						</Stack>
						<Divider/>
						<LoadingButton
							variant="contained"
							fullWidth
							loading={isInTransaction}
							onClick={async () => {
								await footballHeroesService.refreshOpponentTeams()
							}}
							endIcon={
								<Stack direction="row" alignItems="center" spacing={0.5}>
									<Divider orientation="vertical" />
									<Typography variant="body1">{refreshPrice}</Typography>
									<img style={{ width: 20, height: 20 }} src={TokenImage} alt="token"/>
								</Stack>
							}
						>
							Refresh opponents
						</LoadingButton>
						{
							isFetchingOpponents ?
								<Box display="flex" alignItems="center" justifyContent="center" width="100%">
									<CircularProgress sx={{ marginTop: '15px' }} color="secondary"/>
								</Box>
								:
								<TabOpponent
									matchAvailable={matchAvailable}
									setMatchAvailable={setMatchAvailable}
									opponents={opponents} selectOpponent={selectOpponent}
								/>
						}
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	)
}

/*
	{
								opponents.map((o, i) => (
								<Stack key={i}>
										<Typography onClick={() => selectOpponent(o)}>
											Clique ici bg
										</Typography>
									</Stack>
								))
							}
 */

export default MatchPage
