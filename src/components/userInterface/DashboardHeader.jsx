"use client";

import Image from "next/image";
import {
  ADMIN_NAV_LINKS,
  ADMIN_OTHER_LINKS,
  ADMIN_ROLES,
  ROLE_COLORS,
  ROLE_TEXT_COLORS,
} from "@/constants";
import placeholderLogo from "@/assets/img/barangay_logo.png";
import { usePathname } from "next/navigation";

const DashboardHeader = ({ name, role }) => {
  const pathname = usePathname();
  const allLinks = [...ADMIN_NAV_LINKS, ...ADMIN_OTHER_LINKS];
  const current = allLinks.find((link) => link.href === pathname);

  return (
    <div className="flex flex-row w-full h-10 gap-4 justify-between select-none pointer-events-none">
      <h2 className="text-3xl font-bold text-text">
        {current?.label || "Admin Panel"}
      </h2>
      <div
        className="inline-flex items-center gap-2 
         h-10"
      >
        {/* Logo */}
        <div className="relative aspect-square h-full">
          <Image
            src={placeholderLogo}
            alt="Barangay Logo"
            fill
            className="object-contain"
          />
        </div>

        {/* Text */}
        <div className="leading-tight inline-flex flex-col h-full justify-between py-1">
          <span className="font-medium text-sm leading-none">
            {name || "Admin"}
          </span>
          <span
            className={`text-xs font-semibold leading-none ${
              ROLE_TEXT_COLORS[role] || ROLE_TEXT_COLORS.DEFAULT
            }`}
          >
            {ADMIN_ROLES[role] || "Role"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
