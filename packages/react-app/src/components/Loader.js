import React from "react";
import Card from "./card/Card";
import FootballPlayerContract from "../contractInteraction/FootballPlayerContract";
import LoadingImage from "../images/gifs/loading.gif";
import {CancelOutlined, CheckCircleOutlined} from '@mui/icons-material';
import {Modal, Button, Stack, Typography} from '@mui/material';
import {darkModal} from "../css/style";

class Loader extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.transaction) {
            this.callBack();
        }
        this.state = {showLoader: false, transactionState: ""};
    }

    async callBack() {
        this.setStep("confirmation");
        let getPlayer = this.getPlayer.bind(this);
        let setStep = this.setStep.bind(this);
        this.setState({showLoader: true});
        let setStates = this.setStates.bind(this);
        this.props.transaction.on('transactionHash', function (hash) {
            setStep("loading");
        }).on('receipt', function (receipt) {
            if (receipt.events.TrainingDone) {
                console.log(receipt.events.TrainingDone);
                setStates({
                    rewards: receipt.events.TrainingDone.returnValues.rewards,
                    transactionState: "trainingDone"
                });
            } else if (receipt.events[6]) {
                getPlayer(parseInt(receipt.events[6].raw.topics[2], 16));
            } else {
                setStep("success");
            }
        }).on('error', function (error, receipt) {
            setStep("error");
        });
    }

    async getPlayer(playerId) {
        this.setState({player: await FootballPlayerContract.getFootballPlayer(playerId)});
        this.setStep("mint");
    }

    setStep(transactionState) {
        this.setState({transactionState: transactionState});
    }

    setStates(state) {
        this.setState(state);
    }

    componentDidUpdate(prevProps) {
        if (this.props.transaction && this.state.transactionState === "" && this.props.transaction !== prevProps.transaction) {
            this.callBack();
        }
    }

    onHide() {
        if (this.state.transactionState !== "confirmation" && this.state.transactionState !== "loading") {
            this.setState({showLoader: false, transactionState: ""});
        }
    }

    render() {
        return (
            <Modal open={this.state.showLoader} onClose={() => this.onHide()}>
                <Stack alignItems="center" direction="column" spacing={2} sx={darkModal}>
                    {
                        {
                            'confirmation':
                                <>
                                    <img style={{width: 200, height: 200}} src={LoadingImage}
                                    alt=""/>
                                    <Typography variant="h6">Waiting confirmation...</Typography>
                                </>,
                            'loading':
                                <>
                                    <img style={{width: 100, height: 100}} src={LoadingImage}
                                         alt=""/>
                                    <Typography variant="h6">Loading...</Typography>
                                </>,
                            'error':
                                <>
                                    <CancelOutlined color="error" sx={{width: 100, height: 100}}/>
                                    <Typography variant="h6">Transaction encountered an error</Typography>
                                </>,
                            'success':
                                <>
                                    <CheckCircleOutlined color="success" sx={{width: 100, height: 100}}/>
                                    <Typography variant="h6">Success!</Typography>
                                </>,
                            'mint':
                                <>
                                    <Card player={this.state.player} isForSale={false} marketItem={[]}/>
                                    <Button variant="primary" onClick={() => this.onHide()}>Collect</Button>
                                </>,
                            'trainingDone':
                                <>
                                    <Typography variant="h6">{this.state.rewards}</Typography>
                                    <Button variant="primary" onClick={() => this.onHide()}>Collect</Button>
                                </>
                        }[this.state.transactionState]
                    }
                    <Button
                        hidden={this.state.transactionState !== 'success' && this.state.transactionState !== 'error'}
                        variant="contained" color="primary" onClick={() => this.onHide()}>
                        Continue
                    </Button>
                </Stack>
            </Modal>
        );
    }
}

export default Loader;
