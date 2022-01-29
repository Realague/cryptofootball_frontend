import React, { useEffect, useState } from 'react'
import { Avatar, Grid, Popover, Stack, Typography, useMediaQuery } from '@mui/material'
import Box from '@mui/material/Box'
import { useSelector } from 'react-redux'
import footballHeroesService from '../../services/FootballPlayerService'
import Frame from '../../enums/Frame'
import Card from '../../components/card/Card'
import TabOpponent, { TabPanel } from './components/TabOpponent'
import TabsUnstyled from '@mui/base/TabsUnstyled'
import PlayerIcon from './components/PlayerIcon'
import { useTheme } from '@emotion/react'

const MatchPage = () => {
	const { team } = useSelector(state => state.game)
	const { teamDrawerOpen } = useSelector(state => state.settings)
	const [opponents, setOpponents] = useState([])
	const [myComposition, setMyComposition] = useState(undefined)
	const [selectedOpponent, setSelectedOpponent] = useState(undefined)
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('md'))


	useEffect(() => {
		fetchOpponents()
	}, [])

	useEffect(() => {
		if (team !== undefined) {
			footballHeroesService.convertPlayersIdToComposition(team).then(c => setMyComposition(c))
		}
	}, [team])

	const fetchOpponents = async () => {
		const tempOpponents = []
		const teamsId = await footballHeroesService.getOpponentFootballTeams()

		for (const id of teamsId) {
			const team = await footballHeroesService.getOpponentFootballTeam(id)
			const teamData = {
				id,
				defenders: [],
				attackers: [],
				midfielders: [],
				goalkeeper: undefined,
				score : team.averageScore,
			}
			for (const defenderId of team.defenders) {
				teamData.defenders.push(await footballHeroesService.getOpponentPlayer(defenderId))
			}
			for (const attackerId of team.attackers) {
				teamData.attackers.push(await footballHeroesService.getOpponentPlayer(attackerId))
			}
			for (const midfielderId of team.midfielders) {
				teamData.midfielders.push(await footballHeroesService.getOpponentPlayer(midfielderId))
			}
			teamData.goalkeeper = await footballHeroesService.getOpponentPlayer(team.goalKeeper)
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
		<Stack justifyContent="center" alignItems="center" width="100%" height="500px" p={2}>
			<Stack direction="row" width={isMobile ? '90%' : '100%' } height="100%" justifyContent={isMobile ? 'center' : ''}>
				<Grid height={teamDrawerOpen ? '70%' : '100%'} hidden={isMobile} container width="60%" sx={{
					background: 'url("/stadium.png")',
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
				<Stack width={isMobile ? '100%': '40%'} justifyContent="flex-start" alignItems="center" spacing={2}>
					<Typography variant="h5" color="secondary">Opponents</Typography>
					<Stack>
						<TabOpponent opponents={opponents} selectOpponent={selectOpponent}/>
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
