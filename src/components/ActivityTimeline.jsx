import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

export default function ActivityTimeline({ hourly, daily }) {
  const [view, setView] = useState("hourly");
  const data = view === "hourly" ? hourly : daily;
  const key = view === "hourly" ? "hour" : "date";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-medium">
              Call activity timeline
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {view === "hourly"
                ? "Calls distributed across 24 hours"
                : "Calls per day"}
            </p>
          </div>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {["hourly", "daily"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 text-xs rounded-md transition-colors font-medium ${
                  view === v
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart
            data={data}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="callGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey={key}
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval={view === "hourly" ? 3 : 0}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
              formatter={(v) => [v, "Calls"]}
            />
            <Area
              type="monotone"
              dataKey="calls"
              stroke="#2563eb"
              strokeWidth={2}
              fill="url(#callGradient)"
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
