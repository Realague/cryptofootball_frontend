import React, {useState} from 'react'
import {Divider, Drawer, Stack,} from '@mui/material'
import {drawerTeamWidth} from '../../App'
import {useDispatch, useSelector} from 'react-redux'
import Strategy from '../../enums/Strategy'
import {addPlayerToTeam} from '../../features/gameSlice'
import {useSnackbar} from 'notistack'
import Header from './components/Header'
import DraggingContent from './components/DraggingContent'
import DrawerContent from './components/DrawerContent'

const TeamDrawer = ({open, changeState}) => {
	const {isDraggingPlayer, team} = useSelector(state => state.game)
	const dispatch = useDispatch()
	const {enqueueSnackbar} = useSnackbar()
	const [lastPlayerDropped, setLastPlayerDropped] = useState(undefined)

	const onPlayerDropped = (player) => {
		const usedStrategy = Strategy.Strategies.find(s => s.id === team.strategy)

		if (usedStrategy.composition[player.position] <= team.players.filter(p => p.position === player.position).length) {
			enqueueSnackbar('Too many players on this position', {variant: 'error'})
			return
		}

		if (team.players.filter(p => p.id === player.id).length) {
			enqueueSnackbar('Cannot use the same user more than once', {variant: 'error'})
			return
		}
		setLastPlayerDropped(player)
		dispatch(addPlayerToTeam(player))
		enqueueSnackbar('Player added !', {variant: 'success'})
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
						<DrawerContent lastPlayerDropped={lastPlayerDropped}/>

				}
			</Stack>

		</Drawer>
	)
}

export default TeamDrawer
