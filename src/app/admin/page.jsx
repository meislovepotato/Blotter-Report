import { AdminHomeView } from "@/components";
import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard",
};

const AdminHome = () => {
  return (
    <>
      <AdminHomeView />
      <div className="mt-6">
        <Link href="/admin/fake-sms" className="text-blue-600 underline">
          View Fake SMS Inbox
        </Link>
      </div>
    </>
  );
};

export default AdminHome;
