import {createSlice} from '@reduxjs/toolkit'

const initialState = {
	isReady: false,
	transaction: undefined,
}

export const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		setReady: (state, action) => {
			state.isReady = action.payload
		},
		setTransaction: (state, action) => {
			state.transaction = action.payload
		},
	},
})

export const {
	setReady,
	setTransaction,
} = gameSlice.actions

export default gameSlice.reducer
