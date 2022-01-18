import {createSlice} from '@reduxjs/toolkit'
import Strategy from '../enums/Strategy'
import {act} from '@testing-library/react'

export

const initialState = {
	isReady: false,
	isDraggingPlayer: false,
	teamDrawerOpen: false,
	transaction: undefined,
	team: {
		strategy: undefined,
		players: [],
	},
}

export const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		setStrategy: (state, action) => {
			state.team.strategy = action.payload
		},
		resetTeam: (state, action ) => {
			state.team = initialState.team
		},
		addPlayerToTeam: (state, action) => {
			state.team.players = [...state.team.players, action.payload]
		},
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
	setTeamDrawerState,
	setStrategy,
	resetTeam,
	addPlayerToTeam,
} = gameSlice.actions

export default gameSlice.reducer
