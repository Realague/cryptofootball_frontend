import {createSlice} from '@reduxjs/toolkit'

const initialState = {
	isReady: false,
	isDraggingPlayer: false,
	teamDrawerOpen: false,
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
		setIsDraggingPlayer: (state, action) => {
			state.isDraggingPlayer = action.payload
		},
		setTeamDrawerState: (state, action) => {
			state.teamDrawerOpen = action.payload
		}
	},
})

export const {
	setReady,
	setTransaction,
	setIsDraggingPlayer,
	setTeamDrawerState
} = gameSlice.actions

export default gameSlice.reducer
