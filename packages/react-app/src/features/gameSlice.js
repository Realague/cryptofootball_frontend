import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import footballHeroesService from '../services/FootballPlayerService'
import { act } from '@testing-library/react'

export const fetchData = createAsyncThunk('game/fetchData', async () => {
	const playerTeam = await footballHeroesService.getPlayerTeam()
	const ids = [
		...playerTeam.attackers.map(id => +id),
		...playerTeam.defenders.map(id => +id),
		...playerTeam.midfielders.map(id => +id),
		+playerTeam.goalKeeper
	]
	const players = []
	for (let id of ids) {
		players.push(await footballHeroesService.getFootballPlayer(id))
	}
	let tempPlayers = []
	for (let playerId of ids) {
		tempPlayers.push(await footballHeroesService.getFootballPlayer(playerId))
	}
	const tempMarketItems = []
	const tempPlayersForSale = []
	let marketItemsId = await footballHeroesService.getListedPlayerOfAddress()
	for (let i = 0; i !== marketItemsId.length; i++) {
		let marketItem = await footballHeroesService.getMarketItem(marketItemsId[i])
		tempMarketItems.push(marketItem)
		tempPlayersForSale.push(await footballHeroesService.getFootballPlayer(marketItem.tokenId))
	}
	return {
		team: {
			strategy: +playerTeam.composition,
			players: players,
		},
		collection: tempPlayers,
		marketItems: tempMarketItems,
		playersForSale: tempPlayersForSale,
	}
})

const initialState = {
	isDraggingPlayer: false,
	teamDrawerOpen: false,
	team: {
		strategy: undefined,
		players: [],
	},
	collection: [],
	marketItems: [],
	playersForSale: [],
	fetching: false,
	confetti: {
		fire: false,
		reset: false,
	}
}

export const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		fireConffeti: (state, action) => {
			state.confetti.fire = {}
		},
		stopConffeti: (state, action) => {
			state.confetti.reset = {}
		},
		setCollection: (state, action) => {
			state.collection = action.payload
		},
		setMarketItems: (state, action) => {
			state.marketItems = action.payload
		},
		setPlayersForSale: (state, action) => {
			state.playersForSale = action.payload
		},
		setStrategy: (state, action) => {
			state.team.strategy = action.payload
		},
		resetTeam: (state, action ) => {
			state.team = initialState.team
		},
		setTeamPlayers: (state, action) => {
			state.team.players = action.payload
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
	extraReducers: (builder) => {
		builder.addCase(fetchData.fulfilled, (state, action) => {
			return { ...state, ...action.payload, fetching: false }
		})
		builder.addCase(fetchData.pending, (state, action) => {
			state.fetching = true
		})
	}
})

export const {
	setIsDraggingPlayer,
	setTeamDrawerState,
	setStrategy,
	resetTeam,
	addPlayerToTeam,
	removePlayerFromTeamById,
	setTeamPlayers,
	setCollection,
	setMarketItems,
	setPlayersForSale,
	fireConffeti,
	stopConffeti,
} = gameSlice.actions

export default gameSlice.reducer
