import React, {useState} from 'react'
import {Box, Divider, Fade, Modal, Paper, Slide, Stack, Typography} from '@mui/material'
import {darkModalNoFlex} from '../../../css/style'
import Button from '@mui/material/Button'

const InformationModal = ({ open, onClose, frame }) => {
	const [action, setAction] = useState(undefined)

	const chooseAction = (value) => {
		setAction(action === value ? undefined : value)
	}

	const InformationContent = (
		<Stack display="flex" height={'100%'} spacing={2} flexDirection="column" alignItems="center" justifyContent="center" width="240px">
			<Typography variant="h6">Actions</Typography>
			<Divider flexItem color="primary" />
			<Button onClick={() => chooseAction('level-up')} fullWidth color="primary" variant="contained">Level Up</Button>
			<Button fullWidth color="primary" variant="contained">Improve Frame</Button>
			<Button fullWidth color="primary" variant="contained">Train</Button>
			<Button fullWidth color="secondary" variant="outlined" my={4}>Sell</Button>
		</Stack>
	)

	const LevelUpContent = (
		<Stack display="flex" height={'100%'} spacing={2} flexDirection="column" alignItems="center" justifyContent="center" width="240px">
			<Typography variant="h6">Level Up</Typography>
			<Divider flexItem color="primary" />
			<Button fullWidth color="primary" variant="contained">Confirm</Button>
			<Divider flexItem color="primary" />
			<Button onClick={() => chooseAction(undefined)} fullWidth color="secondary" variant="contained">Back</Button>
		</Stack>
	)

	return (
		<Modal
			closeAfterTransition
			open={open}
			onClose={onClose}
			BackdropProps={{
				timeout: 500,
			}}
			width={'600px'}
			height={'600px'}
		>
			<Fade in={open}>
				<Stack sx={darkModalNoFlex} spacing={4} display="flex" direction="row" justifyContent="space-around" alignItems="center">
					<Box width="240px">
						{frame()}
					</Box>
					<Box width="240px" height={'400px'} overflow={'hidden'}>
						<Slide direction="right" mountOnEnter unmountOnExit in={action === undefined}>
							{ InformationContent }
						</Slide>
						<Slide direction="left" mountOnEnter unmountOnExit in={action === 'level-up'}>
							{ LevelUpContent }
						</Slide>
					</Box>

				</Stack>
			</Fade>
		</Modal>
	)
}

export default InformationModal
