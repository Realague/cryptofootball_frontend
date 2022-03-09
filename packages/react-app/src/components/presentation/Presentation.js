import React, { useState } from 'react'
import '../../css/presentation.css'
import { Box, Divider, Grid, Slide, Stack, Typography, useMediaQuery } from '@mui/material'
import TokenImage from '../../images/token.png'
import theme from '../../theme'
import VisibilitySensor from 'react-visibility-sensor'

function Presentation() {
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const boxStyle = (color) => ({
		borderRadius: '5px',
		backgroundColor: theme.palette.background.paper,
		boxShadow: `0 0 10px ${color}`,
		borderTop: `3px solid ${color}`,
		height: '220px',
		width: isMobile ? '90vw' : '375px',
		justifyContent: 'space-between',
		p: 2,
		m: 2,
	})

	const PresentationBox = ({ color, children }) => {
		return (
			<Stack sx={boxStyle(color)} spacing={1}>
				{ children }
			</Stack>
		)
	}

	return (
		<Stack alignItems="center" spacing={2} p={2}>
			<Typography variant="h4" textAlign="center">Play to earn NFT</Typography>
			<Typography variant="h4" textAlign="center">The best football game to make money</Typography>
			<Divider flexItem variant="middle" sx={{ width: '50%', alignSelf: 'center' }} />
			<Typography variant="h5">
				Recruit and train your football players to build the best football team.
                    Train them by taking penalties.
			</Typography>

			<Grid container alignItems="center" justifyContent="center">
				<PresentationBox color="red">
					<Typography variant="h4">Recruit your players</Typography>
					<img src="/demo-card.png" style={{ width: '64px', height: '100px', alignSelf: 'flex-end' }}/>
				</PresentationBox>
				<PresentationBox color={theme.palette.secondary.main}>
					<Typography variant="h4">Play with your players</Typography>
					<img src="/stadium.png" style={{ width: '128px', height: '75px', alignSelf: 'flex-end' }} alt=""/>
				</PresentationBox>
				<PresentationBox color={theme.palette.primary.light}>
					<Typography variant="h4">Train your players</Typography>
					<img src="/coupetrans.png" style={{ width: '64px', height: '80px', alignSelf: 'flex-end' }} alt=""/>
				</PresentationBox>
				<PresentationBox color="green">
					<Typography variant="h4">Earn our tokens</Typography>
					<img style={{ width: '64px', height: '64px', alignSelf: 'flex-end' }} src={TokenImage} alt="token"/>
				</PresentationBox>
			</Grid>

		</Stack>
	)
}

export default Presentation
