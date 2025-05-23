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
import { navigationItems } from "@/constants";

/**
 * UserDashboardSidebar Component
 *
 * A collapsible sidebar for the user dashboard that provides navigation
 * and branding. Features include:
 * - Icon-collapsible design for space efficiency
 * - Active state highlighting based on current route
 * - Brand header with application identity
 * - Organized navigation menu from constants
 * - Footer with version information
 */
export function UserDashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  // Get current pathname to determine active navigation item
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
              {/* Map through navigation items from constants */}
              {navigationItems.map((item) => (
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
