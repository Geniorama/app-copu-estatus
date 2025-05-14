// /app/hooks/useLogout.ts
"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { resetCurrentUser, resetUserData } from "@/app/store/features/userSlice";
import { resetCompaniesOptions } from "../store/features/companiesSlice";

export default function useLogout() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    router.push("/api/auth/logout");
    dispatch(resetCurrentUser());
    dispatch(resetUserData());
    dispatch(resetCompaniesOptions());
  };

  return handleLogout;
}
