import {
  Home,
  Calendar,
  User,
  Settings,
  HeartPlus,
  Ticket,
  Activity,
  FileText,
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
    title: "Tickets",
    url: "/user-dashboard/tickets",
    icon: Ticket,
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
];

export const doctorNavigationItems = [
  {
    title: "Home",
    url: "/doctor-dashboard",
    icon: Home,
  },
  {
    title: "Live Ticket Review",
    url: "/doctor-dashboard/live-tickets",
    icon: Activity,
  },
  {
    title: "All Tickets",
    url: "/doctor-dashboard/tickets",
    icon: FileText,
  },
  {
    title: "Patients",
    url: "/doctor-dashboard/patients",
    icon: HeartPlus,
  },
  {
    title: "Profile",
    url: "/doctor-dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/doctor-dashboard/settings",
    icon: Settings,
  },
];
