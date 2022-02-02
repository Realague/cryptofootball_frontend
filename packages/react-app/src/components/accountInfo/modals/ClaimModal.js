import React from 'react'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import Button from '@mui/material/Button'
import footballHeroesService from '../../../services/FootballPlayerService'

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
					With your current <strong>{claimFee}%</strong> claim fee, you'll
					receive <strong>{rewards} $GB</strong> out
					of <strong>{rewards} $GB</strong> Claim fee decay at a rate of 2% everyday
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button
					variant="contained"
					onClick={() => onClose()}
				>
					Cancel
				</Button>
				<Button
					onClick={async () => await footballHeroesService.claimRewards()}
					color="secondary"
					variant="contained"
				>
					Claim
				</Button>
			</DialogActions>
		</Dialog>
	)
}
