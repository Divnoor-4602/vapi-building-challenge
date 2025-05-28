import {
  Home,
  Calendar,
  BarChart3,
  User,
  Settings,
  HelpCircle,
  HeartPlus,
  Clock,
} from "lucide-react";

export const userNavigationItems = [
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

export const doctorNavigationItems = [
  {
    title: "Profile",
    url: "/doctor-dashboard",
    icon: User,
  },
  {
    title: "Patients",
    url: "/doctor-dashboard/patients",
    icon: HeartPlus,
  },
  {
    title: "Appointments",
    url: "/doctor-dashboard/appointments",
    icon: Clock,
  },
  {
    title: "Calendar",
    url: "/doctor-dashboard/calendar",
    icon: Calendar,
  },
  {
    title: "Reports",
    url: "/doctor-dashboard/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    url: "/doctor-dashboard/settings",
    icon: Settings,
  },
];
