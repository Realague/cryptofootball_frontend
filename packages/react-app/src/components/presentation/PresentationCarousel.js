import { Carousel } from 'react-bootstrap'
import football1 from '../../images/football-1.jpg'
import football3 from '../../images/football-3.jpg'
import React from 'react'
import Box from '@mui/material/Box'
import { Button, Divider, Stack, Typography, useMediaQuery } from '@mui/material'
import theme from '../../theme'
import { useNavigate } from 'react-router-dom'

function PresentationCarousel() {
	const navigate = useNavigate()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	return (
		<Carousel style={{ height: '100vh' }}>
			<Carousel.Item>
				<img
					style={{
						height: '100vh',
						objectFit: 'cover',
						width: '100%',
					}}
					src={football1}
					alt="First slide"
				/>
				<Stack
					alignItems="center"
					sx={{
						position: 'absolute',
						bottom: '0%',
						left: '50%',
						width: isMobile ? '95%' : '60%',
						transform: 'translate(-50%, -50%)',
						backdropFilter: 'blur(3px)',
						borderRadius: '3px',
					}}
					p={1}
					spacing={1}
				>
					<Typography
						variant="h3"
						color="secondary"
						sx={{
							textShadow: `0 0 20px black, 0 0 5px ${theme.palette.primary.main}`,
						}}
					>
						The world is waiting for its hero
					</Typography>
					<Divider variant="middle" flexItem />
					<Typography
						variant="h4"
						sx={{
							textShadow: '0 0 20px black, 0 0 1px black',
						}}
					>
						Arrive like a king, leave like a hero.
					</Typography>
					<Divider variant="middle" flexItem />
					<Button
						variant="contained"
						onClick={() => navigate('/collection')}
					>
						Let's play now
					</Button>
				</Stack>
			</Carousel.Item>
		</Carousel>
	)
}

export default PresentationCarousel
