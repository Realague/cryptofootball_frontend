import React from 'react'
import {Box, Stack, Typography} from '@mui/material'
import messi from '../../../images/footballplayer/messi.jpeg'
import footballHeroesService from '../../../services/FootballPlayerService'
import Position from '../../../enums/Position'
import {useTheme} from '@emotion/react'

const PlayerListItem = ({ player }) => {
	const theme = useTheme()

	return (
		<Stack sx={{
			width: '100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			backgroundColor: theme.palette.background.light,
		}} direction="row" spacing={2} p={1}>
			<img
				src={messi}
				style={{
					height: '70x',
					width: '60px',
					boxShadow: '0px 0px 5px #d0ad34',
					border: '1px solid #d0ad34',
					objectFit: 'cover',
					outline: 'none',
				}}
			/>
			<Typography variant="h6">
				{footballHeroesService.getPlayersName(player)}
			</Typography>
			<Stack direction="row" alignItems="center" spacing={2}>
				<Typography
					variant="subtitle1"
					display="flex"
					justifyContent="flex-end"
					sx={{
						textShadow: '1px 1px 0 black'
					}}
				>
					{Position.positionIdToString(player.position)}
				</Typography>
				<Typography
					variant="h6"
					display="flex"
					justifyContent="center"
					sx={{
						textShadow: '0 0 10px yellow'
					}}
				>
					{player.score}
				</Typography>
			</Stack>
		</Stack>
	)
}

export default PlayerListItem
