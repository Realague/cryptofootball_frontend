import React, { useEffect, useState } from 'react'
import Card from './card/Card'
import LoadingImage from '../images/gifs/loading.gif'
import { CancelOutlined, CheckCircleOutlined } from '@mui/icons-material'
import { Modal, Button, Stack, Typography, Divider, Box, Grid, Checkbox } from '@mui/material'
import { darkModal, trainingModal } from '../css/style'
import { useDispatch, useSelector } from 'react-redux'
import footballHeroesService from '../services/FootballPlayerService'
import {
	addPlayersToCollection,
	addPlayerToCollection,
	fetchData,
	fireConffeti, setTeam,
	updatePlayerInCollection
} from '../features/gameSlice'
import { updateBalances } from '../features/userSlice'
import Web3 from 'web3'
import TokenPrice from './tokenPrice/TokenPrice'
import Position from '../enums/Position'
import ReactPlayer from 'react-player'

const Loader = () => {
	const [transactionState, setTransactionState] = useState('')
	const [showLoader, setShowLoader] = useState(false)
	const [rewards, setRewards] = useState(0)
	const [player, setPlayer] = useState(undefined)
	const [players, setPlayers] = useState([])
	const [useAsTeam, setUseAsTeam] = useState(false)
	const [animationEnded, setAnimationEnded] = useState(undefined)
	const [showAnimation, setShowAnimation] = useState(false)
	const dispatch = useDispatch()

	const { transaction } = useSelector(state => state.settings)

	useEffect(() => {
		if (transaction !== undefined && transaction.transaction.on) {
			callBack()
		}
	}, [transaction])


	const refreshBalances = async () => {
		const jobs  = []
		jobs.push(footballHeroesService.getRewards())
		jobs.push(footballHeroesService.getGbBalance())
		jobs.push(footballHeroesService.getBusdBalance())
		const jobsResult = await Promise.all(jobs)
		dispatch(updateBalances({
			BUSDBalance: Web3.utils.fromWei(jobsResult[2]),
			GBBalance: Web3.utils.fromWei(jobsResult[1]),
			rewards: jobsResult[0]
		}))
	}

	const callBack = async () => {
		setTransactionState('confirmation')
		setShowLoader(true)
		transaction.transaction.on('transactionHash', function () {
			setTransactionState('loading')
		}).on('receipt', async function (receipt) {
			console.log('receipt', receipt)
			refreshBalances()
			if (transaction.name === 'resetTeam') {
				dispatch(fetchData())
			}
			if (receipt.events.TrainingDone) {
				setTransactionState('trainingDone')
				setRewards(receipt.events.TrainingDone.returnValues)
				if (receipt.events.TrainingDone.returnValues.won === true) {
					dispatch(fireConffeti())
				}
				console.log(rewards)
				dispatch(updatePlayerInCollection(await footballHeroesService.getFootballPlayer(receipt.events.TrainingDone.returnValues.playerId)))
			} else if (receipt.events.MatchResult) {
				setTransactionState('matchResult')
				const matchResult = receipt.events.MatchResult.returnValues
				setRewards(matchResult)
				if (matchResult.won) {
					dispatch(fireConffeti('snow'))
				}
			} else if (receipt.events.UpgradeFrame) {
				await getPlayer(receipt.events.UpgradeFrame.returnValues.playerId, 'improveFrame')
				dispatch(fireConffeti())
				dispatch(updatePlayerInCollection(await footballHeroesService.getFootballPlayer(receipt.events.UpgradeFrame.returnValues.playerId)))
			} else if (receipt.events.NewPlayer) {
				const newPlayer = await getPlayer(receipt.events.NewPlayer.returnValues.playerId, 'mint')
				console.log('player added', newPlayer)
				dispatch(addPlayerToCollection(newPlayer))
				setAnimationEnded(false)
				setShowAnimation(newPlayer.frame)
				//dispatch(fireConffeti())
			} else if (receipt.events.NewPlayers) {
				await getPlayers(receipt.events.NewPlayers.returnValues.playersId, 'mintTeam')
				dispatch(fireConffeti())
			} else if (receipt.events.LevelUp) {
				setRewards(receipt.events.LevelUp.returnValues)
				setTransactionState('levelUp')
				dispatch(fireConffeti())
				dispatch(updatePlayerInCollection(await footballHeroesService.getFootballPlayer(receipt.events.LevelUp.returnValues.playerId)))
			} else {
				setTransactionState('success')
			}
		}).on('error', function (e) {
			console.log('error', e)
			setTransactionState('error')
		})
	}

	const getPlayer = async (playerId, state = 'mint') => {
		const fetchedPlayer = await footballHeroesService.getFootballPlayer(playerId)
		setPlayer(fetchedPlayer)
		setTransactionState(state)
		return fetchedPlayer
	}

	const getPlayers = async (playersId, state = 'mint') => {
		const players = await Promise.all(playersId.map(id => footballHeroesService.getFootballPlayer(id)))
		console.log(players)
		setPlayers(players)
		dispatch(addPlayersToCollection(players))
		setTransactionState(state)
	}

	const onHide = () => {
		if (transactionState !== 'confirmation' && transactionState !== 'loading') {
			setShowLoader(false)
			setTransactionState('')
		}
	}


	return (
		<>
			<Modal open={showLoader}>
				<Stack alignItems="center" direction="column" spacing={2} sx={darkModal}>
					{
						{
							'confirmation':
                            <>
                            	<img style={{ width: 350, height: 200 }} src={LoadingImage}
                            		alt=""/>
                            	<Typography variant="h6">Please confirm transaction</Typography>
                            </>,
							'loading':
                            <>
                            	<img style={{ width: 350, height: 200 }} src={LoadingImage}
                            		alt=""/>
                            	<Typography variant="h6">Loading...</Typography>
                            </>,
							'error':
                            <>
                            	<CancelOutlined color="error" sx={{ width: 100, height: 100 }}/>
                            	<Typography variant="h6">Transaction encountered an error</Typography>
                            </>,
							'success':
                            <>
                            	<CheckCircleOutlined color="success" sx={{ width: 100, height: 100 }}/>
                            	<Typography variant="h6">Success!</Typography>
                            </>,
							'matchResult':
						<Stack alignItems="center" spacing={2}>
							<Typography variant="h4">Match result</Typography>
							<Divider/>
							<Typography
								color={rewards.won === true ? 'green': 'red'}
								fontSize="24px"
								variant="h5"
							>
								{rewards.won === true ? 'Victory' : 'Defeat'}
							</Typography>
							<img style={{ width: rewards.won ? 150 : 200, height: 200 }} src={rewards.won ? '/coupetrans.png' : '/coupecassetrans.png'} alt=""/>
							<Divider/>
							<Stack width="100%" direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
								<Typography variant="subtitle1">Rewards: </Typography>
								<TokenPrice typoVariant="subtitle2" price={parseFloat(Web3.utils.fromWei(rewards.rewards || '0', 'ether')).toFixed(2)} token="gb"/>
							</Stack>
							<Divider/>
							<Button
								sx={{ mt: 2 }}
								variant="contained"
								color="secondary"
								fullWidth
								onClick={onHide}
							>
						Collect
							</Button>
						</Stack>,
							'mint':
                            <>
                            	{
                            		showAnimation &&
                            				<ReactPlayer
                            					height="100vh"
                            					width="100vw"
                            					style={{
                            						position: 'absolute',
                            						backgroundColor: 'black',
                            					}}
                            					playing
                            					muted
                            					onEnded={() => {
                            						dispatch(fireConffeti())
                            						setAnimationEnded(true)
                            					}}
                            					controls={false}
                            					url='videos/mint_1.mp4'
                            				/>
                            	}
                            	{
                            		animationEnded === true &&
									<Stack alignItems="center" spacing={2} sx={darkModal}>
										<Typography variant="h4">Mint result</Typography>
										<Divider/>
										<Card player={player} marketItem={undefined}/>
										<Divider/>
										<Button
											sx={{ mt: 2 }}
											variant="contained"
											color="secondary"
											fullWidth
											onClick={() => {
												onHide()
												setShowAnimation(false)
											}}
										>
											Collect
										</Button>
									</Stack>
                            	}
                            </>,
							'mintTeam':
									<Stack sx={{
										...trainingModal,
										alignItem: 'center',
										width: '75vw',
									}} spacing={2}>
										<Typography variant="h4">Mint result</Typography>
										<Divider/>
										<Grid container sx={{ height: '50vh', overflowY: 'scroll' }}>
											{
												players.map(player => {
													return (
														<Grid item key={player.id} xs={'auto'}>
															<Card player={player} marketItem={undefined}/>
														</Grid>
													)
												})
											}
										</Grid>
										<Divider/>
										<Stack direction="row" alignItems="center" justifyContent="center" spacing={1} width="100%">
											<Typography variant="body2">Use as team</Typography>
											<Checkbox
												color="secondary"
												checked={useAsTeam}
												onChange={(event) => {
													setUseAsTeam(event.target.checked)
												}}
												inputProps={{ 'aria-label': 'controlled' }}
											/>
										</Stack>
										<Divider/>
										<Button
											sx={{ mt: 2 }}
											variant="contained"
											color="secondary"
											fullWidth
											onClick={async () => {
												const composition = {
													goalkeeper: undefined,
													defenders: [],
													midfielders: [],
													attackers: [],
												}
												players.forEach(p => {
													switch (+p.position) {
													case Position.Attacker.id:
														composition.attackers.push(+p.id)
														break
													case Position.Midfielder.id:
														composition.midfielders.push(+p.id)
														break
													case Position.Defender.id:
														composition.defenders.push(+p.id)
														break
													case Position.GoalKeeper.id:
														composition.goalkeeper = +p.id
														break
													}
												})
												const compositions = await footballHeroesService.getCompositionList()
												let compositionId = undefined
												console.log(compositions)
												compositions.forEach((compo, id) => {
													if (
														+compo.attackerNb === composition.attackers.length
														&& +compo.defenderNb === composition.defenders.length
														&& +compo.midfielderNb === composition.midfielders.length
													) {
														compositionId = id
													}
												})
												onHide()
												await footballHeroesService.setPlayerTeam(
													compositionId,
													+composition.goalkeeper,
													composition.defenders,
													composition.midfielders,
													composition.attackers,
												)
												dispatch(setTeam((players)))
											}}
										>
											Collect
										</Button>
									</Stack>,
							'improveFrame':
								<Stack alignItems="center" spacing={2}>
									<Typography variant="h4">Improve Tier</Typography>
									<Divider/>
									<Card player={player} marketItem={undefined} />
									<Divider/>
									<Button
										sx={{ mt: 2 }}
										variant="contained"
										color="secondary"
										fullWidth
										onClick={onHide}
									>
										Collect
									</Button>
								</Stack>,
							'trainingDone':
                            <Stack alignItems="center" spacing={2}>
                            	<Typography variant="h4">Training result</Typography>
                            	<Divider/>
                            	<Typography
                            		color={rewards.won === true ? 'green': 'red'}
                            		variant="h5"
                            		fontSize="24px"
                            	>
                            		{rewards.won === true ? 'Victory' : 'Defeat'}
                            	</Typography>
                            	<img style={{ width: 150	, height: 200 }} src={rewards.won ? '/training_win_white.png' : '/training_lose_white.png'} alt=""/>
                            	<Divider/>
                            	<Stack width="100%" direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                            		<Typography variant="subtitle1">Rewards: </Typography>
                            		<TokenPrice typoVariant="subtitle2" price={parseFloat(Web3.utils.fromWei(rewards.rewards || '0', 'ether')).toFixed(2)} token="gb"/>
                            	</Stack>
                            	<Stack width="100%" direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                            		<Typography variant="subtitle1">Xp earnt: </Typography>
                            		<Typography variant="subtitle2">{rewards.xp}</Typography>
                            	</Stack>
                            	<Divider/>
                            	<Button
                            		sx={{ mt: 2 }}
                            		variant="contained"
                            		color="secondary"
                            		fullWidth
                            		onClick={onHide}
                            	>
									Collect
                            	</Button>
                            </Stack>,
							'levelUp':
								<Stack alignItems="center" spacing={2}>
									<Typography variant="h4">Level up results</Typography>
									<Divider/>
									<Stack width="100%" direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
										<Typography variant="subtitle1">Level gained: </Typography>
										<Typography
											color="secondary"
											variant="subtitle2"
										>
											{ rewards.levelGain }
										</Typography>
									</Stack>
									<Stack width="100%" direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
										<Typography variant="subtitle1">Xp Gained : </Typography>
										<Typography variant="subtitle2">{rewards.xpGain}</Typography>
									</Stack>
									<Divider/>
									<Button
										sx={{ mt: 2 }}
										variant="contained"
										color="secondary"
										fullWidth
										onClick={onHide}
									>
										Collect
									</Button>
								</Stack>
						}[transactionState]
					}
					<Button
						hidden={transactionState !== 'success' && transactionState !== 'error'}
						variant="contained" color="primary" onClick={onHide}>
                    Continue
					</Button>
				</Stack>
			</Modal>
		</>
	)
}

export default Loader
