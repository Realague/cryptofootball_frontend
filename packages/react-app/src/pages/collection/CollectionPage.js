import React from 'react'
import {Box, Stack} from '@mui/material'
import FootballPlayerCollection from "../../components/FootballPlayerCollection";

const CollectionPage = () => {
	return (
		<Stack display="flex" direction="column" width="100%">
			<FootballPlayerCollection/>
		</Stack>
	)
}

export default CollectionPage
