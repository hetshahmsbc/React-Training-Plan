// A hand-built list section: a title, a search box, an "Add" button, and the
// react-toolkit Table. Unlike ConfigurableDashboard, WE own the data, the
// search and the wiring — nothing is generated from a JSON config.

import { useMemo, useState } from "react";
import { Table, Input, Button } from "@msbc/react-toolkit";

interface Props {
  title: string;
  rows: Record<string, any>[];
  columns: any[]; // AG-Grid column defs (field/headerName/cellRenderer/...)
  loading?: boolean;
  addLabel?: string;
  onAdd?: () => void;
  onRowDoubleClick?: (row: Record<string, any>) => void;
  searchKeys?: string[]; // which fields the search box filters on
  searchPlaceholder?: string;
}

export function DataTable({
  title,
  rows,
  columns,
  loading,
  addLabel,
  onAdd,
  onRowDoubleClick,
  searchKeys = [],
  searchPlaceholder = "Search…",
}: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || searchKeys.length === 0) return rows;
    return rows.filter((row) =>
      searchKeys.some((key) =>
        String(row[key] ?? "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [rows, query, searchKeys]);

  return (
    <div className="hms-card">
      <div className="hms-tabletitle">{title}</div>

      <div className="hms-toolbar">
        <div className="hms-search hms-toolbar__search">
          <Input
            variant="text"
            value={query}
            placeHolder={searchPlaceholder}
            onChange={(e: any) => setQuery(e.target.value)}
          />
        </div>
        {onAdd && <Button text={addLabel || "Add"} onClick={onAdd} />}
      </div>

      <Table
        rowData={filtered}
        columnDefs={columns}
        domLayout="autoHeight"
        rowHeight={56}
        headerHeight={48}
        suppressHorizontalScroll={false}
        showPagination={false}
        loading={loading}
        onRowDoubleClicked={(e: any) => onRowDoubleClick?.(e.data)}
      />

      {!loading && filtered.length === 0 && (
        <div className="hms-empty">
          {query ? "No results match your search." : "No records yet."}
        </div>
      )}
    </div>
  );
}
