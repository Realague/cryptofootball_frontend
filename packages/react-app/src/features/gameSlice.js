import {createSlice} from '@reduxjs/toolkit'

export

const initialState = {
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
		removePlayerFromTeamById: (state, action) => {
			state.team.players = state.team.players.filter(p => p.id !== action.payload)
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
	setIsDraggingPlayer,
	setTeamDrawerState,
	setStrategy,
	resetTeam,
	addPlayerToTeam,
	removePlayerFromTeamById,
} = gameSlice.actions

export default gameSlice.reducer
