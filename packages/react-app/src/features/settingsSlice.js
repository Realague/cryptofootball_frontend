import { createSlice } from '@reduxjs/toolkit'

export

const initialState = {
	isReady: false,
	drawerMobileOpen: false,
	transaction: undefined,
	isDraggingPlayer: false,
	teamDrawerOpen: false,
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
		setIsDraggingPlayer: (state, action) => {
			state.isDraggingPlayer = action.payload
		},
		setTeamDrawerState: (state, action) => {
			state.teamDrawerOpen = action.payload
		}
	},
})

export const {
	setTransaction,
	setReady,
	changeDrawerMobile,
	setIsDraggingPlayer,
	setTeamDrawerState,
} = settingsSlice.actions

export default settingsSlice.reducer
