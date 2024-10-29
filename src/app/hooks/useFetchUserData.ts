import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { setUserData } from "@/app/store/features/userSlice";

export function useFetchUserData() {
  const dispatch = useDispatch();

  const fetchUserData = useCallback(async (auth0Id: string) => {
    try {
      const response = await fetch(`/api/user?auth0Id=${auth0Id}`);

      if (!response.ok) {
        throw new Error(`Error al obtener el usuario: ${response.statusText}`);
      }

      const userData = await response.json();

      const transformData = {
        ...userData,
        fname: userData.firstName,
        lname: userData.lastName,
      };

      dispatch(setUserData(transformData));
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  }, [dispatch]);

  return fetchUserData;
}
