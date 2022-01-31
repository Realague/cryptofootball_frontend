import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useDispatch, useSelector } from 'react-redux'
import ProjectLogo from '../../images/projectLogo.jpg'
import WalletButton from './components/ButtonWallet'
import Button from '@mui/material/Button'
import { AppBar, Box, IconButton, Stack, Toolbar, useMediaQuery } from '@mui/material'
import NavigationLink from './components/NavbarLink'
import AccountInfo from '../../components/mainPages/AccountInfo'
import { theme } from '../../theme'
import { changeDrawerMobile } from '../../features/settingsSlice'
import SwipeableFootDrawer from '../swipeableDrawer/swipeableDrawer'
import { FaHamburger } from 'react-icons/all'
import TokenImage from '../../images/token_black.png'
import { fireConffeti } from '../../features/gameSlice'

const Navbar = ({ toggleTheme }) => {
	const { GBExactPrice, account } = useSelector(state => state.user)
	const { isReady } = useSelector(state => state.settings)
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const dispatch = useDispatch()

	const menu = [
		//{ name: 'Home', path: '' },
		{ name: 'Collection', path: 'collection' },
		{ name: 'Match', path: 'match' },
		{ name: 'Mint', path: 'mint' },
		{ name: 'Training', path: 'training' },
		{ name: 'Marketplace', path: 'marketplace' },
		//{ name: 'Claim Tokens', path: 'claims' },
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
					<img src={ProjectLogo} style={{ height: 42, width: 42, marginRight: 15, borderRadius: '50%' }} alt=""/>
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
					<Button onClick={() => { dispatch(fireConffeti('snow'))}} variant="contained" color="secondary">
						<img style={{ width: 25, height: 25, marginRight: '5px' }} src={TokenImage} alt="token"/>
						{parseFloat(GBExactPrice).toFixed(2)}
					</Button>
				</Stack>
			</Toolbar>
			{
				account && isReady && <AccountInfo/>
			}
		</AppBar>
	)
}

export default Navbar

/*
    <Nav.Link href="https://footballheroes.gitbook.io/footballheroes/">Whitepaper</Nav.Link>
 */
