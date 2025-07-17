"use client";

import { LogoutRounded } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const base =
  "inline-flex items-center justify-center font-semibold transition-all duration-300  ease-in-out rounded-lg drop-shadow-xl drop-shadow-transparent focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

export const PrimaryButton = ({
  children,
  className = "",
  rightIcon,
  isForm = false,
  ...props
}) => {
  return (
    <button
      className={`${base} ${
        isForm
          ? "h-10 px-8 text-base"
          : "h-6 px-6 text-xs sm:h-10 sm:px-8 sm:text-base"
      } bg-primary text-background hover:drop-shadow-primary/50 hover:drop-shadow-xl cursor-pointer ${className}`}
      {...props}
    >
      {children}
      {rightIcon && (
        <span className="ml-2 pointer-events-none">{rightIcon}</span>
      )}
    </button>
  );
};

export const SecondaryButton = ({
  children,
  className = "",
  isForm = false,
  ...props
}) => {
  return (
    <button
      className={`${base} ${
        isForm ? "h-10 text-base" : "h-6 text-xs sm:h-10 sm:text-base"
      } px-0 text-primary disabled:text-text hover:text-secondary cursor-pointer !${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const OutlineButton = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`${base} !font-normal h-10 px-8 text-base border-2 border-primary text-text hover:drop-shadow-primary/50 hover:drop-shadow-xl  cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const LogOutButton = () => {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        try {
          // Debug: Log what's in storage before clearing
          console.log("LocalStorage keys:", Object.keys(localStorage));
          console.log("SessionStorage keys:", Object.keys(sessionStorage));

          await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
          });

          // Clear all localStorage items
          localStorage.clear();
          sessionStorage.clear();

          // Debug: Verify it's cleared
          console.log(
            "After clear - LocalStorage keys:",
            Object.keys(localStorage)
          );
          console.log(
            "After clear - SessionStorage keys:",
            Object.keys(sessionStorage)
          );

          router.push("/");
        } catch (error) {
          console.error("Logout failed:", error);
          router.push("/");
        }
      }}
      className="h-10 w-full flex items-center px-4 rounded-md hover:bg-red-300/25 text-red-500 hover:text-red-800 transition-all cursor-pointer"
    >
      <LogoutRounded fontSize="small" />
      Logout
    </button>
  );
};
