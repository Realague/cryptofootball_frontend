import React, { useCallback, useEffect, useRef, useState } from 'react'
import Card from './card/Card'
import LoadingImage from '../images/gifs/loading.gif'
import { CancelOutlined, CheckCircleOutlined } from '@mui/icons-material'
import { Modal, Button, Stack, Typography, Divider } from '@mui/material'
import { darkModal } from '../css/style'
import { useDispatch, useSelector } from 'react-redux'
import footballHeroesService from '../services/FootballPlayerService'
import { fetchData, fireConffeti } from '../features/gameSlice'

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
		}).on('receipt', function (receipt) {
			console.log('recepeit', receipt)
			if (receipt.events.TrainingDone) {
				setTransactionState('trainingDone')
				setRewards(receipt.events.TrainingDone.returnValues)
				dispatch(fetchData())
				if (receipt.events.TrainingDone.returnValues.won === true) {
					dispatch(fireConffeti())
				}
			} else if (receipt.events.NewPlayer) {
				getPlayer(receipt.events.NewPlayer.returnValues.playerId)
				dispatch(fireConffeti())
				dispatch(fetchData())
			}  else if (receipt.events.LevelUp) {
				setRewards(receipt.events.LevelUp.returnValues)
				setTransactionState('levelUp')
				dispatch(fireConffeti())
				dispatch(fetchData())
			} else {
				setTransactionState('success')
			}
		}).on('error', function () {
			setTransactionState('error')
		})
	}

	const getPlayer = async (playerId) => {
		setPlayer(await footballHeroesService.getFootballPlayer(playerId))
		setTransactionState('mint')
	}

	const onHide = () => {
		if (transactionState !== 'confirmation' && transactionState !== 'loading') {
			setShowLoader(false)
			setTransactionState('')
		}
	}

	console.log('rewards', rewards)

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
                            	<Typography variant="h6">Waiting confirmation...</Typography>
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
							'trainingDone':
                            <Stack alignItems="center" spacing={2}>
                            	<Typography variant="h4">Training result</Typography>
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
										<Typography variant="subtitle1">Level up Results: </Typography>
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
