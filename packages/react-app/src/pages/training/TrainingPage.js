import React, { useState } from 'react'
import {
	Grid,
	Stack,
} from '@mui/material'
import { useSelector } from 'react-redux'
import Card from '../../components/card/Card'
import SortRow from './components/SortRow'
import LoadingImage from '../../images/gifs/loading.gif'
import TrainingModal from './components/TrainingModal'

const TrainingPage = () => {
	const { collection, fetching } = useSelector(state => state.game)
	const [modalOptions, setModalOptions] = useState({
		open: false,
		player: undefined,
	})
	const [sortOptions, setSortOptions] = useState({
		field: 'currentStamina',
		direction: 'desc',
	})

	return (
		<Stack width="100%" overflow="hidden" alignItems="center" p={2} spacing={2}>
			<SortRow sortOptions={sortOptions} setSortOptions={setSortOptions} />
			<Grid container>
				{
					fetching ?
						<Stack height="50vh" width="100%" justifyContent="center" alignItems="center">
							<img style={{ width: 400, height: 200 }} src={LoadingImage} alt=""/>
						</Stack>
						:
						[...collection]
							.filter(player => player.isAvailable)
							.sort((a, b) => {
								if (sortOptions.direction === 'desc') {
									return parseFloat(b[sortOptions.field]) - parseFloat(a[sortOptions.field])
								} else {
									return parseFloat(a[sortOptions.field]) - parseFloat(b[sortOptions.field])
								}
							})
							.map(player => (
								<Grid item key={player.id} xs={true}>
									<Card
										player={player}
										isTrainingPage
										onClick={(p) => {
											setModalOptions({
												open: true,
												player: p
											})
										}}
									/>
								</Grid>
							))
				}
			</Grid>
			<TrainingModal modalOptions={modalOptions} setModalOptions={setModalOptions} />
		</Stack>
	)
}

export default TrainingPage
