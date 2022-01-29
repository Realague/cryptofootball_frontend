import React, { useEffect, useState } from 'react'
import { Box, Chip, Grid, Popover, Stack, Typography } from '@mui/material'
import InformationModal from './modals/InformationModal'
import Frame from '../../enums/Frame'
import Position from '../../enums/Position'
import { BsFillLightningChargeFill } from 'react-icons/bs'
import ExperienceProgressBar from './components/ExperienceProgressBar'
import StaminaProgressBar from './components/StaminaProgressBar'
import footballHeroesService from '../../services/FootballPlayerService'
import { useSelector } from 'react-redux'

const Card = ({ player, marketItem, mobile = false, isNpc }) => {
	const { team } = useSelector(state => state.game)
	const [stamina, setStamina] = useState(0)
	const [openedModal, setOpenedModal] = useState(undefined)
	const [anchorElExperience, setAnchorElExperience] = useState(undefined)
	const [anchorElStamina, setAnchorElStamina] = useState(undefined)

	useEffect(() => {
		if (!isNpc) {
			getPlayerStamina()
		}
	}, [])

	const getPlayerStamina = async () => {
		setStamina(await footballHeroesService.getCurrentStamina(player.id))
	}

	const renderCard = () => (
		<Stack
			onClick={() => setOpenedModal('information')}
			width={mobile ? '160px' : '250px'}
			height={mobile ? '270px' : '350px'}
			sx={{
				backgroundImage: `url(${Frame.frameIdToString(player.frame)})`,
				backgroundSize: 'auto 95%',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center',
			}}
			padding={6}
			paddingTop={mobile ? '50px' : '70px'}
		>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
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
				{
					!mobile && team.players.find(p => player.id == p.id) !== undefined &&
						<Chip sx={{ position: 'absolute', marginLeft: '40px', marginBottom: '20px' }} label="In Team" />
				}
				<Typography
					variant="h6"
					display="flex"
					justifyContent="center"
					sx={{
						textShadow: '0 0 10px yellow',
						paddingBottom: isNpc ? '45px' : '',
					}}
				>
					{player.score}
				</Typography>
			</Stack>
			<Box display="flex" justifyContent="center">
				<img
					src={`/footballplayer/${player.position}-${player.rarity}-${player.imageId}.png`}
					style={{
						height: mobile ? '76px' : '126px',
						width: mobile ? '76px' : '126px',
						boxShadow: `0px 0px 5px ${Frame.TierList[player.frame].color.dark}, inset 0px 0px 50px ${Frame.TierList[player.frame].color.main}`,
						background: 'radial-gradient(at 50% 0, black, transparent 70%),linear-gradient(0deg, black, transparent 50%) bottom',
						border: `1px solid ${Frame.TierList[player.frame].color.light}`,
						objectFit: 'cover',
						outline: 'none',
					}}
				/>
			</Box>
			<Stack justifyContent="center" alignItems="center" spacing={0.25}>
				<Typography variant="h6">
					{footballHeroesService.getPlayersName(player)}
				</Typography>
				<Stack hidden={isNpc} direction={mobile ? 'column' : 'row'} width="80%" alignItems="center" justifyContent="space-between" spacing={1}>
					<Typography hidden={mobile} width="20px" variant="subtitle2">XP</Typography>
					<ExperienceProgressBar
						onMouseEnter={(event) => {
							setAnchorElExperience(event.currentTarget)
						}}
						onMouseLeave={() => {
							setAnchorElExperience(undefined)
						}}
						variant="determinate"
						value={(player.xp / footballHeroesService.getXpRequireToLvlUp(player.score))  * 100}
					/>
					<Popover
						id="mouse-over-popover"
						sx={{
							pointerEvents: 'none',
						}}
						open={Boolean(anchorElExperience)}
						anchorEl={anchorElExperience}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'left',
						}}
						onClose={() => setAnchorElExperience(undefined)}
						disableRestoreFocus
					>
						<Typography sx={{ p: 1 }}>
							{+player.xp} / {footballHeroesService.getXpRequireToLvlUp(player.score) * 100}
						</Typography>
					</Popover>
				</Stack>
				<Stack hidden={isNpc} direction={mobile ? 'column' : 'row'} width="80%" alignItems="center" justifyContent="space-between" spacing={1}>
					<BsFillLightningChargeFill
						hidden={mobile}
						style={{ color: 'yellow', width: '20px' }}/>
					<StaminaProgressBar
						onMouseEnter={(event) => {
							setAnchorElStamina(event.currentTarget)
						}}
						onMouseLeave={() => {
							setAnchorElStamina(undefined)
						}}
						variant="determinate"
						value={+player.currentStamina}
					/>
					<Popover
						id="mouse-over-popover"
						sx={{
							pointerEvents: 'none',
						}}
						open={Boolean(anchorElStamina)}
						anchorEl={anchorElStamina}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'left',
						}}
						onClose={() => setAnchorElStamina(undefined)}
						disableRestoreFocus
					>
						<Typography sx={{ p: 1 }}>{+player.currentStamina} / 100</Typography>
					</Popover>

				</Stack>
			</Stack>
			{
				mobile && team.players.find(p => player.id == p.id) !== undefined &&
					<Box
						sx={{
							display: 'flex',
							width: '100%',
							justifyContent: 'center',
							paddingTop: '5px',
						}}
						color="secondary"
					>
						<Chip sx={{ position: 'absolute' }} label="In Team" />
					</Box>
			}
		</Stack>
	)

	return (
		<Stack sx={{
			display: 'flex',
		}} direction="column" alignItems="center" width={'100%'}>
			{renderCard()}
			<InformationModal
				isInTeam={team.players.find(p => player.id == p.id) !== undefined}
				mobile={mobile}
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
