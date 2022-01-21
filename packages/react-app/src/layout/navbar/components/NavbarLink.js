import React from 'react'
import { Box, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { useTheme } from '@emotion/react'


const NavigationLink = ({ name, path }) => {
	const theme = useTheme()

	return (
		<NavLink
			style={({ isActive }) => {
				return {
					display: 'block',
					margin: '1rem 0',
					textDecoration: 'none',
					color: isActive ? theme.palette.secondary.main : theme.palette.primary.contrastText,
					textShadow: `0 0 1px ${isActive ? theme.palette.secondary.main : theme.palette.primary.dark}`
				}
			}}
			to={`/${path}`}
		>
			<Box sx={{ marginRight: '25px' }}>
				<Typography
					variant="h6"
				>{name}</Typography>
			</Box>
		</NavLink>
	)
}

export default NavigationLink
