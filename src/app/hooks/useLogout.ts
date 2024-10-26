// /app/hooks/useLogout.ts
"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { resetCurrentUser, resetUserData } from "@/app/store/features/userSlice";
import type { MouseEvent } from "react";

export default function useLogout() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = (e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    dispatch(resetCurrentUser());
    dispatch(resetUserData());
    router.push("/api/auth/logout");
  };

  return handleLogout;
}
