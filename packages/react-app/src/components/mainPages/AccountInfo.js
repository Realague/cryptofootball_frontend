import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {connect} from 'react-redux';
import "../../css/accountInfo.css"
import GameContract from "../../contractInteraction/GameContract";
import {
    Box,
    Button, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Slide,
    Typography
} from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AccountInfo = (props) => {
    const [open, setOpen] = useState(false);
    const [time, setTime] = useState({"h": 0, "m": 0, "s": 0});
    const [rewards, setRewards] = useState(0);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (props.account !== '' && seconds === 0) {
            setRewardTimer();
        }
        if (seconds > 0) {
            const timer = setTimeout(() => {
                setSeconds(seconds - 1)
                secondsToTime(seconds)
                console.log(seconds)
            }, 1000)
            return () => clearTimeout(timer);
        }
    }, [seconds])

    const setRewardTimer = async () => {
        while (!GameContract.getContract()) {
            await new Promise(r => setTimeout(r, 100));
        }
        let timer = Math.floor(await GameContract.getRemainingClaimCooldown() / 1000);
        setSeconds(timer);
    }

    const secondsToTime = (secs) => {
        console.log("ici1")
        let hours = Math.floor(secs / (60 * 60));

        let divisorForMinutes = secs % (60 * 60);
        let minutes = Math.floor(divisorForMinutes / 60);

        let divisorForSeconds = divisorForMinutes % 60;
        let seconds = Math.ceil(divisorForSeconds);

        setTime({
            "h": hours,
            "m": minutes,
            "s": seconds
        });
    }

    const checkClaimRewards = async () => {
        //TODO display warning if claim fee are not 0%
        let claimCooldownTimer = await GameContract.getRemainingClaimCooldown();
        if (parseInt(claimCooldownTimer) !== 0) {
            return;
        }
        let amountToClaim = props.rewards - props.rewards * props.claimFee / 100;
        if (props.claimfee !== 0) {
            setRewards(amountToClaim)
            setOpen(true)
        } else {
            //claimRewards();
        }
    }

    /*const claimRewards = () => {
        setState({transaction: GameContract.getContract().methods.claimReward().send({from: props.account})});
    }*/

    return (
        <Box className="navMenu">
            {
                props.account !== '' ?
                    <Box>
                        <p className="accountInfo float-left">Rewards: {parseFloat(props.rewards).toFixed(2)}
                            $GB {props.rewards === "0" ? "" : " | Claim fee " + props.claimFee + "%"}
                            {seconds > 0 ? " | Next claim in " + time.h + "h" + time.m + "m" + time.s + "s" : props.rewards !== "0" ? <>{" |"}
                                <Button variant="link" onClick={checkClaimRewards}>Claim</Button></> : ""}</p>
                        <p className="accountInfo float-right">Wallet
                            balance: {parseFloat(props.GBBalance).toFixed(2)} $GB
                            | {parseFloat(props.BUSDBalance).toFixed(2)} $BUSD</p>
                    </Box>
                    : ""}
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setOpen(false)}
            >
                <DialogTitle><Typography variant="h5">Claim Rewards</Typography></DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        <Typography><strong>With your current {props.claimFee}% claim fee, you'll
                            receive {rewards} $GB
                            out of {props.rewards} $GB</strong>
                            <p>Claim fee decay at a rate of 2% everyday</p></Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="error" variant="outlined"
                            onClick={() => setOpen(false)}>Cancel</Button>
                    <Button color="success" variant="contained"
                    >Claim</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
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

