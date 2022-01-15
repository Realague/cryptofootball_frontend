import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import FootballPlayerContract from '../contractInteraction/FootballPlayerContract'
import Card from './card/Card'
import MintButton from './MintButton'
import Marketplace from '../contractInteraction/MarketplaceContract'
import LoadingImage from '../images/gifs/loading.gif'
import {Box, Stack, Typography} from '@mui/material'

const FootballPlayerCollection = () => {
    const {account, playersId} = useSelector(state => state.user)
    const [showAllPlayer, setShowAllPlayer] = useState(true)
    const [players, setPlayers] = useState(true)
    const [playersForSale, setPlayersForSale] = useState([])
    const [marketItems, setMarketItems] = useState([])

    useEffect(() => {
        if (account !== undefined) {
            firstCall()
        }
    }, [])

    const firstCall = async () => {
        while (!FootballPlayerContract.getContract()) {
            await new Promise(r => setTimeout(r, 100))
        }
        await getPlayers()
    }

    const getPlayers = async () => {
        let players = []
        for (let i = 0; i !== playersId.length; i++) {
            players.push(await FootballPlayerContract.getFootballPlayer(playersId[i]))
        }
        setPlayers(players)
    }

    const getPlayersListed = async () => {
        let marketItemsId = await Marketplace.getListedPlayerOfAddress(account)
        let players = []
        let marketItems = []
        for (let i = 0; i !== marketItemsId.length; i++) {
            let marketItem = await Marketplace.getMarketItem(marketItemsId[i])
            marketItems.push(marketItem)
            players.push(await FootballPlayerContract.getFootballPlayer(marketItem.tokenId))
        }
        setPlayersForSale(players)
        setMarketItems(marketItems)
    }

    const changeSwitchValue = async () => {
        setShowAllPlayer(!showAllPlayer)
        if (!showAllPlayer) {
            await getPlayers()
        } else {
            await getPlayersListed()
        }
    }

    return (
        <Box>
            {
                account !== undefined ?
                    <Box>
                        <MintButton/>
                        <Box className="switch-button accountInfo float-right" style={{clear: 'both'}}>
                            <input className="switch-button-checkbox" onClick={() => changeSwitchValue()}
                                   type="checkbox"/>
                            <label className="switch-button-label" htmlFor=""><span
                                className="switch-button-label-span">All player</span></label>
                        </Box>
                        <Box alignItems="center" className="white-color playerCards" style={{clear: 'both'}}>
                            {
                                (players && players.length > 0) ?
                                    players.map(function (player, idx) {
                                        return (
                                            <Box key={idx}>
                                                <Card player={!showAllPlayer && marketItems ? playersForSale : player}
                                                      marketItem={!showAllPlayer && marketItems ? marketItems[idx] : undefined}/>
                                            </Box>
                                        )
                                    })
                                    :
                                    <Stack alignItems="center" direction="column"
                                           sx={{width: '200px', height: '200px'}}>
                                        <img src={LoadingImage} alt=""/>
                                        <Typography variant="h5">Loading...</Typography>
                                    </Stack>
                            }
                        </Box>
                    </Box>
                    : ''
            }
        </Box>
    )
}


export default FootballPlayerCollection


