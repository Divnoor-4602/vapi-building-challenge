import {
  Home,
  Calendar,
  BarChart3,
  User,
  Settings,
  HelpCircle,
} from "lucide-react";

export const navigationItems = [
  {
    title: "Home",
    url: "/user-dashboard",
    icon: Home,
  },
  {
    title: "Appointments",
    url: "/user-dashboard/appointments",
    icon: Calendar,
  },
  {
    title: "Reports",
    url: "/user-dashboard/reports",
    icon: BarChart3,
  },
  {
    title: "Profile",
    url: "/user-dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/user-dashboard/settings",
    icon: Settings,
  },
  {
    title: "Support",
    url: "/user-dashboard/support",
    icon: HelpCircle,
  },
];
