import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './rootReducer';

// Configuración de persistencia
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'],  // Solo la parte 'user' del estado será persistida
  blacklist: ['user.currentUser'], // No persistir currentUser
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
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
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

// Función para purgar la persistencia
export const purgeStore = (store: AppStore) => {
  const persistorInstance = persistor(store);
  persistorInstance.purge();
  return persistorInstance;
};
