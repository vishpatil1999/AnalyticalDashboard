import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { formatDuration, formatCost, formatDateTime } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, X } from "lucide-react";
import { fetchCallRecords } from "../api/cdrService.jsx";

const PAGE_SIZE = 20;

const COLUMNS = [
  { key: "#",              label: "#",             sortable: false },
  { key: "callerName",     label: "Caller",        sortable: true  },
  { key: "callerNumber",   label: "Caller number", sortable: false },
  { key: "receiverNumber", label: "Receiver",      sortable: false },
  { key: "city",           label: "City",          sortable: true  },
  { key: "callDirection",  label: "Direction",     sortable: true  },
  { key: "callStatus",     label: "Status",        sortable: true  },
  { key: "callDuration",   label: "Duration",      sortable: true  },
  { key: "callCost",       label: "Cost",          sortable: true  },
  { key: "callStartTime",  label: "Start time",    sortable: true  },
];

function SortButtons({ colKey, sortKey, sortDir, onSort }) {
  return (
    <div className="flex flex-col ml-1 gap-0">
      <button
        type="button"
        className={`leading-none p-0 border-none bg-transparent cursor-pointer text-[9px] ${
          sortKey === colKey && sortDir === "asc"
            ? "text-blue-600"
            : "text-muted-foreground/40 hover:text-muted-foreground"
        }`}
        onClick={() => onSort(colKey, "asc")}
        title="Sort ascending"
      >
        <ChevronUp className="w-3 h-3" />
      </button>
      <button
        type="button"
        className={`leading-none p-0 border-none bg-transparent cursor-pointer text-[9px] ${
          sortKey === colKey && sortDir === "desc"
            ? "text-blue-600"
            : "text-muted-foreground/40 hover:text-muted-foreground"
        }`}
        onClick={() => onSort(colKey, "desc")}
        title="Sort descending"
      >
        <ChevronDown className="w-3 h-3" />
      </button>
    </div>
  );
}

export default function RecentCallsTable() {
  const [calls, setCalls] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [cityInput, setCityInput] = useState("");
  const [callerInput, setCallerInput] = useState("");
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [filters, setFilters] = useState({ city: "", caller: "", from: "", to: "" });

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchCallRecords({
      page,
      limit: PAGE_SIZE,
      city: filters.city || undefined,
      caller: filters.caller || undefined,
      from: filters.from || undefined,
      to: filters.to || undefined,
    })
      .then((result) => {
        if (!isMounted) return;
        setCalls(result.data);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      })
      .catch((err) => {
        if (isMounted) setError(err.response?.data?.error || err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [page, filters]);

  const goToPage = (newPage) => {
    setPage(Math.min(Math.max(1, newPage), totalPages));
  };

  const handleSort = (key, dir) => {
    setSortKey(key);
    setSortDir(dir);
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setPage(1); 
    setFilters({ city: cityInput, caller: callerInput, from: fromInput, to: toInput });
  };

  const handleClearFilters = () => {
    setCityInput("");
    setCallerInput("");
    setFromInput("");
    setToInput("");
    setPage(1);
    setFilters({ city: "", caller: "", from: "", to: "" });
  };

  const hasActiveFilters = filters.city || filters.caller || filters.from || filters.to;

  const sortedCalls = useMemo(() => {
    if (!sortKey) return calls;
    return [...calls].sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];
      if (sortKey === "callCost" || sortKey === "callDuration") {
        av = parseFloat(av);
        bv = parseFloat(bv);
      }
      if (sortKey === "callStartTime") {
        av = new Date(av);
        bv = new Date(bv);
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [calls, sortKey, sortDir]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-medium">Recent call logs</CardTitle>
            <p className="text-sm text-muted-foreground">
              {total} calls total — page {page} of {totalPages}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => goToPage(1)} disabled={page === 1 || loading}>First</Button>
            <Button variant="outline" size="sm" onClick={() => goToPage(page - 1)} disabled={page === 1 || loading}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground w-16 text-center">{page} / {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => goToPage(page + 1)} disabled={page === totalPages || loading}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => goToPage(totalPages)} disabled={page === totalPages || loading}>Last</Button>
          </div>
        </div>

        {/* Filter bar */}
        <form onSubmit={handleApplyFilters} className="flex flex-wrap items-end gap-3 pt-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">City</label>
            <Input
              placeholder="e.g. Clarktown"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              className="h-8 w-36 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Caller number</label>
            <Input
              placeholder="e.g. 07815262791"
              value={callerInput}
              onChange={(e) => setCallerInput(e.target.value)}
              className="h-8 w-40 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">From</label>
            <Input
              type="date"
              value={fromInput}
              onChange={(e) => setFromInput(e.target.value)}
              className="h-8 w-36 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">To</label>
            <Input
              type="date"
              value={toInput}
              onChange={(e) => setToInput(e.target.value)}
              className="h-8 w-36 text-sm"
            />
          </div>
          <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            Apply filters
          </Button>
          {hasActiveFilters && (
            <Button type="button" variant="outline" size="sm" onClick={handleClearFilters}>
              <X className="w-3.5 h-3.5 mr-1" />
              Clear
            </Button>
          )}
        </form>
      </CardHeader>
      <CardContent className="p-0">
        {error && (
          <p className="text-sm text-red-600 px-4 py-3">{error}</p>
        )}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                {COLUMNS.map((col) => (
                  <TableHead key={col.key}>
                    <div className="flex items-center">
                      {col.label}
                      {col.sortable && (
                        <SortButtons
                          colKey={col.key}
                          sortKey={sortKey}
                          sortDir={sortDir}
                          onSort={handleSort}
                        />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length} className="text-center text-sm text-muted-foreground py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : sortedCalls.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length} className="text-center text-sm text-muted-foreground py-8">
                    No records match these filters.
                  </TableCell>
                </TableRow>
              ) : (
                sortedCalls.map((r, i) => (
                  <TableRow key={r._id} className="text-sm">
                    <TableCell className="text-muted-foreground text-xs">{(page - 1) * PAGE_SIZE + i + 1}</TableCell>
                    <TableCell className="font-medium whitespace-nowrap">{r.callerName}</TableCell>
                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap">{r.callerNumber}</TableCell>
                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap">{r.receiverNumber}</TableCell>
                    <TableCell className="whitespace-nowrap">{r.city}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={r.callDirection === "incoming" ? "border-blue-200 text-blue-700 bg-blue-50" : "border-orange-200 text-orange-700 bg-orange-50"}>
                        {r.callDirection}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={r.callStatus === "answered" ? "border-green-200 text-green-700 bg-green-50" : "border-red-200 text-red-700 bg-red-50"}>
                        {r.callStatus === "answered" ? "Success" : "Failed"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDuration(r.callDuration)}</TableCell>
                    <TableCell className="font-medium">{formatCost(r.callCost)}</TableCell>
                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap">{formatDateTime(r.callStartTime)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <p className="text-xs text-muted-foreground">
            {total > 0
              ? `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} of ${total}`
              : "No records"}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => goToPage(1)} disabled={page === 1 || loading}>First</Button>
            <Button variant="outline" size="sm" onClick={() => goToPage(page - 1)} disabled={page === 1 || loading}><ChevronLeft className="w-4 h-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => goToPage(page + 1)} disabled={page === totalPages || loading}><ChevronRight className="w-4 h-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => goToPage(totalPages)} disabled={page === totalPages || loading}>Last</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}