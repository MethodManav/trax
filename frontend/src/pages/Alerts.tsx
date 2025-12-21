import { motion } from "framer-motion";
import { useAlerts, useMarkAlertRead } from "@/hooks/useTrackers";
import { GlassCard, AnimatedGlassCard } from "@/components/ui/glass-card";
import { TableSkeleton } from "@/components/ui/skeleton-loaders";
import { categoryConfig } from "@/lib/mockData";
import { formatDistanceToNow, format } from "date-fns";
import { Bell, TrendingDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AlertsPage() {
  const { data: alerts, isLoading } = useAlerts();
  const markRead = useMarkAlertRead();

  const newAlerts = alerts?.filter((a) => a.isNew) || [];
  const pastAlerts = alerts?.filter((a) => !a.isNew) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-2"
        >
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Alerts</h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Price drop notifications and updates
        </motion.p>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : (
        <>
          {/* New Alerts */}
          {newAlerts.length > 0 && (
            <div className="space-y-4">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-semibold text-foreground flex items-center gap-2"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
                </span>
                New Alerts ({newAlerts.length})
              </motion.h2>

              <div className="space-y-3">
                {newAlerts.map((alert, i) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <GlassCard className="p-5 border-l-4 border-destructive">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">
                          {categoryConfig[alert.category].icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold text-foreground">
                                {alert.message}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {formatDistanceToNow(alert.timestamp, {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markRead.mutate(alert.id)}
                                className="text-muted-foreground hover:text-primary"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Mark read
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          {pastAlerts.length > 0 && (
            <div className="space-y-4">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-semibold text-foreground"
              >
                Past Alerts
              </motion.h2>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

                <div className="space-y-6">
                  {pastAlerts.map((alert, i) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="relative pl-16"
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-4 w-5 h-5 rounded-full bg-background border-2 border-border flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                      </div>

                      <GlassCard variant="subtle" className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">
                            {categoryConfig[alert.category].icon}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {alert.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(
                                alert.timestamp,
                                "MMM d, yyyy 'at' h:mm a"
                              )}
                            </p>
                          </div>
                          {/* <span className="text-sm text-success font-medium">
                            {alert.priceChange}%
                          </span> */}
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {alerts?.length === 0 && (
            <GlassCard className="py-16 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No alerts yet
              </h3>
              <p className="text-muted-foreground">
                You'll see price drop notifications here
              </p>
            </GlassCard>
          )}
        </>
      )}
    </div>
  );
}
