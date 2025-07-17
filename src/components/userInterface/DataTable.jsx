"use client";
import { useState, useEffect, useRef } from "react";

const DataTable = ({
  data = [],
  columns,
  isCompact = false,
  isViewable = true,
  viewMore,
  maxRows = null,
  title,
  onRowClick,
  loading = false,
}) => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const rowRef = useRef(null);
  const [dynamicMaxRows, setDynamicMaxRows] = useState(maxRows || 10);

  const safeData = Array.isArray(data) ? data : [];
  const effectiveMaxRows = maxRows || dynamicMaxRows;
  const displayData = effectiveMaxRows
    ? safeData.slice(0, effectiveMaxRows)
    : safeData;

  useEffect(() => {
    const calculateMaxRows = () => {
      if (
        !containerRef.current ||
        !headerRef.current ||
        !rowRef.current ||
        maxRows
      )
        return;

      const containerHeight = containerRef.current.clientHeight;
      const headerHeight = headerRef.current.clientHeight;
      const rowHeight = rowRef.current.clientHeight;
      const titleAreaHeight = isCompact ? 24 : 0;
      const availableHeight = containerHeight - titleAreaHeight - headerHeight;
      const calculatedMaxRows = Math.floor(availableHeight / rowHeight);
      setDynamicMaxRows(Math.max(1, calculatedMaxRows));
    };

    calculateMaxRows();
    const handleResize = () => setTimeout(calculateMaxRows, 0);
    window.addEventListener("resize", handleResize);

    let resizeObserver;
    if (window.ResizeObserver && containerRef.current) {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [data, columns, isCompact, maxRows]);

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-100";
      case "HIGH":
        return "bg-yellow-100";
      default:
        return "";
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${isCompact ? "h-full" : "min-h-96"} flex flex-col gap-4`}
    >
      {isCompact && (
        <div className="flex flex-row justify-between">
          <div className="flex items-center">
            <h3
              className={`flex flex-col ${
                isCompact ? "text-sm" : "text-lg"
              } text-text font-semibold`}
            >
              {title}
            </h3>
            {safeData.length > effectiveMaxRows && (
              <span className="text-xs text-primary font-bold ml-2">
                +{safeData.length - effectiveMaxRows}
              </span>
            )}
          </div>

          {isViewable && (
            <span
              onClick={viewMore}
              className="text-xs font-semibold text-primary select-none cursor-pointer"
            >
              view more
            </span>
          )}
        </div>
      )}

      <div className="overflow-auto h-full">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6"></div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr
                ref={headerRef}
                className="bg-secondary/50 text-xs rounded-t-md"
              >
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`text-left p-2 text-text font-semibold ${
                      idx === 0 ? "rounded-l-md" : ""
                    } ${idx === columns.length - 1 ? "rounded-r-md" : ""}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayData.map((row, idx) => {
                const severityClass = getSeverityClass(row.severity);
                const fallbackBg =
                  !severityClass && idx % 2 === 1 ? "bg-text/5" : "";
                return (
                  <tr
                    key={idx}
                    ref={idx === 0 ? rowRef : null}
                    className={`text-xs hover:bg-secondary/10 ${
                      onRowClick ? "cursor-pointer" : ""
                    } ${severityClass || fallbackBg}`}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className="p-2 text-text">
                        {col.render
                          ? col.render(row[col.key], row)
                          : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DataTable;
