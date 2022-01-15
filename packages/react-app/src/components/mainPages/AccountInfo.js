import React, {useEffect, useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {connect, useSelector} from 'react-redux'
import '../../css/accountInfo.css'
import GameContract from '../../contractInteraction/GameContract'
import {
	Box,
	Button, Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle, Divider, Slide, Stack,
	Typography
} from '@mui/material'
import {ClaimModal} from "../accountInfo/modals/ClaimModal";
import {useTheme} from "@emotion/react";
import LoadingImage from "../../images/gifs/loading.gif";
import TokenImage from "../../images/token.png";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />
})

const AccountInfo = () => {
	const {
		account,
		BUSDBalance,
		GBBalance,
		GBPrice,
		claimFee,
	} = useSelector(state => state.user)
	const [open, setOpen] = useState(false)
	const [time, setTime] = useState({'h': 0, 'm': 0, 's': 0})
	const [rewards, setRewards] = useState(0)
	const [seconds, setSeconds] = useState(0)
	const theme = useTheme()

	useEffect(() => {
		if (account !== '' && seconds === 0) {
			setRewardTimer()
		}
		if (seconds > 0) {
			const timer = setTimeout(() => {
				setSeconds(seconds - 1)
				secondsToTime(seconds)
				console.log(seconds)
			}, 1000)
			return () => clearTimeout(timer)
		}
	}, [seconds])

	const setRewardTimer = async () => {
		while (!GameContract.getContract()) {
			await new Promise(r => setTimeout(r, 100))
		}
		let timer = Math.floor(await GameContract.getRemainingClaimCooldown() / 1000)
		setSeconds(timer)
	}

	const secondsToTime = (secs) => {
		let hours = Math.floor(secs / (60 * 60))

		let divisorForMinutes = secs % (60 * 60)
		let minutes = Math.floor(divisorForMinutes / 60)

		let divisorForSeconds = divisorForMinutes % 60
		let seconds = Math.ceil(divisorForSeconds)

		setTime({
			'h': hours,
			'm': minutes,
			's': seconds
		})
	}

	const checkClaimRewards = async () => {
		//TODO display warning if claim fee are not 0%
		let claimCooldownTimer = await GameContract.getRemainingClaimCooldown()
		if (parseInt(claimCooldownTimer) !== 0) {
			return
		}
		let amountToClaim = rewards - rewards * claimFee / 100
		if (claimFee !== 0) {
			setRewards(amountToClaim)
			setOpen(true)
		} else {
			//claimRewards();
		}
	}

	/*const claimRewards = () => {
        setState({transaction: GameContract.getContract().methods.claimReward().send({from: props.account})});
    }*/

	return (
		<>
			<Stack
				display="flex"
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				paddingX={3}
				sx={{
					backgroundColor: theme.palette.background.paper,
					boxShadow: `inset -5px -5px 5px 5px ${theme.palette.background.paper}`,
				}}
			>
				<Stack
					direction="row"
					spacing={1}
					alignItems="center"
					p={1}
				>
					<Stack
						direction="row"
						alignItems="center"
						spacing={1}
					>
						<Typography variant="subtitle2">
							Rewards:
						</Typography>
						<Typography variant="subtitle1">{parseFloat(rewards).toFixed(2)}</Typography>
						<img style={{width: 20, height: 20}} src={TokenImage} alt="token"/>
					</Stack>
					<Typography>
						Claim fee: {claimFee}%
					</Typography>
					{seconds > 0 ?
						<Typography>Next claim in {`${time.h}h${time.m}m${time.s}s`}</Typography>
						: rewards !== '0' ?
							<Button variant="contained" onClick={checkClaimRewards}>Claim</Button>
							: ''
					}
				</Stack>
				<Typography>Wallet
					balance: {parseFloat(GBBalance).toFixed(2)} $GB
					| {parseFloat(BUSDBalance).toFixed(2)} $BUSD
				</Typography>

			</Stack>
			<ClaimModal claimFee={claimFee} rewards={rewards} open={open} onClose={() =>  setOpen(false)} />
		</>
	)
}

export default AccountInfo

