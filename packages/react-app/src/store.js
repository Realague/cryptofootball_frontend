import {combineReducers, configureStore, getDefaultMiddleware} from '@reduxjs/toolkit'
import userReducer from './features/userSlice'
import {persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, persistStore} from 'reduxjs-toolkit-persist'

import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import storage from 'reduxjs-toolkit-persist/lib/storage'

const persistConfig = {
	key: 'root',
	storage,
	stateReconciler: autoMergeLevel2
}

const reducers = combineReducers({
	user: userReducer,
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
		},
	}),
})

export const persistor = persistStore(store)
