"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Loading from "./dashboard/loading";
export default function AdminAuthGuard({ children }) {
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("admin_token")
        : null;
    if (!token) {
      setVerifying(false);
      setAuthorized(false);
      router.replace("404");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (!decoded || decoded.name !== "admin" || !decoded.email) {
        setVerifying(false);
        setAuthorized(false);
        router.replace("404");
        return;
      }
      setVerifying(false);
      setAuthorized(true);
    } catch {
      setVerifying(false);
      setAuthorized(false);
      router.replace("404");
    }
  }, [router]);
  if (verifying) {
    return <Loading />;
  }
  if (!authorized) {
    return null;
  }
  return children;
}
