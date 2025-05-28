"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { doctorNavigationItems, userNavigationItems } from "@/constants";

type SidebarProps = React.ComponentProps<typeof Sidebar> & {
  type?: "user" | "doctor";
};

export function DashboardSidebar({ type, ...props }: SidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props} variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size={"lg"} asChild>
              <Link href={"/"}>
                <div className="flex">
                  {/* logo */}
                  <div className="flex items-start flex-col">
                    <div className="text-sm font-heading truncate font-semibold">
                      Nightingale
                    </div>
                    <div className="text-xs font-heading truncate">
                      Vapi Building Challenge
                    </div>
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {/* Sidebar content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {(type === "user"
                ? userNavigationItems
                : doctorNavigationItems
              ).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-2 w-2" />
                      <span className="text-xs font-body truncate font-medium">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground">
          Hospital Voice Agent v1.0
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
