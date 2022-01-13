import Menu from "../Menu";
import AccountInfo from "./AccountInfo";
import React from "react";
import FootballPlayerContract from "../../contractInteraction/FootballPlayerContract";
import {connect} from "react-redux";
import MarketplaceContract from "../../contractInteraction/MarketplaceContract";
import {Button} from "react-bootstrap";
import Web3 from "web3";
import MarketplaceCardsManager from "../cards/MarketplaceCardsManager";
import {abis, addresses} from "@project/contracts";
import Contract from "web3-eth-contract";
import Loader from "../Loader";
import CardsManager from "../cards/CardsManager";

class Marketplace extends React.Component {

    constructor(props) {
        super(props);
        this.state = {marketItems: [], showLoader: false}
        if (props.account !== '') {
            this.firstCall();
        }
    }

    async firstCall() {
        while (!MarketplaceContract.getContract()) {
            await new Promise(r => setTimeout(r, 100));
        }
        await this.getMarketItems();
    }

    async buyPlayer(marketItem) {
        //TODO check price in wei
        if (Web3.utils.toWei(this.props.GBBalance, 'ether') < marketItem.price) {
            return;
        }

        let GBToken = new Contract(abis.erc20, addresses.GBTOKEN);
        let GBAllowance = await GBToken.methods.allowance(this.props.account, addresses.Marketplace).call();

        if (parseInt(GBAllowance) < marketItem.price) {
            let transaction = GBToken.methods.approve(addresses.Marketplace, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({from: this.props.account});
            this.setState({transaction: transaction});
            await transaction;
        }
        this.setState({transaction: MarketplaceContract.getContract().methods.buyPlayer(marketItem.itemId, marketItem.price).send({from: this.props.account})});
    }

    async getMarketItems() {
        let marketItemsId = await MarketplaceContract.getPlayerForSaleFiltered([0, 1, 2, 3, 4], 0, 100, 0, "100000000000000000000000", false);
        let marketItems = [];
        for (let i = 0; i !== marketItemsId.length; i++) {
            let marketItem = await MarketplaceContract.getMarketItem(marketItemsId[i]);
            marketItems.push({ player: await FootballPlayerContract.getFootballPlayer(marketItem.tokenId), marketItem: marketItem});
        }
        this.setState({marketItems: marketItems})
    }

    render() {
        let buyPlayer = this.buyPlayer.bind(this);
        let account = this.props.account;
        let GBBalance = this.props.GBBalance;
        return (
            <div>
                <Menu/>
                <AccountInfo/>
                <div>
                    {
                        this.props.account !== '' ?
                            <div>
                                <div className="white-color playerCards" style={{clear: 'both'}}>
                                    {
                                        this.state.marketItems.map(function (marketItem, idx) {
                                            return (
                                                <div key={idx}>
                                                    <CardsManager player={marketItem.player} account={account} />
                                                    { Web3.utils.toWei(GBBalance, 'ether') < marketItem.marketItem.price || marketItem.marketItem.seller === account ?
                                                        <Button variant="secondary" disabled>{Web3.utils.fromWei(marketItem.marketItem.price, 'ether')} $GB</Button> :
                                                    <Button onClick={() => buyPlayer(marketItem.marketItem)} variant="primary">{Web3.utils.fromWei(marketItem.marketItem.price, 'ether')} $GB</Button> }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            : ''
                    }
                </div>
                <Loader transaction={this.state.transaction} account={this.props.account}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    account: state.pReducer.account,
    BUSDBalance: state.pReducer.BUSDBalance,
    GBBalance: state.pReducer.GBBalance,
});

export default connect(mapStateToProps)(Marketplace);