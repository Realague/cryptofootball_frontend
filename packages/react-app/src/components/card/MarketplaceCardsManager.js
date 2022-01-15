import React from "react";
import NoneFrame from "./NoneFrame";
import BronzeFrame from "./BronzeFrame";
import SilverFrame from "./SilverFrame";
import GoldFrame from "./GoldFrame";
import DiamondFrame from "./DiamondFrame";
import GameContract from "../../contractInteraction/GameContract";
import Marketplace from "../../contractInteraction/MarketplaceContract";
import Loader from "../Loader";

class MarketplaceCardsManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {stamina: 0, showLoader: false};
        this.getPlayerStamina();
    }

    async getPlayerStamina() {
        await new Promise(r => setTimeout(r, 250));
        let stamina = await GameContract.getContract().methods.getCurrentStamina(0).call();
        this.setState({stamina: stamina});
    }

    showPriceChoice() {
        this.setState({show: false, showResult: false, showPriceChoice: true});
    }

    async cancelListing() {
        let showLoader = this.showLoader.bind(this);
        Marketplace.getContract().methods.cancelListing(this.props.marketItem.itemId).send({from: this.props.account})
            .on('transactionHash', function (hash) {
                showLoader(true);
            }).on('receipt', function (receipt) {
            showLoader(false);
        }).on('error', function (error, receipt) {
            showLoader(false);
        });
    }

    selectRightFrame() {
        return (
            this.props.player.frame === "0" ?
                <NoneFrame player={this.props.player} account={this.props.account}
                           stamina={this.state.stamina}/> :
                this.props.player.frame === "1" ?
                    <BronzeFrame player={this.props.player}
                                 account={this.props.account} stamina={this.state.stamina}/> :
                    this.props.player.frame === "2" ?
                        <SilverFrame player={this.props.player}
                                     account={this.props.account} stamina={this.state.stamina}/> :
                        this.props.player.frame === "3" ?
                            <GoldFrame player={this.props.player}
                                       account={this.props.account} stamina={this.state.stamina}/> :
                            this.props.player.frame === "4" ?
                                <DiamondFrame player={this.props.player}
                                              account={this.props.account}
                                              stamina={this.state.stamina}/> : "");
    }

    render() {
        return (
            <div>
                <div onClick={() => this.setState({stamina: this.state.stamina, show: true})}>
                    {this.selectRightFrame()}
                </div>
                <Loader showLoader={this.state.showLoader}/>
            </div>
        )
    }
}

export default MarketplaceCardsManager;
