"use client";

import { BlottersOverview } from "@/components";
import { useUser } from "@/context";

const FullBlottersView = () => {
  const user = useUser();
  return (
    <div className="h-full p-4 rounded-2xl bg-background shadow-2xl shadow-text/10">
      <BlottersOverview isCompact={false} dashboardRole={user?.dashboardRole} />
    </div>
  );
};

export default FullBlottersView;
