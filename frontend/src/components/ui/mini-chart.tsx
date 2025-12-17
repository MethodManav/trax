import { useMemo } from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

interface MiniChartProps {
  data: { date: string; price: number }[];
  color?: "mobile" | "clothing" | "flights" | "success";
  className?: string;
}

export function MiniChart({ data, color = "mobile", className }: MiniChartProps) {
  const colorMap = {
    mobile: "hsl(211, 100%, 50%)",
    clothing: "hsl(280, 70%, 55%)",
    flights: "hsl(24, 100%, 55%)",
    success: "hsl(142, 72%, 45%)",
  };

  const fillColor = colorMap[color];
  
  const trend = useMemo(() => {
    if (data.length < 2) return "neutral";
    const first = data[0].price;
    const last = data[data.length - 1].price;
    return last < first ? "down" : last > first ? "up" : "neutral";
  }, [data]);

  return (
    <div className={cn("h-12 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fillColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={fillColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--glass))",
              border: "1px solid hsl(var(--glass-border))",
              borderRadius: "0.75rem",
              backdropFilter: "blur(12px)",
              fontSize: "12px",
              padding: "8px 12px",
            }}
            formatter={(value: number) => [`$${value}`, "Price"]}
            labelStyle={{ display: "none" }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={fillColor}
            strokeWidth={2}
            fill={`url(#gradient-${color})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
