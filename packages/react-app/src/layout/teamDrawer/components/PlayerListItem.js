import React from 'react'
import { Box, IconButton, Stack, Typography, useMediaQuery } from '@mui/material'
import footballHeroesService from '../../../services/FootballPlayerService'
import Position from '../../../enums/Position'
import { useTheme } from '@emotion/react'
import { Remove } from '@mui/icons-material'
import { useDispatch } from 'react-redux'
import { removePlayerFromTeamById } from '../../../features/gameSlice'
import Frame from '../../../enums/Frame'

const PlayerListItem = ({ player, onClick, icon = <Remove /> }) => {
	const theme = useTheme()
	const dispatch = useDispatch()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	const removePlayer = (playerId) => {
		dispatch(removePlayerFromTeamById(playerId))
	}

	return (
		<Stack sx={{
			width: '100%',
			height: '80px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			backgroundColor: theme.palette.background.light,
			background: `linear-gradient(0.25turn, ${Frame.TierList[player.frame].color.dark}, 30%, ${theme.palette.background.paper})`
		}} direction="row" spacing={2} p={1}>
			<Stack direction={isMobile ? 'column' : 'row'} spacing={2} alignItems="center">
				<img
					src={`/footballplayer/${player.position}-${player.rarity}-${player.imageId}.png`}
					style={{
						height: '70px',
						width: '60px',
						boxShadow: `0px 0px 5px ${Frame.TierList[player.frame].color.dark}, inset 0px 0px 50px ${Frame.TierList[player.frame].color.main}`,
						background: 'radial-gradient(at 50% 0, black, transparent 70%),linear-gradient(0deg, black, transparent 50%) bottom',
						border: `1px solid ${Frame.TierList[player.frame].color.light}`,
						objectFit: 'cover',
						outline: 'none',
					}}
				/>
				<Typography hidden={isMobile} variant="h6">
					{footballHeroesService.getPlayersName(player)}
				</Typography>
			</Stack>
			<Stack direction="row" alignItems="center" spacing={2}>
				<Stack direction={isMobile ? 'column' : 'row'} alignItems="center" spacing={isMobile ? 1 : 2}>
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

				<IconButton onClick={() => onClick(player) || removePlayer(player.id)}>
					{icon}
				</IconButton>
			</Stack>
		</Stack>
	)
}

export default PlayerListItem
