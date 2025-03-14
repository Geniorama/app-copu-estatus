import { useState, useEffect } from "react";
import { getAllUsers } from "@/app/utilities/helpers/fetchers";
import type { User } from "@/app/types";
import type { Entry } from "contentful-management";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

interface UseFetchUsersProps {
  itemsPerPage?: number;
}

export default function useFetchUsers({itemsPerPage = 6}: UseFetchUsersProps) {
  const [loading, setLoading] = useState(true);
  const [originalData, setOriginalData] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const { currentUser } = useSelector((state: RootState) => state.user);
  const currentUserId = currentUser?.user.sub;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await getAllUsers(itemsPerPage + 1, currentPage);
        const users = res.users;
        if (users) {
          const transformData: User[] = users.map((user:Entry) => ({
            id: user.sys.id,
            fname: user.fields.firstName?.["en-US"] || null,
            lname: user.fields.lastName?.["en-US"] || null,
            email: user.fields.email?.["en-US"] || null,
            role: user.fields.role?.["en-US"] || null,
            phone: user.fields.phone?.["en-US"] || null,
            imageProfile: user.fields.imageProfile?.["en-US"] || null,
            status: user.fields.status?.["en-US"] || null,
            auth0Id: user.fields.auth0Id?.["en-US"] || null,
            companiesId: user.fields.company?.["en-US"]?.map((company:Entry) => company.sys.id) || null,
            position: user.fields.position?.["en-US"] || null,
          }));

          const filteredData = transformData.filter(user => user.auth0Id !== currentUserId);
          setOriginalData(filteredData);
          setTotalPages(res.totalPages);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUserId, currentPage, itemsPerPage]);

  return { loading, originalData, setOriginalData, setLoading, currentPage, setCurrentPage, totalPages };
}
