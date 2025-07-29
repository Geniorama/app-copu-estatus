import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './rootReducer';

// Configuración de persistencia
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user']  // Solo la parte 'user' del estado será persistida
}

// Crear el persistedReducer usando persistReducer y rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Crear el store con el persistedReducer
export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,  // Pasar el reducer persistido directamente
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignorar acciones específicas que contienen valores no serializables
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
          // Ignorar rutas específicas del estado
          ignoredPaths: ['user.currentUser'],
        },
      }),
  });
}

// Inferir los tipos del store
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

// Crear el persistor
export const persistor = (store: AppStore) => persistStore(store);
