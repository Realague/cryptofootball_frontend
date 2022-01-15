import React, {useEffect, useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {connect, useDispatch, useSelector} from 'react-redux'
import '../css/toggleButton.css'
import FootballPlayerContract from '../contractInteraction/FootballPlayerContract'
import Contract from 'web3-eth-contract'
import {abis, addresses} from '@project/contracts'
import Web3 from 'web3'
import {Box, Button} from '@mui/material'
import {setTransaction} from "../features/gameSlice";

const MintButton = () => {
    const {
        account,
        BUSDBalance,
        GBBalance,
        GBPrice,
    } = useSelector(state => state.user)
    const dispatch = useDispatch()

    useEffect(() => {
    }, [])

    const mint = async () => {
        const mintPrice = await FootballPlayerContract.getMintPrice()
        const mintFees = await FootballPlayerContract.getMintFees()
        if (parseInt(Web3.utils.toWei(BUSDBalance, 'ether')) < parseInt(mintFees) && parseInt(Web3.utils.toWei(GBBalance, 'ether')) < mintPrice * GBPrice) {
            return
        }
        let BUSDTestnet = new Contract(abis.erc20, addresses.BUSDTestnet)
        let GBToken = new Contract(abis.erc20, addresses.GBTOKEN)
        let busdAllowance = await BUSDTestnet.methods.allowance(account, addresses.FootballPlayers).call()
        let gbAllowance = await GBToken.methods.allowance(account, addresses.FootballPlayers).call()
        if (parseInt(Web3.utils.fromWei(busdAllowance)) < parseInt(Web3.utils.fromWei(mintFees))) {
            let transaction = BUSDTestnet.methods.approve(addresses.FootballPlayers, '115792089237316195423570985008687907853269984665640564039457584007913129639935').send({from: account})
            dispatch(setTransaction({transaction: transaction}))
            await transaction
        }
        if (parseInt(Web3.utils.fromWei(gbAllowance)) < Web3.utils.fromWei((mintPrice * GBPrice).toString())) {
            let transaction = GBToken.methods.approve(addresses.FootballPlayers, '115792089237316195423570985008687907853269984665640564039457584007913129639935').send({from: account})
            dispatch(setTransaction({transaction: transaction}))
            await transaction
        }
        dispatch(setTransaction({transaction: FootballPlayerContract.getContract().methods.mintPlayer().send({from: account})}))
    }

    return (
        <Box className="navMenu" style={{clear: 'both'}}>
            <Button sx={{margin: '10px'}} variant="contained" color="primary" className="float-left" onClick={mint}>
                Mint
            </Button>
        </Box>
    )
}

export default MintButton
