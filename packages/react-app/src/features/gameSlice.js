import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import footballHeroesService from '../services/FootballPlayerService'

export const fetchData = createAsyncThunk('game/fetchData', async () => {
	let tempPlayers = []
	const collectionIds = await footballHeroesService.getFootballPlayerList()
	for (let playerId of collectionIds.map(i => +i)) {
		tempPlayers.push(await footballHeroesService.getFootballPlayer(playerId))
	}
	const playerTeam = await footballHeroesService.getPlayerTeam()
	const ids = [
		...playerTeam.attackers.map(id => +id),
		...playerTeam.defenders.map(id => +id),
		...playerTeam.midfielders.map(id => +id),
		+playerTeam.goalKeeper
	]
	const players = []
	for (let id of ids) {
		players.push(tempPlayers.find(p => p.id == id))
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
	team: {
		strategy: undefined,
		players: [],
	},
	collection: [],
	marketItems: [],
	playersForSale: [],
	fetching: false,
	confetti: {
		fire: { style: undefined },
		reset: false,
	}
}

export const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		fireConffeti: (state, action) => {
			state.confetti.fire.style = action.payload
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
		updatePlayerInCollection: (state, action) => {
			state.team.players = state.team.players.map(p => {
				if (p.id === action.payload.id) {
					return action.player
				}
				return p
			})
		},
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
	updatePlayerInCollection,
} = gameSlice.actions

export default gameSlice.reducer
