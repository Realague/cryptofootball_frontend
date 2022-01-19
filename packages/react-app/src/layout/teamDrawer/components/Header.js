import React from 'react'
import { Box, Drawer, IconButton, Typography } from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import { useTheme } from '@emotion/react'

const Header = ({ changeState }) => {
	const theme = useTheme()

	const DrawerHeader = styled('div')(({ theme }) => ({
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
		...theme.mixins.toolbar,
	}))

	return (
		<DrawerHeader sx={{
			display: 'flex',
		}}>
			<IconButton onClick={() => changeState()}>
				{theme.direction === 'rtl' ? <ChevronLeft/> : <ChevronRight/>}
			</IconButton>
			<Typography variant="h6" color="secondary">
                Team
			</Typography>
			<Box/>
		</DrawerHeader>
	)
}

export default Header
