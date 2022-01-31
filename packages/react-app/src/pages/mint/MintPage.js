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

const MintPage = () => {
	const [mintTeamComposition, setMintTeamComposition] = useState(-1)
	const [availableCompositions, setAvailableCompositions] = useState([])
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))


	useEffect(() => {
		footballHeroesService.getCompositionList().then(compositions => setAvailableCompositions(compositions))
	}, [])

	return (
		<Stack p={4} spacing={2}>
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
								<Typography>ma super image ici</Typography>
								<Divider flexItem />
								<Button
									fullWidth
									variant="contained"
									color="secondary"
									onClick={() => footballHeroesService.mint()}
								>
									Mint
								</Button>
							</Stack>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Stack alignItems="center" spacing={2} p={2}>
								<Typography variant="h5" color="secondary">
									MINT TEAM
								</Typography>
								<Divider flexItem />
								<Typography>ma super image ici</Typography>
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
								<Button
									fullWidth
									disabled={mintTeamComposition === -1}
									variant="contained"
									color="secondary"
									onClick={() => {

										console.log('composition to mint: ' + mintTeamComposition)
										// footballHeroesService.mint()
									}}
								>
									Mint
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
