"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { UserProvider } from "@/context";

export default function AdminClientWrapper({ user, children }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname.startsWith("/admin/users") && user.dashboardRole !== "ADMIN") {
      router.replace("/admin");
    }
  }, [pathname, user.dashboardRole, router]);

  return <UserProvider user={user}>{children}</UserProvider>;
}
