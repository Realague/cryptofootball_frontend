import React, { useEffect, useState } from 'react'
import Card from './card/Card'
import LoadingImage from '../images/gifs/loading.gif'
import { CancelOutlined, CheckCircleOutlined } from '@mui/icons-material'
import { Modal, Button, Stack, Typography, Divider, Box } from '@mui/material'
import { darkModal } from '../css/style'
import { useDispatch, useSelector } from 'react-redux'
import footballHeroesService from '../services/FootballPlayerService'
import {addPlayerToCollection, fetchData, fireConffeti, updatePlayerInCollection} from '../features/gameSlice'

const Loader = () => {
	const [transactionState, setTransactionState] = useState('')
	const [showLoader, setShowLoader] = useState(false)
	const [rewards, setRewards] = useState(0)
	const [player, setPlayer] = useState(undefined)
	const dispatch = useDispatch()

	const { transaction } = useSelector(state => state.settings)

	useEffect(() => {
		if (transaction !== undefined && transaction.transaction.on) {
			callBack()
		}
	}, [transaction])

	const callBack = async () => {
		setTransactionState('confirmation')
		setShowLoader(true)
		transaction.transaction.on('transactionHash', function () {
			setTransactionState('loading')
		}).on('receipt', async function (receipt) {
			console.log('receipt', receipt)
			if (receipt.events.TrainingDone) {
				setTransactionState('trainingDone')
				setRewards(receipt.events.TrainingDone.returnValues)
				if (receipt.events.TrainingDone.returnValues.won === true) {
					dispatch(fireConffeti())
				}
				dispatch(updatePlayerInCollection(await footballHeroesService.getFootballPlayer(rewards.playerId)))
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
				dispatch(updatePlayerInCollection(player))
			} else if (receipt.events.NewPlayer) {
				await getPlayer(receipt.events.NewPlayer.returnValues.playerId, 'mint')
				dispatch(fireConffeti())
				dispatch(addPlayerToCollection(player))
			}  else if (receipt.events.LevelUp) {
				setRewards(receipt.events.LevelUp.returnValues)
				setTransactionState('levelUp')
				dispatch(fetchData())
				dispatch(fireConffeti())
				dispatch(updatePlayerInCollection(await footballHeroesService.getFootballPlayer(rewards.playerId)))
			} else {
				setTransactionState('success')
			}
		}).on('error', function (e) {
			console.log('error', e)
			setTransactionState('error')
		})
	}

	const getPlayer = async (playerId, state = 'mint') => {
		setPlayer(await footballHeroesService.getFootballPlayer(playerId))
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
							<img style={{ width: rewards.won ? 150 : 200, height: 200 }} src={rewards.won ? '/coupetrans.png' : '/coupecassetrans.png'} alt=""/>
							<Divider/>
							<Stack width="100%" direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
								<Typography variant="subtitle1">Result: </Typography>
								<Typography
									color={rewards.won === true ? 'green': 'red'}
									variant="subtitle2"
								>
									{rewards.won === true ? 'Victory' : 'Defeat'}
								</Typography>
							</Stack>
							<Stack width="100%" direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
								<Typography variant="subtitle1">Rewards: </Typography>
								<Typography variant="subtitle2">{rewards.rewards}</Typography>
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
                            	<Stack alignItems="center" spacing={2}>
                            		<Typography variant="h4">Mint result</Typography>
                            		<Divider/>
                            		<Card player={player} marketItem={undefined}/>
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
                            </>,
							'improveFrame':
								<Stack alignItems="center" spacing={2}>
									<Typography variant="h4">Improve Frame</Typography>
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
                            	<img style={{ width: 150	, height: 200 }} src={rewards.won ? '/training_win_white.png' : '/training_lose_white.png'} alt=""/>
                            	<Divider/>
                            	<Stack width="100%" direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                            		<Typography variant="subtitle1">Result: </Typography>
                            		<Typography
                            			color={rewards.won === true ? 'green': 'red'}
                            			variant="subtitle2"
                            		>
                            			{rewards.won === true ? 'Victory' : 'Defeat'}
                            		</Typography>
                            	</Stack>
                            	<Stack width="100%" direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                            		<Typography variant="subtitle1">Rewards: </Typography>
                            		<Typography variant="subtitle2">{rewards.rewards}</Typography>
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
