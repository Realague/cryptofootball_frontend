import { createSlice } from '@reduxjs/toolkit'

export

const initialState = {
	isReady: false,
	drawerMobileOpen: false,
	transaction: undefined,
	isDraggingPlayer: false,
	teamDrawerOpen: false,
	isMarketplaceOpen: true,
	isMintOpen: true,
	isLevelUpOpen: true,
	isTrainingOpen: true,
	isMatchOpen: true,
	isUpgradeFrameOpen: true
}

export const settingsSlice = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		setContractState: (state, action) => {
			return {
				...state,
				isMarketplaceOpen: action.payload.isMarketplaceOpen,
				isMintOpen: action.payload.isMintOpen,
				isLevelUpOpen: action.payload.isLevelUpOpen,
				isTrainingOpen: action.payload.isTrainingOpen,
				isMatchOpen: action.payload.isMatchOpen,
				isUpgradeFrameOpen: action.payload.isUpgradeFrameOpen
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
