import { motion } from "framer-motion";
import { useDashboardStats, useAlerts, useTrackers } from "@/hooks/useTrackers";
import { AnimatedGlassCard } from "@/components/ui/glass-card";
import { StatSkeleton, CardSkeleton } from "@/components/ui/skeleton-loaders";
import { MiniChart } from "@/components/ui/mini-chart";
import { Package, Bell, TrendingDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { categoryConfig } from "@/lib/mockData";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: alerts, isLoading: alertsLoading } = useAlerts();
  const { data: trackers, isLoading: trackersLoading } = useTrackers();

  const recentAlerts = alerts?.filter(a => a.isNew).slice(0, 3) || [];
  const recentTrackers = trackers?.slice(0, 4) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-foreground mb-2"
        >
          Dashboard
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Overview of your price tracking activity
        </motion.p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsLoading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <AnimatedGlassCard delay={0.1} hover>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Tracked</p>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="text-4xl font-bold text-foreground"
                  >
                    {stats?.totalTracked}
                  </motion.p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
              </div>
            </AnimatedGlassCard>

            <AnimatedGlassCard delay={0.2} hover>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active Alerts</p>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="text-4xl font-bold text-foreground"
                  >
                    {stats?.activeAlerts}
                  </motion.p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-destructive" />
                </div>
              </div>
            </AnimatedGlassCard>

            <AnimatedGlassCard delay={0.3} hover>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Biggest Drop</p>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="text-4xl font-bold text-success"
                  >
                    {stats?.biggestDrop}%
                  </motion.p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-success" />
                </div>
              </div>
            </AnimatedGlassCard>
          </>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Alerts */}
        <AnimatedGlassCard delay={0.4}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Recent Alerts</h2>
            <Link 
              to="/alerts" 
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {alertsLoading ? (
            <div className="space-y-4">
              <CardSkeleton />
            </div>
          ) : recentAlerts.length > 0 ? (
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-4 p-4 rounded-xl bg-background/50 hover:bg-background/80 transition-colors"
                >
                  <div className="text-2xl">
                    {categoryConfig[alert.category].icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {alert.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                  {alert.isNew && (
                    <span className="px-2 py-1 text-xs font-medium bg-destructive/10 text-destructive rounded-full">
                      New
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No recent alerts
            </p>
          )}
        </AnimatedGlassCard>

        {/* Recent Trackers */}
        <AnimatedGlassCard delay={0.5}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Recent Trackers</h2>
          </div>
          
          {trackersLoading ? (
            <div className="space-y-4">
              <CardSkeleton />
            </div>
          ) : recentTrackers.length > 0 ? (
            <div className="space-y-4">
              {recentTrackers.map((tracker) => (
                <div
                  key={tracker.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-background/50 hover:bg-background/80 transition-colors"
                >
                  <div className="text-2xl">
                    {categoryConfig[tracker.category].icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {tracker.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${tracker.currentPrice}
                    </p>
                  </div>
                  <div className="w-20">
                    <MiniChart 
                      data={tracker.priceHistory.slice(-7)} 
                      color={categoryConfig[tracker.category].color as "mobile" | "clothing" | "flights"}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No trackers yet
            </p>
          )}
        </AnimatedGlassCard>
      </div>
    </div>
  );
}
