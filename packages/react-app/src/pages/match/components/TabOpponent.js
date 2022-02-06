import * as React from 'react'
import { styled } from '@mui/system'
import TabsUnstyled from '@mui/base/TabsUnstyled'
import TabsListUnstyled from '@mui/base/TabsListUnstyled'
import TabPanelUnstyled from '@mui/base/TabPanelUnstyled'
import { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled'
import TabUnstyled, { tabUnstyledClasses } from '@mui/base/TabUnstyled'
import theme from '../../../theme'
import PlayerIcon from './PlayerIcon'
import { Button, Divider, easing, Slide, Stack, Typography } from '@mui/material'
import footballHeroesService from '../../../services/FootballPlayerService'
import LayoutContent from '../../../components/LayoutContent'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import GbImage from '../../../images/token.png'


const Tab = styled(TabUnstyled)`
  font-family: IBM Plex Sans, sans-serif;
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: bold;
  background-color: transparent;
  width: 100%;
  padding: 12px 16px;
  margin: 6px 6px;
  border: none;
  border-radius: 5px;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: ${theme.palette.primary.main};
  }

  &:focus {
    color: #fff;
    border-radius: 3px;
    outline: 2px solid ${theme.palette.primary.dark};
    outline-offset: 2px;
  }

  &.${tabUnstyledClasses.selected} {
    background-color: ${theme.palette.primary.dark};
    color: ${theme.palette.secondary.main};
  }

  &.${buttonUnstyledClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const TabPanel = styled(TabPanelUnstyled)`
  width: 100%;
  padding: 15px;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
`

const TabsList = styled(TabsListUnstyled)`
  min-width: 320px;
  background-color: ${theme.palette.primary.main};
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
`

export default function TabOpponent({ opponents, selectOpponent, setMatchAvailable, matchAvailable }) {
	const { isInTransaction } = useSelector(state => state.settings)
	const [oldIndex, setOldIndex] = useState(0)
	const [currentIndex, setCurrentIndex] = useState(0)

	return (
		<TabsUnstyled defaultValue={0} style={{
			borderRadius: '10px',
			backgroundColor: theme.palette.background.default,
		}}>
			<TabsList>
				{
					opponents.map((o, i) => (
						<Tab key={i+40} onClick={() => {
							setOldIndex(currentIndex)
							setCurrentIndex(i)
							selectOpponent(o)
						}}>Opponent {i + 1}</Tab>
					))
				}
			</TabsList>
			{
				opponents.map((o, i) => (
					<TabPanel key={i+50} value={i} sx={{ overflow: 'hidden' }}>
						<Slide key={i+50}
							   timeout={500}
							   direction={currentIndex > oldIndex ? 'left' : 'right'}
							   appear
							   in
						>
							<LayoutContent>
								<Stack spacing={1}>
									<Stack direction="row" spacing={2} alignItems="center" justifyContent="space-around" pb={3}>
										<Stack alignItems="center">
											<Typography variant="h5">Team Score</Typography>
											<Typography variant="h5" sx={{
												textShadow: '0 0 10px yellow',
											}}>{o.score}</Typography>
										</Stack>
										<Stack alignItems="center">
											<Typography variant="h5">Rewards</Typography>
											<Stack direction="row" alignItems="center" spacing={0.5}>
												<Typography variant="h5" sx={{
													textShadow: '0 0 10px yellow',
												}}>{o.rewards}</Typography>
												<img style={{ width: 20, height: 20 }} src={GbImage} alt="gb token"/>
											</Stack>
										</Stack>
									</Stack>
									<Divider/>
									{
										['defenders', 'midfielders', 'attackers'].map((position, i) => (
											<Stack key={i} spacing={1} p={1}>
												<Typography variant="subtitle2" color="secondary">{position.toUpperCase()}</Typography>
												<Stack direction="row" flexWrap spacing={2}>
													{
														o[position].map((p, indexPlayer) => (
															<PlayerIcon isNpc key={i + indexPlayer + 60} player={p}/>)
														)
													}
												</Stack>
											</Stack>
										))
									}
									<Divider/>
									<LoadingButton
										variant="contained"
										color="secondary"
										disabled={+matchAvailable === 0}
										loading={isInTransaction}
										fullWidth
										onClick={async () => {
											await footballHeroesService.playMatch(o.id)
											setMatchAvailable(matchAvailable - 1)
										}}
									>
							Play
									</LoadingButton>
								</Stack>
							</LayoutContent>
						</Slide>
					</TabPanel>
				))
			}
		</TabsUnstyled>
	)
}
