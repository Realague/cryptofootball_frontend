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
								<Divider flexItem />
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
								<Divider flexItem />
								<Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center">
									<Stack direction="row" spacing={1} alignItems="center">
										<Typography variant="caption">
											Fees: { prices.fee !== undefined && prices.fee }
										</Typography>
										<img style={{ width: 20, height: 20 }} src={BusdImage} alt="token"/>
									</Stack>
									<Stack direction="row" spacing={1} alignItems="center">
										<Typography variant="caption">
											Price: { prices.fee !== undefined && prices.player }
										</Typography>
										<img style={{ width: 20, height: 20 }} src={TokenImage} alt="token"/>
									</Stack>
								</Stack>
								<Divider flexItem />
								<Button
									fullWidth
									variant="contained"
									color="secondary"
									disabled={isInTransaction}
									onClick={() => footballHeroesService.mint()}
								>
									{
										isInTransaction ?
											<CircularProgress size={21}/>
											:
											'Mint'
									}
								</Button>
							</Stack>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Stack alignItems="center" spacing={2} p={2}>
								<Typography variant="h5" color="secondary">
									MINT TEAM
								</Typography>
								<Divider flexItem />
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
								<Divider flexItem />
								{
									availableCompositions.length === 0 ?
										<CircularProgress color="secondary"/>
										:
										<Stack direction="row" spacing={2} alignItems="center">
											<Typography color="secondary" variant="body2">
												Composition to mint:
											</Typography>
											<Select
												value={mintTeamComposition}
												label="Sort"
												color="secondary"
												onChange={(event) => {
													setMintTeamComposition(event.target.value)
												}}
												sx={{
													height: '30px',
													width: '100px',
												}}
											>
												{
													availableCompositions.map((c, i) => (
														<MenuItem key={i} value={i}>
															{`${c.attackerNb}-${c.midfielderNb}-${c.defenderNb}`}
														</MenuItem>)
													)
												}
											</Select>
										</Stack>
								}
								<Divider flexItem />
								<Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center">
									<Stack direction="row" spacing={1} alignItems="center">
										<Typography variant="caption">
											Fees: { prices.fee !== undefined && prices.fee * 11 }
										</Typography>
										<img style={{ width: 20, height: 20 }} src={BusdImage} alt="token"/>
									</Stack>
									<Stack direction="row" spacing={1} alignItems="center">
										<Typography variant="caption">
											Price: { prices.fee !== undefined && prices.player * 11 }
										</Typography>
										<img style={{ width: 20, height: 20 }} src={TokenImage} alt="token"/>
									</Stack>
								</Stack>
								<Divider flexItem />
								<Button
									fullWidth
									disabled={mintTeamComposition === -1 || isInTransaction}
									variant="contained"
									color="secondary"
									onClick={() => {
										console.log('composition to mint: ' + mintTeamComposition)
										footballHeroesService.mintTeam(mintTeamComposition)
									}}
								>
									{
										isInTransaction ?
											<CircularProgress size={21}/>
											:
											'Mint'
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
