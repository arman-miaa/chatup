/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import placeholder from "@/src/assets/placeholders/image_placeholder.png";
import { ChevronsUpDown, LogOut } from "lucide-react";

import { useGetMeQuery } from "@/redux/api/authApi";
import { logout } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export function NavUser() {
  const { isMobile } = useSidebar();
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();

  const { data, error, isLoading } = useGetMeQuery({ skip: !token }) as any;

  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    dispatch(logout());
    router.push("/login?redirect=" + pathname);
  };

  // Loading state
  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">...</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Loading...</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Error state
  if (error) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">!</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold text-red-500">Error</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={data?.image || placeholder}
                  alt={data?.firstName ?? "User"}
                  className="h-8 w-8 object-cover rounded-lg"
                />
                <AvatarFallback className="rounded-lg">
                  <Image
                    src={data?.image || placeholder}
                    alt={data?.firstName ?? "User"}
                    width={60}
                    height={60}
                    className="h-8 w-8 object-cover rounded-lg"
                  />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {data?.firstName || "User"}
                </span>
                <span className="truncate text-xs">
                  {data?.email || "No email"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={data?.image || placeholder.src}
                    alt={data?.firstName ?? "User"}
                    className="h-8 w-8 object-cover rounded-lg"
                  />
                  <AvatarFallback className="rounded-lg">
                    <Image
                      src={data?.image || placeholder}
                      alt={data?.firstName ?? "User"}
                      width={60}
                      height={60}
                      className="h-8 w-8 object-cover rounded-lg"
                    />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {data?.firstName || "User"}
                  </span>
                  <span className="truncate text-xs">
                    {data?.email || "No email"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
