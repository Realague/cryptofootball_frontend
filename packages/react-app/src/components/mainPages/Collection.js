import AccountInfo from "./AccountInfo";
import FootballPlayerCollection from "../FootballPlayerCollection";
import {connect} from "react-redux";
import React from "react";
import {Box, Typography} from '@mui/material';

class Collection extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Box>
                {
                    this.props.isConnected ?
                        <Box>
                            <AccountInfo/>
                            <FootballPlayerCollection/>
                        </Box> :
                        <Box style={{clear: 'both'}} className="loadingConnect">
                            <img src="https://media4.giphy.com/media/lXh0orPunKyzrixoCG/giphy.gif" alt=""/>
                            <Typography variant="h2">Be your own hero</Typography>
                        </Box>
                }
            </Box>
        )
    }
}

const mapStateToProps = (state) => ({
    account: state.pReducer.account,
    BUSDBalance: state.pReducer.BUSDBalance,
    GBBalance: state.pReducer.GBBalance,
    GBPrice: state.pReducer.GBPrice,
    claimFee: state.pReducer.claimFee,
    rewards: state.pReducer.rewards,
    isConnected: state.pReducer.isConnected
});

export default connect(mapStateToProps)(Collection);
