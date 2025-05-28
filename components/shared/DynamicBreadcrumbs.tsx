"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

// Map of path segments to display names
const pathDisplayNames: Record<string, string> = {
  "user-dashboard": "Dashboard",
  appointments: "Appointments",
  reports: "Reports",
  profile: "Profile",
  settings: "Settings",
  support: "Support",
};

export function DynamicBreadcrumbs() {
  const pathname = usePathname();

  // Split pathname and filter out empty segments
  const pathSegments = pathname.split("/").filter(Boolean);

  // Remove 'user-dashboard' from segments if it exists (since it's the base)
  const filteredSegments = pathSegments.filter(
    (segment) => segment !== "user-dashboard"
  );

  // Always start with Dashboard as the base
  const breadcrumbItems = [
    {
      label: "Dashboard",
      href: "/user-dashboard",
      isLast: filteredSegments.length === 0,
    },
  ];

  // Add remaining segments
  filteredSegments.forEach((segment, index) => {
    const isLast = index === filteredSegments.length - 1;
    const href = `/user-dashboard/${filteredSegments.slice(0, index + 1).join("/")}`;
    const label =
      pathDisplayNames[segment] ||
      segment.charAt(0).toUpperCase() + segment.slice(1);

    breadcrumbItems.push({
      label,
      href,
      isLast,
    });
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <div key={item.href} className="flex items-center">
            {index > 0 && <BreadcrumbSeparator className="mx-2" />}
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
