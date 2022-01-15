import {createDraftSafeSelector, createSlice} from '@reduxjs/toolkit'

const initialState = {
	account: undefined,
	BUSDBalance: '0.00',
	GBBalance: '0.00',
	GBPrice: '0.00',
	claimFee: '0',
	rewards: '0',
	playersId: [],
	isConnected: false
}

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		login: (state, action) => {
			state.account = action.payload
			state.isConnected = true
		},
		updateAccount: (state, action) => {
			return {
				...state,
				BUSDBalance: action.payload.BUSDBalance,
				GBBalance: action.payload.GBBalance,
				GBPrice: action.payload.GBPrice,
				claimFee: action.payload.claimFee,
				rewards: action.payload.rewards,
				playersId: action.payload.playersId,
			}
		},
		logout: () => {
			return initialState
		},
	},
})

export const {
	login,
	updateAccount,
	logout,
} = userSlice.actions

export default userSlice.reducer
