import React from "react";
import NoneFrame from "./NoneFrame";
import BronzeFrame from "./BronzeFrame";
import SilverFrame from "./SilverFrame";
import GoldFrame from "./GoldFrame";
import DiamondFrame from "./DiamondFrame";
import GameContract from "../../contractInteraction/GameContract";
import Marketplace from "../../contractInteraction/MarketplaceContract";
import Button from '@mui/material/Button';
import {Form, FormControl, InputGroup, Modal} from "react-bootstrap";
import Loader from "../Loader";
import Web3 from "web3";
import FootballPlayerContract from "../../contractInteraction/FootballPlayerContract";
import {abis, addresses} from "@project/contracts";
import Contract from "web3-eth-contract";
import {connect} from "react-redux";

class CardsManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {stamina: 0, show: false};
        this.getPlayerStamina();
    }

    async getPlayerStamina() {
        await new Promise(r => setTimeout(r, 250));
        let stamina = await GameContract.getContract().methods.getCurrentStamina(this.props.player.id).call();
        this.setState({stamina: stamina});
    }

    async listFootballPlayer(price) {
        if (!price || parseInt(price) <= 0) {
            return;
        }
        this.setState({showPriceChoice: false})
        price = Web3.utils.toWei(price, 'ether');
        let BUSDTestnet = new Contract(abis.erc20, addresses.BUSDTestnet);
        if (!await FootballPlayerContract.isApprovedForAll(this.props.account)) {
            let transaction = FootballPlayerContract.getContract().methods.setApprovalForAll(addresses.Marketplace, true).send({from: this.props.account});
            this.setState({transaction: transaction});
            await transaction;
        }
        let busdAllowance = await BUSDTestnet.methods.allowance(this.props.account, addresses.Marketplace).call();
        if (parseInt(Web3.utils.fromWei(busdAllowance)) < parseInt(await Marketplace.getListingFees())) {
            let transaction = BUSDTestnet.methods.approve(addresses.Marketplace, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({from: this.props.account});
            this.setState({transaction: transaction});
            await transaction;
        }
        this.setState({transaction: Marketplace.getContract().methods.listPlayer(this.props.player.id, price).send({from: this.props.account})});
    }

    showPriceChoice() {
        this.setState({showPriceChoice: true});
    }

    changePrice(price) {
        price = Web3.utils.toWei(price, 'ether');
        this.setState({
            transaction: Marketplace.getContract().methods.changePrice(this.props.marketItem.itemId, price).send({from: this.props.account})
        });
    }

    cancelListing() {
        this.setState({transaction: Marketplace.getContract().methods.cancelListing(this.props.marketItem.itemId).send({from: this.props.account})});
    }

    showResult(rewards, win) {
        this.setState({
            players: this.state.players,
            player: this.state.player,
            showLoader: false,
            rewards: rewards,
            win: win,
            show: true,
            showResult: true
        })
    }

    trainPlayer(trainingGroundId) {
        this.setState({showTraining: false, transaction: GameContract.getContract().methods.trainingGround(trainingGroundId, this.props.player.id).send({from: this.props.account})});
    }

    selectFrame() {
        return (<>
            {
                {
                    '0': <NoneFrame player={this.props.player} account={this.props.account}
                                    stamina={this.state.stamina}/>,
                    '1': <BronzeFrame player={this.props.player} account={this.props.account}
                                      stamina={this.state.stamina}/>,
                    '2': <SilverFrame player={this.props.player} account={this.props.account}
                                      stamina={this.state.stamina}/>,
                    '3': <GoldFrame player={this.props.player} account={this.props.account}
                                    stamina={this.state.stamina}/>,
                    '4': <DiamondFrame player={this.props.player} account={this.props.account}
                                       stamina={this.state.stamina}/>
                }[this.props.player.frame]
            }</>);
    }

    render() {
        return (
            <div>
                <div onClick={() => this.setState({show: true})}>
                    {this.selectFrame()}
                </div>
                <Modal show={this.state.show} onHide={() => this.setState({show: false})}>
                    <Modal.Header closeButton/>
                    <Modal.Body className="modal-body-player">
                        <div className="align-div-horizontally-container">
                            <div className="left-div">
                                {this.selectFrame()}
                            </div>
                            <div className="right-div">
                                {
                                    this.props.player.score === 100 || this.props.isForSale ? "" :
                                        <Button color="primary" variant="contained" className="button-detail-player"
                                                onClick={() => this.setState({showLevelUp: true})}>LEVEL UP</Button>
                                }
                                {
                                    this.props.player.frame === 4 || this.props.isForSale ? "" :
                                        <Button color="primary" variant="contained" className="button-detail-player">IMPROVE FRAME</Button>
                                }
                                <Button color="primary" variant="contained" disabled={this.state.stamina === "0" || this.props.isForSale} className="button-detail-player">TRAIN</Button> : ""
                                {
                                    this.props.isForSale ?
                                        <>
                                            <Button color="error" variant="contained" onClick={() => this.cancelListing()}
                                                    className="button-detail-player">CANCEL LISTING</Button>
                                            <Button color="error" variant="contained" onClick={() => this.setState({
                                                showPriceChoice: true,
                                                changePrice: true
                                            })} className="button-detail-player">CHANGE PRICE</Button>
                                        </>
                                        :
                                        <Button color="error" variant="contained" onClick={() => this.setState({
                                            showPriceChoice: true
                                        })} className="button-detail-player">SELL PLAYER</Button>
                                }
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
                <Loader transaction={this.state.transaction} account={this.props.account}/>
                <Modal show={this.state.showPriceChoice} onHide={() => this.setState({showPriceChoice: false, changePrice: false})}>
                    <Modal.Body>
                        <Form>
                            <InputGroup className="mb-2">
                                <FormControl id="inlineFormInputGroup" placeholder="Price" type="decimal"
                                             onChange={(event) => this.setState({
                                                 price: event.target.value
                                             })}
                                             require/>
                                <InputGroup.Text>$GB</InputGroup.Text>
                            </InputGroup>
                            {parseFloat(this.state.price) <= 0 ? "Price need to be superrior to 0" : ""}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary"
                                onClick={() => this.setState({showPriceChoice: false, changePrice: false})}>
                            Cancel
                        </Button>
                        <Button variant="primary"
                                onClick={() => this.state.changePrice ? this.changePrice(this.state.price) : this.listFootballPlayer(this.state.price)}>
                            {this.state.changePrice ? "Change price" : "Sell football player"}
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showLevelUp} onHide={() => this.setState({showLevelUp: false})}>
                    <Modal.Header closeButton/>
                    <Modal.Body>
                        <Form.Label>Range</Form.Label>
                        <Form.Range/>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.showTraining}
                       onHide={() => this.setState({showTraining: false})}>
                    <Modal.Header closeButton/>
                    <Modal.Body>
                        {
                            this.state.showResult ? this.state.rewards
                                :
                                <div>
                                    <Button variant="primary"
                                            onClick={() => this.trainPlayer(0)}>Select</Button>
                                    <Button variant="primary"
                                            onClick={() => this.trainPlayer(1)}>Select</Button>
                                    <Button variant="primary"
                                            onClick={() => this.trainPlayer(2)}>Select</Button>
                                </div>
                        }
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    account: state.pReducer.account
});

export default connect(mapStateToProps)(CardsManager);
