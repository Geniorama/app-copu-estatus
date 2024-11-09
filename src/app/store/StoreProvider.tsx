'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { makeStore, AppStore, persistor } from '.'
import type { Persistor } from 'redux-persist'
import IconLoad from '@/app/img/copu-load.gif'

export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore>()
  const persistorRef = useRef<Persistor>()

  if (!storeRef.current) {
    // Crear la instancia de la tienda la primera vez que se renderiza
    storeRef.current = makeStore()
    // Crear la instancia de persistor
    persistorRef.current = persistor(storeRef.current)
  }

  const loadBox = () => {
    return(
      <div className='w-screen h-screen flex justify-center items-center'>
        <div className='w-32'>
          <img className='w-full' src={IconLoad.src} alt="" />
        </div>
      </div>
    )
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate 
        loading={loadBox()}  // Componente de carga simple
        persistor={persistorRef.current!}
      >
        {children}
      </PersistGate>
    </Provider>
  )
}
