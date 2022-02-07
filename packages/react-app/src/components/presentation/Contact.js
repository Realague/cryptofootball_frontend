import React from 'react'
import '../../css/contact.css'
import { Divider, Grid, IconButton, Stack, Typography, useMediaQuery } from '@mui/material'
import { theme } from '../../theme'
import { Telegram, Twitter } from '@mui/icons-material'

function Contact() {
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	const iconStyle = {
		height: '75px',
		width: '75px',
	}
	return (
		<Stack spacing={2} alignItems="center" p={2} sx={{
			backgroundColor: theme.palette.background.paper,
			boxShadow: 'inset 0 0 15px black'
		}}>
			<Typography variant="h4">Join our community</Typography>
			<Divider flexItem sx={{ width: '50%', alignSelf: 'center' }} />
			<Stack direction="row" spacing={isMobile ? 2 : 10}>
				<IconButton onClick={() => window.open('https://t.me/+ZNuorcKy0NE4OTA8')}>
					<Telegram sx={iconStyle}/>
				</IconButton>
				<IconButton onClick={() => window.open('https://twitter.com/footballheroes8')}>
					<Twitter sx={iconStyle}/>
				</IconButton>
			</Stack>
		</Stack>
	)
}

export default Contact
