import React from 'react'
import { ItemTypes } from '../../../components/Constants'
import { AddCircle } from '@mui/icons-material'
import { Typography } from '@mui/material'
import DroppableBox from '../../../components/droppableBox/DroppableBox'

const DraggingContent = ({ onDrop }) => {
	return (
		<DroppableBox onDrop={(i) => onDrop(i)} type={ItemTypes.PLAYER}>
			<AddCircle sx={{
				height: '70px',
				width: '70px',
			}}/>
			<Typography fontSize={20} color="secondary" variant="button">
                Drop the player here to add in team
			</Typography>
		</DroppableBox>
	)
}

export default DraggingContent
