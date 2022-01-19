import {createSlice} from '@reduxjs/toolkit'

export

const initialState = {
	isReady: false,
}

export const settingsSlice = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		setReady: (state, action) => {
			state.isReady = action.payload
		},
	},
})

export const {
	setReady,
} = settingsSlice.actions

export default settingsSlice.reducer
