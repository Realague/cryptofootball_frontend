import React from 'react'
import { Button, Divider, Stack, Typography } from '@mui/material'
import TokenImage from '../../../images/token.png'
import { BsFillLightningChargeFill } from 'react-icons/bs'

const TrainingColumn = ({ difficulty, selectedMode, setSelectedMode }) => {

	return (
		<Stack
			p={2}
			spacing={2}
		>
			<Typography alignSelf="center" variant="h5" color="secondary">{difficulty.name}</Typography>
			<Stack direction="row" spacing={1} alignItems="center">
				<Typography variant="body2">
                    + {difficulty.token}
				</Typography>
				<img style={{ width: 20, height: 20 }} src={TokenImage} alt="token"/>
			</Stack>
			<Stack direction="row" spacing={2}>
				<Typography variant="body2">
                    + {difficulty.xp} XP
				</Typography>
			</Stack>
			<Divider/>
			<Stack direction="row" spacing={1} alignItems="center">
				<Typography variant="body2">
                    - {difficulty.stamina}
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
