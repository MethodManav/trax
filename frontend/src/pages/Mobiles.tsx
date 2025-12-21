import { useState } from "react";
import { motion } from "framer-motion";
import { useTrackedMobileTriggers } from "@/hooks/useTrackers";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/skeleton-loaders";
import { AddTrackerModal } from "@/components/AddTrackerModal";
import { Plus, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function MobilesPage() {
  const { data: trackers, isLoading } = useTrackedMobileTriggers();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <span className="text-3xl">📱</span>
            <h1 className="text-3xl font-bold text-foreground">Mobiles</h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            {trackers?.length || 0} items being tracked
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button variant="hero" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Add New Tracker
          </Button>
        </motion.div>
      </div>

      {/* Trackers List */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : trackers && trackers.length > 0 ? (
        <div className="space-y-4">
          {trackers.map((tracker, i) => (
            <motion.div
              key={tracker.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard hover className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {tracker.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(tracker.lastChecked, {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price Info */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Current</p>
                      <p className="text-xl font-bold text-foreground">
                        ${tracker.currentPrice}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Target</p>
                      <p className="text-lg font-semibold text-primary">
                        ${tracker.targetPrice}
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      ) : (
        <GlassCard className="py-16 text-center">
          <span className="text-4xl mb-4 block">📱</span>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No trackers yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Start tracking mobile prices to get alerts
          </p>
          <Button variant="soft" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Add your first tracker
          </Button>
        </GlassCard>
      )}

      <AddTrackerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultCategory="mobiles"
      />
    </div>
  );
}
