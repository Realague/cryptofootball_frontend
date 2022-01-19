import React from 'react'
import { Stack } from '@mui/material'
import FootballPlayerCollection from '../../components/FootballPlayerCollection'

const CollectionPage = () => {
	return (
		<Stack display="flex" direction="column" width="100%" overflow="hidden">
			<FootballPlayerCollection/>
		</Stack>
	)
}

export default CollectionPage
