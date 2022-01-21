import * as React from 'react'
import Box from '@mui/material/Box'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import { useDispatch, useSelector } from 'react-redux'
import { changeDrawerMobile } from '../../features/settingsSlice'
import { useNavigate } from 'react-router-dom'

const SwipeableFootDrawer = ({ menu }) => {
	const { drawerMobileOpen } = useSelector(state => state.settings)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const toggleDrawer = (anchor, open) => (event) => {
		if (
			event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
		) {
			return
		}

		dispatch(changeDrawerMobile(open))
	}

	const list = (anchor) => (
		<Box
			sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
			role="presentation"
			onClick={toggleDrawer(anchor, false)}
			onKeyDown={toggleDrawer(anchor, false)}
		>
			<List>
				{menu.map(({ name, path }, index) => (
					<ListItem button key={name} onClick={() => navigate(path)}>
						<ListItemIcon>
							{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
						</ListItemIcon>
						<ListItemText primary={name} />
					</ListItem>
				))}
			</List>
			<Divider />
		</Box>
	)

	return (
		<div>
			{['left'].map((anchor) => (
				<React.Fragment key={anchor}>
					<SwipeableDrawer
						anchor={anchor}
						open={drawerMobileOpen}
						onClose={toggleDrawer(anchor, false)}
						onOpen={toggleDrawer(anchor, true)}
					>
						{list(anchor)}
					</SwipeableDrawer>
				</React.Fragment>
			))}
		</div>
	)
}

export default SwipeableFootDrawer
