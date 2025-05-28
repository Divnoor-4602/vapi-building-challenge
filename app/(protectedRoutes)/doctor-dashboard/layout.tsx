import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/shared/DashboardSidebar";
import { cookies } from "next/headers";
import { Separator } from "@radix-ui/react-separator";
import { DynamicBreadcrumbs } from "@/components/shared/DynamicBreadcrumbs";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <DashboardSidebar type="doctor" />
      <SidebarInset className="bg-white">
        <main className="w-full rounded-xl">
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DynamicBreadcrumbs />
            </div>
          </header>
        </main>
        {/* <SidebarTrigger /> */}
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
