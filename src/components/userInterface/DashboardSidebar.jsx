"use client";

import { BarangayLogo, LogOutButton } from "@/components";
import { ADMIN_NAV_LINKS, ADMIN_OTHER_LINKS } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DashboardSidebar = ({ role }) => {
  const pathname = usePathname();

  const visibleLinks = ADMIN_NAV_LINKS.filter((link) => {
    const noRequiredRole = !link.requiredRole;
    const roleMatches = link.requiredRole === role;
    const adminSeesStaff = link.requiredRole === "STAFF" && role === "ADMIN";

    const isVisible = noRequiredRole || roleMatches || adminSeesStaff;

    return isVisible;
  });

  return (
    <aside className="col-span-2 py-4 select-none">
      <div className="flex flex-col bg-background h-full gap-14 p-4 shadow-2xl shadow-text/10 rounded-2xl">
        <BarangayLogo small />

        {/* MAIN NAV LINKS */}
        <ul className="flex flex-col flex-1 gap-2 text-sm">
          {visibleLinks.map(({ label, href, icon }) => {
            const isActive = pathname === href;

            return (
              <li
                key={href}
                className={`h-10 w-full flex items-center px-4 rounded-md hover:bg-secondary/25 *:text-text/80 *:hover:text-text/60 transition-all ${
                  isActive ? "bg-secondary/50 *:!text-primary" : ""
                }`}
              >
                <Link
                  href={href}
                  className="flex h-full w-full items-center gap-2 transition-all truncate"
                >
                  {icon}
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* OTHER LINKS */}
        <ul className="flex flex-col gap-2 text-sm">
          <span className="text-text/50">Others</span>
          {ADMIN_OTHER_LINKS.map(({ label, href, icon }) => {
            const isActive = pathname === href;
            return (
              <li
                key={href}
                className={`h-10 w-full flex items-center px-4 rounded-md hover:bg-secondary/25 *:text-text/80 *:hover:text-text/60 transition-all ${
                  isActive ? "bg-secondary/50 *:!text-primary" : ""
                }`}
              >
                <Link
                  href={href}
                  className="flex h-full w-full items-center gap-2 transition-all truncate"
                >
                  {icon}
                  {label}
                </Link>
              </li>
            );
          })}
          <LogOutButton />
        </ul>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
