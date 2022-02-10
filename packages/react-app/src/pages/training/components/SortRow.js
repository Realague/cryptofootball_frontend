import React from 'react'
import { MenuItem, Select, Stack, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'

const SortRow = ({ setSortOptions, sortOptions }) => {

	return (
		<Stack direction="row" spacing={2} alignItems="center">
			<Typography variant="subtitle1">Sort:</Typography>
			<Select
				value={sortOptions.field}
				label="Sort"
				color="secondary"
				onChange={(e) => setSortOptions({ ...sortOptions, field: e.target.value })}
				sx={{
					height: '30px',
					width: '100px',
				}}
			>
				<MenuItem value={'currentStamina'}>Stamina</MenuItem>
				<MenuItem value={'score'}>Score</MenuItem>
				<MenuItem value={'frame'}>Tier</MenuItem>
			</Select>
			<Button
				sx={{
					height: '30px',
					width: '70px',
				}}
				variant="outlined"
				color="secondary"
				endIcon={sortOptions.direction === 'desc' ? <ArrowDropDown /> : <ArrowDropUp/>}
				onClick={() => setSortOptions({ ...sortOptions, direction: sortOptions.direction === 'desc' ? 'asc' : 'desc' })}
			>
				{ sortOptions.direction }
			</Button>
		</Stack>
	)
}

export default SortRow
