"use client";

import AppSidebar from "@/components/shared/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { useAppSelector } from "@/redux/hooks";
import { useDecodedToken } from "@/src/hooks/useDecodedToken";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useAppSelector((state) => state.auth.token);
  const decodedToken = useDecodedToken(token);
  const role = decodedToken?.role || "ADMIN";

  return (
    <SidebarProvider>
      {/* Pass the user role dynamically to AppSidebar */}
      <AppSidebar role={role} />
      <SidebarInset>
        <header className="flex h-16 b shrink-0  items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="p-4 pt-0 bg-[#F1F5F9] min-h-screen">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
