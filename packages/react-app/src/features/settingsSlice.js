import { createSlice } from '@reduxjs/toolkit'

export

const initialState = {
	isReady: false,
	drawerMobileOpen: false,
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
	},
})

export const {
	setReady,
	changeDrawerMobile
} = settingsSlice.actions

export default settingsSlice.reducer
