"use client";

import { useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const dummySalesData = [
  { month: "Jun 2024", sales: 3500, orders: 120 },
  { month: "Jul 2024", sales: 4800, orders: 145 },
  { month: "Aug 2024", sales: 5200, orders: 153 },
  { month: "Sep 2024", sales: 6100, orders: 165 },
  { month: "Oct 2024", sales: 7100, orders: 189 },
  { month: "Nov 2024", sales: 6700, orders: 172 },
  { month: "Dec 2024", sales: 9800, orders: 215 },
  { month: "Jan 2025", sales: 9200, orders: 201 },
  { month: "Feb 2025", sales: 8900, orders: 188 },
  { month: "Mar 2025", sales: 10200, orders: 222 },
  { month: "Apr 2025", sales: 11600, orders: 240 },
  { month: "May 2025", sales: 12300, orders: 258 },
];

const categoryData = [
  { name: "Electronics", sales: 45000, color: "#3b82f6" },
  { name: "Clothing", sales: 32000, color: "#10b981" },
  { name: "Home & Garden", sales: 18000, color: "#f59e0b" },
  { name: "Sports", sales: 12000, color: "#ef4444" },
  { name: "Books", sales: 8000, color: "#8b5cf6" },
];

const revenueData = [
  { period: "Q1 2024", revenue: 45000, profit: 12000 },
  { period: "Q2 2024", revenue: 52000, profit: 15000 },
  { period: "Q3 2024", revenue: 61000, profit: 18500 },
  { period: "Q4 2024", revenue: 73000, profit: 22000 },
  { period: "Q1 2025", revenue: 68000, profit: 19500 },
];

const Page = () => {
  useEffect(() => {
    document.title = "Admin Dashboard | Century Market";
  }, []);
  return (
    <div className="sm:p-4 md:p-6 space-y-8 bg-white min-h-screen">
      <h1 className="text-3xl mt-10 md:mt-2 font-bold text-black">Admin Dashboard</h1>
      
      <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-white border-b border-gray-200 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-sm">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-black">Dashboard Analytics Guide</h2>
              <p className="text-gray-600 text-sm mt-1">Complete overview of your business performance metrics</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="font-bold text-black text-lg">Key Metrics</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-black text-sm">Sales Revenue</div>
                    <div className="text-gray-600 text-xs">Total sales performance across all channels</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-black text-sm">Order Volume</div>
                    <div className="text-gray-600 text-xs">Number of completed transactions</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-black text-sm">Customer Growth</div>
                    <div className="text-gray-600 text-xs">Active customer base expansion</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Analysis */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="font-bold text-black text-lg">Chart Insights</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <div className="font-semibold text-black mb-1">📈 Trend Analysis</div>
                  <div className="text-gray-600 text-xs">Monthly performance tracking with growth indicators</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <div className="font-semibold text-black mb-1">📊 Category Breakdown</div>
                  <div className="text-gray-600 text-xs">Revenue distribution across product categories</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <div className="font-semibold text-black mb-1">💰 Profit Margins</div>
                  <div className="text-gray-600 text-xs">Quarterly revenue vs profit comparison</div>
                </div>
              </div>
            </div>

            {/* Inventory Management */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="font-bold text-black text-lg">Inventory Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-200">
                  <span className="w-4 h-4 bg-green-600 rounded-full flex-shrink-0"></span>
                  <div className="flex-1">
                    <div className="font-semibold text-black text-sm">In Stock</div>
                    <div className="text-gray-600 text-xs">Products available for sale</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-200">
                  <span className="w-4 h-4 bg-yellow-600 rounded-full flex-shrink-0"></span>
                  <div className="flex-1">
                    <div className="font-semibold text-black text-sm">Low Stock</div>
                    <div className="text-gray-600 text-xs">Items requiring restocking</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-200">
                  <span className="w-4 h-4 bg-red-600 rounded-full flex-shrink-0"></span>
                  <div className="flex-1">
                    <div className="font-semibold text-black text-sm">Out of Stock</div>
                    <div className="text-gray-600 text-xs">Products unavailable for purchase</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-black text-lg">System Features</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <div className="font-semibold text-black mb-1">⚡ Real-time Updates</div>
                  <div className="text-gray-600 text-xs">Live data synchronization across all metrics</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <div className="font-semibold text-black mb-1">📱 Responsive Design</div>
                  <div className="text-gray-600 text-xs">Optimized viewing on all device sizes</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <div className="font-semibold text-black mb-1">🔒 Secure Access</div>
                  <div className="text-gray-600 text-xs">Protected admin authentication system</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-black font-semibold text-sm">Dashboard Status:</span>
                <span className="text-green-600 font-bold text-sm">All systems operational</span>
              </div>
              <div className="text-xs text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">        {[
          {
            label: "Total Sales",
            value: "$102,450",
            color: "text-green-600",
          },
          {
            label: "Total Orders",
            value: "2,134",
            color: "text-blue-600",
          },
          {
            label: "Total Customers",
            value: "1,430",
            color: "text-purple-600",
          },
          {
            label: "Refunds",
            value: "64",
            color: "text-red-600",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white text-black p-4 sm:p-5 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-xs sm:text-sm text-gray-600">{label}</h3>
            <p
              className={`mt-1 sm:mt-2 text-2xl sm:text-3xl font-semibold ${color}`}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
      <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-8">
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
            <ResponsiveContainer
              width="100%"
              height={300}
              minWidth={200}
              minHeight={200}
            >
              <LineChart
                data={dummySalesData}
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
                  tickFormatter={(value) => `$${value / 1000}k`}
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
                  formatter={(value) => [`$${value.toLocaleString()}`, "Sales"]}
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
                  name="Sales ($)"
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
          </div>
        </div>

        {/* Orders Chart */}
        <div className="w-full bg-gradient-to-br from-white to-blue-50 p-2 sm:p-4 md:p-6 xl:p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <div className="flex items-center justify-between mb-2 sm:mb-4 md:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
                Monthly Orders
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm">
                Order volume trends
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md flex items-center justify-center w-10 h-10">
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <ResponsiveContainer
              width="100%"
              height={300}
              minWidth={200}
              minHeight={200}
            >
              <LineChart
                data={dummySalesData}
                margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="ordersGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
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
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e40af",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#e5e7eb" }}
                  formatter={(value) => [value.toLocaleString(), "Orders"]}
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
                  dataKey="orders"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  name="Orders"
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                  activeDot={{
                    r: 8,
                    fill: "#3b82f6",
                    stroke: "#fff",
                    strokeWidth: 3,
                  }}
                  fill="url(#ordersGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Enhanced Charts */}
      <div className="w-full  grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-8">
        {/* Category Sales - Bar Chart */}
        <div className="w-full bg-gradient-to-br from-white to-purple-50 p-2 sm:p-4 md:p-6 xl:p-8 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <div className="flex items-center justify-between mb-2 sm:mb-4 md:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
                Sales by Category
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm">
                Revenue distribution across categories
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-md flex items-center justify-center w-10 h-10">
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <ResponsiveContainer
              width="100%"
              height={300}
              minWidth={200}
              minHeight={200}
            >
              <BarChart
                data={categoryData}
                margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
              >
                <defs>
                  {categoryData.map((entry, index) => (
                    <linearGradient
                      key={`gradient-${index}`}
                      id={`barGradient-${index}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={entry.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={entry.color}
                        stopOpacity={0.4}
                      />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  strokeOpacity={0.6}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={{ stroke: "#d1d5db" }}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={{ stroke: "#d1d5db" }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#7c3aed",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#e5e7eb" }}
                  formatter={(value) => [`$${value.toLocaleString()}`, "Sales"]}
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
                <Bar
                  dataKey="sales"
                  radius={[8, 8, 0, 0]}
                  fill={(entry, index) => `url(#barGradient-${index})`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#barGradient-${index})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue vs Profit - Area Chart */}
        <div className="w-full bg-gradient-to-br from-white to-orange-50 p-2 sm:p-4 md:p-6 xl:p-8 rounded-2xl shadow-lg border border-orange-100 hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <div className="flex items-center justify-between mb-2 sm:mb-4 md:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
                Revenue & Profit
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm">
                Quarterly performance comparison
              </p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-md flex items-center justify-center w-10 h-10">
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <ResponsiveContainer
              width="100%"
              height={300}
              minWidth={200}
              minHeight={200}
            >
              <AreaChart
                data={revenueData}
                margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient
                    id="profitGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  strokeOpacity={0.6}
                />
                <XAxis
                  dataKey="period"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={{ stroke: "#d1d5db" }}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={{ stroke: "#d1d5db" }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ea580c",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#e5e7eb" }}
                  formatter={(value, name) => [
                    `$${value.toLocaleString()}`,
                    name === "revenue" ? "Revenue" : "Profit",
                  ]}
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
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="#f59e0b"
                  fill="url(#revenueGradient)"
                  strokeWidth={3}
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stackId="2"
                  stroke="#10b981"
                  fill="url(#profitGradient)"
                  strokeWidth={3}
                  name="Profit"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
  <div className="bg-white text-black p-4 sm:p-6 rounded-lg shadow-lg border border-gray-200">
    <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-black">Quick Actions</h2>
    <ul className="space-y-2 sm:space-y-3">
      <li>
        <button className="w-full text-left text-blue-600 hover:text-blue-700 transition font-medium">
          ➕ Add New Product
        </button>
      </li>
      <li>
        <button className="w-full text-left text-blue-600 hover:text-blue-700 transition font-medium">
          📦 View Order History
        </button>
      </li>
      <li>
        <button className="w-full text-left text-blue-600 hover:text-blue-700 transition font-medium">
          📧 Send Marketing Email
        </button>
      </li>
    </ul>
  </div>

  <div className="bg-white text-black p-4 sm:p-6 rounded-lg shadow-lg border border-gray-200">
    <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-black">System Alerts</h2>
    <ul className="text-sm space-y-2 text-red-600">
      <li>⚠️ Low inventory on <strong>5 products</strong></li>
      <li>🕓 <strong>8 unfulfilled orders</strong> pending</li>
      <li>📬 <strong>12 unread messages</strong> in contact form</li>
      <li>🖼️ <strong>3 products</strong> missing images</li>
      <li>🔐 New admin login detected from <strong>unknown device</strong></li>
    </ul>
  </div>
</div>

<div className="bg-white text-black p-4 sm:p-6 rounded-lg shadow-lg border border-gray-200 mt-6 sm:mt-8">
  <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-black">Top Selling Products</h2>
  <ul className="divide-y divide-gray-200">
    {[
      { name: "Wireless Headphones", sold: 320 },
      { name: "Smart Watch", sold: 289 },
      { name: "Bluetooth Speaker", sold: 245 },
      { name: "Fitness Tracker", sold: 210 },
      { name: "USB-C Cable", sold: 198 },
    ].map((product) => (
      <li
        key={product.name}
        className="py-2 sm:py-3 px-2 flex justify-between items-center hover:bg-gray-50 rounded transition"
      >
        <span className="text-sm text-black">{product.name}</span>
        <span className="font-bold text-green-600">{product.sold} sold</span>
      </li>
    ))}
  </ul>
</div>

<div className="bg-white text-black p-4 sm:p-6 rounded-lg shadow-lg border border-gray-200 mt-6 sm:mt-8">
  <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-black">Inventory Overview</h2>
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
    <div className="bg-gray-50 border border-gray-200 p-3 sm:p-4 rounded shadow-sm">
      <h4 className="text-sm text-gray-600">In Stock</h4>
      <p className="text-lg sm:text-xl font-semibold text-green-600">1,250</p>
    </div>
    <div className="bg-gray-50 border border-gray-200 p-3 sm:p-4 rounded shadow-sm">
      <h4 className="text-sm text-gray-600">Low Stock</h4>
      <p className="text-lg sm:text-xl font-semibold text-yellow-600">32</p>
    </div>
    <div className="bg-gray-50 border border-gray-200 p-3 sm:p-4 rounded shadow-sm">
      <h4 className="text-sm text-gray-600">Out of Stock</h4>
      <p className="text-lg sm:text-xl font-semibold text-red-600">7</p>
    </div>
    <div className="bg-gray-50 border border-gray-200 p-3 sm:p-4 rounded shadow-sm">
      <h4 className="text-sm text-gray-600">Backordered</h4>
      <p className="text-lg sm:text-xl font-semibold text-blue-600">15</p>
    </div>
  </div>
</div>

    </div>
  );
};

export default Page;
