import '../../css/partenaire.css'
import React from 'react'
import { Stack } from '@mui/material'

function Partenaire() {
	return (
		<Stack direction="row" alignItems="center" justifyContent="space-around" p={2}>
			<a href="https://www.qries.com/">
				<img
					style={{
						height: '35px',
						width: '170px',
					}}
					alt="Qries" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Binance_logo.svg/2560px-Binance_logo.svg.png">
				</img>
			</a>

			<a href="https://www.qries.com/">
				<img style={{
					height: '30px',
					width: '170px',
				}} alt="Qries" src="https://www.savefuturecoin.com/assets/img/live-pancakeswap.png">
				</img>
			</a>
		</Stack>
	)
}

export default Partenaire
