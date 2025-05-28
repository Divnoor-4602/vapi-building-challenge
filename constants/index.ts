import {
  Home,
  Calendar,
  BarChart3,
  User,
  Settings,
  HelpCircle,
  HeartPlus,
  Clock,
  Users,
  Shield,
  Database,
  Activity,
  Bot,
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

export const adminNavigationItems = [
  {
    title: "Dashboard",
    url: "/admin-dashboard",
    icon: Home,
  },
  {
    title: "Users",
    url: "/admin-dashboard/users",
    icon: Users,
  },
  {
    title: "Doctors",
    url: "/admin-dashboard/doctors",
    icon: HeartPlus,
  },
  {
    title: "AI Agents",
    url: "/admin-dashboard/ai-agents",
    icon: Bot,
  },
  {
    title: "Analytics",
    url: "/admin-dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "System Health",
    url: "/admin-dashboard/system-health",
    icon: Activity,
  },
  {
    title: "Database",
    url: "/admin-dashboard/database",
    icon: Database,
  },
  {
    title: "Security",
    url: "/admin-dashboard/security",
    icon: Shield,
  },
  {
    title: "Settings",
    url: "/admin-dashboard/settings",
    icon: Settings,
  },
];
