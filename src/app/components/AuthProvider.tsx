"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import NavBar from "@/app/components/NavBar";
import { BEARER_TOKEN_KEY } from "@/app/constants";
import apiInstance from "@/app/services/algotrialApi";
import {
  selectUser,
  setUser,
  useAlgoTrialStore,
} from "@/app/store/algoTrialStore";

export default function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const currentUser = useAlgoTrialStore(selectUser);
  useEffect(() => {
    const bearerToken = localStorage.getItem(BEARER_TOKEN_KEY);
    if (!bearerToken) {
      setUser(null);
      router.push("/login");
      return;
    }

    const reload_data = async () => {
      try {
        await apiInstance.get("/auth/me");
      } catch (error) {
        setUser(null);
        console.error(error);
      }
    };

    reload_data();
  }, [router]);
  return (
    <div>
      {currentUser && <NavBar />}
      {children}
    </div>
  );
}
