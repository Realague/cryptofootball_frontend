import React, { useState } from 'react'
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
import { setTeamDrawerState } from './features/gameSlice'
import { SnackbarProvider } from 'notistack'

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
	const teamDrawerOpen = useSelector(state => state.game.teamDrawerOpen)
	const dispatch = useDispatch()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	const drawerTeamWidth = isMobile ? 200 : 500

	const changeOpenTeamDrawerState = (value) => {
		dispatch(setTeamDrawerState(value))
	}

	const toggleThemeMode = () => {
		setThemeMode(themeMode === 'dark' ? 'light' : 'dark')
	}

	return (
		<ThemeProvider theme={themeMode === 'dark' ? theme : lightTheme}>
			<DndProvider backend={HTML5Backend}>
				<SnackbarProvider maxSnack={3}>
					<Main drawerTeamWidth={drawerTeamWidth} open={teamDrawerOpen}>
						<Navbar toggleTheme={toggleThemeMode}/>
						{
							isReady ?
								<Outlet/>
								:
								<CircularProgress/>
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
