import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockTrackers, mockAlerts, Tracker, Alert, Category } from '@/lib/mockData';

// Simulated delay for async operations
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Local storage key
const TRACKERS_KEY = 'price-tracker-items';
const ALERTS_KEY = 'price-tracker-alerts';

// Initialize from localStorage or use mock data
const getInitialTrackers = (): Tracker[] => {
  if (typeof window === 'undefined') return mockTrackers;
  const stored = localStorage.getItem(TRACKERS_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    return parsed.map((t: Tracker) => ({
      ...t,
      lastChecked: new Date(t.lastChecked),
      createdAt: new Date(t.createdAt),
    }));
  }
  localStorage.setItem(TRACKERS_KEY, JSON.stringify(mockTrackers));
  return mockTrackers;
};

const getInitialAlerts = (): Alert[] => {
  if (typeof window === 'undefined') return mockAlerts;
  const stored = localStorage.getItem(ALERTS_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    return parsed.map((a: Alert) => ({
      ...a,
      timestamp: new Date(a.timestamp),
    }));
  }
  localStorage.setItem(ALERTS_KEY, JSON.stringify(mockAlerts));
  return mockAlerts;
};

// Fetch all trackers
export const useTrackers = () => {
  return useQuery({
    queryKey: ['trackers'],
    queryFn: async () => {
      await delay(500);
      return getInitialTrackers();
    },
  });
};

// Fetch trackers by category
export const useTrackersByCategory = (category: Category) => {
  return useQuery({
    queryKey: ['trackers', category],
    queryFn: async () => {
      await delay(400);
      const trackers = getInitialTrackers();
      return trackers.filter(t => t.category === category);
    },
  });
};

// Fetch single tracker
export const useTracker = (id: string) => {
  return useQuery({
    queryKey: ['tracker', id],
    queryFn: async () => {
      await delay(300);
      const trackers = getInitialTrackers();
      return trackers.find(t => t.id === id);
    },
  });
};

// Add new tracker
export const useAddTracker = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newTracker: Omit<Tracker, 'id' | 'priceHistory' | 'lastChecked' | 'createdAt' | 'status'>) => {
      await delay(800);
      
      const tracker: Tracker = {
        ...newTracker,
        id: Date.now().toString(),
        status: 'waiting',
        lastChecked: new Date(),
        createdAt: new Date(),
        priceHistory: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          price: newTracker.currentPrice,
        })),
      };
      
      const trackers = getInitialTrackers();
      const updated = [...trackers, tracker];
      localStorage.setItem(TRACKERS_KEY, JSON.stringify(updated));
      
      return tracker;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trackers'] });
    },
  });
};

// Delete tracker
export const useDeleteTracker = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(400);
      const trackers = getInitialTrackers();
      const updated = trackers.filter(t => t.id !== id);
      localStorage.setItem(TRACKERS_KEY, JSON.stringify(updated));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trackers'] });
    },
  });
};

// Fetch alerts
export const useAlerts = () => {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      const token = localStorage.getItem('x-auth-token');
      if (!token) {
        // Return empty array if not authenticated
        return [];
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/dashboard/triggers`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token,
            },
          }
        );

        if (!response.ok) {
          // Fallback to mock data if API fails
          return getInitialAlerts();
        }

        const data = await response.json();
        
        // Map backend recentAlerts to frontend Alert format
        if (data.recentAlerts && Array.isArray(data.recentAlerts)) {
          return data.recentAlerts.map((alert: any) => ({
            id: alert.id || alert._id || String(Date.now() + Math.random()),
            trackerId: alert.triggerId || alert.trackerId || '',
            category: alert.category || 'mobiles' as Category,
            message: alert.message || alert.text || 'Price alert',
            priceChange: alert.priceChange || alert.priceDrop || 0,
            timestamp: alert.timestamp ? new Date(alert.timestamp) : new Date(),
            isNew: alert.isNew !== undefined ? alert.isNew : alert.isRead === false,
          }));
        }
        
        return [];
      } catch (error) {
        console.error('Error fetching alerts:', error);
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
      await delay(200);
      const alerts = getInitialAlerts();
      const updated = alerts.map(a => a.id === id ? { ...a, isNew: false } : a);
      localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};

// Dashboard stats
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const token = localStorage.getItem('x-auth-token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/dashboard/triggers`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch dashboard stats');
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
