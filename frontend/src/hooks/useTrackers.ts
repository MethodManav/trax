import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  mockTrackers,
  mockAlerts,
  Tracker,
  Alert,
  Category,
} from "@/lib/mockData";

// Simulated delay for async operations
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Initialize mock data
const getInitialTrackers = (): Tracker[] => {
  return mockTrackers;
};

const getInitialAlerts = (): Alert[] => {
  return mockAlerts;
};

// Fetch all trackers
export const useTrackers = () => {
  return useQuery({
    queryKey: ["trackers"],
    queryFn: async () => {
      await delay(500);
      return getInitialTrackers();
    },
  });
};

// Fetch trackers by category
export const useTrackersByCategory = (category: Category) => {
  return useQuery({
    queryKey: ["trackers", category],
    queryFn: async () => {
      await delay(400);
      const trackers = getInitialTrackers();
      return trackers.filter((t) => t.category === category);
    },
  });
};

// Fetch single tracker
export const useTracker = (id: string) => {
  return useQuery({
    queryKey: ["tracker", id],
    queryFn: async () => {
      await delay(300);
      const trackers = getInitialTrackers();
      return trackers.find((t) => t.id === id);
    },
  });
};

// Add new tracker
export const useAddTracker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      newTracker: Omit<
        Tracker,
        "id" | "priceHistory" | "lastChecked" | "createdAt" | "status"
      >
    ) => {
      await delay(800);

      const tracker: Tracker = {
        ...newTracker,
        id: Date.now().toString(),
        status: "waiting",
        lastChecked: new Date(),
        createdAt: new Date(),
        priceHistory: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          price: newTracker.currentPrice,
        })),
      };

      return tracker;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trackers"] });
    },
  });
};

// Delete tracker
export const useDeleteTracker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await delay(400);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trackers"] });
    },
  });
};

// Fetch alerts
export const useAlerts = () => {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const token = localStorage.getItem("x-auth-token");
      if (!token) {
        // Return empty array if not authenticated
        return [];
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/notifications`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          }
        );

        if (!response.ok) {
          // Fallback to mock data if API fails
          return getInitialAlerts();
        }

        const data = await response.json();

        // Map backend notifications to frontend Alert format
        if (data.notifications && Array.isArray(data.notifications)) {
          return data.notifications.map((notification) => {
            // Try to infer category from message
            let category: Category = "mobiles";
            const message = notification.message?.toLowerCase() || "";
            if (message.includes("flight") || message.includes("✈️")) {
              category = "flights";
            } else if (message.includes("clothing") || message.includes("👕")) {
              category = "clothing";
            }

            // Try to extract price change percentage from message
            let priceChange = 0;
            const priceMatch = message.match(
              /(?:dropped|decreased|down|fell)\s*(?:by\s*)?(\d+(?:\.\d+)?)%/i
            );
            if (priceMatch) {
              priceChange = parseFloat(priceMatch[1]) || 0;
            }

            return {
              id:
                notification._id ||
                notification.id ||
                String(Date.now() + Math.random()),
              trackerId: notification.triggerId || notification.trackerId || "",
              category: category,
              message: notification.message || "Price alert",
              priceChange: priceChange,
              timestamp: notification.createdAt
                ? new Date(notification.createdAt)
                : new Date(),
              isNew: !notification.read, // isNew is the inverse of read
            };
          });
        }

        return [];
      } catch (error) {
        console.error("Error fetching alerts:", error);
        // Fallback to mock data on error
        return getInitialAlerts();
      }
    },
  });
};

// Mark alert as read
export const useMarkAlertRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("x-auth-token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/notifications/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to mark notification as read");
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
};

// Fetch tracked mobile triggers
export const useTrackedMobileTriggers = () => {
  return useQuery({
    queryKey: ["tracked-mobile-triggers"],
    queryFn: async () => {
      const token = localStorage.getItem("x-auth-token");
      if (!token) {
        // Return empty array if not authenticated
        return [];
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/triggers/mobile/tracked`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          }
        );

        if (!response.ok) {
          // Fallback to mock data if API fails
          const trackers = getInitialTrackers();
          return trackers.filter((t) => t.category === "mobiles");
        }

        const data = await response.json();

        // Map backend triggers to frontend Tracker format
        if (data.triggers && Array.isArray(data.triggers)) {
          return data.triggers.map((trigger) => {
            const config = trigger.config || {};
            const lastFetchedPrice = trigger.lastFetchedPrice || {};

            // Extract price information
            const currentPrice =
              lastFetchedPrice.price || trigger.expectedPrice || 0;
            const targetPrice = trigger.expectedPrice || 0;
            const originalPrice =
              lastFetchedPrice.originalPrice || currentPrice;

            // Determine status based on price comparison
            let status: "dropped" | "waiting" | "alert" = "waiting";
            if (currentPrice <= targetPrice && currentPrice < originalPrice) {
              status = "dropped";
            } else if (currentPrice <= targetPrice) {
              status = "alert";
            }

            // Build name from config
            const brandName = config.brandName || "";
            const modelName = config.modelName || "";
            const ram = config.ram || "";
            const rom = config.rom || "";
            const name =
              [brandName, modelName, ram, rom].filter(Boolean).join(" ") ||
              "Mobile Tracker";

            return {
              id:
                trigger._id || trigger.id || String(Date.now() + Math.random()),
              category: "mobiles" as Category,
              name: name,
              currentPrice: currentPrice,
              targetPrice: targetPrice,
              originalPrice: originalPrice,
              lastChecked: trigger.nextCheck
                ? new Date(trigger.nextCheck)
                : new Date(),
              status: status,
              priceHistory: [], // Can be populated if needed
              createdAt: trigger.createdAt
                ? new Date(trigger.createdAt)
                : new Date(),
            };
          });
        }

        return [];
      } catch (error) {
        console.error("Error fetching tracked mobile triggers:", error);
        // Fallback to mock data on error
        const trackers = getInitialTrackers();
        return trackers.filter((t) => t.category === "mobiles");
      }
    },
  });
};

// Dashboard stats
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const token = localStorage.getItem("x-auth-token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/dashboard/triggers`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch dashboard stats");
      }

      const data = await response.json();

      return {
        totalTracked: data.totalTrigger || 0,
        activeAlerts: data.inactiveTrigger || 0,
        biggestDrop: data.totalTrigger || 0,
      };
    },
  });
};
