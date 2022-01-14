import React from 'react';
import {connect} from 'react-redux';
import FootballPlayerContract from "../contractInteraction/FootballPlayerContract";
import CardsManager from "./cards/CardsManager";
import MintButton from "./MintButton";
import Marketplace from "../contractInteraction/MarketplaceContract";
import LoadingImage from "../images/gifs/loading.gif"
import {Box, Button, Stack, Typography} from '@mui/material';

class FootballPlayerCollection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {show: false, showAllPlayer: true};
        if (props.account !== '') {
            this.firstCall();
        }
    }

    async firstCall() {
        while (!FootballPlayerContract.getContract()) {
            await new Promise(r => setTimeout(r, 100));
        }
        await this.getPlayers();
    }

    async getPlayers() {
        let playersId = this.props.playersId;
        let players = [];
        for (let i = 0; i !== playersId.length; i++) {
            players.push(await FootballPlayerContract.getFootballPlayer(playersId[i]));
        }
        this.setState({players: players});
    }

    async getPlayersListed() {
        let marketItemsId = await Marketplace.getListedPlayerOfAddress(this.props.account);
        let players = [];
        let marketItems = [];
        for (let i = 0; i !== marketItemsId.length; i++) {
            let marketItem = await Marketplace.getMarketItem(marketItemsId[i]);
            marketItems.push(marketItem);
            players.push(await FootballPlayerContract.getFootballPlayer(marketItem.tokenId));
        }
        this.setState({playersForSale: players, marketItems: marketItems});
    }

    async changeSwitchValue() {
        this.setState({showAllPlayer: !this.state.showAllPlayer});
        if (!this.state.showAllPlayer) {
            await this.getPlayers();
        } else {
            await this.getPlayersListed();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.playersId !== this.props.playersId) {
            this.getPlayers().then(() => this.setState({loading: false}));
        }
    }

    render() {
        let marketItems = this.state.marketItems;

        return (
            <Box>
                {
                    this.props.account !== '' ?
                        <Box>
                            <MintButton/>
                            <Box className="switch-button accountInfo float-right" style={{clear: 'both'}}>
                                <input className="switch-button-checkbox" onClick={() => this.changeSwitchValue()}
                                       type="checkbox"/>
                                <label className="switch-button-label" htmlFor=""><span
                                    className="switch-button-label-span">All player</span></label>
                            </Box>
                            <Box alignItems="center" className="white-color playerCards" style={{clear: 'both'}}>
                                {
                                    this.state.showAllPlayer && this.state.players ?
                                        this.state.players.map(function (player, idx) {
                                            return (
                                                <Box>
                                                    <CardsManager player={player} isForSale={false} marketItem={[]}
                                                                  key={idx}/>
                                                </Box>
                                            )
                                        }) : !this.state.showAllPlayer && marketItems ?
                                            this.state.playersForSale.map(function (player, idx) {
                                                return (
                                                    <Box>
                                                        <CardsManager player={player} isForSale={true}
                                                                      marketItem={marketItems[idx]} key={idx}/>
                                                    </Box>
                                                )
                                            })
                                            :
                                            <Stack alignItems="center" direction="column"
                                                   sx={{width: "200px", height: "200px"}}>
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
}

const mapStateToProps = (state) => ({
    account: state.pReducer.account,
    playersId: state.pReducer.playersId
});

export default connect(mapStateToProps)(FootballPlayerCollection);


