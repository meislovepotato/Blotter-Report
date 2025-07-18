"use client";

import Image from "next/image";
import background from "@/assets/img/background.jpg";

import React, { useState } from "react";
import {
  BlotterHeader,
  ComplaintForm,
  AuthModal,
  TrackModal,
  BarangayInfoModal,
} from "@/components";

const HomePage = () => {
  const [showAuth, setShowAuth] = useState(false);

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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-10% via-background via-27% md:via-70% to-background to-90%" />
      </div>

      {/* Header */}
      <BlotterHeader buttonClick={() => setShowAuth(true)} />

      {/* Main Section */}
      <main className="flex flex-col px-3 gap-4 h-10 sm:px-8 sm:justify-between md:grid md:grid-cols-8 md:gap-4 md:flex-1 md:items-stretch lg:px-18 lg:grid-cols-12 lg:gap-5 2xl:px-60">
        <div className="flex flex-col flex-1 gap-6 w-full select-none sm:grid sm:grid-cols-8 sm:gap-4 md:flex md:flex-col md:col-span-4 md:py-6 md:gap-8 md:justify-center lg:col-span-6 xl:py-8">
          <div className="flex flex-col gap-6 w-full sm:col-span-5 md:justify-between md:gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-text sm:text-4xl md:leading-tight 2xl:text-5xl 2xl:leading-none">
              Welcome to the <span className=" text-accent">Complaint</span>{" "}
              Reporting Page
            </h1>
            <p className="text-xs/tight text-justify text-text sm:text-sm/tight md:text-sm/tight">
              This page allows you to report incidents, complaints, and other
              community concerns. Barangay workers will act on these reports.
              You can create an account to submit reports or log in to view and
              manage previous reports.
            </p>
          </div>
          <TrackModal className={`hidden md:flex`} />
        </div>
        <div className="flex flex-col w-full h-auto flex-1 justify-end gap-8 md:col-span-4 md:h-full md:justify-center lg:col-span-5 lg:col-start-8">
          <ComplaintForm />
          <TrackModal className={` md:hidden flex mb-6`} />
        </div>
      </main>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
      <BarangayInfoModal />
    </div>
  );
};

export default HomePage;
