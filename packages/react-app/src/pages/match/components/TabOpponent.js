import * as React from 'react'
import { styled } from '@mui/system'
import TabsUnstyled from '@mui/base/TabsUnstyled'
import TabsListUnstyled from '@mui/base/TabsListUnstyled'
import TabPanelUnstyled from '@mui/base/TabPanelUnstyled'
import { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled'
import TabUnstyled, { tabUnstyledClasses } from '@mui/base/TabUnstyled'
import theme from '../../../theme'
import PlayerIcon from './PlayerIcon'
import { Button, Divider, Stack, Typography } from '@mui/material'
import footballHeroesService from '../../../services/FootballPlayerService'


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

export default function TabOpponent({ opponents, selectOpponent }) {
	return (
		<TabsUnstyled defaultValue={0} style={{
			borderRadius: '10px',
			backgroundColor: theme.palette.background.default,
		}}>
			<TabsList>
				{
					opponents.map((o, i) => (
						<Tab key={i+40} onClick={() => selectOpponent(o)}>Team {i + 1}</Tab>
					))
				}
			</TabsList>
			{
				opponents.map((o, i) => (
					<TabPanel key={i+50} value={i}>
						<Stack spacing={1}>
							<Stack direction="row" spacing={2} alignItems="center" justifyContent="center" pb={3}>
								<Typography variant="h5">Team Score:</Typography>
								<Typography variant="h5" sx={{
									textShadow: '0 0 10px yellow',
								}}>{o.score}</Typography>
							</Stack>
							<Divider/>
							{
								['defenders', 'midfielders', 'attackers'].map((position, i) => (
									<Stack key={i} spacing={2} p={2}>
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
							<Button
								variant="contained"
								color="secondary"
								fullWidth
								onClick={async () => {
									await footballHeroesService.playMatch(o.id)
								}}
							>
							Play
							</Button>
						</Stack>
					</TabPanel>
				))
			}
		</TabsUnstyled>
	)
}
