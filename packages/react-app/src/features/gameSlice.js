import {createSlice} from '@reduxjs/toolkit'

const initialState = {
	isReady: false
}

export const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		setReady: (state, action) => {
			state.isReady = action.payload
		},
	},
})

export const {
	setReady,
} = gameSlice.actions

export default gameSlice.reducer
