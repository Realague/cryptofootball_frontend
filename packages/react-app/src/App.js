import React, {useContext, useEffect, useState} from 'react'
import {Box} from '@mui/material'
import Navbar from './layout/navbar/Navbar'
import {Outlet} from 'react-router-dom'
import {ThemeProvider} from '@emotion/react'
import { theme, lightTheme } from './theme'

const App = () => {
	const [themeMode, setThemeMode] = useState('dark')

	const toggleThemeMode = () => {
		setThemeMode(themeMode === 'dark' ? 'light' : 'dark')
	}

	return (
		<ThemeProvider theme={themeMode === 'dark' ? theme : lightTheme}>
			<Box>
				<Navbar toggleTheme={toggleThemeMode}/>
				<Outlet/>
			</Box>
		</ThemeProvider>
	)
}

export default App
