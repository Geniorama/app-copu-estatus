"use client";

import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCurrentUser } from "../store/features/userSlice";
import DashboardHome from "../views/Dashboard/Home";
import DashboardHomeClient from "../views/DashboardClient/HomeClient";
import { Claims } from "@auth0/nextjs-auth0";

interface DashboardClientWrapperProps {
    user: Claims,
    userRole: 'admin' | 'cliente'
}

const DashboardClientWrapper = ({ user, userRole }: DashboardClientWrapperProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && userRole) {
      dispatch(setCurrentUser({ user }));
    }
  }, [dispatch, user, userRole]);

  console.log('user role', userRole)

  // Renderiza el contenido adecuado según el rol
  if (userRole === "admin") {
    return <DashboardHome />;
  } else if (userRole === "cliente") {
    return <DashboardHomeClient />;
  }

  return <div>Acceso denegado</div>;
};

export default DashboardClientWrapper;
