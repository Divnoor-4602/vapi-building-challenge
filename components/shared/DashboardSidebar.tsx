"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { doctorNavigationItems, userNavigationItems, adminNavigationItems } from "@/constants";

type SidebarProps = React.ComponentProps<typeof Sidebar> & {
  type?: "user" | "doctor" | "admin";
};

export function DashboardSidebar({ type, ...props }: SidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props} variant="inset">
      {/* Header Section: Brand identity and logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex">
                  <div className="flex flex-col items-start">
                    {/* Primary brand name */}
                    <div className="truncate font-heading text-sm font-semibold">
                      Nightingale
                    </div>
                    {/* Secondary subtitle */}
                    <div className="truncate font-heading text-xs text-muted-foreground">
                      Vapi Building Challenge
                    </div>
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Content: Navigation menu */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {(type === "user"
                ? userNavigationItems
                : type === "doctor"
                ? doctorNavigationItems
                : adminNavigationItems
              ).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      {/* Navigation icon - proper size for visibility */}
                      <item.icon className="h-4 w-4" />
                      {/* Navigation label */}
                      <span className="truncate font-body text-sm font-medium">
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

      {/* Sidebar rail for visual consistency */}
      <SidebarRail />
    </Sidebar>
  );
}
