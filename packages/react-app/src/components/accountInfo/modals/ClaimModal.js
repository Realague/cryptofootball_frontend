import React from 'react'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import Button from '@mui/material/Button'

export const ClaimModal = ({ onClose, open, rewards, claimFee }) => {

	return (
		<Dialog
			open={open}
			// TransitionComponent={Transition}
			keepMounted
			onClose={() => onClose()}
		>
			<DialogTitle>Claim Rewards</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-slide-description">
                    With your current {claimFee}% claim fee, you'll
                    receive {rewards} $GB
                    out of {rewards} $GB
                    Claim fee decay at a rate of 2% everyday
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button color="error" variant="outlined"
					onClick={() => onClose()}>Cancel</Button>
				<Button color="secondary" variant="contained"
				>Claim</Button>
			</DialogActions>
		</Dialog>
	)
}
