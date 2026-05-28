import * as React from "react";
import { cn } from "@/lib/utils";

type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
  width?: string;
};

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  empty = "Nenhum registro",
  onRowClick,
}: DataTableProps<T>) {
  const template = columns
    .map((c) => c.width ?? "minmax(0, 1fr)")
    .join(" ");

  return (
    <div className="bg-white border-[1.5px] border-border-strong shadow-brutal-sm overflow-hidden">
      <div
        className="grid bg-navy px-5 py-3"
        style={{ gridTemplateColumns: template }}
      >
        {columns.map((c) => (
          <span
            key={c.key}
            className={cn(
              "text-[10px] text-white font-display italic font-black uppercase tracking-[0.12em]",
              c.className
            )}
          >
            {c.header}
          </span>
        ))}
      </div>
      {rows.length === 0 ? (
        <div className="py-14 text-center text-fg-mute text-[13px] font-medium">
          {empty}
        </div>
      ) : (
        rows.map((row) => (
          <div
            key={rowKey(row)}
            className={cn(
              "grid px-5 py-3 border-b border-border last:border-b-0 items-center",
              onRowClick && "hover:bg-surface-3 cursor-pointer"
            )}
            style={{ gridTemplateColumns: template }}
            onClick={() => onRowClick?.(row)}
          >
            {columns.map((c) => (
              <div key={c.key} className={c.className}>
                {c.render(row)}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
