"use client";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { resetCurrentUser, resetUserData } from '@/app/store/features/userSlice';
import { resetCompaniesOptions } from '@/app/store/features/companiesSlice';
import { setSidebarShow } from '@/app/store/features/settingsSlice';

export default function useAuthGuard() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // Función para limpiar completamente el estado
    const clearAllData = () => {
      console.log('Limpiando todos los datos de la aplicación...');
      
      // Limpiar Redux
      dispatch(resetCurrentUser());
      dispatch(resetUserData());
      dispatch(resetCompaniesOptions());
      dispatch(setSidebarShow(true));
      
      // Limpiar localStorage
      localStorage.removeItem("userData");
      localStorage.removeItem("companiesOptions");
      
      // Limpiar claves de persistencia
      localStorage.removeItem('persist:root');
      localStorage.removeItem('persist:user');
      
      // Limpiar sessionStorage
      sessionStorage.clear();
      
      // Purgar Redux store si está disponible
      if (typeof window !== 'undefined' && window.purgeReduxStore) {
        window.purgeReduxStore();
      }
      
      console.log('Todos los datos han sido limpiados');
    };

    // Listener para detectar cuando se hace logout
    const handleUserLoggedOut = () => {
      console.log('AuthGuard: Detectado logout, limpiando datos...');
      clearAllData();
    };

    // Listener para detectar cambios en el storage (logout en otra pestaña)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userData' && e.newValue === null) {
        console.log('AuthGuard: Detectado logout en otra pestaña, limpiando datos...');
        clearAllData();
      }
    };

    // Agregar listeners
    window.addEventListener('userLoggedOut', handleUserLoggedOut);
    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('userLoggedOut', handleUserLoggedOut);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [dispatch]);

  return null;
}
