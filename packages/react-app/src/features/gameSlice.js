import { createSlice } from '@reduxjs/toolkit'
import { act } from '@testing-library/react'

export

const initialState = {
	isDraggingPlayer: false,
	teamDrawerOpen: false,
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
		setTeam: (state, action) => {
			state.team = action.payload
		},
		addPlayerToTeam: (state, action) => {
			state.team.players = [...state.team.players, action.payload]
		},
		removePlayerFromTeamById: (state, action) => {
			state.team.players = state.team.players.filter(p => p.id !== action.payload)
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
	setIsDraggingPlayer,
	setTeamDrawerState,
	setStrategy,
	resetTeam,
	addPlayerToTeam,
	removePlayerFromTeamById,
	setTeam,
} = gameSlice.actions

export default gameSlice.reducer
