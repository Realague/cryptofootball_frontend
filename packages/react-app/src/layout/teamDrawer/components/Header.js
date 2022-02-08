import React from 'react'
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import { useTheme } from '@emotion/react'
import Helper from '../../../components/helper/Helper'

const Header = ({ changeState }) => {
	const theme = useTheme()

	const DrawerHeader = styled('div')(({ theme }) => ({
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
		...theme.mixins.toolbar,
	}))

	return (
		<DrawerHeader sx={{
			display: 'flex',
		}}>
			<Stack direction="row" alignItems="center" spacing={2}>
				<IconButton onClick={() => changeState()}>
					{theme.direction === 'rtl' ? <ChevronLeft/> : <ChevronRight/>}
				</IconButton>
				<Typography variant="h6" color="secondary">
					Team
				</Typography>
				<Helper size="16px">
					<Stack p={2} sx={{
						width: '200px'
					}}
						   spacing={2}
					>
						<Typography lineHeight={1.4}>
							This drawer will display your current team.
							In order to add some player in your team you can
							drag and drop them into this drawer or click on them
							in the collection's page and use the button called 'Add to team'
						</Typography>
						<Divider flexItem variant="middle" />
						<Stack spacing={1}>
							<Typography variant="body2">
								Save Team
							</Typography>
							<Typography>
								Make a transaction to save the current team
							</Typography>
						</Stack>
						<Stack spacing={1}>
							<Typography variant="body2">
								Reset Team
							</Typography>
							<Typography>
								Reset the team locally, no transactions is made
							</Typography>
						</Stack>
						<Stack spacing={1}>
							<Typography variant="body2">
								Disband Team
							</Typography>
							<Typography>
								Make a transaction to disband the current team
							</Typography>
						</Stack>
					</Stack>
				</Helper>
			</Stack>
			<Box/>
		</DrawerHeader>
	)
}

export default Header
