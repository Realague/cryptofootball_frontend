import React from 'react'
import '../../css/contact.css'
import { Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material'
import { theme } from '../../theme'

function Contact() {
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	return (
		<Stack spacing={2} alignItems="center">
			<Typography variant="h4">Join our community</Typography>
			<Divider flexItem sx={{ width: '50%', alignSelf: 'center' }} />
			<Stack
				direction={isMobile ? 'column' : 'row'}
				spacing={isMobile ? 2 : 10}
			>
				<img
					style={{
						height: '100px',
						width: '100px',
					}}
					alt="Qries"
					src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/1024px-Telegram_2019_Logo.svg.png">
				</img>
				<img
					style={{
						height: '100px',
						width: '100px',
					}}
							 alt="Qries"
					src="https://www.danoneinstitute.org/wp-content/uploads/2020/06/logo-rond-twitter.png">
				</img>
			</Stack>
		</Stack>
	)
}

export default Contact
