const initialState = {
    account: '',
    BUSDBalance: '0.00',
    GBBalance: '0.00',
    GBPrice: '0.00',
    claimFee: '0',
    rewards: '0',
    playersId: [],
    isConnected: false
};

function service(state = initialState, action) {
    let nextState;
    switch (action.type) {
        case 'LOGIN':
            nextState = {
                account: action.account,
                BUSDBalance: state.BUSDBalance,
                GBBalance: state.GBBalance,
                GBPrice: state.GBPrice,
                claimFee: state.claimFee,
                rewards: state.rewards,
                playersId: state.playersId,
                isConnected: true
            };
            return nextState;
        case 'LOGOUT':
            nextState = {
                account: '',
                BUSDBalance: '',
                GBBalance: '',
                GBPrice: '',
                claimFee: '',
                rewards: '',
                playersId: [],
                isConnected: false
            };
            return nextState;
        case 'ACCOUNTINFO':
            nextState = {
                account: state.account,
                BUSDBalance: action.BUSDBalance,
                GBBalance: action.GBBalance,
                GBPrice: action.GBPrice,
                claimFee: action.claimFee,
                rewards: action.rewards,
                playersId: action.playersId,
                isConnected: state.isConnected
            };
            return nextState;
        default:
            return state;
    }
}

export default service;
