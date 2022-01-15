import React, {useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import useWeb3Modal from '../../hooks/useWeb3Modal'
import {useSelector} from 'react-redux'
import ProjectLogo from '../../images/projectLogo.jpg'
import WalletButton from './components/ButtonWallet'
import Button from '@mui/material/Button'
import {AppBar, Stack, Toolbar} from '@mui/material'
import NavigationLink from './components/NavbarLink'

const Navbar = ({ toggleTheme }) => {
	const GBPrice = useSelector(state => state.user.GBPrice)

	return (
		<AppBar variant={'elevation'} position="sticky">
			<Toolbar sx={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				flexDirection: 'row',
				width: '100%',
			}}>
				<Stack direction="row" alignItems="center" spacing={2}>
					<img src={ProjectLogo} style={{ height: 42, width: 42, marginRight: 15, borderRadius: '50%' }}/>
					{[
						{ name: 'Home', path: '' },
						{ name: 'Collection', path: 'collection' },
						{ name: 'Match', path: 'match' },
						{ name: 'Marketplace', path: 'marketplace' },
						{ name: 'Claim Tokens', path: 'claims' },
					].map(i => (
						<NavigationLink
							key={i.path}
							name={i.name}
							path={i.path}
						/>
					))}
				</Stack>
				<Stack spacing={2} direction="row">
					<WalletButton/>
					<Button onClick={toggleTheme} variant="contained" color="secondary">
                        GB: ${parseFloat(GBPrice).toFixed(2)}
					</Button>
				</Stack>
			</Toolbar>
		</AppBar>
	)
}

export default Navbar

/*
    <Nav.Link href="https://footballheroes.gitbook.io/footballheroes/">Whitepaper</Nav.Link>
 */
