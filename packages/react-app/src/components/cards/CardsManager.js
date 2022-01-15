import React, {useEffect, useState} from 'react'
import NoneFrame from './NoneFrame'
import BronzeFrame from './BronzeFrame'
import SilverFrame from './SilverFrame'
import GoldFrame from './GoldFrame'
import DiamondFrame from './DiamondFrame'
import GameContract from '../../contractInteraction/GameContract'
import Marketplace from '../../contractInteraction/MarketplaceContract'
import Button from '@mui/material/Button'
import {Form, FormControl, InputGroup} from 'react-bootstrap'
import Loader from '../Loader'
import Web3 from 'web3'
import FootballPlayerContract from '../../contractInteraction/FootballPlayerContract'
import {abis, addresses} from '@project/contracts'
import Contract from 'web3-eth-contract'
import {useSelector} from 'react-redux'
import {Backdrop, Box, Chip, Divider, Fade, Modal, Slide, Stack, Typography} from '@mui/material'
import {darkModal, darkModalNoFlex} from '../../css/style'

const CardsManager = ({ player }) => {
	const account = useSelector(state => state.user.account)
	const [stamina, setStamina] = useState(0)
	const [show, setShow] = useState(false)
	const [transaction, setTransaction] = useState(undefined)
	const [showPriceChoice, setShowPriceChoice] = useState(false)
	const [showTraining, setShowTraining] = useState(false)
	const [showLevelUp, setShowLevelUp] = useState(false)
	const [showLoader, setShowLoader] = useState(false)
	const [rewards, setRewards] = useState(undefined)
	const [win, setWin] = useState(undefined)
	const [price, setPrice] = useState(undefined)
	const [showResult, setShowResult] = useState(false)
	const [changePrice, setChangePrice] = useState(false)
	const [isForSale, setIsForSale] = useState(false)
	const [marketItem, setMarketItem] = useState(undefined)

	const [openedModal, setOpenedModal] = useState(undefined)

	useEffect(() => {
		getPlayerStamina()
	}, [])

	const getPlayerStamina = async () => {
		await new Promise(r => setTimeout(r, 250))
		let stamina = await GameContract.getContract().methods.getCurrentStamina(player.id).call()
		setStamina(stamina)
	}

	const listFootballPlayer = async (price) => {
		if (!price || parseInt(price) <= 0) {
			return
		}
		setShowPriceChoice(false)
		price = Web3.utils.toWei(price, 'ether')
		let BUSDTestnet = new Contract(abis.erc20, addresses.BUSDTestnet)
		if (!await FootballPlayerContract.isApprovedForAll(account)) {
			let transaction = FootballPlayerContract.getContract().methods.setApprovalForAll(addresses.Marketplace, true).send({from: account})
			setTransaction(transaction)
			await transaction
		}
		let busdAllowance = await BUSDTestnet.methods.allowance(account, addresses.Marketplace).call()
		if (parseInt(Web3.utils.fromWei(busdAllowance)) < parseInt(await Marketplace.getListingFees())) {
			let transaction = BUSDTestnet.methods.approve(addresses.Marketplace, '115792089237316195423570985008687907853269984665640564039457584007913129639935').send({from: account})
			setTransaction(transaction)
			await transaction
		}
		setTransaction(Marketplace.getContract().methods.listPlayer(player.id, price).send({from: account}))
	}

	const changePriceFun = (price) => {
		price = Web3.utils.toWei(price, 'ether')
		setTransaction(
			Marketplace.getContract().methods.changePrice(marketItem.itemId, price).send({from: account})
		)
	}

	const cancelListing = () => {
		setTransaction(Marketplace.getContract().methods.cancelListing(marketItem.itemId).send({from: account}))
	}

	const showResultFun = (rewards, win) => {
		setShowLoader(false)
		setRewards(rewards)
		setWin(win)
		setShow(true)
		setShowResult(true)
	}

	const trainPlayer = (trainingGroundId) => {
	    setShowTraining(false)
		setTransaction(
			GameContract.getContract().methods.trainingGround(trainingGroundId, player.id).send({from: account})
		)
	}

	const selectFrame = () => {
		return (<>
			{
				{
					'0': <NoneFrame player={player} account={account}
						stamina={stamina}/>,
					'1': <BronzeFrame player={player} account={account}
						stamina={stamina}/>,
					'2': <SilverFrame player={player} account={account}
						stamina={stamina}/>,
					'3': <GoldFrame player={player} account={account}
						stamina={stamina}/>,
					'4': <DiamondFrame player={player} account={account}
						stamina={stamina}/>
				}[player.frame]
			}</>)
	}

	return (
		<Stack direction="column" alignItems="center">
			<Box onClick={() => setOpenedModal('information')}>
				{ selectFrame() }
			</Box>
			<Loader transaction={transaction} account={account}/>
			<Modal
				closeAfterTransition
				open={openedModal === 'information'}
				onClose={() => setOpenedModal(undefined)}
				BackdropProps={{
					timeout: 500,
				}}
				width={'600px'}
				height={'600px'}
			>
				<Fade in={openedModal === 'information'}>
					<Stack sx={darkModalNoFlex} spacing={4} display="flex" direction="row" justifyContent="space-around" alignItems="center">
						<Box width="240px">
							{selectFrame()}
						</Box>
						<Stack display="flex" spacing={2} flexDirection="column" alignItems="center" justifyContent="center" width="240px">
							<Typography variant="h6">Actions</Typography>
							<Divider flexItem color="primary" />
							<Button fullWidth color="primary" variant="contained">Level Up</Button>
							<Button fullWidth color="primary" variant="contained">Improve Frame</Button>
							<Button fullWidth color="primary" variant="contained">Train</Button>
							<Button fullWidth color="secondary" variant="outlined" my={4}>Sell</Button>
						</Stack>
					</Stack>
				</Fade>
			</Modal>

		</Stack>
	)
}

export default CardsManager

/*

	<Modal show={show} onHide={() => setShow(false)}>
				<Modal.Header closeButton/>
				<Modal.Body className="modal-body-player">
					<div className="align-div-horizontally-container">
						<div className="left-div">
							{ selectFrame() }
						</div>
						<div className="right-div">
							{
								player.score === 100 || isForSale ? '' :
									<Button color="primary" variant="contained" className="button-detail-player"
										onClick={() => {
										    setShowLevelUp(true)
										}}>LEVEL UP</Button>
							}
							{
								player.frame === 4 || isForSale ? '' :
									<Button color="primary" variant="contained" className="button-detail-player">IMPROVE
                                        FRAME</Button>
							}
							<Button color="primary" variant="contained"
								disabled={stamina === '0' || isForSale}
								className="button-detail-player">TRAIN</Button> : ""
							{
								isForSale ?
									<>
										<Button color="error" variant="contained" onClick={() => cancelListing()}
											className="button-detail-player">CANCEL LISTING</Button>
										<Button color="error" variant="contained" onClick={() => {
											setShowPriceChoice(true)
											setChangePrice(true)
										}} className="button-detail-player">CHANGE PRICE</Button>
									</>
									:
									<Button color="error" variant="contained" onClick={() => {
										setShowPriceChoice(true)
									}} className="button-detail-player">SELL PLAYER</Button>
							}
						</div>
					</div>
				</Modal.Body>
			</Modal>
			<Modal show={showPriceChoice} onHide={() => {
				setShowPriceChoice(false)
				setChangePrice(false)
			}}>
				<Modal.Body>
					<Form>
						<InputGroup className="mb-2">
							<FormControl id="inlineFormInputGroup" placeholder="Price" type="decimal"
								onChange={(event) => {
									setPrice(event.target.value)
								}}
								require/>
							<InputGroup.Text>$GB</InputGroup.Text>
						</InputGroup>
						{parseFloat(price) <= 0 ? 'Price need to be superrior to 0' : ''}
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary"
						onClick={() => {
							setShowPriceChoice(false)
							setChangePrice(false)
						}}>
                        Cancel
					</Button>
					<Button variant="primary"
						onClick={() => changePrice ? changePriceFun(price) : listFootballPlayer(price)}>
						{changePrice ? 'Change price' : 'Sell football player'}
					</Button>
				</Modal.Footer>
			</Modal>
			<Modal show={showLevelUp} onHide={() => setShowLevelUp(false)}>
				<Modal.Header closeButton/>
				<Modal.Body>
					<Form.Label>Range</Form.Label>
					<Form.Range/>
				</Modal.Body>
			</Modal>
			<Modal show={showTraining}
				onHide={() => setShowTraining(false)}>
				<Modal.Header closeButton/>
				<Modal.Body>
					{
						showResult ? rewards
							:
							<div>
								<Button variant="primary"
									onClick={() => trainPlayer(0)}>Select</Button>
								<Button variant="primary"
									onClick={() => trainPlayer(1)}>Select</Button>
								<Button variant="primary"
									onClick={() => trainPlayer(2)}>Select</Button>
							</div>
					}
				</Modal.Body>
			</Modal>

 */
