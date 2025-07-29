"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";

const WeeklyStatsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/stats/weekly")
      .then((res) => res.json())
      .then((responseData) => {
        console.log("API Response:", responseData); // Debug log

        // Format dates for better display
        const formattedData = responseData.map((item) => ({
          ...item,
          date: new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        }));

        setData(formattedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load weekly stats", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <CircularProgress />
        <span className="ml-3 text-text font-medium">
          Loading weekly stats...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-600">
        <span>Error loading data: {error}</span>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl p-4 shadow-xl">
          <p className="text-gray-800 font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600">
                {entry.name}:{" "}
                <span className="font-semibold text-gray-800">
                  {entry.value}
                </span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-col ml-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full gap-2 select-none">
      <h3 className="text-xs text-text font-semibold">Weekly Reports</h3>

      <div className="flex-1 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="pendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="flaggedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#e2e8f0"
              strokeDasharray="3 3"
              strokeOpacity={0.6}
              vertical={false}
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
              dx={-10}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              align="right"
              verticalAlign="middle"
              layout="vertical"
              iconType="circle"
              content={<CustomLegend />}
            />

            <Line
              type="monotone"
              dataKey="pendingComplaints"
              stroke="#6366f1"
              strokeWidth={3}
              name="Pending Complaints"
              dot={{ fill: "#6366f1", strokeWidth: 2, r: 5 }}
              activeDot={{
                r: 7,
                fill: "#6366f1",
                strokeWidth: 2,
                stroke: "#fff",
              }}
              fill="url(#pendingGradient)"
            />

            <Line
              type="monotone"
              dataKey="resolvedCases"
              stroke="#10b981"
              strokeWidth={3}
              name="Resolved Cases"
              dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
              activeDot={{
                r: 7,
                fill: "#10b981",
                strokeWidth: 2,
                stroke: "#fff",
              }}
              fill="url(#resolvedGradient)"
            />

            <Line
              type="monotone"
              dataKey="flaggedReports"
              stroke="#ef4444"
              strokeWidth={3}
              name="Flagged Reports"
              dot={{ fill: "#ef4444", strokeWidth: 2, r: 5 }}
              activeDot={{
                r: 7,
                fill: "#ef4444",
                strokeWidth: 2,
                stroke: "#fff",
              }}
              fill="url(#flaggedGradient)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyStatsChart;
