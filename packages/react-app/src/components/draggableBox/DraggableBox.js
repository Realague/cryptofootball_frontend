import React, { useEffect } from 'react'
import { useDrag } from 'react-dnd'
import { Box } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setIsDraggingPlayer, setTeamDrawerState } from '../../features/settingsSlice'

const DraggableBox = ({ type, item, children }) => {
	const dispatch = useDispatch()
	const teamDrawerOpen = useSelector(state => state.settings.teamDrawerOpen)

	const [{ opacity, isDragging }, dragRef] = useDrag(
		() => ({
			type,
			item,
			collect: (monitor) => ({
				opacity: monitor.isDragging() ? 0 : 1,
				isDragging: !!monitor.isDragging()
			})
		}),
		[]
	)

	useEffect(() => {
		dispatch(setIsDraggingPlayer(isDragging))
		if (isDragging && !teamDrawerOpen) {
			dispatch(setTeamDrawerState(true))
		}
	}, [isDragging])

	return (
		<Box ref={dragRef} style={{ opacity }}>
			{children}
		</Box>
	)
}

export default DraggableBox
