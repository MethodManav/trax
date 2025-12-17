import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockTrackers, mockAlerts, Tracker, Alert, Category } from '@/lib/mockData';
import { useState, useEffect } from 'react';

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
      await delay(400);
      return getInitialAlerts();
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
      await delay(600);
      const trackers = getInitialTrackers();
      const alerts = getInitialAlerts();
      
      const totalTracked = trackers.length;
      const activeAlerts = alerts.filter(a => a.isNew).length;
      
      // Find biggest price drop
      let biggestDrop = 0;
      trackers.forEach(t => {
        const drop = ((t.originalPrice - t.currentPrice) / t.originalPrice) * 100;
        if (drop > biggestDrop) biggestDrop = drop;
      });
      
      return {
        totalTracked,
        activeAlerts,
        biggestDrop: Math.round(biggestDrop),
      };
    },
  });
};
