import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import footballHeroesService from '../services/FootballPlayerService'

export const fetchData = createAsyncThunk('game/fetchData', async (args, { dispatch }) => {
	let tempPlayers = []
	const collectionIds = await footballHeroesService.getFootballPlayerList()
	let jobs = []
	for (let playerId of collectionIds.map(i => +i)) {
		jobs.push(footballHeroesService.getFootballPlayer(playerId))
	}
	tempPlayers  = await Promise.all(jobs)
	dispatch(setCollection(tempPlayers))
	const playerTeam = await footballHeroesService.getPlayerTeam()
	console.log(playerTeam)
	const players = tempPlayers.filter(p => p.isAvailable === false)
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
		style: ''
	}
}

export const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		fireConffeti: (state, action) => {
			state.confetti.fire = {}
			state.confetti.style = action.payload
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
