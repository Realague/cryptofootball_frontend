import React from 'react'
import '../../css/presentation.css'
import { Box, Divider, Stack, Typography } from '@mui/material'


function Presentation() {
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
				<div className="box box-down cyan">
					<h2>Recruit your players</h2>
					<img src="https://assets.codepen.io/2301174/icon-supervisor.svg" alt=""/>
				</div>

				<div className="box red">
					<h2>Train your players</h2>
					<img src="https://assets.codepen.io/2301174/icon-team-builder.svg" alt=""/>
				</div>

				<div className="box box-down blue">
					<h2>Boost your players</h2>
					<img src="https://assets.codepen.io/2301174/icon-calculator.svg" alt=""/>
				</div>
			</div>
			<Box sx={{
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
			}}>
				<div className="box orange">
					<h2>Win tokens</h2>
					<img src="https://assets.codepen.io/2301174/icon-karma.svg" alt=""/>
				</div>
			</Box>
		</Stack>
	)
}

export default Presentation
