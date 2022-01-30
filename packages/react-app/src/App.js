import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CircularProgress, useMediaQuery } from '@mui/material'
import Navbar from './layout/navbar/Navbar'
import { Outlet } from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import { theme, lightTheme } from './theme'
import Loader from './components/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from '@mui/material/styles'
import TeamFab from './components/TeamFab/TeamFab'
import TeamDrawer from './layout/teamDrawer/TeamDrawer'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { fetchData, fireConffeti } from './features/gameSlice'
import { SnackbarProvider } from 'notistack'
import ReactCanvasConfetti from 'react-canvas-confetti'
import { setTeamDrawerState } from './features/settingsSlice'
import Box from '@mui/material/Box'


function randomInRange(min, max) {
	return Math.random() * (max - min) + min
}

function getAnimationSettings(originXA, originXB) {
	return {
		startVelocity: 30,
		spread: 360,
		ticks: 60,
		zIndex: 0,
		particleCount: 150,
		origin: {
			x: randomInRange(originXA, originXB),
			y: Math.random() - 0.2
		}
	}
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'drawerTeamWidth' })(
	({ theme, open, drawerTeamWidth }) => ({
		flexGrow: 1,
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		...(open && {
			marginRight: drawerTeamWidth,
			transition: theme.transitions.create('margin', {
				easing: theme.transitions.easing.easeOut,
				duration: theme.transitions.duration.enteringScreen,
			}),
		}),
	}),
)

const App = () => {
	const [themeMode, setThemeMode] = useState('dark')
	const { isReady } = useSelector(state => state.settings)
	const { account } = useSelector(state => state.user)
	const { confetti } = useSelector(state => state.game)
	const { teamDrawerOpen } = useSelector(state => state.settings)
	const dispatch = useDispatch()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	const drawerTeamWidth = isMobile ? 200 : 500

	const changeOpenTeamDrawerState = (value) => {
		dispatch(setTeamDrawerState(value))
	}

	const toggleThemeMode = () => {
		setThemeMode(themeMode === 'dark' ? 'light' : 'dark')
	}

	useEffect(() => {
		if (isReady) {
			dispatch(fetchData())
		}
		//dispatch(fireConffeti('snow'))
	}, [isReady])

	return (
		<ThemeProvider theme={themeMode === 'dark' ? theme : lightTheme}>
			<DndProvider backend={HTML5Backend}>
				<SnackbarProvider
					maxSnack={3}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
				>
					<ReactCanvasConfetti
						style={{
							position: 'fixed',
							pointerEvents: 'none',
							width: '100%',
							height: '100%',
							zIndex: 999999,
							top: 0,
							left: 0
						}}
						fire={confetti.fire}
						reset={confetti.reset}
						{
							...(confetti.fire.style === 'snow' ? {
								particleCount: 1000,
								gravity: 0.4,
								colors: ['#f84f4f', '#9ef84f', '#4f79f8', '#f8e14f'],
								shapes: ['circle'],
								ticks: 800,
								scalar: randomInRange(0.4, 1),
								spread: 140,
								startVelocity: 100,
								angle: 270,
								origin: {
									x: 0.5,
									y: -2
								},
							} : {})
						}
					/>
					<Main drawerTeamWidth={drawerTeamWidth} open={teamDrawerOpen}>
						<Navbar toggleTheme={toggleThemeMode}/>
						{
							isReady ?
								<Outlet/>
								:
								<Box sx={{
									height: '100vh',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center'
								}}>
									<CircularProgress color='secondary'/>
								</Box>
						}
						{
							account &&
							<TeamFab
								open={teamDrawerOpen}
								onClick={() => changeOpenTeamDrawerState(!teamDrawerOpen)}
							/>
						}
					</Main>
					{
						isReady &&
						<TeamDrawer
							open={teamDrawerOpen}
							changeState={() => changeOpenTeamDrawerState(!teamDrawerOpen)}
						/>
					}
					<Loader/>
				</SnackbarProvider>
			</DndProvider>
		</ThemeProvider>
	)
}

export default App
