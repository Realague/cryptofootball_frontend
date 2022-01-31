import React from 'react'
import '../../css/contact.css'
import { Grid, Stack, useMediaQuery } from '@mui/material'
import { theme } from '../../theme'

function Contact() {
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	return (
		<Stack spacing={2}>
			<h3 className="title-contact">Join our community</h3>
			<Grid container direction={isMobile ? 'column' : 'row'} spacing={2}>
				<Grid item xs={4} display="flex" alignItems="center" justifyContent="center">
					<img
						style={{
							height: '200px',
							width: '200px',
						}}
						alt="Qries"
						src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/1024px-Telegram_2019_Logo.svg.png">
					</img>
				</Grid>
				<Grid item xs={4} display="flex" alignItems="center" justifyContent="center">
					<img
						style={{
							height: '200px',
							width: '200px',
						}}
						alt="Qries"
						src="https://logodownload.org/wp-content/uploads/2017/11/discord-logo-4-1.png">
					</img>
				</Grid>
				<Grid item xs={4} display="flex" alignItems="center" justifyContent="center">
					<img
						style={{
							height: '200px',
							width: '200px',
						}}
							 alt="Qries"
						src="https://www.danoneinstitute.org/wp-content/uploads/2020/06/logo-rond-twitter.png">
					</img>
				</Grid>
			</Grid>
		</Stack>
	)
}

export default Contact
