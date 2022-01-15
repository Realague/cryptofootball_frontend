import AccountInfo from './AccountInfo'
import FootballPlayerCollection from '../FootballPlayerCollection'
import {connect, useSelector} from 'react-redux'
import React from 'react'
import {Box, Typography} from '@mui/material'

const Collection = () => {
	const { isConnected } = useSelector(state => state.user)

	return (
		<Box>
			{
				isConnected ?
					<Box>
						<AccountInfo/>
						<FootballPlayerCollection/>
					</Box> :
					<Box style={{clear: 'both'}} className="loadingConnect">
						<img src="https://media4.giphy.com/media/lXh0orPunKyzrixoCG/giphy.gif" alt=""/>
						<Typography variant="h2">Be your own hero</Typography>
					</Box>
			}
		</Box>
	)
}

export default Collection
