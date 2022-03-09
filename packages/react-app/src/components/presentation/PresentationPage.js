import React, { useCallback, useEffect, useRef, useState } from 'react'
import PresentationCarousel from './PresentationCarousel'
import Presentation from './Presentation'
import Contact from './Contact'
import Partenaire from './Partenaire'
import { Box, Button, Divider, Stack, Typography, useMediaQuery } from '@mui/material'
import RandomPlayer from '../../pages/mint/components/RandomPlayer'
import theme from '../../theme'
import ReactCanvasConfetti from 'react-canvas-confetti'

function PresentationPage() {
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const refAnimationInstance = useRef(null)
	const [intervalId, setIntervalId] = useState()

	const nextTickAnimation = useCallback(() => {
		if (refAnimationInstance.current) {
			refAnimationInstance.current(getAnimationSettings(60, 0))
			refAnimationInstance.current(getAnimationSettings(120, 1))
		}
	}, [])

	useEffect(() => {
		startAnimation()
	}, [])

	const startAnimation = useCallback(() => {
		if (!intervalId) {
			setIntervalId(setInterval(nextTickAnimation, 60))
		}
	}, [nextTickAnimation, intervalId])

	const pauseAnimation = useCallback(() => {
		clearInterval(intervalId)
		setIntervalId(null)
	}, [intervalId])

	const stopAnimation = useCallback(() => {
		clearInterval(intervalId)
		setIntervalId(null)
		refAnimationInstance.current && refAnimationInstance.current.reset()
	}, [intervalId])

	useEffect(() => {
		return () => {
			clearInterval(intervalId)
		}
	}, [intervalId])


	function getAnimationSettings(angle, originX) {
		const colors = ['#f84f4f', '#9ef84f', '#4f79f8', '#f8e14f']
		const random = colors[Math.floor(Math.random() * colors.length)]
		return {
			particleCount: 1,
			startVelocity: 0,
			ticks: 70,
			gravity: 0.3,
			origin: {
				x: Math.random(),
				y: Math.random() * 0.999 - 0.2
			},
			colors: [random],
			shapes: ['circle'],
			scalar: randomInRange(0.4, 1)
		}
	}


	function randomInRange(min, max) {
		return Math.random() * (max - min) + min
	}

	const getInstance = useCallback((instance) => {
		refAnimationInstance.current = instance
	}, [])

	return (
		<Stack sx={{
			width: '100vw',
		}}
		spacing={2}
		>
			<PresentationCarousel/>
			<Contact/>
			<Stack
				sx={{
					height: isMobile ? 'auto' : '70vh',
					width: '100%'
				}}
				direction={isMobile ? 'column' : 'row'}
				justifyContent="space-between"
				alignItems="center"
			>
				<Box
					width={isMobile ? '100%' : '50%'}
					display="flex"
					justifyContent="center"
					sx={{
						overflowX: 'scroll',
						overflowY: 'none',
					}}
				>
					{
						isMobile ?
							<RandomPlayer/>
							:
							<>
								<Box sx={{ transform: `scale(${isMobile ? '50' : '70'}%)` }}>
									<RandomPlayer/>
								</Box>
								<RandomPlayer/>
								<Box sx={{ transform: `scale(${isMobile ? '50' : '70'}%)` }}>
									<RandomPlayer/>
								</Box>
							</>
					}

				</Box>
				<Stack width={isMobile ? '100%' : '50%'}  alignItems="center" spacing={2} p={4}>
					<Typography variant="h4" textAlign="center">Recruit your players</Typography>
					<Divider flexItem/>
					<Typography variant="subtitle1" lineHeight={2} textAlign="center">
                        Football Players are the NFT you own in FootballHeroes,
                        and you need to have at least one to play the first part
                        of the game called 'training' and 11 to play the 2nd game
                        called 'match'.
					</Typography>
				</Stack>

			</Stack>

			<Stack
				sx={{
					height: isMobile ? 'auto' : '70vh',
					width: '100wh'
				}}
				direction={isMobile ? 'column' : 'row' }
				justifyContent="space-between"
				alignItems="center"
			>
				<Stack width={isMobile ? '100%' : '50%'} alignItems="center" spacing={2} p={4}>
					<Typography variant="h4" textAlign="center">Train your players</Typography>
					<Divider flexItem/>
					<Typography variant="subtitle1" lineHeight={2} textAlign="center">
                        Each Football Player has a tier.
                        The Tier increase the rewards and XP you get from 'training' game
                        and also the influence your stamina regen, stamina is necessary to
                        do the 'training' game.
					</Typography>
				</Stack>
				<Box width={isMobile ? '100%' : '50%'}  display="flex" justifyContent="center">
					<Stack
						width='100%'
						direction="row"
						sx={{
							overflowX: 'scroll',
						}}
						alignItems="flex-start"
						justifyContent="flex-start"
					>
						<Stack
							direction="row"
							sx={{
							}}
							width="100%"
							justifyContent="flex-start"
							alignItems="flex-start"
						>
							<RandomPlayer tier={4}/>
							<RandomPlayer tier={3}/>
							<RandomPlayer tier={2}/>
							<RandomPlayer tier={1}/>
							<RandomPlayer tier={0}/>
						</Stack>
					</Stack>
				</Box>
			</Stack>

			<Stack
				sx={{
					height: isMobile ? 'auto' : '70vh',
					width: '100wh'
				}}
				direction={isMobile ? 'column' : 'row' }
				justifyContent="space-between"
				alignItems="center"
			>
				<ReactCanvasConfetti
					refConfetti={getInstance}
					style={{
						position: 'absolute',
						pointerEvents: 'none',
						width: '100%',
						height: '70vh',
					}}
				/>
				<Box width={isMobile ? '100%' : '50%'}  display="flex" justifyContent="center">
					<img src="/coupetrans.png" style={{ width: '30%', height: '20%' }} alt=""/>
				</Box>
				<Stack width={isMobile ? '100%' : '50%'} alignItems="center" spacing={2} p={4}>
					<Typography variant="h4" textAlign="center">Win matches</Typography>
					<Divider flexItem/>
					<Typography variant="subtitle1" lineHeight={2} textAlign="center">
						In FootballHeroes you'll also be able to create your own football team,
						Once your team completed you'll be able to play against AI teams,
						it'll be harder than the training game but the rewards will be much higher.
					</Typography>
				</Stack>
			</Stack>

			<Stack
				sx={{
					height: isMobile ? 'auto' : '70vh',
					width: '100wh'
				}}
				direction={isMobile ? 'column' : 'row' }
				justifyContent="space-between"
				alignItems="center"
				p={2}
			>
				<Stack width={isMobile ? '100%' : '50%'} alignItems="center" spacing={2}>
					<Typography variant="h4" textAlign="center">Marketplace</Typography>
					<Divider flexItem/>
					<Typography variant="subtitle1" lineHeight={2} textAlign="center">
						You'll have the possibility to list any player into our marketplace.
					</Typography>
				</Stack>
				<Box width={isMobile ? '100%' : '50%'}  display="flex" justifyContent="center">
					<img src="/bag3.png" style={{ width: '50%', height: '20%' }} alt=""/>
				</Box>
			</Stack>
			<Stack p={2} justifyContent="center" alignItems="center">
				<Button
					color="secondary"
					variant="contained"
					onClick={() => window.open('https://footballheroes.gitbook.io/footballheroes/')}
				>
					More information
				</Button>
			</Stack>
			<Partenaire/>
		</Stack>
	)
}

export default PresentationPage
