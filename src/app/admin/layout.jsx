import "@/app/global.css";
import Image from "next/image";
import background from "@/assets/img/background.jpg";
import { DashboardHeader, DashboardSidebar, LogOutButton } from "@/components";
import { verifyToken } from "@/lib";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminClientWrapper } from "@/components/wrappers";
import { FakeSMSProvider } from "@/context/FakeSMSContext";

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;

  if (!token) redirect("/");

  let user;
  try {
    user = await verifyToken(token);
  } catch (err) {
    return redirect("/");
  }

  if (!user) redirect("/");

  return (
    <>
      {/* Desktop layout */}
      <div className="grid-cols-12 gap-5 h-screen px-18 2xl:px-25 hidden sm:grid">
        {/* Background */}
        <div className="absolute inset-0 -z-10 select-none pointer-events-none">
          <Image
            src={background}
            alt="Background"
            fill
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-10% via-background via-70% to-background to-90%" />
        </div>
        <DashboardSidebar role={user.dashboardRole} />
        <div className="flex flex-col h-screen col-span-10 py-4 gap-2">
          <DashboardHeader name={user.name} role={user.hierarchyRole} />
          <main className="box-border h-full relative">
            <AdminClientWrapper user={user}>{children}</AdminClientWrapper>
          </main>
        </div>
      </div>

      <FakeSMSProvider>
        <div className="grid-cols-12 gap-5 h-screen px-18 2xl:px-25 hidden sm:grid">
          {/* Background */}
          <div className="absolute inset-0 -z-10 select-none pointer-events-none">
            <Image
              src={background}
              alt="Background"
              fill
              className="object-cover object-top"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent from-10% via-background via-70% to-background to-90%" />
          </div>
          <DashboardSidebar role={user.dashboardRole} />
          <div className="flex flex-col h-screen col-span-10 py-4 gap-2">
            <DashboardHeader name={user.name} role={user.hierarchyRole} />
            <main className="box-border h-full relative">
              {/* Client-side wrapper with role checks */}
              <AdminClientWrapper user={user}>{children}</AdminClientWrapper>
            </main>
          </div>
        </div>
      </FakeSMSProvider>
      
      {/* Mobile fallback */}
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 sm:hidden">
        <h2 className="text-xl font-bold">Dashboard not available on mobile</h2>
        <p className="text-sm text-gray-500 mt-2">
          Please use a tablet or desktop for full access.
        </p>
        <LogOutButton />
      </div>
    </>
  );
}
