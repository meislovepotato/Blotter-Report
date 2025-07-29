"use client";

import {
  BlottersOverview,
  ComplaintsOverview,
  DashboardStats,
  LiveActivityFeed,
  PendingAdmins,
  WeeklyStatsChart,
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
      <DashboardStats />
      <div className="row-span-6 col-span-4 p-4 rounded-2xl z-50 bg-background">
        {isViewable ? <PendingAdmins isCompact={true} /> : <LiveActivityFeed />}
      </div>
      <div className="row-span-4 col-span-6 p-4 rounded-2xl bg-background">
        <WeeklyStatsChart />
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
