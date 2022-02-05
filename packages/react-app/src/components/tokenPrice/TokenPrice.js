import React from 'react'
import { Stack, Typography } from '@mui/material'
import BusdImage from '../../images/busd.png'
import GbImage from '../../images/token.png'

const TokenPrice = ({ sxToken = {}, typoVariant = 'body1', price = undefined, token = 'gb' }) => {

	return (
		<Stack direction="row" alignItems="center" spacing={0.5}>
			<Typography variant={typoVariant} hidden={price === undefined}>
				{price}
			</Typography>
			<img style={{ width: 20, height: 20, ...sxToken }} src={{
				'gb': GbImage,
				'busd': BusdImage,
			}[token]} alt="busd"/>
		</Stack>
	)
}

export default TokenPrice
