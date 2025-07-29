"use client";
import { useState, useEffect, useRef } from "react";
import { SEVERITY_COLOR_MAP, SEVERITY_HOVER_MAP } from "@/constants";
import { CircularProgress } from "@mui/material";

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

  const sortedData = [...safeData].sort((a, b) => {
    const aSeverity = a.severity ?? 0;
    const bSeverity = b.severity ?? 0;

    if (aSeverity !== bSeverity) {
      return bSeverity - aSeverity;
    }

    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const effectiveMaxRows = maxRows || dynamicMaxRows;
  const displayData = effectiveMaxRows
    ? sortedData.slice(0, effectiveMaxRows)
    : sortedData;

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

  const getSeverityClass = (row) => {
    if (row.status === "ESCALATED") return "bg-gray-100";
    return SEVERITY_COLOR_MAP[row.severity] || "";
  };

  const getHoverClass = (row) => {
    if (row.status === "ESCALATED") return "hover:bg-gray-200";
    return SEVERITY_HOVER_MAP[row.severity] || "hover:bg-secondary/10";
  };

  const getTextClass = (row) => {
    return row.status === "ESCALATED" ? "text-gray-500" : "text-text";
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
            <CircularProgress />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr
                ref={headerRef}
                className="bg-secondary/50 text-sm rounded-t-md"
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
                const severityClass = getSeverityClass(row);
                const hoverClass = getHoverClass(row);
                const textClass = getTextClass(row);
                const fallbackBg =
                  !severityClass && idx % 2 === 1 ? "bg-text/5" : "";

                return (
                  <tr
                    key={idx}
                    ref={idx === 0 ? rowRef : null}
                    className={`text-xs ${onRowClick ? "cursor-pointer" : ""} ${severityClass || fallbackBg} ${hoverClass}`}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className={`p-2 ${textClass}`}>
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
