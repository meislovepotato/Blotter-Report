"use client";

import { useRouter } from "next/navigation";
import { PrimaryButton, BarangayLogo } from "@/components";
import { ArrowForwardRounded } from "@mui/icons-material";

const BlotterHeader = ({ buttonClick }) => {
  const router = useRouter();

  return (
    <header className="flex justify-between items-center px-3 mb-8 select-none sm:px-8 md:px-18 2xl:px-60">
      <BarangayLogo />
      <span className="text-xl font-bold hidden md:block lg:text-2xl">
        Complaint Reporting System
      </span>
      <PrimaryButton
        rightIcon={
          <ArrowForwardRounded className="text-background !w-4 !h-4" />
        }
        onClick={buttonClick}
      >
        Admin
      </PrimaryButton>
    </header>
  );
};

export default BlotterHeader;
