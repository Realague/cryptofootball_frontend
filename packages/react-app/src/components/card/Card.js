import React, {useEffect, useState} from 'react'
import GameContract from '../../contractInteraction/GameContract'
import Marketplace from '../../contractInteraction/MarketplaceContract'
import Loader from '../Loader'
import Web3 from 'web3'
import FootballPlayerContract from '../../contractInteraction/FootballPlayerContract'
import {abis, addresses} from '@project/contracts'
import Contract from 'web3-eth-contract'
import {useSelector} from 'react-redux'
import {Backdrop, Box, Chip, Divider, Fade, Modal, Slide, Stack, Typography} from '@mui/material'
import InformationModal from './modals/InformationModal'
import Frame from "../../enums/Frame";
import Position from "../../enums/Position";
import messi from "../../images/footballplayer/messi.jpeg";
import {BsFillLightningChargeFill} from "react-icons/bs";
import ExperienceProgressBar from "./components/ExperienceProgressBar";
import StaminaProgressBar from "./components/StaminaProgressBar";

const Card = ({ player, marketItem }) => {
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
		/*if (!await FootballPlayerContract.isApprovedForAll(account)) {
			let transaction = FootballPlayerContract.getContract().methods.setApprovalForAll(addresses.Marketplace, true).send({from: account})
			setTransaction(transaction)
			await transaction
		}
		let busdAllowance = await BUSDTestnet.methods.allowance(account, addresses.Marketplace).call()
		if (parseInt(Web3.utils.fromWei(busdAllowance)) < parseInt(await Marketplace.getListingFees())) {
			let transaction = BUSDTestnet.methods.approve(addresses.Marketplace, '115792089237316195423570985008687907853269984665640564039457584007913129639935').send({from: account})
			setTransaction(transaction)
			await transaction
		}*/
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

	const renderCard = () => (
		<Stack
			onClick={() => setOpenedModal('information')}
			width="250px"
			height="350px"
			sx={{
				backgroundImage: `url(${Frame.frameIdToString(player.frame)})`,
				backgroundSize: "auto 100%",
				backgroundRepeat: "no-repeat",
				backgroundPosition: "center",
			}}
			padding={6}
			paddingTop="70px"
			>
			<Stack
				direction="row"
				justifyContent="space-between"
			>
				<Typography
					variant="subtitle1"
					display="flex"
					justifyContent="flex-end"
					sx={{
						textShadow: '1px 1px 0 black'
					}}
				>
					{Position.positionIdToString(player.position)}
				</Typography>
				<Typography
					variant="h6"
					display="flex"
					justifyContent="center"
					sx={{
						textShadow: '0 0 10px yellow'
					}}
				>
					{player.score}
				</Typography>
			</Stack>
			<Box display="flex" justifyContent="center">
				<img
					src={messi}
					style={{
						height: "126px",
						width: "126px",
						boxShadow: '0px 0px 5px #d0ad34',
						border: "1px solid #d0ad34",
						objectFit: 'cover',
						outline: 'none',
					}}
				/>
			</Box>
			<Stack justifyContent="center" alignItems="center">
				<Typography variant="h6">
					{FootballPlayerContract.getPlayersName(player)}
				</Typography>
				<Stack direction="row" width="100%" alignItems="center" justifyContent="space-evenly">
					<Typography variant="subtitle2">XP</Typography>
					<ExperienceProgressBar
						variant="determinate"
						value={(player.xp / GameContract.getXpRequireToLvlUp(player.score))  * 100}
					/>
				</Stack>
				<Stack direction="row" width="100%" alignItems="center" justifyContent="space-evenly">
					<BsFillLightningChargeFill
						style={{color: 'yellow'}}/>
					<StaminaProgressBar
						variant="determinate"
						value={+stamina}
					/>
				</Stack>
			</Stack>
		</Stack>
	)

	return (
		<Stack direction="column" alignItems="center" width="100%">
			{renderCard()}
			<InformationModal
				onClose={() => setOpenedModal(undefined)}
				open={openedModal === 'information'}
				frame={renderCard}
				player={player}
				marketItem={marketItem}
			/>

		</Stack>
	)
}

export default Card

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
