import React, { useState } from 'react'
import {
	Button,
	Checkbox,
	CircularProgress,
	Divider,
	Grid,
	IconButton,
	Modal,
	Stack,
	Typography,
	useMediaQuery
} from '@mui/material'
import TrainingColumn from './TrainingColumn'
import { trainingModal } from '../../../css/style'
import { theme } from '../../../theme'
import football1 from '../../../images/football-1.jpg'
import footballHeroesService from '../../../services/FootballPlayerService'
import { BsFillLightningChargeFill } from 'react-icons/bs'
import { ChevronLeft, ChevronRight, Close, RemoveCircle } from '@mui/icons-material'

const TrainingModal = ({ modalOptions, setModalOptions }) => {
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const [useAllStamina, setUseAllStamina] = useState(false)
	const [selectedMode, setSelectedMode] = useState(undefined)

	const train = () => {
		const player = modalOptions.player
		footballHeroesService.trainPlayer(selectedMode, player.id, useAllStamina)
		setModalOptions({
			...modalOptions,
			open: false,
		})
	}

	const difficulties = [{
		name: 'EASY',
		id: 0,
		xp: 100,
		token: 5,
		stamina: 25,
	},
	{
		name: 'MEDIUM',
		id: 1,
		xp: 150,
		token: 7,
		stamina: 25,
	},
	{
		name: 'HARD',
		id: 2,
		xp: 200,
		token: 10,
		stamina: 25,
	}]

	return (
		<Modal
			closeAfterTransition
			open={modalOptions.open}
			onClose={() => {
				setUseAllStamina(false)
				setSelectedMode(undefined)
				setModalOptions({ ...modalOptions, open : false })
			}}
			BackdropProps={{
				timeout: 500,
			}}
		>
			<Grid
				container
				width={isMobile ? '95vw' : '65vw'}
				height={isMobile ? 'auto' : 'auto'}
				sx={{
					gridAutoColumns: 'column',
					...trainingModal,
				}}
				p={1}
			>
				<Grid
					item xs={0} sm={4} hidden={isMobile}>
					<img style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
					}} src={football1} alt=""/>
				</Grid>
				<Grid item xs={true}>
					{
						modalOptions.player === undefined ?
							<CircularProgress/>
							:

							<Stack alignItems="center" justifyContent="center" spacing={2} p={2}>
								<Stack direction="row" width="100%" justifyContent="flex-end">
									<IconButton onClick={() => setModalOptions({ ...modalOptions, open : false })}>
										<Close/>
									</IconButton>
								</Stack>
								<Typography color="secondary" variant="h4">Training Ground</Typography>
								<Typography variant="h6">
                            Choose the difficulty of the training
								</Typography>
								<Divider flexItem/>
								<Stack direction="row" alignItems="center" justifyContent="center" spacing={1} width="100%">
									<Typography variant="body2">Stamina available: </Typography>
									<Typography variant="body1">{modalOptions.player.currentStamina}</Typography>
									<BsFillLightningChargeFill
										style={{ color: 'yellow', width: '20px' }}/>
								</Stack>
								<Grid container sx={{ gridAutoColumns: 'column' }}>
									{
										difficulties.map(d => (
											<Grid key={d.name} item xs={4}>
												<TrainingColumn
													player={modalOptions.player}
													difficulty={d}
													selectedMode={selectedMode}
													useAllStamina={useAllStamina}
													setSelectedMode={setSelectedMode}
												/>
											</Grid>
										))
									}
								</Grid>
								<Stack width="100%" alignItems="center">
									<Stack direction="row" alignItems="center" justifyContent="center" spacing={2} width="100%">
										<Typography variant="body2">Difficulty: </Typography>
										{
											selectedMode === undefined ?
												<Typography variant="body1" color="error">No difficulty chosen</Typography>
												:
												<Typography variant="body1" color="secondary">{
													difficulties[selectedMode].name
												}</Typography>
										}
									</Stack>
									<Stack direction="row" alignItems="center" justifyContent="center" spacing={1} width="100%">
										<Typography variant="body2">Use all the stamina</Typography>
										<Checkbox
											color="secondary"
											checked={useAllStamina}
											onChange={(event) => {
												setUseAllStamina(event.target.checked)
											}}
											inputProps={{ 'aria-label': 'controlled' }}
										/>
									</Stack>
									<Button
										onClick={train}
										disabled={
											selectedMode === undefined ||
											+modalOptions.player.currentStamina < difficulties[selectedMode].stamina
										}
										fullWidth
										variant="contained"
										color="secondary"
									>
                                Train
									</Button>
								</Stack>
							</Stack>
					}
				</Grid>
			</Grid>
		</Modal>
	)
}

export default TrainingModal
