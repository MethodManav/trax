// Mock analytics data for admin dashboard

export interface RegionData {
  region: string;
  country: string;
  lat: number;
  lng: number;
  requests: number;
  mobiles: number;
  clothing: number;
  flights: number;
}

export interface CategoryDemand {
  category: string;
  total: number;
  growth: number;
  color: string;
}

export interface TimeSeriesData {
  date: string;
  mobiles: number;
  clothing: number;
  flights: number;
}

export const mockRegionData: RegionData[] = [
  { region: "Mumbai", country: "India", lat: 19.076, lng: 72.8777, requests: 15420, mobiles: 8500, clothing: 4200, flights: 2720 },
  { region: "Delhi", country: "India", lat: 28.6139, lng: 77.209, requests: 12800, mobiles: 6200, clothing: 3800, flights: 2800 },
  { region: "Bangalore", country: "India", lat: 12.9716, lng: 77.5946, requests: 11200, mobiles: 7100, clothing: 2400, flights: 1700 },
  { region: "Chennai", country: "India", lat: 13.0827, lng: 80.2707, requests: 8400, mobiles: 4800, clothing: 2100, flights: 1500 },
  { region: "Hyderabad", country: "India", lat: 17.385, lng: 78.4867, requests: 7600, mobiles: 4200, clothing: 1900, flights: 1500 },
  { region: "Kolkata", country: "India", lat: 22.5726, lng: 88.3639, requests: 6200, mobiles: 3100, clothing: 1800, flights: 1300 },
  { region: "Pune", country: "India", lat: 18.5204, lng: 73.8567, requests: 5800, mobiles: 3400, clothing: 1500, flights: 900 },
  { region: "Ahmedabad", country: "India", lat: 23.0225, lng: 72.5714, requests: 4200, mobiles: 2100, clothing: 1200, flights: 900 },
  { region: "Jaipur", country: "India", lat: 26.9124, lng: 75.7873, requests: 3100, mobiles: 1400, clothing: 1100, flights: 600 },
  { region: "Lucknow", country: "India", lat: 26.8467, lng: 80.9462, requests: 2400, mobiles: 1100, clothing: 800, flights: 500 },
];

export const mockCategoryDemand: CategoryDemand[] = [
  { category: "Mobiles", total: 42100, growth: 12.5, color: "hsl(211, 100%, 50%)" },
  { category: "Clothing", total: 20800, growth: 8.3, color: "hsl(280, 70%, 55%)" },
  { category: "Flights", total: 14420, growth: 15.2, color: "hsl(24, 100%, 55%)" },
];

export const mockTimeSeriesData: TimeSeriesData[] = [
  { date: "Jan", mobiles: 3200, clothing: 1800, flights: 1100 },
  { date: "Feb", mobiles: 3400, clothing: 1900, flights: 1200 },
  { date: "Mar", mobiles: 3800, clothing: 2100, flights: 1300 },
  { date: "Apr", mobiles: 3600, clothing: 1700, flights: 1400 },
  { date: "May", mobiles: 4100, clothing: 1600, flights: 1500 },
  { date: "Jun", mobiles: 3900, clothing: 1500, flights: 1800 },
  { date: "Jul", mobiles: 4200, clothing: 1800, flights: 1600 },
  { date: "Aug", mobiles: 4500, clothing: 2000, flights: 1400 },
  { date: "Sep", mobiles: 4100, clothing: 2200, flights: 1200 },
  { date: "Oct", mobiles: 3800, clothing: 1900, flights: 1100 },
  { date: "Nov", mobiles: 4000, clothing: 2100, flights: 1300 },
  { date: "Dec", mobiles: 3500, clothing: 2200, flights: 1500 },
];

export const mockTotalStats = {
  totalRequests: 77320,
  totalUsers: 12450,
  avgRequestsPerUser: 6.2,
  peakHour: "8 PM - 9 PM",
  topRegion: "Mumbai",
  topCategory: "Mobiles",
};
