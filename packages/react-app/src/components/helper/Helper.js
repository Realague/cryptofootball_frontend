import * as React from 'react'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import { IconButton } from '@mui/material'
import { Help } from '@mui/icons-material'

export default function Helper({ children, size }) {
	const [anchorEl, setAnchorEl] = React.useState(null)

	const handlePopoverOpen = (event) => {
		setAnchorEl(event.currentTarget)
	}

	const handlePopoverClose = () => {
		setAnchorEl(null)
	}

	const open = Boolean(anchorEl)

	return (
		<div>
			<Help
				aria-owns={open ? 'mouse-over-popover' : undefined}
				aria-haspopup="true"
				sx={{
					width: size,
					height: size,
				}}
				onMouseEnter={handlePopoverOpen}
				onMouseLeave={handlePopoverClose}
			/>
			<Popover
				id="mouse-over-popover"
				sx={{
					pointerEvents: 'none',
					p: 2,
				}}
				open={open}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
				onClose={handlePopoverClose}
				disableRestoreFocus
			>
				{children}
			</Popover>
		</div>
	)
}
