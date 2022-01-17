import React from 'react'
import {Box, Divider, Drawer, IconButton, ListItem, ListItemIcon, ListItemText, Stack, Typography} from '@mui/material'
import {theme} from '../../theme'
import {AddCircle, ChevronLeft, ChevronRight, Inbox, List, Mail} from '@mui/icons-material'
import {drawerTeamWidth} from '../../App'
import {styled} from '@mui/material/styles'
import {useSelector} from 'react-redux'
import {useTheme} from '@emotion/react'
import DroppableBox from '../../components/droppableBox/DroppableBox'
import {ItemTypes} from '../../components/Constants'

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
	justifyContent: 'flex-start',
}))

const TeamDrawer = ({ open, changeState }) => {
	const isDraggingPlayer = useSelector(state => state.game.isDraggingPlayer)
	const theme = useTheme()

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
			<DrawerHeader sx={{
				display: 'flex',
				justifyContent: 'space-between'
			}}>
				<IconButton onClick={() => changeState()}>
					{theme.direction === 'rtl' ? <ChevronLeft /> : <ChevronRight />}
				</IconButton>
				<Typography variant="h6" color="secondary">
                    Team
				</Typography>
				<Box/>
			</DrawerHeader>
			<Divider />
			<Stack p={4} spacing={2} sx={{
				display: 'flex',
				width: '100%',
				height: '100%',
				justifyContent: 'center',
				alignItems: 'center',
			}}>
				{
					isDraggingPlayer ?
						<DroppableBox onDrop={(i) => console.log('dropped', i)} type={ItemTypes.PLAYER}>
							<AddCircle sx={{
								height: '70px',
								width: '70px',
							}} />
							<Typography fontSize={20} color="secondary" variant="button">
								Drop the player here to add in team
							</Typography>
						</DroppableBox>
						:
						<>
							<Typography>Bnojour</Typography>
						</>
				}
			</Stack>

		</Drawer>
	)
}

export default TeamDrawer
