import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useDispatch, useSelector } from 'react-redux'
import '../../css/accountInfo.css'
import { Button, Divider, Stack, Typography, useMediaQuery } from '@mui/material'
import { ClaimModal } from '../accountInfo/modals/ClaimModal'
import { useTheme } from '@emotion/react'
import TokenImage from '../../images/token.png'
import BusdImage from '../../images/busd.png'
import footballHeroesService from '../../services/FootballPlayerService'
import { theme } from '../../theme'
import Web3 from 'web3'
import { LoadingButton } from '@mui/lab'
import { updateAccount, updateGBBalance } from '../../features/userSlice'

const AccountInfo = () => {
	const {
		account,
		BUSDBalance,
		GBBalance,
		claimFee,
		rewards,
		presaleTokens
	} = useSelector(state => state.user)
	const [open, setOpen] = useState(false)
	const [time, setTime] = useState({ 'h': 0, 'm': 0, 's': 0 })
	const [amountToClaim, setAmountToClaim] = useState(0)
	const [seconds, setSeconds] = useState(0)
	const theme = useTheme()
	const [hasStarted, setHasStarted] = useState(false)
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const [loading, setLoading] = useState(false)
	const dispatch = useDispatch()


	useEffect(() => {
		if (seconds === 0 && !hasStarted) {
			setHasStarted(true)
			setRewardTimer()
		}
		if (seconds > 0) {
			const timer = setTimeout(() => {
				setSeconds(seconds - 1)
				secondsToTime(seconds)
			}, 1000)
			return () => clearTimeout(timer)
		}
	}, [seconds])

	const setRewardTimer = async () => {
		let seconds = await footballHeroesService.getRemainingClaimCooldown()
		setSeconds(seconds)
	}

	const claimDemoTokens = async () => {
		setLoading(true)
		footballHeroesService.getDemoTokens().finally(() => {
			footballHeroesService.getGbBalance().then(balance => {
				dispatch(updateGBBalance(Web3.utils.fromWei(balance)))
			})
			setLoading(false)

		})
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
		let claimCooldownTimer = await footballHeroesService.getRemainingClaimCooldown()
		if (parseInt(claimCooldownTimer) !== 0) {
			return
		}
		let realAmount = rewards - rewards * claimFee / 100
		if (claimFee !== 0) {
			setAmountToClaim(realAmount)
			setOpen(true)
		} else {
			footballHeroesService.claimRewards()
		}
	}

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
					overflowX: isMobile ? 'scroll' : 'hidden',
				}}
			>
				<Stack
					direction="row"
					alignItems="center"
					p={1}
					spacing={2}
				>
					<Stack
						direction="row"
						alignItems="center"
						spacing={1}
					>
						<Typography variant="subtitle2">
                            Rewards:
						</Typography>
						<Typography variant="subtitle1">{parseFloat(Web3.utils.fromWei(rewards, 'ether')).toFixed(2)}</Typography>
						<img style={{ width: 20, height: 20 }} src={TokenImage} alt="token"/>
					</Stack>
					<Stack
						direction="row"
						alignItems="center"
						spacing={1}
						hidden={+claimFee === 0}
					>
						<Typography variant="subtitle2" >
                            Claim fee:
						</Typography>
						<Typography variant="subtitle1">
							{claimFee}%
						</Typography>
					</Stack>
					{seconds > 0 ?
						<Typography hidden={seconds === 0}>Next claim in {`${time.h}h${time.m}m${time.s}s`}</Typography>
						: rewards !== '0' ?
							<Button variant="contained" onClick={checkClaimRewards}>Claim</Button>
							: ''
					}
					<Stack
						direction="row"
						alignItems="center"
						spacing={1}
					>
						<Typography variant="subtitle2">
							Presale:
						</Typography>
						<Typography variant="subtitle1">{presaleTokens}</Typography>
						<img style={{ width: 20, height: 20 }} src={TokenImage} alt="token"/>
					</Stack>
					<LoadingButton
						loading={loading}
						variant="contained" onClick={claimDemoTokens}>Claim demo token</LoadingButton>
				</Stack>
				<Stack
					direction="row" sx={{
						backgroundColor: theme.palette.background.default,
						borderRadius: '5px',
					}}
					justifyContent="space-around"
					alignItems="center"
					p={0.5}
					px={2}
					spacing={2}
					m={0.5}
				>
					<Typography color="secondary" variant="subtitle1">Wallet</Typography>
					<Divider orientation="vertical"/>
					<Stack>
						<Stack direction="row" alignItems="center" spacing={1}>
							<Typography variant="body1">{parseFloat(GBBalance).toFixed(2)}</Typography>
							<img style={{ width: 20, height: 20 }} src={TokenImage} alt="token"/>
						</Stack>
						<Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
							<Typography variant="body1">
								{parseFloat(BUSDBalance).toFixed(2)}
							</Typography>
							<img style={{ width: 20, height: 20 }} src={BusdImage} alt="busd"/>
						</Stack>
					</Stack>

				</Stack>
			</Stack>
			<ClaimModal claimFee={claimFee} rewards={amountToClaim} open={open} onClose={() => setOpen(false)}/>
		</>
	)
}

export default AccountInfo

