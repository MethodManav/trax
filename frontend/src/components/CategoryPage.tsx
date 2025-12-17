import { useState } from "react";
import { motion } from "framer-motion";
import { useTrackersByCategory, useDeleteTracker } from "@/hooks/useTrackers";
import { Category, categoryConfig } from "@/lib/mockData";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/skeleton-loaders";
import { MiniChart } from "@/components/ui/mini-chart";
import { AddTrackerModal } from "@/components/AddTrackerModal";
import { Plus, TrendingDown, Clock, Trash2, ExternalLink, Filter } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CategoryPageProps {
  category: Category;
}

export function CategoryPage({ category }: CategoryPageProps) {
  const { data: trackers, isLoading } = useTrackersByCategory(category);
  const deleteTracker = useDeleteTracker();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState<"all" | "dropped" | "waiting">("all");
  
  const config = categoryConfig[category];
  
  const filteredTrackers = trackers?.filter(t => {
    if (priceFilter === "all") return true;
    return t.status === priceFilter;
  }) || [];

  const statusColors = {
    dropped: "bg-success-light text-success",
    waiting: "bg-warning-light text-warning",
    alert: "bg-destructive/10 text-destructive",
  };

  const statusIcons = {
    dropped: "⬇️",
    waiting: "⏳",
    alert: "🔔",
  };

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
            <span className="text-3xl">{config.icon}</span>
            <h1 className="text-3xl font-bold text-foreground">{config.label}</h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            {filteredTrackers.length} items being tracked
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

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span>Status:</span>
            </div>
            <div className="flex gap-2">
              {(["all", "dropped", "waiting"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setPriceFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    priceFilter === filter
                      ? "bg-primary text-primary-foreground"
                      : "bg-background/50 text-muted-foreground hover:bg-background"
                  }`}
                >
                  {filter === "all" ? "All" : filter === "dropped" ? "⬇️ Dropped" : "⏳ Waiting"}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Trackers List */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : filteredTrackers.length > 0 ? (
        <div className="space-y-4">
          {filteredTrackers.map((tracker, i) => (
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
                        {tracker.route && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {tracker.route}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(tracker.lastChecked, { addSuffix: true })}
                          </span>
                          {tracker.url && (
                            <a 
                              href={tracker.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 hover:text-primary transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View
                            </a>
                          )}
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

                  {/* Chart */}
                  <div className="w-32">
                    <MiniChart 
                      data={tracker.priceHistory.slice(-7)} 
                      color={config.color as "mobile" | "clothing" | "flights"}
                    />
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${statusColors[tracker.status]}`}>
                      {statusIcons[tracker.status]} {tracker.status}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTracker.mutate(tracker.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      ) : (
        <GlassCard className="py-16 text-center">
          <span className="text-4xl mb-4 block">{config.icon}</span>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No trackers yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Start tracking {config.label.toLowerCase()} prices to get alerts
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
        defaultCategory={category}
      />
    </div>
  );
}
