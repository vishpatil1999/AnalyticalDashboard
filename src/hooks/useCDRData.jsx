import { useState, useEffect, useMemo } from "react";
import { fetchCDRs } from "../api/CdrService.jsx";

export function useCDRData() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCDRs()
      .then((data) => setRecords(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const kpis = useMemo(() => {
    const total = records.length;
    const successful = records.filter((r) => r.callStatus === true).length;
    const failed = total - successful;
    const totalCost = records.reduce(
      (s, r) => s + parseFloat(r.callCost || 0),
      0,
    );
    const totalDur = records.reduce((s, r) => s + (r.callDuration || 0), 0);
    const avgDuration = total > 0 ? Math.round(totalDur / total) : 0;
    const successRate = total > 0 ? Math.round((successful / total) * 100) : 0;
    return {
      totalCalls: total,
      successCalls: successful,
      failedCalls: failed,
      totalCost: totalCost.toFixed(2),
      avgDuration,
      successRate,
    };
  }, [records]);

  const durationStats = useMemo(() => {
    if (!records.length)
      return { longest: 0, shortest: 0, average: 0, chartData: [] };
    const durations = records.map((r) => r.callDuration || 0);
    const longest = Math.max(...durations);
    const shortest = Math.min(...durations);
    const average = Math.round(
      durations.reduce((a, b) => a + b, 0) / durations.length,
    );
    const chartData = [...records]
      .sort((a, b) => b.callDuration - a.callDuration)
      .slice(0, 10)
      .map((r) => ({
        name: r.callerName.split(" ")[0],
        duration: r.callDuration,
      }));
    return { longest, shortest, average, chartData };
  }, [records]);

  const costByCity = useMemo(() => {
    const map = {};
    records.forEach((r) => {
      const city = r.city || "Unknown";
      map[city] = (map[city] || 0) + parseFloat(r.callCost || 0);
    });
    return Object.entries(map)
      .map(([city, cost]) => ({ city, cost: parseFloat(cost.toFixed(2)) }))
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 8);
  }, [records]);

  const callsPerHour = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: `${String(i).padStart(2, "0")}:00`,
      calls: 0,
    }));
    records.forEach((r) => {
      const h = new Date(r.callStartTime).getHours();
      if (!isNaN(h)) hours[h].calls += 1;
    });
    return hours;
  }, [records]);

  const callsPerDay = useMemo(() => {
    const map = {};
    records.forEach((r) => {
      const day = r.callStartTime?.slice(0, 10);
      if (day) map[day] = (map[day] || 0) + 1;
    });
    return Object.entries(map)
      .map(([date, calls]) => ({ date, calls }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [records]);

  const callsByCity = useMemo(() => {
    const map = {};
    records.forEach((r) => {
      const city = r.city || "Unknown";
      map[city] = (map[city] || 0) + 1;
    });
    return Object.entries(map)
      .map(([city, calls]) => ({ city, calls }))
      .sort((a, b) => b.calls - a.calls)
      .slice(0, 8);
  }, [records]);

  const statusBreakdown = useMemo(
    () => [
      { name: "Successful", value: kpis.successCalls },
      { name: "Failed", value: kpis.failedCalls },
    ],
    [kpis],
  );

  const directionBreakdown = useMemo(() => {
    const inbound = records.filter((r) => r.callDirection === true).length;
    const outbound = records.filter((r) => r.callDirection === false).length;
    return [
      { name: "Inbound", value: inbound },
      { name: "Outbound", value: outbound },
    ];
  }, [records]);

  const recentCalls = useMemo(() => {
    return [...records]
      .sort((a, b) => new Date(b.callStartTime) - new Date(a.callStartTime));
  }, [records]);

  return {
    loading,
    error,
    records,
    kpis,
    durationStats,
    costByCity,
    callsPerHour,
    callsPerDay,
    callsByCity,
    statusBreakdown,
    directionBreakdown,
    recentCalls,
  };
}
