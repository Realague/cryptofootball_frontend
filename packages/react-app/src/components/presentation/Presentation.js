import React, { useState } from 'react'
import '../../css/presentation.css'
import { Box, Divider, Slide, Stack, Typography, useMediaQuery } from '@mui/material'
import TokenImage from '../../images/token.png'
import theme from '../../theme'
import VisibilitySensor from 'react-visibility-sensor'

function Presentation() {
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const boxStyle = (color) => ({
		borderRadius: '5px',
		boxShadow: `0 0 10px ${color}`,
		borderTop: `3px solid ${color}`,
		height: '220px',
		width: isMobile ? '90vw' : '375px',
		justifyContent: 'space-between',
		p: 2,
		m: 2,
	})

	const PresentationBox = ({ color, children }) => {
		const [isComponentVisible, setIsVisible] = useState(false)

		return (
			<VisibilitySensor
				partialVisibility
				minTopValue={75}
				onChange={(isVisible) => {
					if (!isComponentVisible && isVisible) {
						setIsVisible(isVisible)
					}
				}}
			>
				<Slide direction="left" in={isComponentVisible}>
					<Stack sx={boxStyle(color)} spacing={1}>
						{ children }
					</Stack>
				</Slide>
			</VisibilitySensor>
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

			<PresentationBox color="red">
				<Typography variant="h4">Recruit your players</Typography>
				<img src="/demo-card.png" style={{ width: '64px', height: '100px', alignSelf: 'flex-end' }}/>
			</PresentationBox>
			<Stack direction={isMobile ? 'column' : 'row'} justifyContent="space-around">
				<PresentationBox color={theme.palette.secondary.main}>
					<Typography variant="h4">Play with your players</Typography>
					<img src="/stadium.png" style={{ width: '128px', height: '75px', alignSelf: 'flex-end' }} alt=""/>
				</PresentationBox>
				<PresentationBox color={theme.palette.primary.light}>
					<Typography variant="h4">Train your players</Typography>
					<img src="/coupetrans.png" style={{ width: '64px', height: '80px', alignSelf: 'flex-end' }} alt=""/>
				</PresentationBox>
			</Stack>
			<PresentationBox color="green">
				<Typography variant="h4">Earn our tokens</Typography>
				<img style={{ width: '64px', height: '64px', alignSelf: 'flex-end' }} src={TokenImage} alt="token"/>
			</PresentationBox>
		</Stack>
	)
}

export default Presentation
