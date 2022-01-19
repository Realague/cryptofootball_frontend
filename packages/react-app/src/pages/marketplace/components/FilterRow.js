import React from 'react'
import { Box, Button, MenuItem, Select, Slider, Stack, Typography, useMediaQuery } from '@mui/material'
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import { useTheme } from '@emotion/react'

const FilterRow = ({
	sortOption,
	setSortOption,
	sortDirection,
	setSortDirection,
	priceRange,
	setPriceRange,
	lowestHighestPrice,
	scoreRange,
	setScoreRange,
	lowestHighestScore,
	setShowLeftFilter,
	showLeftFilter,
}) => {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	return (
		<Stack
			display="flex"
			direction="row"
			alignItems="center"
			spacing={2}
			p={2}
			sx={{
				height: '30px',
			}}
		>
			{
				isMobile &&
                <Button
                	variant="contained"
                	color="secondary"
                	onClick={() => setShowLeftFilter(!showLeftFilter)}
                >
                	{showLeftFilter ? 'Close' : 'Open'}
                </Button>
			}
			<Typography variant="subtitle1">Sort:</Typography>
			<Select
				value={sortOption}
				label="Sort"
				color="secondary"
				onChange={(event) => {
					setSortOption(event.target.value)
				}}
				sx={{
					height: '30px',
					width: '100px',
				}}
			>
				<MenuItem value={'score'}>Score</MenuItem>
				<MenuItem value={'id'}>Id</MenuItem>
				<MenuItem value={'frame'}>Tier</MenuItem>
			</Select>
			<Button
				sx={{
					height: '30px',
					width: '70px',
				}}
				variant="outlined"
				color="secondary"
				endIcon={sortDirection === 'desc' ? <ArrowDropDown/> : <ArrowDropUp/>}
				onClick={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
			>
				{sortDirection}
			</Button>
			<Box width="150px" p={2} paddingTop={3}>
				{
					priceRange !== undefined &&
                    <Slider
                    	color="secondary"
                    	min={lowestHighestPrice[0]}
                    	max={lowestHighestPrice[1]}
                    	marks={[
                    		{
                    			value: priceRange[0],
                    			label: `${priceRange[0]} $GB`
                    		},
                    		{
                    			value: priceRange[1],
                    			label: `${priceRange[1]} $GB`
                    		}
                    	]}

                    	getAriaLabel={() => 'Price range'}
                    	value={priceRange}
                    	onChange={(e, value) => {
                    		setPriceRange(value)
                    	}}
                    	valueLabelDisplay="auto"

                    />
				}
			</Box>
			<Box width="150px" p={2} paddingTop={3}>
				{
					scoreRange !== undefined &&
                    <Slider
                    	color="secondary"
                    	min={lowestHighestScore[0]}
                    	max={lowestHighestScore[1]}
                    	marks={[
                    		{
                    			value: scoreRange[0],
                    			label: `${scoreRange[0]} $GB`
                    		},
                    		{
                    			value: scoreRange[1],
                    			label: `${scoreRange[1]} $GB`
                    		}
                    	]}

                    	getAriaLabel={() => 'Price range'}
                    	value={scoreRange}
                    	onChange={(e, value) => {
                    		setScoreRange(value)
                    	}}
                    	valueLabelDisplay="auto"
                    />
				}
			</Box>
		</Stack>
	)
}

export default FilterRow
