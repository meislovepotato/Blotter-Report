"use client";

import {
  BlottersOverview,
  ComplaintsOverview,
  LiveActivityFeed,
  PendingAdmins,
} from "@/components";
import { useUser } from "@/context";

export const metadata = {
  title: "Admin Dashboard",
};

const AdminHomeView = () => {
  const user = useUser();
  const isViewable = user?.dashboardRole === "ADMIN";

  return (
    <div className="flex-1 w-full h-full grid grid-cols-10 grid-rows-16 gap-x-5 gap-y-4 *:shadow-2xl *:shadow-text/10">
      <div className="row-span-3 col-span-2 p-4 rounded-2xl bg-background">
        <h3 className="text-xs text-text font-semibold">Pending Complaints</h3>
      </div>
      <div className="row-span-3 col-span-2 p-4 rounded-2xl bg-background">
        <h3 className="text-xs text-text font-semibold">Resolved Cases</h3>
      </div>
      <div className="row-span-3 col-span-2 p-4 rounded-2xl bg-background">
        <h3 className="text-xs text-text font-semibold">Flagged Reports</h3>
      </div>
      <div className="row-span-6 col-span-4 p-4 rounded-2xl z-50 bg-background">
        {isViewable ? <PendingAdmins isCompact={true} /> : <LiveActivityFeed />}
      </div>
      <div className="row-span-3 col-span-6 p-4 rounded-2xl bg-background">
        <h3 className="text-xs text-text font-semibold">Weekly Reports</h3>
      </div>
      <div className="row-span-5 col-span-10 p-4 rounded-2xl bg-background">
        <ComplaintsOverview isCompact={true} />
      </div>
      <div className="row-span-5 col-span-10 p-4 rounded-2xl bg-background">
        <BlottersOverview
          isCompact={true}
          isViewable={isViewable}
          dashboardRole={user?.dashboardRole}
        />
      </div>
    </div>
  );
};

export default AdminHomeView;
