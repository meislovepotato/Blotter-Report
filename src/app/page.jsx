"use client";

import Image from "next/image";
import background from "@/assets/img/background.jpg";

import React, { useEffect, useState } from "react";
import { BlotterHeader, ComplaintForm, AuthModal } from "@/components";
import { fetchBarangayInfo } from "@/lib";
import {
  AccessTimeFilledRounded,
  CallRounded,
  LocationOnRounded,
  MailRounded,
  PersonRounded,
} from "@mui/icons-material";
import Link from "next/link";

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
    valueKey: "chairperson", // just make sure you return this from the API
  },
  {
    icon: <AccessTimeFilledRounded fontSize="1rem" className="text-primary" />,
    label: "Office Hours",
    valueKey: "officeHours",
  },
];

const HomePage = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [barangay, setBarangay] = useState({
    name: "Loading...",
    location: null,
    address: null,
    hotline: null,
    email: null,
    chairperson: null,
    officeHours: null,
  });

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

  return (
    <div className="flex flex-col py-4 min-h-screen lg:overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 select-none pointer-events-none">
        {/* Background image */}
        <Image
          src={background}
          alt="Background"
          fill
          className="object-cover object-top"
          priority
        />

        {/* Fade overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-10% via-background via-70% to-background to-90%" />
      </div>

      {/* Header */}
      <BlotterHeader buttonClick={() => setShowAuth(true)} />

      {/* Main Section */}
      <main className="flex flex-col px-3 gap-4 h-10 sm:px-8 sm:justify-between md:grid md:grid-cols-8 md:gap-4 md:flex-1 md:items-stretch lg:px-18 lg:grid-cols-12 lg:gap-5 2xl:px-60">
        <div className="flex flex-col flex-1 gap-6 w-full select-none sm:grid sm:grid-cols-8 sm:gap-4 md:flex md:flex-col md:col-span-4 md:py-6 md:gap-12 md:justify-center lg:col-span-6 xl:py-8">
          <div className="flex flex-col gap-6 w-full sm:col-span-5 md:justify-between">
            <h1 className="text-3xl  font-bold tracking-tight text-text sm:text-5xl md:leading-tight 2xl:text-5xl 2xl:leading-none">
              Welcome to the <span className=" text-accent">Complaint</span>{" "}
              Reporting Page
            </h1>
            <p className="text-xs/tight text-justify text-text sm:text-base/tight ">
              This page allows you to report incidents, complaints, and other
              community concerns. Barangay workers will act on these reports.
              You can create an account to submit reports or log in to view and
              manage previous reports.
            </p>
            <div className="mt-4">
              <Link href="/fake-sms" className="text-blue-600 underline">
                View Fake SMS Inbox (Demo)
              </Link>
            </div>
          </div>
          <div className="bg-secondary/18 backdrop-blur-lg w-full flex flex-col flex-1 h-full gap-2 p-4 rounded-2xl sm:col-span-3 md:max-h-70 md:justify-between">
            <h3 className="text-xl leading-snug font-bold text-text">
              <span className="text-primary">Barangay {barangay.name}</span> -{" "}
              {barangay.location}
            </h3>
            <ul className="text-text text-xs leading-3.5 font-bold flex flex-col gap-2 *:flex *:items-start *:gap-2 2xl:text-base">
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
            <p className="text-text/80 text-xs italic md:text-base">
              "Serving the community with transparency, accountability, and
              prompt action."
            </p>
          </div>
        </div>
        <div className="flex flex-col w-full h-auto flex-1 justify-end md:col-span-4 md:h-full md:justify-center lg:col-span-5 lg:col-start-8">
          <ComplaintForm />
        </div>
      </main>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
};

export default HomePage;
