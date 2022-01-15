import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import FootballPlayerContract from '../contractInteraction/FootballPlayerContract'
import Card from './card/Card'
import MintButton from './MintButton'
import Marketplace from '../contractInteraction/MarketplaceContract'
import LoadingImage from '../images/gifs/loading.gif'
import {Box, Stack, Tab, Tabs, Typography} from '@mui/material'
import Frame from "../enums/Frame";


const FootballPlayerCollection = () => {
    const {account, playersId} = useSelector(state => state.user)
    const [showAllPlayer, setShowAllPlayer] = useState(true)
    const [players, setPlayers] = useState(true)
    const [playersForSale, setPlayersForSale] = useState([])
    const [marketItems, setMarketItems] = useState([])
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        getPlayers()
    }, [])

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


    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`vertical-tabpanel-${index}`}
                aria-labelledby={`vertical-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        {children}
                    </Box>
                )}
            </div>
        );
    }

    return (
        <Box sx={{ width: '100%', display: 'flex', height: "100%" }}>
            <Tabs
                orientation="vertical"
                variant="fullWidth"
                value={tabValue}
                onChange={handleTabChange}
                textColor="secondary"
                indicatorColor="secondary"
                sx={{ borderRight: 1, borderColor: 'divider', width: '150px', height: '100%' }}
            >
                {
                    ['Mint', 'All', ...Frame.TierList.map(t => t.name).reverse()].map((c, i) => (
                        <Tab value={i} key={i} label={c} />
                    ))
                }
            </Tabs>
            <TabPanel value={tabValue} index={0}>
                <MintButton>Mint</MintButton>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                Item Two
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                Item Three
            </TabPanel>
        </Box>
    )
}


export default FootballPlayerCollection

/*
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
 */
