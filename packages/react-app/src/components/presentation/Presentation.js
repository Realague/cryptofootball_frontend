import React from 'react'
import '../../css/presentation.css'
import { Box, Divider, Stack, Typography, useMediaQuery } from '@mui/material'
import TokenImage from '../../images/token.png'
import theme from '../../theme'
import { FitnessCenter } from '@mui/icons-material'


function Presentation() {
	const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

	const boxStyle = (color) => ({
		borderRadius: '5px',
		boxShadow: `0 0 10px ${color}`,
		borderTop: `3px solid ${color}`,
		height: '250px',
		width: '375px',
		justifyContent: 'space-between',
		p: 2,
		m: 2,
	})

	return (
		<Stack alignItems="center" spacing={2} p={2}>
			<Typography variant="h4" textAlign="center">Play to earn NFT</Typography>
			<Typography variant="h4" textAlign="center">The best football game to make money</Typography>
			<Divider flexItem variant="middle" sx={{ width: '50%', alignSelf: 'center' }} />
			<Typography variant="h5">
				Recruit and train your football players to build the best football team.
                    Train them by taking penalties.
			</Typography>
			<div className="row1-container">
				<Stack sx={boxStyle('red')} spacing={2}>
					<Typography variant="h4">Recruit your players</Typography>
					<Divider flexItem variant="middle" />
					<img src="/demo-card.png" style={{ width: '64px', height: '100px', alignSelf: 'flex-end' }}/>
				</Stack>

				<Stack sx={boxStyle(theme.palette.secondary.main)} spacing={2}>
					<Typography variant="h4">Play with your players</Typography>
					<Divider flexItem variant="middle" />
					<img src="/stadium.png" style={{ width: '128px', height: '75px', alignSelf: 'flex-end' }} alt=""/>
				</Stack>

				<Stack sx={boxStyle(theme.palette.primary.light)} spacing={2}>
					<Typography variant="h4">Train your players</Typography>
					<Divider flexItem variant="middle" />
					<img src="/coupetrans.png" style={{ width: '64px', height: '80px', alignSelf: 'flex-end' }} alt=""/>
				</Stack>
			</div>
			<div className="row2-container">
				<Stack sx={boxStyle('green')} spacing={2}>
					<Typography variant="h4">Earn our tokens</Typography>
					<Divider flexItem variant="middle" />
					<img style={{ width: '64px', height: '64px', alignSelf: 'flex-end' }} src={TokenImage} alt="token"/>
				</Stack>
			</div>
		</Stack>
	)
}

export default Presentation
