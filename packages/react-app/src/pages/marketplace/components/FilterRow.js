import React from 'react'
import { Box, Button, MenuItem, Select, Slider, Stack, Typography, useMediaQuery } from '@mui/material'
import { ArrowDropDown, ArrowDropUp, FilterAlt, FilterAltOff } from '@mui/icons-material'
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

	const renderRanges = (
		<Stack direction="row" alignItems="center" spacing={8}>
			<Box width="150px" p={1} >
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
			<Box width="150px" p={1}>
				{
					scoreRange !== undefined &&
					<Slider
						color="secondary"
						min={lowestHighestScore[0]}
						max={lowestHighestScore[1]}
						marks={[
							{
								value: scoreRange[0],
								label: `${scoreRange[0]} Score`
							},
							{
								value: scoreRange[1],
								label: `${scoreRange[1]} Score`
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

	return (
		<Stack
			display="flex"
			direction={isMobile ? 'column' : 'row'}
			alignItems="center"
			spacing={isMobile ? 0 : 3}
			p={isMobile ? 0 : 2}
			sx={{
				height: isMobile ? '100px' : '40px',
			}}
		>
			<Stack direction="row" alignItems="center" spacing={2}>
				<Button
					hidden={!isMobile}
                	variant="contained"
                	color="secondary"
                	onClick={() => setShowLeftFilter(!showLeftFilter)}
				>
                	{
                		showLeftFilter ? <FilterAltOff/> : <FilterAlt/>
                	}
				</Button>
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
			</Stack>
			{
				renderRanges
			}

		</Stack>
	)
}

export default FilterRow
