"use client";

import Image from "next/image";
import placeholderLogo from "@/assets/img/barangay_logo.png";
import { useEffect, useState } from "react";
import { fetchBarangayInfo } from "@/lib";

const BarangayLogo = ({ small = false }) => {
  const [barangay, setBarangay] = useState({
    name: "Loading...",
    logoUrl: null,
  });

  useEffect(() => {
    fetchBarangayInfo().then((data) => {
      if (data) {
        setBarangay({
          name: data.name || "Unknown",
          logoUrl: data.logoUrl,
        });
      }
    });
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-2 select-none ${
        small ? "h-10" : "h-6 sm:h-10"
      }`}
    >
      {/* Logo */}
      <div className="relative aspect-square h-full pointer-events-none">
        <Image
          src={barangay.logoUrl || placeholderLogo}
          alt="Barangay Logo"
          fill
          className="object-contain"
        />
      </div>

      {/* Text */}
      <div className="leading-tight inline-flex flex-col h-full justify-between py-0.5">
        <span
          className={`font-bold uppercase ${
            small ? "text-sm" : "text-xs sm:text-xl"
          } leading-none`}
        >
          Barangay
        </span>
        <span
          className={`font-bold ${
            small ? "text-sm" : "text-[.625rem] sm:text-base"
          } leading-none`}
        >
          {barangay.name}
        </span>
      </div>
    </div>
  );
};

export default BarangayLogo;
