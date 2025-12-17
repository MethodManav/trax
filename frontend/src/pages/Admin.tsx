import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { AnimatedGlassCard } from "@/components/ui/glass-card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  mockRegionData,
  mockCategoryDemand,
  mockTimeSeriesData,
  mockTotalStats,
} from "@/lib/mockAnalytics";
import {
  Users,
  Activity,
  MapPin,
  TrendingUp,
  Smartphone,
  Shirt,
  Plane,
  Clock,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statsCards = [
  {
    label: "Total Requests",
    value: mockTotalStats.totalRequests.toLocaleString(),
    icon: Activity,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "Total Users",
    value: mockTotalStats.totalUsers.toLocaleString(),
    icon: Users,
    color: "text-clothing",
    bgColor: "bg-clothing/10",
  },
  {
    label: "Top Region",
    value: mockTotalStats.topRegion,
    icon: MapPin,
    color: "text-flights",
    bgColor: "bg-flights/10",
  },
  {
    label: "Peak Hour",
    value: mockTotalStats.peakHour,
    icon: Clock,
    color: "text-success",
    bgColor: "bg-success/10",
  },
];

const CATEGORY_COLORS = ["hsl(211, 100%, 50%)", "hsl(280, 70%, 55%)", "hsl(24, 100%, 55%)"];

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Analytics overview: Regional demand by product category
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <AnimatedGlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </AnimatedGlassCard>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Demand Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatedGlassCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Category Demand Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockCategoryDemand}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="total"
                    nameKey="category"
                  >
                    {mockCategoryDemand.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {mockCategoryDemand.map((cat, i) => (
                <div key={cat.category} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[i] }}
                  />
                  <span className="text-sm text-muted-foreground">{cat.category}</span>
                  <span className="text-sm font-medium text-success">+{cat.growth}%</span>
                </div>
              ))}
            </div>
          </AnimatedGlassCard>
        </motion.div>

        {/* Time Series Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatedGlassCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Request Trends by Category
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTimeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="mobiles" stroke={CATEGORY_COLORS[0]} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="clothing" stroke={CATEGORY_COLORS[1]} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="flights" stroke={CATEGORY_COLORS[2]} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </AnimatedGlassCard>
        </motion.div>
      </div>

      {/* Regional Demand Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <AnimatedGlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Regional Demand Analysis
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockRegionData.slice(0, 8)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis dataKey="region" type="category" width={80} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                />
                <Legend />
                <Bar dataKey="mobiles" fill={CATEGORY_COLORS[0]} name="Mobiles" radius={[0, 4, 4, 0]} />
                <Bar dataKey="clothing" fill={CATEGORY_COLORS[1]} name="Clothing" radius={[0, 4, 4, 0]} />
                <Bar dataKey="flights" fill={CATEGORY_COLORS[2]} name="Flights" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AnimatedGlassCard>
      </motion.div>

      {/* Regional Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <AnimatedGlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Detailed Regional Breakdown
          </h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Region</TableHead>
                  <TableHead className="text-right">Total Requests</TableHead>
                  <TableHead className="text-right">
                    <span className="inline-flex items-center gap-1">
                      <Smartphone className="w-4 h-4 text-mobile" /> Mobiles
                    </span>
                  </TableHead>
                  <TableHead className="text-right">
                    <span className="inline-flex items-center gap-1">
                      <Shirt className="w-4 h-4 text-clothing" /> Clothing
                    </span>
                  </TableHead>
                  <TableHead className="text-right">
                    <span className="inline-flex items-center gap-1">
                      <Plane className="w-4 h-4 text-flights" /> Flights
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRegionData.map((region) => (
                  <TableRow key={region.region}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        {region.region}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {region.requests.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-mobile">
                      {region.mobiles.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-clothing">
                      {region.clothing.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-flights">
                      {region.flights.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </AnimatedGlassCard>
      </motion.div>
    </div>
  );
}
