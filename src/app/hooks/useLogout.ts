// /app/hooks/useLogout.ts
"use client";

import { useDispatch } from "react-redux";
import { resetCurrentUser, resetUserData } from "@/app/store/features/userSlice";
import { resetCompaniesOptions } from "../store/features/companiesSlice";

export default function useLogout() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      console.log("Iniciando proceso de logout...");
      
      // Limpiar el estado de Redux
      dispatch(resetCurrentUser());
      dispatch(resetUserData());
      dispatch(resetCompaniesOptions());
      
      // Limpiar localStorage completamente
      localStorage.removeItem("userData");
      
      // Limpiar cualquier otro dato que pueda estar en localStorage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('user') || key.includes('company') || key.includes('auth'))) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`Removido de localStorage: ${key}`);
      });
      
      console.log("Datos limpiados correctamente");
      
      // Limpiar sessionStorage también
      sessionStorage.clear();
      
      // Disparar evento personalizado para notificar que se hizo logout
      window.dispatchEvent(new CustomEvent('userLoggedOut'));
      
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
