"use client";

import { ComplaintsOverview } from "@/components";
import { useUser } from "@/context";

const FullComplaints = () => {
  const user = useUser();
  return (
    <div className="h-full p-4 rounded-2xl bg-background shadow-2xl shadow-text/10">
      <ComplaintsOverview
        isCompact={false}
        dashboardRole={user?.dashboardRole}
      />
    </div>
  );
};

export default FullComplaints;
