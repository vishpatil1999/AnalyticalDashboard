import { Card, CardContent } from "@/components/ui/card";
import { Phone, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";
import { formatCost, formatDuration } from "@/lib/utils";

const cards = [
  {
    key: "totalCalls",
    label: "Total calls",
    icon: Phone,
    color: "text-blue-600",
    bg: "bg-blue-50",
    cardBg: "bg-blue-50/60 border-blue-100",
    fmt: (v) => v,
    sub: () => "all records",
  },
  {
    key: "totalCost",
    label: "Total cost",
    icon: DollarSign,
    color: "text-amber-600",
    bg: "bg-amber-100",
    cardBg: "bg-amber-50/60 border-amber-100",
    fmt: (v) => formatCost(v),
    sub: () => "across all calls",
  },
  {
    key: "avgDuration",
    label: "Avg duration",
    icon: Clock,
    color: "text-purple-600",
    bg: "bg-purple-100",
    cardBg: "bg-purple-50/60 border-purple-100",
    fmt: (v) => formatDuration(v),
    sub: () => "per call",
  },
  {
    key: "successCalls",
    label: "Successful",
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-100",
    cardBg: "bg-green-50/60 border-green-100",
    fmt: (v) => v,
    sub: (_, kpis) => `${kpis.successRate}% success rate`,
  },
  {
    key: "failedCalls",
    label: "Failed calls",
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-100",
    cardBg: "bg-red-50/60 border-red-100",
    fmt: (v) => v,
    sub: (_, kpis) => `${100 - kpis.successRate}% failure rate`,
  },
];

export default function KPICards({ kpis }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map(({ key, label, icon: Icon, color, bg, cardBg, fmt, sub }) => (
        <Card key={key} className={`${cardBg}`}>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className={`${bg} p-1.5 rounded-md`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {label}
              </span>
            </div>
            <p className={`text-2xl font-semibold ${color}`}>
              {fmt(kpis[key])}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {sub(kpis[key], kpis)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}