"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setCurrentUser } from "../store/features/userSlice";
import DashboardHome from "../views/Dashboard/Home";
import DashboardHomeClient from "../views/DashboardClient/HomeClient";
import { Claims } from "@auth0/nextjs-auth0";
import { RootState } from "../store";
import { getUserByAuth0Id } from "../utilities/helpers/fetchers";
import { setUserData, resetUserData } from "../store/features/userSlice";
import type { User } from "../types";
import { Entry } from "contentful-management";
import SkeletonLoader from "../utilities/ui/SkeletonLoader";
import useAuthGuard from "../hooks/useAuthGuard";

interface DashboardClientWrapperProps {
    user: Claims,
    userRole: 'admin' | 'cliente'
}

const DashboardClientWrapper = ({ user, userRole }: DashboardClientWrapperProps) => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  
  // Hook para proteger la autenticación y limpiar datos
  useAuthGuard();

  useEffect(() => {
    // Solo ejecutar una vez cuando el componente se monta
    if (!user || !userRole || !user.sub) {
      console.log('DashboardWrapper - Missing required data:', { user: !!user, userRole, hasSub: !!user?.sub });
      return;
    }
    
    console.log('DashboardWrapper - user object:', user);
    console.log('DashboardWrapper - userRole:', userRole);
    console.log('DashboardWrapper - user.sub:', user.sub);
    
    dispatch(setCurrentUser({ user }));
    
    // Solo cargar datos si no están disponibles
    if (!userData) {
      const loadUserData = async () => {
        try {
          console.log('Loading user data for:', user.sub);
          console.log('Calling getUserByAuth0Id...');
          const response = await getUserByAuth0Id(user.sub);
          console.log('getUserByAuth0Id response:', response);
          
          if (response && response.firstName && response.lastName) {
            const transformData: User = {
              id: '',
              fname: response.firstName['en-US'] || '',
              lname: response.lastName['en-US'] || '',
              position: response.position?.['en-US'] || '',
              email: response.email?.['en-US'] || '',
              phone: response.phone?.['en-US'] || '',
              role: response.role?.['en-US'] || '',
              imageProfile: response.imageProfile?.['en-US'] || '',
              companies: response.company?.['en-US'] || [],
              companiesId: response.company?.['en-US']?.map((company: Entry) => (company.sys.id)) || [],
            };
            console.log('User data loaded:', transformData);
            dispatch(setUserData(transformData));
            localStorage.setItem("userData", JSON.stringify(transformData));
            
            // Disparar evento personalizado para notificar que los datos del usuario han cambiado
            window.dispatchEvent(new CustomEvent('userDataLoaded', { 
              detail: { userData: transformData } 
            }));
          } else {
            console.warn('No user data found or incomplete data:', response);
            // Solo usar datos básicos del Auth0 si realmente tenemos información válida
            if (user.name || user.given_name || user.email) {
              const basicUserData: User = {
                id: '',
                fname: user.name || user.given_name || '',
                lname: user.family_name || '',
                position: '',
                email: user.email || '',
                phone: '',
                role: userRole,
                imageProfile: user.picture || '',
                companies: [],
                companiesId: [],
              };
              console.log('Using basic Auth0 user data:', basicUserData);
              dispatch(setUserData(basicUserData));
              localStorage.setItem("userData", JSON.stringify(basicUserData));
            } else {
              // Si no hay datos válidos, limpiar el estado
              dispatch(resetUserData());
              localStorage.removeItem("userData");
            }
          }
        } catch (error) {
          console.error("Error loading user data:", error);
          // En caso de error, no usar datos de fallback, solo limpiar el estado
          dispatch(resetUserData());
          localStorage.removeItem("userData");
        } finally {
          setIsLoading(false);
        }
      };
      
      loadUserData();
    } else {
      console.log('User data already available:', userData);
      setIsLoading(false);
    }
  }, []); // Solo se ejecuta una vez al montar el componente

  // Efecto separado para manejar cambios en userData
  useEffect(() => {
    if (userData) {
      setIsLoading(false);
    }
  }, [userData]);

  // Mostrar skeleton solo si estamos cargando Y no tenemos datos del usuario
  if (isLoading && !userData) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <SkeletonLoader type="table" rows={5} className="w-full max-w-4xl" />
      </div>
    );
  }

  // Verificar que tenemos datos válidos del usuario antes de renderizar
  if (!userData || !userData.fname || !userData.email) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No hay datos de usuario disponibles</h2>
          <p className="text-gray-600">Por favor, inicia sesión nuevamente.</p>
        </div>
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
