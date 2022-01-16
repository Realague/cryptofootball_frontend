import React, {createRef, forwardRef, useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import FootballPlayerContract from '../contractInteraction/FootballPlayerContract'
import Card from './card/Card'
import MintButton from './MintButton'
import Marketplace from '../contractInteraction/MarketplaceContract'
import LoadingImage from '../images/gifs/loading.gif'
import {Box, Divider, Grid, Grow, Paper, Slide, Stack, Tab, Tabs, Typography} from '@mui/material'
import Frame from "../enums/Frame";
import Button from "@mui/material/Button";
import Loader from "./Loader";


const FootballPlayerCollection = () => {
    const {account, playersId} = useSelector(state => state.user)
    const [showAllPlayer, setShowAllPlayer] = useState(true)
    const [players, setPlayers] = useState([])
    const [playersForSale, setPlayersForSale] = useState([])
    const [marketItems, setMarketItems] = useState([])
    const [tabValue, setTabValue] = useState(1);
    const [isFetchingData, setIsFetchingData] = useState(false)
    const frames = Frame.TierList.slice().reverse()
    const ref = createRef()


    useEffect(() => {
        setIsFetchingData(true)
        Promise.all([getPlayers(), getPlayersListed()])
            .finally(() => setIsFetchingData(false))
    }, [])

    const getPlayers = async () => {
        let players = []
        for (let playerId of playersId) {
            players.push(await FootballPlayerContract.getFootballPlayer(playerId))
        }
        setPlayers(players)
    }

    const getPlayersListed = async () => {
        let marketItemsId = await Marketplace.getListedPlayerOfAddress(account)
        for (let i = 0; i !== marketItemsId.length; i++) {
            let marketItem = await Marketplace.getMarketItem(marketItemsId[i])
            marketItems.push(marketItem)
            players.push(await FootballPlayerContract.getFootballPlayer(marketItem.tokenId))
        }
        setPlayersForSale(players)
        setMarketItems(marketItems)
    }


    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    const TabPanel = ({children, value, index, ...other}) => {
        return (
            <Box
                role="tabpanel"
                hidden={value !== index}
                {...other}
                sx={{
                    width: '100%',
                    marginLeft: '150px',
                }}
            >
                {value === index && (
                    <Box sx={{
                        p: 2,
                    }}>
                        {children}
                    </Box>
                )}
            </Box>
        );
    }

    const LoadingContent = (
        <Box display="flex" justifyContent="center" width="100%" height="80vh" alignItems="center">
            <img style={{width: 400, height: 200}} src={LoadingImage} alt=""/>
        </Box>
    )

    const LayoutContent = forwardRef(({children}, ref) => (
        <Box ref={ref}>
            {children}
        </Box>
    ))

    const renderPlayer = (filter = undefined, isSell = false) => {
        return (
            <Grid container>
                {
                    isFetchingData ?
                        LoadingContent  :
                        isSell ?
                            playersForSale.map((player, idx) => (
                                    <Grid item key={idx}>
                                        <Slide direction="up" appear={true} in={true}>
                                            <LayoutContent ref={ref}>
                                                <Card player={player} isForSale={true}
                                                      marketItem={marketItems[idx]} key={idx}/>
                                            </LayoutContent>
                                        </Slide>
                                    </Grid>
                                ))
                            :
                    players.filter(p => filter === undefined ? true : p.frame == filter).map((player, idx) => (
                        <Grid item key={idx}>
                            <Slide direction="up" appear={true} in={true}>
                                <LayoutContent ref={ref}>
                                    <Card player={!showAllPlayer && marketItems ? playersForSale : player}
                                          marketItem={!showAllPlayer && marketItems ? marketItems[idx] : undefined}/>
                                </LayoutContent>
                            </Slide>
                        </Grid>
                    ))
                }
            </Grid>
        )
    }

    return (
        <Box sx={{width: '100%', display: 'flex', height: "100%"}}>
            <Tabs
                orientation="vertical"
                variant="fullWidth"
                value={tabValue}
                onChange={handleTabChange}
                textColor="secondary"
                indicatorColor="secondary"
                sx={{borderRight: 1, position: 'fixed', borderColor: 'divider', width: '150px', height: '100%'}}
            >
                {
                    ['Mint', 'All', 'Listed', ...frames].map((c, i) => (
                        <Tab value={i} key={i} label={c.name || c}/>
                    ))
                }
            </Tabs>
            <TabPanel value={tabValue} index={0}>
                <MintButton>Mint</MintButton>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                {
                    renderPlayer()
                }
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                <Grid container>
                    {
                        renderPlayer(undefined, true)
                    }
                </Grid>
            </TabPanel>
            {
                frames.map((t, i) => (
                    <TabPanel key={3 + i} value={tabValue} index={3 + i}>
                        {
                            renderPlayer(t.id)
                        }
                    </TabPanel>
                ))
            }
        </Box>
    )
}

export default FootballPlayerCollection
