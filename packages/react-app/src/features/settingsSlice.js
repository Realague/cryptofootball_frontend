import { createSlice } from '@reduxjs/toolkit'

export

const initialState = {
	attemptingToConnect: false,
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
	isUpgradeFrameOpen: false,
	isInTransaction: false,
}

export const settingsSlice = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		setAttemptingToConnect: (state, action) => {
			state.attemptingToConnect = action.payload
		},
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
		},
		setTransactionState: (state, action) => {
			state.isInTransaction = action.payload
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
	setAttemptingToConnect,
	setTransactionState
} = settingsSlice.actions

export default settingsSlice.reducer
