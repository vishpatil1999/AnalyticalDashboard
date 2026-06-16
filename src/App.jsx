import { useCDRData } from './hooks/useCDRData.jsx';
import KPICards         from './components/KPICards.jsx';
import DurationChart    from './components/DurationChart.jsx';
import CostChart        from './components/CostChart.jsx';
import ActivityTimeline from './components/ActivityTimeline.jsx';
import CityChart        from './components/CityChart.jsx';
import RecentCallsTable from './components/RecentCallsTable.jsx';
import { PhoneCall }    from 'lucide-react';

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-3">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground">Loading dashboard...</p>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-2">
      <p className="text-red-500 font-medium">Failed to load data</p>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export default function App() {
  const {
    loading, error,
    kpis, durationStats,
    costByCity, callsPerHour,
    callsPerDay, callsByCity,
    recentCalls,
  } = useCDRData();

  if (loading) return <Spinner />;
  if (error)   return <ErrorState message={error} />;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-screen-xl mx-auto flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <PhoneCall className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">CDR Analytics</h1>
            <p className="text-xs text-muted-foreground">Call Data Record Dashboard</p>
          </div>
          <div className="ml-auto text-xs text-muted-foreground">
            {kpis.totalCalls} records loaded
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-screen-xl mx-auto px-6 py-6 space-y-6">

        {/* Row 1: KPI Cards */}
        <KPICards kpis={kpis} />

        {/* Row 2: Duration + Cost */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DurationChart data={durationStats.chartData} stats={durationStats} />
          <CostChart     data={costByCity} />
        </div>

        {/* Row 3: Timeline */}
        <ActivityTimeline hourly={callsPerHour} daily={callsPerDay} />

        {/* Row 4: City pie + ranking */}
        <CityChart data={callsByCity} />

        {/* Row 5: Recent calls table */}
        <RecentCallsTable calls={recentCalls} />

      </main>

    </div>
  );
}