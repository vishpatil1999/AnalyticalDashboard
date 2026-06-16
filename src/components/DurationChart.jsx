import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatDuration } from "@/lib/utils";

export default function DurationChart({ data, stats }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          Call duration analytics
        </CardTitle>
        <div className="flex gap-6 text-sm text-muted-foreground mt-1">
          <span>
            Longest:{" "}
            <strong className="text-foreground">
              {formatDuration(stats.longest)}
            </strong>
          </span>
          <span>
            Shortest:{" "}
            <strong className="text-foreground">
              {formatDuration(stats.shortest)}
            </strong>
          </span>
          <span>
            Average:{" "}
            <strong className="text-foreground">
              {formatDuration(stats.average)}
            </strong>
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={data}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}s`}
            />
            <Tooltip
              formatter={(v) => [formatDuration(v), "Duration"]}
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            />
            <Bar dataKey="duration" fill="#7c3aed" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
