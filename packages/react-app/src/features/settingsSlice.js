import { createSlice } from '@reduxjs/toolkit'

export

const initialState = {
	isReady: false,
	drawerMobileOpen: false,
	transaction: undefined,
}

export const settingsSlice = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		setReady: (state, action) => {
			state.isReady = action.payload
		},
		changeDrawerMobile: (state, action) => {
			state.drawerMobileOpen = action.payload
		},
		setTransaction: (state, action) => {
			state.transaction = action.payload
		},
	},
})

export const {
	setTransaction,
	setReady,
	changeDrawerMobile
} = settingsSlice.actions

export default settingsSlice.reducer
