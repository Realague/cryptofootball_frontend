import AccountInfo from "./AccountInfo";
import FootballPlayerCollection from "../FootballPlayerCollection";
import {connect} from "react-redux";
import React from "react";

class Collection extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {
                    this.props.isConnected ?
                    <div>
                        <AccountInfo/>
                        <FootballPlayerCollection/>
                    </div> :
                        <div>
                            <div style={{clear: 'both'}} className="loadingConnect">
                                <img src="https://media4.giphy.com/media/lXh0orPunKyzrixoCG/giphy.gif" alt="this slowpoke moves" />
                                <h2 className="text-center">Be your own hero</h2>
                            </div>
                        </div>
                }
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
    rewards: state.pReducer.rewards,
    isConnected: state.pReducer.isConnected
});

export default connect(mapStateToProps)(Collection);
