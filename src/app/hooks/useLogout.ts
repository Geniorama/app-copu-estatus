// /app/hooks/useLogout.ts
"use client";

import { useDispatch } from "react-redux";
import { resetCurrentUser, resetUserData } from "@/app/store/features/userSlice";
import { resetCompaniesOptions } from "../store/features/companiesSlice";

export default function useLogout() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // Primero limpiamos el estado
      dispatch(resetCurrentUser());
      dispatch(resetUserData());
      dispatch(resetCompaniesOptions());
      localStorage.removeItem("userData");
      // Luego hacemos la redirección
      window.location.href = "/api/auth/logout";
    } catch (error) {
      console.error("Error during logout:", error);
      // Si hay un error, intentamos la redirección de todos modos
      window.location.href = "/api/auth/logout";
    }
  };

  return handleLogout;
}
