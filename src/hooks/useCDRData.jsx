import { useState, useEffect } from "react";
import {
  fetchKPIs,
  fetchDurationStats,
  fetchCostByCity,
  fetchCallsPerHour,
  fetchCallsPerDay,
  fetchCallsByCity,
} from "../api/analyticsService.jsx";

export function useCDRData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [kpis, setKpis] = useState({
    totalCalls: 0,
    totalCost: "0.00",
    avgDuration: 0,
    successCalls: 0,
    failedCalls: 0,
    successRate: 0,
  });
  const [durationStats, setDurationStats] = useState({
    longest: 0,
    shortest: 0,
    average: 0,
    chartData: [],
  });
  const [costByCity, setCostByCity] = useState([]);
  const [callsPerHour, setCallsPerHour] = useState([]);
  const [callsPerDay, setCallsPerDay] = useState([]);
  const [callsByCity, setCallsByCity] = useState([]);
  const [statusBreakdown, setStatusBreakdown] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      const results = await Promise.allSettled([
        fetchKPIs(),
        fetchDurationStats(),
        fetchCostByCity(),
        fetchCallsPerHour(),
        fetchCallsPerDay(),
        fetchCallsByCity(),
      ]);

      if (!isMounted) return;

      const [
        kpiResult,
        durationResult,
        costByCityResult,
        callsPerHourResult,
        callsPerDayResult,
        callsByCityResult,
      ] = results;
      const failures = [];

      if (kpiResult.status === "fulfilled") {
        const kpiData = kpiResult.value;
        const successRate =
          kpiData.totalCalls > 0
            ? Math.round((kpiData.successfulCalls / kpiData.totalCalls) * 100)
            : 0;

        setKpis({
          totalCalls: kpiData.totalCalls,
          totalCost: kpiData.totalCost.toFixed(2),
          avgDuration: Math.round(kpiData.avgDurationSeconds),
          successCalls: kpiData.successfulCalls,
          failedCalls: kpiData.failedCalls,
          successRate,
        });

        setStatusBreakdown([
          { name: "Successful", value: kpiData.successfulCalls },
          { name: "Failed", value: kpiData.failedCalls },
        ]);
      } else {
        failures.push("KPIs");
      }

      if (durationResult.status === "fulfilled") {
        setDurationStats(durationResult.value);
      } else {
        failures.push("Duration stats");
      }

      if (costByCityResult.status === "fulfilled") {
        setCostByCity(costByCityResult.value);
      } else {
        failures.push("Cost by city");
      }

      if (callsPerHourResult.status === "fulfilled") {
        setCallsPerHour(callsPerHourResult.value);
      } else {
        failures.push("Calls per hour");
      }

      if (callsPerDayResult.status === "fulfilled") {
        setCallsPerDay(callsPerDayResult.value);
      } else {
        failures.push("Calls per day");
      }

      if (callsByCityResult.status === "fulfilled") {
        setCallsByCity(callsByCityResult.value);
      } else {
        failures.push("Calls by city");
      }
      if (failures.length > 0) {
        setError(`Failed to load: ${failures.join(", ")}`);
      }

      setLoading(false);
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    loading,
    error,
    kpis,
    durationStats,
    costByCity,
    callsPerHour,
    callsPerDay,
    callsByCity,
    statusBreakdown,
  };
}
