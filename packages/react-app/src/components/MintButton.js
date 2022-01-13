import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {connect} from 'react-redux';
import '../css/toggleButton.css'
import FootballPlayerContract from "../contractInteraction/FootballPlayerContract";
import Contract from "web3-eth-contract";
import {abis, addresses} from "@project/contracts";
import Web3 from "web3";
import {Modal} from "react-bootstrap";
import Loader from "./Loader";
import CardsManager from "./cards/CardsManager";

class MintButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {showLoader: false, showMint: false, player: {}};
    }

    async mint(account, gbTokenPrice, busdBalance, gbBalance) {
        const mintPrice = await FootballPlayerContract.getMintPrice();
        const mintFees = await FootballPlayerContract.getMintFees();
        if (parseInt(Web3.utils.toWei(busdBalance, 'ether')) < parseInt(mintFees) && parseInt(Web3.utils.toWei(gbBalance, 'ether')) < mintPrice * gbTokenPrice) {
            return;
        }
        let BUSDTestnet = new Contract(abis.erc20, addresses.BUSDTestnet);
        let GBToken = new Contract(abis.erc20, addresses.GBTOKEN);
        let busdAllowance = await BUSDTestnet.methods.allowance(account, addresses.FootballPlayers).call();
        let gbAllowance = await GBToken.methods.allowance(account, addresses.FootballPlayers).call();
        if (parseInt(Web3.utils.fromWei(busdAllowance)) < parseInt(Web3.utils.fromWei(mintFees))) {
            let transaction = BUSDTestnet.methods.approve(addresses.FootballPlayers, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({from: account});
            this.setState({transaction: transaction});
            await transaction;
        }
        if (parseInt(Web3.utils.fromWei(gbAllowance)) < Web3.utils.fromWei((mintPrice * gbTokenPrice).toString())) {
            let transaction = GBToken.methods.approve(addresses.FootballPlayers, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({from: account});
            this.setState({transaction: transaction});
            await transaction;
        }
        this.setState({transaction: FootballPlayerContract.getContract().methods.mintPlayer().send({from: account})});
    }

    render() {
        return (
            <div className="navMenu" style={{clear: 'both'}}>
                <button
                    className="button accountInfo float-left" onClick={() => {
                    this.mint(this.props.account, this.props.GBPrice, this.props.BUSDBalance, this.props.GBBalance);
                }}>Mint
                </button>
                <Loader transaction={this.state.transaction} account={this.props.account}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    account: state.pReducer.account,
    provider: state.pReducer.provider,
    BUSDBalance: state.pReducer.BUSDBalance,
    GBBalance: state.pReducer.GBBalance,
    GBPrice: state.pReducer.GBPrice,
});

export default connect(mapStateToProps)(MintButton);