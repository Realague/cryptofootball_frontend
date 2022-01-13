import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {connect} from 'react-redux';
import "../../css/accountInfo.css"
import GameContract from "../../contractInteraction/GameContract";
import {Button, Modal} from "react-bootstrap";
import Loader from "../Loader";

class AccountInfo extends React.Component {

    constructor(props) {
        super(props);
        this.timer = 0;
        this.state = {time: {}, seconds: 0}
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
        if (props.account !== '') {
            this.setRewardTimer();
        }
    }

    async setRewardTimer() {
        while (!GameContract.getContract()) {
            await new Promise(r => setTimeout(r, 100));
        }
        let timer = Math.floor(await GameContract.getRemainingClaimCooldown() / 1000);
        console.log(timer)
        this.state = {time: {}, seconds: timer, account: ''};
        this.startTimer();
    }

    startTimer() {
        if (this.timer === 0 && this.state.seconds > 0) {
            this.timer = setInterval(this.countDown, 1000);
        }
    }

    countDown() {
        let seconds = this.state.seconds - 1;
        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds,
        });

        if (seconds === 0) {
            clearInterval(this.timer);
        }
    }

    secondsToTime(secs) {
        let hours = Math.floor(secs / (60 * 60));

        let divisorForMinutes = secs % (60 * 60);
        let minutes = Math.floor(divisorForMinutes / 60);

        let divisorForSeconds = divisorForMinutes % 60;
        let seconds = Math.ceil(divisorForSeconds);

        let obj = {
            "h": hours,
            "m": minutes,
            "s": seconds
        };
        return obj;
    }

    componentDidMount() {
        let timeLeftVar = this.secondsToTime(this.state.seconds);
        this.setState({time: timeLeftVar});
    }

    async checkClaimRewards() {
        //TODO display warning if claim fee are not 0%
        let claimCooldownTimer = await GameContract.getRemainingClaimCooldown();
        if (parseInt(claimCooldownTimer) !== 0) {
            return;
        }
        let amountToClaim = this.props.rewards - this.props.rewards * this.props.claimFee / 100;
        if (this.props.claimfee !== 0) {
            this.setState({rewards: amountToClaim, show: true})
        } else {
            this.claimRewards();
        }
    }

    claimRewards() {
       this.setState({transaction: GameContract.getContract().methods.claimReward().send({from: this.props.account})});
    }

    render() {
        return (
            <div className="navMenu">
                {
                    this.props.account !== '' ?
                        <div>
                            <p className="accountInfo float-left">Rewards: {parseFloat(this.props.rewards).toFixed(2)}
                                $GB {this.props.rewards === "0" ? "" : " | Claim fee " + this.props.claimFee + "%"}
                                {this.state.seconds > 0 ? " | Next claim in " + this.state.time.h + "h" + this.state.time.m + "m" + this.state.time.s + "s" : this.props.rewards !== "0" ? <>{" |"}
                                    <Button
                                        onClick={() => this.checkClaimRewards()}
                                        variant="link">Claim</Button></> : ""}</p>
                            <p className="accountInfo float-right">Wallet
                                balance: {parseFloat(this.props.GBBalance).toFixed(2)} $GB
                                | {parseFloat(this.props.BUSDBalance).toFixed(2)} $BUSD</p>
                        </div>
                        : ""}
                <Modal show={this.state.show}
                       onHide={() => this.setState({
                           show: false
                       })}>
                    <Modal.Body>
                        With your current {this.props.claimFee}% claim fee, you'll receive {this.state.rewards} $GB out of {this.props.rewards} $GB
                        <p>Claim fee decay at a rate of 2% everyday</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => this.setState({show: false})}>Cancel</Button>
                        <Button onClick={() => this.claimRewards()}
                                variant="primary">Claim</Button>
                    </Modal.Footer>
                </Modal>
                <Loader transaction={this.state.transaction} account={this.props.account}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    account: state.pReducer.account,
    BUSDBalance: state.pReducer.BUSDBalance,
    GBBalance: state.pReducer.GBBalance,
    GBPrice: state.pReducer.GBPrice,
    claimFee: state.pReducer.claimFee,
    rewards: state.pReducer.rewards
});

export default connect(mapStateToProps)(AccountInfo);

