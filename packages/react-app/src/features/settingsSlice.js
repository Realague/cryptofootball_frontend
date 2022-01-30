import { createSlice } from '@reduxjs/toolkit'

export

const initialState = {
	isReady: false,
	drawerMobileOpen: false,
	transaction: undefined,
	isDraggingPlayer: false,
	teamDrawerOpen: false,
	isMarketplaceOpen: false,
	isMintOpen: false,
	isLevelUpOpen: false,
	isTrainingOpen: false,
	isMatchOpen: false,
	isUpgradeFrameOpen: false
}

export const settingsSlice = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		setContractState: (state, action) => {
			return {
				...state,
				...action.payload,
			}
		},
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
	setContractState,
	setTransaction,
	setReady,
	changeDrawerMobile,
	setIsDraggingPlayer,
	setTeamDrawerState,
} = settingsSlice.actions

export default settingsSlice.reducer
