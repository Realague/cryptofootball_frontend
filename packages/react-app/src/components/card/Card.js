import React, {useEffect, useState} from 'react'
import { Box, Stack, Typography} from '@mui/material'
import InformationModal from './modals/InformationModal'
import Frame from "../../enums/Frame";
import Position from "../../enums/Position";
import messi from "../../images/footballplayer/messi.jpeg";
import {BsFillLightningChargeFill} from "react-icons/bs";
import ExperienceProgressBar from "./components/ExperienceProgressBar";
import StaminaProgressBar from "./components/StaminaProgressBar";
import footballHeroesService from "../../services/FootballPlayerService";

const Card = ({ player, marketItem }) => {
	const [stamina, setStamina] = useState(0)
	const [openedModal, setOpenedModal] = useState(undefined)

	useEffect(() => {
		getPlayerStamina()
	}, [])

	const getPlayerStamina = async () => {
		setStamina(await footballHeroesService.getCurrentStamina(player.id))
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
			<Stack justifyContent="center" alignItems="center" spacing={0.25}>
				<Typography variant="h6">
					{footballHeroesService.getPlayersName(player)}
				</Typography>
				<Stack direction="row" width="80%" alignItems="center" justifyContent="space-between" spacing={1}>
					<Typography width="20px" variant="subtitle2">XP</Typography>
					<ExperienceProgressBar
						variant="determinate"
						value={(player.xp / footballHeroesService.getXpRequireToLvlUp(player.score))  * 100}
					/>
				</Stack>
				<Stack direction="row" width="80%" alignItems="center" justifyContent="space-between" spacing={1}>
					<BsFillLightningChargeFill
						style={{color: 'yellow', width: "20px"}}/>
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
