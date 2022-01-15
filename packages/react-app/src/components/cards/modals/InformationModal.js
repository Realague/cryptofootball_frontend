import React from 'react'
import {Box, Divider, Fade, Modal, Stack, Typography} from '@mui/material'
import {darkModalNoFlex} from '../../../css/style'
import Button from '@mui/material/Button'

const InformationModal = ({ open, onClose, frame }) => {
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
	)
}

export default InformationModal
