// /app/hooks/useLogout.ts
"use client";

import { useDispatch } from "react-redux";
import { resetCurrentUser, resetUserData } from "@/app/store/features/userSlice";
import { resetCompaniesOptions } from "../store/features/companiesSlice";
import { setSidebarShow } from "../store/features/settingsSlice";

export default function useLogout() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      console.log("Iniciando proceso de logout...");
      
      // Limpiar el estado de Redux
      dispatch(resetCurrentUser());
      dispatch(resetUserData());
      dispatch(resetCompaniesOptions());
      dispatch(setSidebarShow(true)); // Resetear sidebar a estado inicial
      
      // Limpiar localStorage completamente
      localStorage.removeItem("userData");
      localStorage.removeItem("companiesOptions");
      
      // Limpiar cualquier otro dato que pueda estar en localStorage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('user') || key.includes('company') || key.includes('auth') || key.includes('persist'))) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`Removido de localStorage: ${key}`);
      });
      
      // Limpiar específicamente las claves de Redux Persist
      localStorage.removeItem('persist:root');
      localStorage.removeItem('persist:user');
      
      // Limpiar sessionStorage también
      sessionStorage.clear();
      
      // Purgar el store de Redux completamente
      if (typeof window !== 'undefined' && window.purgeReduxStore) {
        window.purgeReduxStore();
      }
      
      // Disparar evento personalizado para notificar que se hizo logout
      window.dispatchEvent(new CustomEvent('userLoggedOut'));
      
      console.log("Datos limpiados correctamente");
      
      // Hacer la redirección
      window.location.href = "/api/auth/logout";
    } catch (error) {
      console.error("Error during logout:", error);
      // Si hay un error, intentamos la redirección de todos modos
      window.location.href = "/api/auth/logout";
    }
  };

  return handleLogout;
}
