import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../css/toggleButton.css'
import { Box, Button } from '@mui/material'
import footballHeroesService from '../services/FootballPlayerService'

const MintButton = () => {
	return (
		<Box className="navMenu" style={{ clear: 'both' }}>
			<Button sx={{ margin: '10px' }} variant="contained" color="primary" className="float-left" onClick={() => footballHeroesService.mint()}>
                Mint
			</Button>
		</Box>
	)
}

export default MintButton
