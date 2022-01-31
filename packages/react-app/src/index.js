import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import { Provider, useSelector } from 'react-redux'
import { ThemeProvider } from '@emotion/react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { PersistGate } from 'redux-persist/lib/integration/react'
import theme from './theme'
import { Box, CircularProgress, CssBaseline, Typography } from '@mui/material'
import { persistor, store } from './store'
import CollectionPage from './pages/collection/CollectionPage'
import MarketplacePage from './pages/marketplace/MarketplacePage'
import MatchPage from './pages/match/MatchPage'
import PresentationPage from './components/presentation/PresentationPage'
import MintPage from './pages/mint/MintPage'
import TrainingPage from './pages/training/TrainingPage'

const AuthenticatedRoute = ({ render }) => {
	const { account } = useSelector(state => state.user)
	const { isReady } = useSelector(state => state.settings)

	if (account === undefined || !isReady) {
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<Typography color={'primary'}>
					{
						account === undefined ?
							'You first need to connect your wallet' :
							<CircularProgress/>
					}
				</Typography>
			</Box>
		)
	}
	return render
}

ReactDOM.render(
	<Provider store={store}>
		<PersistGate persistor={persistor}>
			<ThemeProvider theme={theme}>
				<CssBaseline/>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<App/>}>
							<Route path="/" element={<Navigate to="/collection" />} />
							<Route path="/collection" element={<AuthenticatedRoute render={<CollectionPage/>}/>}/>
							<Route path="/marketplace" element={<AuthenticatedRoute render={<MarketplacePage/>}/>}/>
							<Route path="/match" element={<AuthenticatedRoute render={<MatchPage/>}/>}/>
							<Route path="/mint" element={<AuthenticatedRoute render={<MintPage/>}/>}/>
							<Route path="/training" element={<AuthenticatedRoute render={<TrainingPage/>}/>}/>
						</Route>
						<Route path="/presentation" element={<PresentationPage/>}/>
					</Routes>
				</BrowserRouter>
			</ThemeProvider>
		</PersistGate>
	</Provider>,
	document.getElementById('root'),
)
