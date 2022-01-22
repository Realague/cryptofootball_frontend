import React from 'react'
import { Stack, Typography } from '@mui/material'
import FootballPlayerCollection from '../../components/FootballPlayerCollection'
import Box from '@mui/material/Box'
import { useSelector } from 'react-redux'

const MatchPage = () => {
	const { team } = useSelector(state => state.game)

	if (team.strategy === undefined || team.players.length === 0) {
		return (
			<Box display="flex" justifyContent="center" direction="column" width="100%" p={2}>
				<Typography variant="h6">
					You need to create a team in order to play.
				</Typography>
			</Box>
		)
	}

	return (
		<Stack justifyContent="center" alignItems="center" width="100%" p={2} spacing={2}>
			<Typography variant="h6" color="secondary">CHOOSE YOUR OPPONENT</Typography>
		</Stack>
	)
}

export default MatchPage
