import React, { useEffect, useState } from 'react'
import {
	Button,
	CircularProgress,
	Divider,
	Grid,
	MenuItem,
	Select,
	Stack,
	Typography,
	useMediaQuery
} from '@mui/material'
import RandomPlayer from './components/RandomPlayer'
import footballHeroesService from '../../services/FootballPlayerService'
import { useTheme } from '@emotion/react'
import Web3 from 'web3'
import TokenImage from '../../images/token.png'
import BusdImage from '../../images/busd.png'
import { useSelector } from 'react-redux'
import football1 from '../../images/football-1.jpg'
import football2 from '../../images/football-2.jpg'

const MintPage = () => {
	const { isInTransaction } = useSelector(state => state.settings)
	const [mintTeamComposition, setMintTeamComposition] = useState(-1)
	const [mintSource, setMintSource] = useState({
		player: 'wallet',
		team: 'wallet',
	})
	const [availableCompositions, setAvailableCompositions] = useState([])
	const [prices, setPrices] = useState({
		fee: undefined,
		player: undefined,
	})
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	useEffect(() => {
		footballHeroesService.getCompositionList().then(compositions => setAvailableCompositions(compositions))
		Promise.all([footballHeroesService.getMintFees(), footballHeroesService.getMintPrice()]).then(results => {
			setPrices({
				fee: Web3.utils.fromWei(results[0]),
				player: Web3.utils.fromWei(results[1])
			})
		})
	}, [])

	return (
		<Stack p={2} spacing={2}>
			<Typography color="secondary" variant="h4">
                Mint
			</Typography>
			<Divider/>
			<Grid container>
				<Grid item hidden={isMobile}>
					<RandomPlayer/>
				</Grid>
				<Grid item xs={true} sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'flex-start',
				}}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<Stack alignItems="center" spacing={2} p={2}>
								<Typography variant="h5" color="secondary">
                                    MINT PLAYER
								</Typography>
								<Divider flexItem/>
								<img
									style={{
										boxShadow: `0 0 10px ${theme.palette.secondary.main}`,
										border: `1px solid ${theme.palette.secondary.main}`,
										borderRadius: '2px',
										objectFit: 'cover',
										height: '240px',
										width: '100%',
									}}
									src={football2}
								/>
								<Divider flexItem/>
								<Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center">
									<Stack direction="row" spacing={1} alignItems="center">
										<Typography variant="caption">
                                            Fees: {prices.fee !== undefined && prices.fee}
										</Typography>
										<img style={{ width: 20, height: 20 }} src={BusdImage} alt="token"/>
									</Stack>
									<Stack direction="row" spacing={1} alignItems="center">
										<Typography variant="caption">
                                            Price: {prices.fee !== undefined && prices.player}
										</Typography>
										<img style={{ width: 20, height: 20 }} src={TokenImage} alt="token"/>
									</Stack>
								</Stack>
								<Divider flexItem/>
								<Stack
									direction="row"
									spacing={2}
									alignItems="center"
								>
									<Typography>
                                        Use tokens from:
									</Typography>
									<Select
										value={mintSource.player}
										label="Sort"
										color="secondary"
										onChange={(e) => setMintSource({ ...mintSource, player: e.target.value })}
										sx={{
											height: '30px',
											width: '100px',
										}}
									>
										<MenuItem value={'wallet'}>Wallet</MenuItem>
										<MenuItem value={'rewards'}>Rewards</MenuItem>
										<MenuItem value={'presale'}>Presale</MenuItem>
									</Select>
								</Stack>
								<Button
									fullWidth
									variant="contained"
									color="secondary"
									disabled={isInTransaction}
									onClick={() => {
										switch (mintSource.player) {
										case 'wallet':
											footballHeroesService.mint()
											break
										case 'rewards':
											footballHeroesService.mintPlayerWithRewards()
											break
										case 'presale':
											footballHeroesService.mintPlayerWithPresaleToken()
											break
										}
									}}
								>
									{
										isInTransaction ?
											<CircularProgress size={21}/>
											:
											'Mint with ' + mintSource.player
									}
								</Button>
							</Stack>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Stack alignItems="center" spacing={2} p={2}>
								<Typography variant="h5" color="secondary">
                                    MINT TEAM
								</Typography>
								<Divider flexItem/>
								<img
									style={{
										boxShadow: `0 0 10px ${theme.palette.secondary.main}`,
										border: `1px solid ${theme.palette.secondary.main}`,
										borderRadius: '2px',
										objectFit: 'cover',
										height: '240px',
										width: '100%',
									}}
									src={football1}
								/>
								<Divider flexItem/>
								<Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center">
									<Stack direction="row" spacing={1} alignItems="center">
										<Typography variant="caption">
                                            Fees: {prices.fee !== undefined && prices.fee * 11}
										</Typography>
										<img style={{ width: 20, height: 20 }} src={BusdImage} alt="token"/>
									</Stack>
									<Stack direction="row" spacing={1} alignItems="center">
										<Typography variant="caption">
                                            Price: {prices.fee !== undefined && prices.player * 11}
										</Typography>
										<img style={{ width: 20, height: 20 }} src={TokenImage} alt="token"/>
									</Stack>
								</Stack>
								<Divider flexItem/>
								<Stack
									direction="row"
									spacing={2}
									alignItems="center"
								>
									<Typography>
                                        Use tokens from:
									</Typography>
									<Select
										value={mintSource.team}
										label="Sort"
										color="secondary"
										onChange={(e) => setMintSource({ ...mintSource, team: e.target.value })}
										sx={{
											height: '30px',
											width: '100px',
										}}
									>
										<MenuItem value={'wallet'}>Wallet</MenuItem>
										<MenuItem value={'rewards'}>Rewards</MenuItem>
										<MenuItem value={'presale'}>Presale</MenuItem>
									</Select>
								</Stack>
								<Button
									fullWidth
									disabled={isInTransaction}
									variant="contained"
									color="secondary"
									onClick={() => {
										switch (mintSource.player) {
										case 'wallet':
											footballHeroesService.mintTeam()
											break
										case 'rewards':
											footballHeroesService.mintTeam()
											break
										case 'presale':
											footballHeroesService.mintTeam()
											break
										}
									}}
								>
									{
										isInTransaction ?
											<CircularProgress size={21}/>
											:
											'Mint with ' + mintSource.team
									}
								</Button>
							</Stack>
						</Grid>
					</Grid>
				</Grid>
				<Grid item hidden={isMobile}>
					<RandomPlayer/>
				</Grid>
			</Grid>
		</Stack>
	)
}

export default MintPage
