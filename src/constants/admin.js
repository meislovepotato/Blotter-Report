import {
  DashboardRounded,
  GavelRounded,
  ManageAccountsRounded,
  GroupRounded,
  SummarizeRounded,
} from "@mui/icons-material";

export const ADMIN_NAV_LINKS = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <DashboardRounded fontSize="small" />,
    requiredRole: null,
  },
  {
    label: "Complaints",
    href: "/admin/complaints",
    icon: <SummarizeRounded fontSize="small" />,
    requiredRole: null,
  },
  {
    label: "Blotters",
    href: "/admin/blotters",
    icon: <GavelRounded fontSize="small" />,
    requiredRole: null,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: <GroupRounded fontSize="small" />,
    requiredRole: "ADMIN",
  },
];

export const ADMIN_OTHER_LINKS = [
  {
    label: "Account",
    href: "/admin/account",
    icon: <ManageAccountsRounded fontSize="small" />,
  },
];

export const ADMIN_ROLES = {
  CAPTAIN: "Chairperson",
  KAGAWAD: "Kagawad",
  SK_CHAIR: "SK Chair",
  SECRETARY: "Secretary",
  CLERK: "Clerk",
};

export const ROLE_COLORS = {
  CAPTAIN: "bg-blue-100 text-blue-700",
  KAGAWAD: "bg-green-100 text-green-700",
  SK_CHAIR: "bg-purple-100 text-purple-700",
  SECRETARY: "bg-yellow-100 text-yellow-800",
  CLERK: "bg-red-100 text-red-700",
  DEFAULT: "bg-gray-100 text-gray-600",
};

export const ROLE_TEXT_COLORS = {
  CAPTAIN: "text-blue-600",
  KAGAWAD: "text-green-600",
  SK_CHAIR: "text-purple-600",
  SECRETARY: "text-yellow-700",
  CLERK: "text-red-600",
  DEFAULT: "text-gray-500",
};

export const AVATAR_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500",
  "bg-emerald-500",
];

export const DEFAULT_FALLBACK_COLOR = "bg-gray-400";
