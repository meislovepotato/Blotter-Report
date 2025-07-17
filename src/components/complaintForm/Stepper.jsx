"use client";

import { CheckRounded } from "@mui/icons-material";

const Stepper = ({ steps, activeStep }) => {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const progressPercentage = (activeStep + 1) / steps.length;
  const dashOffset = circumference * (1 - progressPercentage);

  return (
    <div className="text-xs font-medium text-gray-500 w-full flex-none select-none pointer-events-none">
      <div className="flex justify-center items-center h-14 sm:h-16">
        <div className="flex flex-col w-full h-full py-2 justify-between">
          <span className="text-primary font-bold text-xl leading-none tracking-tighter sm:text-3xl">
            {steps[activeStep]}
          </span>
          <span className="text-text/50 sm:text-base">
            Next - {steps[activeStep + 1] ?? "Done"}
          </span>
        </div>
        <div className="relative h-full aspect-square">
          <svg
            viewBox="0 0 72 72"
            className="absolute inset-0 w-full h-full rotate-[-90deg] stroke-6"
          >
            <circle
              cx="36"
              cy="36"
              r={radius}
              stroke="currentColor"
              // strokeWidth="4"
              className="text-text/10"
              fill="none"
            />
            <circle
              cx="36"
              cy="36"
              r={radius}
              stroke="currentColor"
              // strokeWidth="4"
              className="text-primary"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              fill="none"
              style={{ transition: "stroke-dashoffset 0.3s ease-in-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-normal text-text">
            {activeStep + 1} of {steps.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stepper;
