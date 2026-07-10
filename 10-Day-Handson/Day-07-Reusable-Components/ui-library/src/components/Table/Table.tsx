import { type ReactNode } from "react";
import "./Table.css";

type Column<T> = {
  header: string;
  render: (row: T) => ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  // Stable row identity (e.g. row.id) so React doesn't mix up rows on delete
  rowKey?: (row: T) => string | number;
};

function Table<T>({ columns, data, emptyMessage = "No data found", rowKey }: TableProps<T>) {
  if (data.length === 0) {
    return <p className="table-empty">{emptyMessage}</p>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.header}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowKey ? rowKey(row) : rowIndex}>
            {columns.map((col) => (
              <td key={col.header}>{col.render(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
