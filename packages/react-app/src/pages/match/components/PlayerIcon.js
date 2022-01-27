import React, { useState } from 'react'
import { Avatar, Popover } from '@mui/material'
import Frame from '../../../enums/Frame'
import Card from '../../../components/card/Card'

const PlayerIcon = ({ player, isNpc }) => {
	const [anchorEl, setAnchorEl] = useState(null)

	const handlePopoverOpen = (event) => {
		setAnchorEl(event.currentTarget)
	}

	const handlePopoverClose = () => {
		setAnchorEl(null)
	}

	const open = Boolean(anchorEl)

	return <>
		<Avatar
			onMouseEnter={handlePopoverOpen}
			onMouseLeave={handlePopoverClose}
			src={`/footballplayer/${player.position}-${player.rarity}-${player.imageId}.png`}
			style={{
				boxShadow: `0px 0px 5px ${Frame.TierList[player.frame].color.dark}, inset 0px 0px 50px ${Frame.TierList[player.frame].color.main}`,
				background: 'radial-gradient(at 50% 0, black, transparent 70%),linear-gradient(0deg, black, transparent 50%) bottom',
				border: `1px solid ${Frame.TierList[player.frame].color.light}`,
				objectFit: 'cover',
				outline: 'none',
			}}
		/>
		<Popover
			id="mouse-over-popover"
			sx={{
				pointerEvents: 'none',
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
			<Card
				mobile={false}
				isNpc={isNpc}
				player={player}
			/>
		</Popover>
	</>
}

export default PlayerIcon
