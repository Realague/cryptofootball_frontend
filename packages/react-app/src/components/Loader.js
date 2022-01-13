import {Button, Image, Modal} from "react-bootstrap";
import React from "react";
import success from "../images/succes.png";
import error from "../images/error.png";
import CardsManager from "./cards/CardsManager";
import FootballPlayerContract from "../contractInteraction/FootballPlayerContract";
import LoadingImage from "../images/gifs/loading.gif";

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
            <Modal show={this.state.showLoader} onHide={() => this.onHide()}>
                {
                    {
                        'confirmation':
                            <Modal.Body>
                                <div className="loading">
                                    <img style={{width: 200, height: 200}} src={LoadingImage}
                                         alt=""/>
                                    <h5 className="text-center">Waiting confirmation...</h5>
                                </div>
                            </Modal.Body>,
                        'loading':
                            <Modal.Body>
                                <div className="loading">
                                    <img style={{width: 100, height: 100}} src={LoadingImage}
                                         alt=""/>
                                    <h5 className="text-center">Loading...</h5>
                                </div>
                            </Modal.Body>,
                        'error':
                                <Modal.Body>
                                    <Image style={{width: 100, height: 100}} src={error}/>
                                    <h5 className="text-center">Transaction encountered an error</h5>
                                </Modal.Body>,
                        'success':
                            <Modal.Body>
                                <Image style={{width: 100, height: 100}} src={success}/>
                                <h5 className="text-center">Success!</h5>
                            </Modal.Body>,
                        'mint':
                            <Modal.Body>
                                <CardsManager player={this.state.player} isForSale={false} marketItem={[]}/>
                                <Button variant="primary" onClick={() => this.onHide()}>Collect</Button>
                            </Modal.Body>,
                        'trainingDone':
                            <Modal.Body>
                                <div>{this.state.rewards}</div>
                                <Button variant="primary" onClick={() => this.onHide()}>Collect</Button>
                            </Modal.Body>
                    }[this.state.transactionState]
                }
                {
                    this.state.transactionState === 'success' || this.state.transactionState === 'error' ?
                        <Modal.Footer>
                            <Button variant="primary" onClick={() => this.onHide()}>
                                Continue
                            </Button>
                        </Modal.Footer> : ""
                }
            </Modal>
        );
    }
}

export default Loader;
