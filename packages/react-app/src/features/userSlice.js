import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	account: undefined,
	BUSDBalance: '0.00',
	GBBalance: '0.00',
	GBPrice: '0.00',
	GBExactPrice: '0.00',
	claimFee: '0',
	rewards: '0',
	presaleTokens: '0.00',
	playersId: [],
	isConnected: false,
	fetching: false,
}

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		login: (state, action) => {
			state.account = action.payload
			state.isConnected = true
		},
		updateBalances: (state, action) => {
			return {
				...state,
				BUSDBalance: action.payload.BUSDBalance,
				GBBalance: action.payload.GBBalance,
				rewards: action.payload.rewards || state.rewards,
			}
		},
		updateGBBalance: (state, action) => {
			return {
				...state,
				GBBalance: action.payload,
			}
		},
		updateAccount: (state, action) => {
			return {
				...state,
				BUSDBalance: action.payload.BUSDBalance,
				GBBalance: action.payload.GBBalance,
				GBPrice: action.payload.GBPrice,
				GBExactPrice: action.payload.GBExactPrice,
				claimFee: action.payload.claimFee,
				rewards: action.payload.rewards,
				playersId: action.payload.playersId,
				presaleTokens: action.payload.presaleTokens,
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
	updateBalances,
	logout,
	updateGBBalance,
} = userSlice.actions

export default userSlice.reducer
