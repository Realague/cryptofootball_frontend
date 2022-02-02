import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import userReducer from './features/userSlice'
import gameReducer from './features/gameSlice'
import settingsReducer from './features/settingsSlice'
import {
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
	persistStore,
} from 'reduxjs-toolkit-persist'

import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import storage from 'reduxjs-toolkit-persist/lib/storage'

const persistConfig = {
	key: 'root',
	storage,
	stateReconciler: autoMergeLevel2,
	blacklist: ['settings', 'game'],
}

const reducers = combineReducers({
	user: userReducer,
	game: gameReducer,
	settings: settingsReducer,
})

const _persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
	reducer: _persistedReducer,
	middleware: getDefaultMiddleware({
		serializableCheck: {
			ignoredActions: [
				FLUSH,
				REHYDRATE,
				PAUSE,
				PERSIST,
				PURGE,
				REGISTER
			],
			ignoredActionPaths: [
				'payload.transaction',
			],
			ignoredPaths: [
				'settings.transaction',
			],
		},
	}),
})

export const persistor = persistStore(store)
