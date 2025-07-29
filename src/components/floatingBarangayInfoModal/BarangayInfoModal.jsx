"use client";

import { fetchBarangayInfo } from "@/lib";
import { useEffect, useRef, useState } from "react";
import {
  AccessTimeFilledRounded,
  CallRounded,
  LocationOnRounded,
  MailRounded,
  PersonRounded,
  QuestionMarkRounded,
} from "@mui/icons-material";

const useIsTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);
  return isTouch;
};

const BarangayInfoModal = () => {
  const isTouchDevice = useIsTouchDevice();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const [barangay, setBarangay] = useState({
    name: "Loading...",
    location: null,
    address: null,
    hotline: null,
    email: null,
    chairperson: null,
    officeHours: null,
  });

  const infoList = [
    {
      icon: <LocationOnRounded fontSize="1rem" className="text-primary" />,
      label: "Zone",
      valueKey: "address",
    },
    {
      icon: <CallRounded fontSize="1rem" className="text-primary" />,
      label: "Hotline",
      valueKey: "hotline",
    },
    {
      icon: <MailRounded fontSize="1rem" className="text-primary" />,
      label: "Email",
      valueKey: "email",
    },
    {
      icon: <PersonRounded fontSize="1rem" className="text-primary" />,
      label: "Chair Person",
      valueKey: "chairperson",
    },
    {
      icon: (
        <AccessTimeFilledRounded fontSize="1rem" className="text-primary" />
      ),
      label: "Office Hours",
      valueKey: "officeHours",
    },
  ];

  useEffect(() => {
    fetchBarangayInfo().then((data) => {
      if (data) {
        setBarangay({
          name: data.name || "Unknown",
          location: data.location || "",
          address: data.address || "",
          hotline: data.hotline || "",
          email: data.email || "",
          chairperson: data.chairperson || "",
          officeHours: data.officeHours || "",
        });
      }
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 left-4 z-50 group"
      onClick={() => isTouchDevice && setOpen(!open)}
      onMouseEnter={() => !isTouchDevice && setOpen(true)}
      onMouseLeave={() => !isTouchDevice && setOpen(false)}
    >
      <button
        className="w-10 h-10 rounded-full bg-secondary/20 text-primary shadow-secondary/18 shadow-2xl flex items-center justify-center *:!text-2xl hover:bg-secondary/50 transition-all backdrop-blur-lg border-2 border-secondary/25"
        aria-label="Track Complaint"
      >
        <QuestionMarkRounded />
      </button>

      {/* Floating Modal */}
      {open && (
        <div className="absolute left-full bottom-0 translate-y-[-25%] bg-white/90 backdrop-blur-2xl max-w-[80vw] md:max-w-[36vw] w-screen flex flex-col gap-2 p-4 rounded-2xl shadow-secondary/18 shadow-2xl border-2 border-white">
          <h3 className="text-base sm:text-xl font-bold text-text leading-snug">
            <span className="text-primary">Barangay {barangay.name}</span> -{" "}
            {barangay.location}
          </h3>
          <ul className="text-text text-xs leading-4 font-bold flex flex-col gap-2 *:flex *:items-start *:gap-2 2xl:text-base">
            {infoList.map(({ icon, label, valueKey }) => (
              <li key={label}>
                {icon}
                <span>
                  {label}:{" "}
                  <span className="font-normal select-text">
                    {barangay[valueKey] || "—"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <p className="text-text/80 text-xs italic md:text-sm">
            "Serving the community with transparency, accountability, and prompt
            action."
          </p>
        </div>
      )}
    </div>
  );
};

export default BarangayInfoModal;
