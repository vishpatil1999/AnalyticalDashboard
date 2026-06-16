import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#7c3aed",
  "#d97706",
  "#16a34a",
  "#dc2626",
  "#0891b2",
  "#9333ea",
  "#ea580c",
];

export default function CityChart({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Pie chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Calls by city</CardTitle>
          <p className="text-sm text-muted-foreground">
            Distribution across top cities
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                dataKey="calls"
                nameKey="city"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                paddingAngle={2}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => [v, "Calls"]}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(v) => <span style={{ fontSize: 11 }}>{v}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* City ranking list */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">City rankings</CardTitle>
          <p className="text-sm text-muted-foreground">
            Top cities by call volume
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.map((item, i) => {
              const max = data[0].calls;
              const pct = Math.round((item.calls / max) * 100);
              return (
                <div key={item.city}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground w-4">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium truncate max-w-[160px]">
                        {item.city}
                      </span>
                    </div>
                    <span className="text-sm font-semibold">{item.calls}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: COLORS[i % COLORS.length],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
