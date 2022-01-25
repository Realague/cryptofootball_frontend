import React, { useEffect, useState } from 'react'
import { Avatar, Grid, Stack, Typography } from '@mui/material'
import FootballPlayerCollection from '../../components/FootballPlayerCollection'
import Box from '@mui/material/Box'
import { useSelector } from 'react-redux'
import footballHeroesService from '../../services/FootballPlayerService'
import Frame from '../../enums/Frame'

const MatchPage = () => {
	const { team } = useSelector(state => state.game)
	const [opponents, setOpponents] = useState([])
	const [myComposition, setMyComposition] = useState(undefined)
	const [selectedOpponent, setSelectedOpponent] = useState(undefined)

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
				defenders: [],
				attackers: [],
				midfielders: [],
				goalKeeper: undefined,
			}
			for (const defenderId of team.defenders) {
				teamData.defenders.push(await footballHeroesService.getFootballPlayer(defenderId))
			}
			for (const attackerId of team.attackers) {
				teamData.attackers.push(await footballHeroesService.getFootballPlayer(attackerId))
			}
			for (const midfielderId of team.midfielders) {
				teamData.midfielders.push(await footballHeroesService.getFootballPlayer(midfielderId))
			}
			teamData.goalKeeper = team.goalKeeper
			tempOpponents.push(teamData)
		}
		setOpponents(tempOpponents)
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

	const MapPlayerIcon = ({ player }) => {
		return <Avatar
			src={`/footballplayer/${player.position}-${player.rarity}-${player.imageId}.png`}
			style={{
				boxShadow: `0px 0px 5px ${Frame.TierList[player.frame].color.dark}, inset 0px 0px 50px ${Frame.TierList[player.frame].color.main}`,
				background: 'radial-gradient(at 50% 0, black, transparent 70%),linear-gradient(0deg, black, transparent 50%) bottom',
				border: `1px solid ${Frame.TierList[player.frame].color.light}`,
				objectFit: 'cover',
				outline: 'none',
			}}
		/>
	}

	const RenderTeam = ({ composition, reversed = false }) => {
		return (
			<Stack direction={reversed ? 'row-reverse' : 'row'} width="50%">
				<MapPositionContainer>
					{
						composition.goalkeeper !== undefined &&
						<MapPlayerIcon player={composition.goalkeeper}/>
					}
				</MapPositionContainer>
				<MapPositionContainer>
					{
						composition.defenders.map(p => <MapPlayerIcon key={p.id} player={p}/>)
					}
				</MapPositionContainer>
				<MapPositionContainer>
					{
						composition.midfielders.map(p => <MapPlayerIcon key={p.id} player={p}/>)
					}
				</MapPositionContainer>
				<MapPositionContainer>
					{
						composition.attackers.map(p => <MapPlayerIcon key={p.id} player={p}/>)
					}
				</MapPositionContainer>
			</Stack>
		)
	}

	return (
		<Stack justifyContent="center" alignItems="center" width="100%" height="500px" p={2} spacing={2}>
			<Stack direction="row" width="100%" height="100%">
				<Grid container width="60%" sx={{
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
				<Stack width="40%" justifyContent="flex-start" alignItems="center">
					<Typography variant="h5" color="secondary">Opponents</Typography>
					<Stack>
						{
							opponents.map((o, i) => (
								<Stack key={i}>
									<Typography onClick={() => selectOpponent(o)}>
										Clique ici bg
									</Typography>
								</Stack>
							))
						}
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	)
}

export default MatchPage
