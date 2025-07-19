"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { UserProvider } from "@/context";

export default function AdminClientWrapper({ user, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [hydratedUser, setHydratedUser] = useState(null);

  useEffect(() => {
    // Hydrate safely after client loads
    setHydratedUser(user);
  }, [user]);

  useEffect(() => {
    if (!hydratedUser) return;

    const restrictedPaths = ["/admin/users", "/admin/blotters"];
    const isRestricted = restrictedPaths.some((path) =>
      pathname.startsWith(path)
    );

    if (isRestricted && hydratedUser.dashboardRole !== "ADMIN") {
      router.replace("/admin");
    } else {
      setAuthorized(true);
    }
  }, [pathname, hydratedUser, router]);

  if (!authorized) return null;

  return <UserProvider user={hydratedUser}>{children}</UserProvider>;
}
