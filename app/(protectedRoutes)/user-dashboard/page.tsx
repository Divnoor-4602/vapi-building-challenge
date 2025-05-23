import React from "react";

const Home = () => {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Dashboard Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage your hospital voice agents
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Active Agents</h3>
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </div>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">+2 from last hour</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Calls</h3>
            <div className="h-4 w-4 rounded bg-blue-500" />
          </div>
          <div className="text-2xl font-bold">1,247</div>
          <p className="text-xs text-muted-foreground">+18% from last week</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Avg Response Time</h3>
            <div className="h-4 w-4 rounded bg-yellow-500" />
          </div>
          <div className="text-2xl font-bold">2.3s</div>
          <p className="text-xs text-muted-foreground">-0.2s from yesterday</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Success Rate</h3>
            <div className="h-4 w-4 rounded bg-green-500" />
          </div>
          <div className="text-2xl font-bold">97.2%</div>
          <p className="text-xs text-muted-foreground">+1.2% from last week</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Patient inquiry processed</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Appointment scheduled</p>
                <p className="text-xs text-muted-foreground">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Emergency triage completed
                </p>
                <p className="text-xs text-muted-foreground">8 minutes ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid gap-3">
            <button className="flex items-center gap-3 p-3 text-left border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="h-8 w-8 rounded bg-blue-500/10 flex items-center justify-center">
                <span className="text-blue-500 text-sm">📞</span>
              </div>
              <div>
                <p className="text-sm font-medium">Create New Agent</p>
                <p className="text-xs text-muted-foreground">
                  Set up a new voice agent
                </p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-3 text-left border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="h-8 w-8 rounded bg-green-500/10 flex items-center justify-center">
                <span className="text-green-500 text-sm">⚙️</span>
              </div>
              <div>
                <p className="text-sm font-medium">Agent Settings</p>
                <p className="text-xs text-muted-foreground">
                  Configure existing agents
                </p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-3 text-left border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="h-8 w-8 rounded bg-purple-500/10 flex items-center justify-center">
                <span className="text-purple-500 text-sm">📊</span>
              </div>
              <div>
                <p className="text-sm font-medium">View Analytics</p>
                <p className="text-xs text-muted-foreground">
                  Detailed performance metrics
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="text-lg font-semibold mb-4">System Status</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-sm">API Services</span>
            <span className="text-xs text-muted-foreground ml-auto">
              Operational
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-sm">Voice Processing</span>
            <span className="text-xs text-muted-foreground ml-auto">
              Operational
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="text-sm">Database</span>
            <span className="text-xs text-muted-foreground ml-auto">
              Degraded
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
