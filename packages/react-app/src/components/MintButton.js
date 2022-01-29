import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../css/toggleButton.css'
import { Box, Button } from '@mui/material'
import footballHeroesService from '../services/FootballPlayerService'

const MintButton = () => {
	return (
		<Button fullWidth variant="contained" color="primary" onClick={() => footballHeroesService.mint()}>
                Mint
		</Button>
	)
}

export default MintButton
