"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { UserProvider } from "@/context";

export default function AdminClientWrapper({ user, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const restrictedPaths = ["/admin/users", "/admin/blotters"];
    const isRestricted = restrictedPaths.some((path) =>
      pathname.startsWith(path)
    );

    if (isRestricted && user.dashboardRole !== "ADMIN") {
      router.replace("/admin");
    } else {
      setAuthorized(true);
    }
  }, [pathname, user.dashboardRole, router]);

  if (!authorized) return null; // or return a loading spinner

  return <UserProvider user={user}>{children}</UserProvider>;
}
