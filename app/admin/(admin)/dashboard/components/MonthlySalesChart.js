"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const MonthlySalesChart = ({ data = [], loading = false }) => {
  return (
    <div className="w-full bg-gradient-to-br from-white to-gray-50 p-2 sm:p-4 md:p-6 xl:p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="flex items-center justify-between mb-2 sm:mb-4 md:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
            Monthly Sales
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm">
            Revenue performance over time
          </p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-md flex items-center justify-center w-10 h-10">
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
      </div>
      <div className="flex-1 flex flex-col m-0 p-0 justify-center">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p>No sales data available</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height={300}
            minWidth={200}
            minHeight={200}
          >
            <LineChart
              data={data}
              margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient
                  id="salesGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                strokeOpacity={0.6}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#d1d5db" }}
                tickLine={{ stroke: "#d1d5db" }}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#d1d5db" }}
                tickLine={{ stroke: "#d1d5db" }}
                tickFormatter={(value) => `Rs. ${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  color: "#fff",
                }}
                labelStyle={{ color: "#e5e7eb" }}
                formatter={(value) => [`Rs. ${value.toLocaleString()}`, "Sales"]}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: "10px",
                  textAlign: "center",
                  width: "100%",
                }}
                iconType="circle"
                align="center"
                verticalAlign="top"
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#10b981"
                strokeWidth={4}
                name="Sales (Rs)"
                dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                activeDot={{
                  r: 8,
                  fill: "#10b981",
                  stroke: "#fff",
                  strokeWidth: 3,
                }}
                fill="url(#salesGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default MonthlySalesChart;
