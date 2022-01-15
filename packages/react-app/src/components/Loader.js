import React, {useEffect, useState} from "react";
import Card from "./card/Card";
import FootballPlayerContract from "../contractInteraction/FootballPlayerContract";
import LoadingImage from "../images/gifs/loading.gif";
import {CancelOutlined, CheckCircleOutlined} from '@mui/icons-material';
import {Modal, Button, Stack, Typography} from '@mui/material';
import {darkModal} from "../css/style";
import {useSelector} from "react-redux";

const Loader = () => {
    const [transactionState, setTransactionState] = useState('')
    const [showLoader, setShowLoader] = useState(false)
    const [rewards, setRewards] = useState(0)
    const [player, setPlayer] = useState(undefined)

    const { transaction } = useSelector(state => state.game)
    const { account } = useSelector(state => state.user)
    useEffect(() => {
        if (transaction !== undefined && transactionState === "") {
            callBack()
        }
    }, [transaction])

    const callBack = async () => {
        setTransactionState("confirmation");
        setShowLoader(true)
        transaction.transaction.on('transactionHash', function (hash) {
            setTransactionState("loading");
        }).on('receipt', function (receipt) {
            if (receipt.events.TrainingDone) {
                console.log(receipt.events.TrainingDone);
                setTransactionState("trainingDone")
                setRewards(receipt.events.TrainingDone.returnValues.rewards)
            } else if (receipt.events[6]) {
                getPlayer(parseInt(receipt.events[6].raw.topics[2], 16));
            } else {
                setTransactionState("success");
            }
        }).on('error', function (error, receipt) {
            setTransactionState("error");
        });
    }

    const getPlayer = async (playerId) => {
        setPlayer(await FootballPlayerContract.getFootballPlayer(playerId))
        setTransactionState("mint")
    }

    const onHide = () => {
        if (transactionState !== "confirmation" && transactionState !== "loading") {
            setShowLoader(false)
            setTransactionState("")
        }
    }

    return (
        <Modal open={showLoader}>
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
                                <Card player={player} marketItem={undefined}/>
                                <Button variant="primary" onClick={onHide}>Collect</Button>
                            </>,
                        'trainingDone':
                            <>
                                <Typography variant="h6">{rewards}</Typography>
                                <Button variant="primary" onClick={onHide}>Collect</Button>
                            </>
                    }[transactionState]
                }
                <Button
                    hidden={transactionState !== 'success' && transactionState !== 'error'}
                    variant="contained" color="primary" onClick={onHide}>
                    Continue
                </Button>
            </Stack>
        </Modal>
    );
}

export default Loader;
