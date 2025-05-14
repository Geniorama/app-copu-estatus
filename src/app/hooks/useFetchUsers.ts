import { useState, useEffect } from "react";
import { getAllUsers } from "@/app/utilities/helpers/fetchers";
import type { User } from "@/app/types";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

interface UseFetchUsersProps {
  itemsPerPage?: number;
  hasUpdate?: boolean;
}

export default function useFetchUsers({itemsPerPage = 6, hasUpdate = false}: UseFetchUsersProps) {
  const [loading, setLoading] = useState(true);
  const [originalData, setOriginalData] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  
  const { currentUser } = useSelector((state: RootState) => state.user);
  const currentUserId = currentUser?.user.sub;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAllUsers(itemsPerPage, currentPage);
        if (res.users) {
          const filteredData = res.users.filter((user: User) => user.auth0Id !== currentUserId);
          setOriginalData(filteredData);
          setTotalPages(res.totalPages);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error instanceof Error ? error.message : "Error al obtener usuarios");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUserId, currentPage, itemsPerPage, hasUpdate]);

  return { loading, originalData, setOriginalData, setLoading, currentPage, setCurrentPage, totalPages, error };
}
