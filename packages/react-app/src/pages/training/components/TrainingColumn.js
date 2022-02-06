import React from 'react'
import { Button, Divider, Stack, Typography } from '@mui/material'
import TokenImage from '../../../images/token.png'
import { BsFillLightningChargeFill } from 'react-icons/bs'
import { useSelector } from 'react-redux'

const TrainingColumn = ({ useAllStamina, difficulty, selectedMode, setSelectedMode, player }) => {
	const { GBPrice } = useSelector(state => state.user)

	return (
		<Stack
			p={2}
			spacing={2}
		>
			<Typography alignSelf="center" variant="h5" color="secondary">{difficulty.name}</Typography>
			<Divider flexItem/>
			<Typography alignSelf="center" variant="subtitle2">Rewards</Typography>
			<Divider flexItem variant="middle"/>
			<Stack direction="row" spacing={1} alignItems="center">
				<Typography variant="body2">
                    + {
						useAllStamina ?
							difficulty.token * +GBPrice * (+player.currentStamina / 25)
							:
							difficulty.token * +GBPrice
					}
				</Typography>
				<img style={{ width: 20, height: 20 }} src={TokenImage} alt="token"/>
			</Stack>
			<Stack direction="row" spacing={2}>
				<Typography variant="body2">
                    + {
						useAllStamina ?
							difficulty.xp * (+player.currentStamina / 25)
							:
							difficulty.xp
					} XP
				</Typography>
			</Stack>
			<Divider/>
			<Typography alignSelf="center" variant="subtitle2">Consume</Typography>
			<Divider flexItem variant="middle"/>
			<Stack direction="row" spacing={1} alignItems="center">
				<Typography variant="body2">
                    - {
						useAllStamina ?
							player.currentStamina
							:
							difficulty.stamina
					}
				</Typography>
				<BsFillLightningChargeFill
					style={{ color: 'yellow', width: '20px' }}/>
			</Stack>
			<Divider flexItem variant="middle"/>
			<Button
				variant={selectedMode === difficulty.id ? 'outlined' : 'contained'}
				onClick={() => setSelectedMode(difficulty.id)}
				color="secondary">
				{selectedMode === difficulty.id ? 'Selected' : 'Select'}
			</Button>
		</Stack>
	)
}

export default TrainingColumn
