import React, { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import useWeb3Modal from '../../hooks/useWeb3Modal'
import { useDispatch, useSelector } from 'react-redux'
import ProjectLogo from '../../images/projectLogo.jpg'
import WalletButton from './components/ButtonWallet'
import Button from '@mui/material/Button'
import { AppBar, Box, IconButton, Stack, Toolbar, useMediaQuery } from '@mui/material'
import NavigationLink from './components/NavbarLink'
import Loader from '../../components/Loader'
import AccountInfo from '../../components/mainPages/AccountInfo'
import { theme } from '../../theme'
import { changeDrawerMobile } from '../../features/settingsSlice'
import SwipeableFootDrawer from '../swipeableDrawer/swipeableDrawer'
import { SnackbarProvider } from 'notistack'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { FaHamburger } from 'react-icons/all'

const Navbar = ({ toggleTheme }) => {
	const { drawerMobileOpen } = useSelector(state => state.settings)
	const { GBPrice, account } = useSelector(state => state.user)
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const dispatch = useDispatch()

	const menu = [
		{ name: 'Home', path: '' },
		{ name: 'Collection', path: 'collection' },
		{ name: 'Match', path: 'match' },
		{ name: 'Marketplace', path: 'marketplace' },
		{ name: 'Claim Tokens', path: 'claims' },
	]

	return (
		<AppBar variant={'elevation'} position="sticky">
			{
				isMobile &&
				<SwipeableFootDrawer menu={menu}/>
			}
			<Toolbar sx={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				flexDirection: 'row',
				width: '100%',
			}}>
				<Stack direction="row" alignItems="center" spacing={2}>
					{ isMobile &&
					<IconButton onClick={() => dispatch(changeDrawerMobile(true))}>
						<FaHamburger/>
					</IconButton>
					}
					<img src={ProjectLogo} style={{ height: 42, width: 42, marginRight: 15, borderRadius: '50%' }}/>
					{
						!isMobile &&
						menu.map(i => (
							<NavigationLink
								key={i.path}
								name={i.name}
								path={i.path}
							/>
						))
					}
				</Stack>
				<Stack spacing={2} direction="row">
					<WalletButton/>
					<Button onClick={toggleTheme} variant="contained" color="secondary">
                        GB: ${parseFloat(GBPrice).toFixed(2)}
					</Button>
				</Stack>
			</Toolbar>
			{
				account && <AccountInfo/>
			}
		</AppBar>
	)
}

export default Navbar

/*
    <Nav.Link href="https://footballheroes.gitbook.io/footballheroes/">Whitepaper</Nav.Link>
 */
