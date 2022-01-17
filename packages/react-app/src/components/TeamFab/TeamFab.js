import React from 'react'
import {Box, Fab} from '@mui/material'
import {Close, People} from '@mui/icons-material'
import {styled} from '@mui/material/styles'
import {drawerTeamWidth} from '../../App'
import {useSelector} from 'react-redux'

const FabStyled = styled(Box, { shouldForwardProp: (prop) => prop !== 'open' })(
	({ theme, open }) => ({
		margin: 0,
		top: 'auto',
		right: 20,
		bottom: 20,
		left: 'auto',
		position: 'fixed',
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		...(open && {
			marginRight: drawerTeamWidth,
			transition: theme.transitions.create('margin', {
				easing: theme.transitions.easing.easeOut,
				duration: theme.transitions.duration.enteringScreen,
			}),
		}),
	}),
)

const TeamFab = ({ onClick, open }) => {
	const isDraggingPlayer = useSelector(state => state.game.isDraggingPlayer)

	return (
		<FabStyled open={open}>
			<Fab
				variant={open ? 'circular' : 'extended'}
				onClick={() => onClick()}
			>
				{
					open ?
						<Close/>
						:
						<People sx={{ mr: 1,  }}/>
				}
				{ !open && 'My Team' }
			</Fab>
		</FabStyled>
	)
}

export default TeamFab
