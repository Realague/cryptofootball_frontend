import React, { useEffect, useState } from 'react'
import { Divider, Drawer, Stack, useMediaQuery, } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import Strategy from '../../enums/Strategy'
import { addPlayerToTeam } from '../../features/gameSlice'
import { useSnackbar } from 'notistack'
import Header from './components/Header'
import DraggingContent from './components/DraggingContent'
import DrawerContent from './components/DrawerContent'
import { useTheme } from '@emotion/react'

const TeamDrawer = ({ open, changeState }) => {
	const { team } = useSelector(state => state.game)
	const { isDraggingPlayer } = useSelector(state => state.settings)
	const dispatch = useDispatch()
	const { enqueueSnackbar } = useSnackbar()
	const [lastPlayerDropped, setLastPlayerDropped] = useState(undefined)
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const [tempTeam, setTempTeam] = useState([])

	const drawerTeamWidth = isMobile ? 200 : 500

	useEffect(() => {
		if (team.players !== undefined) {
			setTempTeam(team.players)
		}
	}, [team])

	const onPlayerDropped = async (player) => {
		if (team.strategy === undefined) {
			enqueueSnackbar('You must choose a composition first', { variant: 'error' })
			return
		}

		const usedStrategy = Strategy.Strategies.find(s => s.id === team.strategy)

		if (usedStrategy.composition[player.position] <= tempTeam.filter(p => p.position === player.position).length) {
			enqueueSnackbar('Too many players on this position', { variant: 'error' })
			return
		}

		if (tempTeam.filter(p => p.id === player.id).length) {
			enqueueSnackbar('Cannot use the same user more than once', { variant: 'error' })
			return
		}
		setLastPlayerDropped(player)
		setTempTeam([...tempTeam, player])
		//dispatch(addPlayerToTeam(player))
		enqueueSnackbar('Player added !', { variant: 'success' })
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
			<Header changeState={changeState}/>
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
						<DraggingContent onDrop={(v) => onPlayerDropped(v)}/>
						:
						<DrawerContent tempTeam={tempTeam} setTempTeam={setTempTeam} lastPlayerDropped={lastPlayerDropped}/>

				}
			</Stack>
		</Drawer>
	)
}

export default TeamDrawer
