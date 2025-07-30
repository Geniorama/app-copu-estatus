"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setCurrentUser } from "../store/features/userSlice";
import DashboardHome from "../views/Dashboard/Home";
import DashboardHomeClient from "../views/DashboardClient/HomeClient";
import { Claims } from "@auth0/nextjs-auth0";
import { RootState } from "../store";
import { getUserByAuth0Id } from "../utilities/helpers/fetchers";
import { setUserData } from "../store/features/userSlice";
import type { User } from "../types";
import { Entry } from "contentful-management";
import SkeletonLoader from "../utilities/ui/SkeletonLoader";

interface DashboardClientWrapperProps {
    user: Claims,
    userRole: 'admin' | 'cliente'
}

const DashboardClientWrapper = ({ user, userRole }: DashboardClientWrapperProps) => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      if (user && userRole) {
        dispatch(setCurrentUser({ user }));
        
        // Cargar datos del usuario si no están disponibles
        if (!userData && user.user.sub) {
          try {
            console.log('Loading user data for:', user.user.sub);
            const response = await getUserByAuth0Id(user.user.sub);
            if (response) {
              const transformData: User = {
                id: '',
                fname: response.firstName['en-US'],
                lname: response.lastName['en-US'],
                position: response.position['en-US'],
                email: response.email['en-US'],
                phone: response.phone['en-US'],
                role: response.role['en-US'],
                imageProfile: response.imageProfile['en-US'],
                companies: response.company['en-US'] || [],
                companiesId: response.company['en-US']?.map((company: Entry) => (company.sys.id)) || [],
              };
              console.log('User data loaded:', transformData);
              dispatch(setUserData(transformData));
              localStorage.setItem("userData", JSON.stringify(transformData));
              
              // Disparar evento personalizado para notificar que los datos del usuario han cambiado
              window.dispatchEvent(new CustomEvent('userDataLoaded', { 
                detail: { userData: transformData } 
              }));
            }
          } catch (error) {
            console.error("Error loading user data:", error);
          }
        } else if (userData) {
          console.log('User data already available:', userData);
        }
        
        setIsLoading(false);
      }
    };

    initializeUser();
  }, [dispatch, user, userRole, userData]);

  // Mostrar skeleton mientras se cargan los datos
  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <SkeletonLoader type="table" rows={5} className="w-full max-w-4xl" />
      </div>
    );
  }

  // Renderiza el contenido adecuado según el rol
  if (userRole === "admin") {
    return <DashboardHome />;
  } else if (userRole === "cliente") {
    return <DashboardHomeClient />;
  }

  return <div>Acceso denegado</div>;
};

export default DashboardClientWrapper;
