import React from 'react'
import {useDrag, useDrop} from 'react-dnd'
import {Box, Stack} from '@mui/material'
import {useTheme} from '@emotion/react'

const DroppableBox = ({type, children, onDrop}) => {
	const theme = useTheme()
	const [{ isOver }, drop] = useDrop(
		() => ({
			accept: type,
			drop: (i) => onDrop(i),
			collect: monitor => ({
				isOver: !!monitor.isOver(),
			}),
		})
	)

	return (
		<Stack ref={drop} spacing={2} sx={{
			display: 'flex',
			width: '100%',
			height: '100%',
			justifyContent: 'center',
			alignItems: 'center',
			border: `4px dashed ${isOver ? theme.palette.success.main : theme.palette.secondary.main}`
		}}>
			{ children }
		</Stack>
	)
}

export default DroppableBox
