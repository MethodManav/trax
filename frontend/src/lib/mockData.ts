// Mock data types and initial data for the Price Tracker app

export type Category = "mobiles" | "clothing" | "flights";

export interface Tracker {
  id: string;
  category: Category;
  name: string;
  url?: string;
  route?: string; // For flights
  currentPrice: number;
  targetPrice: number;
  originalPrice: number;
  lastChecked: Date;
  status: "dropped" | "waiting" | "alert";
  priceHistory: { date: string; price: number }[];
  createdAt: Date;
}

export interface Alert {
  id: string;
  trackerId: string;
  category: Category;
  message: string;
  priceChange: number;
  timestamp: Date;
  isNew: boolean;
}

// Generate mock price history
const generatePriceHistory = (
  basePrice: number,
  days: number = 14
): { date: string; price: number }[] => {
  const history: { date: string; price: number }[] = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const variance = (Math.random() - 0.5) * basePrice * 0.2;
    history.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(basePrice + variance),
    });
  }
  return history;
};

export const mockTrackers: Tracker[] = [
  // Mobiles
  {
    id: "1",
    category: "mobiles",
    name: "iPhone 15 Pro Max 256GB",
    url: "https://apple.com/iphone-15-pro",
    currentPrice: 1149,
    targetPrice: 999,
    originalPrice: 1199,
    lastChecked: new Date(Date.now() - 1000 * 60 * 30),
    status: "dropped",
    priceHistory: generatePriceHistory(1175),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  },
  {
    id: "2",
    category: "mobiles",
    name: "Samsung Galaxy S24 Ultra",
    url: "https://samsung.com/galaxy-s24",
    currentPrice: 1299,
    targetPrice: 1100,
    originalPrice: 1299,
    lastChecked: new Date(Date.now() - 1000 * 60 * 45),
    status: "waiting",
    priceHistory: generatePriceHistory(1299),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
  {
    id: "3",
    category: "mobiles",
    name: "Google Pixel 8 Pro",
    url: "https://store.google.com/pixel-8",
    currentPrice: 849,
    targetPrice: 799,
    originalPrice: 999,
    lastChecked: new Date(Date.now() - 1000 * 60 * 15),
    status: "alert",
    priceHistory: generatePriceHistory(920),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
  },
  // Flights
  // {
  //   id: "7",
  //   category: "flights",
  //   name: "New York → London",
  //   route: "JFK → LHR",
  //   currentPrice: 485,
  //   targetPrice: 400,
  //   originalPrice: 650,
  //   lastChecked: new Date(Date.now() - 1000 * 60 * 5),
  //   status: "dropped",
  //   priceHistory: generatePriceHistory(550),
  //   createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
  // },
  // {
  //   id: "8",
  //   category: "flights",
  //   name: "Los Angeles → Tokyo",
  //   route: "LAX → NRT",
  //   currentPrice: 890,
  //   targetPrice: 750,
  //   originalPrice: 1100,
  //   lastChecked: new Date(Date.now() - 1000 * 60 * 25),
  //   status: "alert",
  //   priceHistory: generatePriceHistory(980),
  //   createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
  // },
  // {
  //   id: "9",
  //   category: "flights",
  //   name: "Delhi → Mumbai",
  //   route: "DEL → BOM",
  //   currentPrice: 78,
  //   targetPrice: 60,
  //   originalPrice: 120,
  //   lastChecked: new Date(Date.now() - 1000 * 60 * 8),
  //   status: "dropped",
  //   priceHistory: generatePriceHistory(95),
  //   createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  // },
];

export const mockAlerts: Alert[] = [
  {
    id: "a1",
    trackerId: "9",
    category: "flights",
    message: "Delhi → Mumbai dropped by 12%",
    priceChange: -12,
    timestamp: new Date(Date.now() - 1000 * 60 * 8),
    isNew: true,
  },
  {
    id: "a2",
    trackerId: "3",
    category: "mobiles",
    message: "Google Pixel 8 Pro hit target price!",
    priceChange: -15,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isNew: true,
  },
  {
    id: "a4",
    trackerId: "8",
    category: "flights",
    message: "Los Angeles → Tokyo dropped below $900",
    priceChange: -19,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    isNew: false,
  },
  {
    id: "a5",
    trackerId: "1",
    category: "mobiles",
    message: "iPhone 15 Pro Max price dropped by 4%",
    priceChange: -4,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isNew: false,
  },
];

export const categoryConfig = {
  mobiles: {
    label: "Mobiles",
    icon: "📱",
    color: "mobile",
  },
  flights: {
    label: "Flights",
    icon: "✈️",
    color: "flights",
  },
} as const;
