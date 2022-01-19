import React from 'react'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@emotion/react'

const FilterButton = ({
	isSelected,
	setFilters,
	f,
	type = 'frames',
	disabled = false
}) => {
	const theme = useTheme()

	return (
		<Box
			key={f.id}
			sx={{
				padding: '15px',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				width: '100%',
				borderRight: '2px solid',
				borderColor: isSelected ? theme.palette.secondary.main : theme.palette.background.default,
			}}
			onClick={() => {
				if (disabled) {
					return
				}
				if (isSelected) {
					setFilters(prev => ({ ...prev, [type]: prev[type].filter(id => id !== f.id) }))
				} else {
					setFilters(prev => ({ ...prev, [type]: [...prev[type], f.id] }))
				}
			}}
		>
			<Typography
				variant={disabled ? 'subtitle2' : 'subtitle1'}
				color={ isSelected ? theme.palette.secondary.main : theme.palette.primary.contrastText}
			>{f.name}</Typography>
		</Box>
	)
}


export default FilterButton
