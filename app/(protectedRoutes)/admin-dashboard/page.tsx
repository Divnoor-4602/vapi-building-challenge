"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  HeartPlus, 
  Bot, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
  Plus
} from "lucide-react";

const AdminDashboard = () => {
  // Mock data for demonstration
  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Active Doctors",
      value: "156",
      change: "+3.2%",
      trend: "up",
      icon: HeartPlus,
    },
    {
      title: "AI Agents",
      value: "24",
      change: "+8.1%",
      trend: "up",
      icon: Bot,
    },
    {
      title: "System Health",
      value: "99.8%",
      change: "-0.1%",
      trend: "down",
      icon: Activity,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      user: "Dr. Sarah Johnson",
      action: "Created new patient record",
      time: "2 minutes ago",
      status: "success",
    },
    {
      id: 2,
      user: "John Doe",
      action: "Scheduled appointment",
      time: "5 minutes ago",
      status: "success",
    },
    {
      id: 3,
      user: "AI Agent #12",
      action: "Processed 15 patient queries",
      time: "10 minutes ago",
      status: "info",
    },
    {
      id: 4,
      user: "System",
      action: "Database backup completed",
      time: "1 hour ago",
      status: "success",
    },
    {
      id: 5,
      user: "Dr. Michael Chen",
      action: "Updated treatment protocol",
      time: "2 hours ago",
      status: "warning",
    },
  ];

  const systemAlerts = [
    {
      id: 1,
      type: "warning",
      message: "High API usage detected",
      time: "5 minutes ago",
    },
    {
      id: 2,
      type: "info",
      message: "Scheduled maintenance in 2 hours",
      time: "1 hour ago",
    },
    {
      id: 3,
      type: "success",
      message: "Security scan completed successfully",
      time: "3 hours ago",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-col gap-4 sm:flex-row">
        <div>
          <h1 className="text-4xl font-extrabold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your platform today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="border-gray-200">
            <BarChart3 className="mr-2 h-4 w-4" />
            View Reports
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Quick Action
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
              <div className="p-2 rounded-lg bg-gray-50">
                <stat.icon className="h-4 w-4 text-gray-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center text-xs text-gray-600 mt-1">
                {stat.trend === "up" ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                  {stat.change}
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg font-bold text-gray-900 font-heading">
                Recent Activity
              </CardTitle>
            </div>
            <CardDescription className="text-sm text-gray-600">
              Latest actions and events across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-white text-gray-600">
                      {activity.user.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.user}
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.action}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="secondary"
                      className={
                        activity.status === "success" 
                          ? "bg-green-100 text-green-800 hover:bg-green-200" 
                          : activity.status === "warning" 
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" 
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      }
                    >
                      {activity.status}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-lg font-bold text-gray-900 font-heading">
                System Alerts
              </CardTitle>
            </div>
            <CardDescription className="text-sm text-gray-600">
              Important notifications and warnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100">
                  {alert.type === "warning" && (
                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                  )}
                  {alert.type === "info" && (
                    <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
                  )}
                  {alert.type === "success" && (
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-gray-600" />
            <CardTitle className="text-lg font-bold text-gray-900 font-heading">
              Quick Actions
            </CardTitle>
          </div>
          <CardDescription className="text-sm text-gray-600">
            Common administrative tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button 
              variant="outline" 
              className="h-16 flex-col space-y-2 border-0 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 shadow-none"
            >
              <Users className="h-5 w-5" />
              <span className="text-sm">Manage Users</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col space-y-2 border-0 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 shadow-none"
            >
              <HeartPlus className="h-5 w-5" />
              <span className="text-sm">Add Doctor</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col space-y-2 border-0 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 shadow-none"
            >
              <Bot className="h-5 w-5" />
              <span className="text-sm">Configure AI</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col space-y-2 border-0 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 shadow-none"
            >
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm">View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;