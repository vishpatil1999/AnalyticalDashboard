import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { formatDuration, formatCost, formatDateTime } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";

const PAGE_SIZE = 20;

const COLUMNS = [
  { key: "#",              label: "#",              sortable: false },
  { key: "callerName",     label: "Caller",         sortable: true  },
  { key: "callerNumber",   label: "Caller number",  sortable: false },
  { key: "receiverNumber", label: "Receiver",       sortable: false },
  { key: "city",           label: "City",           sortable: true  },
  { key: "callDirection",  label: "Direction",      sortable: true  },
  { key: "callStatus",     label: "Status",         sortable: true  },
  { key: "callDuration",   label: "Duration",       sortable: true  },
  { key: "callCost",       label: "Cost",           sortable: true  },
  { key: "callStartTime",  label: "Start time",     sortable: true  },
];

function SortButtons({ colKey, sortKey, sortDir, onSort }) {
  return (
    <div className="flex flex-col ml-1 gap-0">
      <button
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

export default function RecentCallsTable({ calls }) {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState("callStartTime");
  const [sortDir, setSortDir] = useState("desc");

  const handleSort = (key, dir) => {
    setSortKey(key);
    setSortDir(dir);
  };

  const sorted = useMemo(() => {
    return [...calls].sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];
      if (sortKey === "callCost")      { av = parseFloat(av); bv = parseFloat(bv); }
      if (sortKey === "callStartTime") { av = new Date(av);   bv = new Date(bv);   }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ?  1 : -1;
      return 0;
    });
  }, [calls, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-medium">Recent call logs</CardTitle>
            <p className="text-sm text-muted-foreground">
              {calls.length} calls total — page {safePage} of {totalPages}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(1)} disabled={safePage === 1}>First</Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground w-16 text-center">{safePage} / {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage(totalPages)} disabled={safePage === totalPages}>Last</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
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
              {paginated.map((r, i) => (
                <TableRow key={r.id} className="text-sm">
                  <TableCell className="text-muted-foreground text-xs">{(safePage - 1) * PAGE_SIZE + i + 1}</TableCell>
                  <TableCell className="font-medium whitespace-nowrap">{r.callerName}</TableCell>
                  <TableCell className="text-muted-foreground text-xs whitespace-nowrap">{r.callerNumber}</TableCell>
                  <TableCell className="text-muted-foreground text-xs whitespace-nowrap">{r.receiverNumber}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.city}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={r.callDirection ? "border-blue-200 text-blue-700 bg-blue-50" : "border-orange-200 text-orange-700 bg-orange-50"}>
                      {r.callDirection ? "Inbound" : "Outbound"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={r.callStatus ? "border-green-200 text-green-700 bg-green-50" : "border-red-200 text-red-700 bg-red-50"}>
                      {r.callStatus ? "Success" : "Failed"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDuration(r.callDuration)}</TableCell>
                  <TableCell className="font-medium">{formatCost(r.callCost)}</TableCell>
                  <TableCell className="text-muted-foreground text-xs whitespace-nowrap">{formatDateTime(r.callStartTime)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <p className="text-xs text-muted-foreground">
            Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, sorted.length)} of {sorted.length}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(1)} disabled={safePage === 1}>First</Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}><ChevronLeft className="w-4 h-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}><ChevronRight className="w-4 h-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => setPage(totalPages)} disabled={safePage === totalPages}>Last</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}