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
    <div className="p-6 space-y-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

      {/* KPI Cards - Dark Modern Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Sales", value: "$102,450", color: "text-green-400" },
          { label: "Total Orders", value: "2,134", color: "text-blue-400" },
          {
            label: "Total Customers",
            value: "1,430",
            color: "text-purple-400",
          },
          { label: "Refunds", value: "64", color: "text-red-400" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-gray-900 text-white p-5 rounded-lg shadow-lg border border-gray-800 hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-sm text-gray-400">{label}</h3>
            <p className={`mt-2 text-3xl font-semibold ${color}`}>{value}</p>
          </div>
        ))}
      </div>
      {/* Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Chart */}
        <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Monthly Sales
              </h2>
              <p className="text-gray-500 text-sm">
                Revenue performance over time
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl shadow-md">
              <svg
                className="w-6 h-6 text-white"
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
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={dummySalesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
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
              <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
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

        {/* Orders Chart */}
        <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Monthly Orders
              </h2>
              <p className="text-gray-500 text-sm">Order volume trends</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl shadow-md">
              <svg
                className="w-6 h-6 text-white"
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
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={dummySalesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
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
              <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
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
              />{" "}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Enhanced Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Sales - Bar Chart */}
        <div className="bg-gradient-to-br from-white to-purple-50 p-8 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Sales by Category
              </h2>
              <p className="text-gray-500 text-sm">
                Revenue distribution across categories
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl shadow-md">
              <svg
                className="w-6 h-6 text-white"
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
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={categoryData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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

        {/* Revenue vs Profit - Area Chart */}
        <div className="bg-gradient-to-br from-white to-orange-50 p-8 rounded-2xl shadow-lg border border-orange-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Revenue & Profit
              </h2>
              <p className="text-gray-500 text-sm">
                Quarterly performance comparison
              </p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl shadow-md">
              <svg
                className="w-6 h-6 text-white"
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
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart
              data={revenueData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
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
              <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
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

      {/* Additional Widgets - Dark Theme with Updated Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">
            Quick Actions
          </h2>
          <ul className="space-y-3">
            <li>
              <button className="w-full text-left text-blue-400 hover:text-blue-300 transition">
                ➕ Add New Product
              </button>
            </li>
            <li>
              <button className="w-full text-left text-blue-400 hover:text-blue-300 transition">
                📦 View Order History
              </button>
            </li>
            <li>
              <button className="w-full text-left text-blue-400 hover:text-blue-300 transition">
                📧 Send Marketing Email
              </button>
            </li>
          </ul>
        </div>

        {/* System Alerts - Updated */}
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">
            System Alerts
          </h2>
          <ul className="text-sm space-y-2 text-red-400">
            <li>
              ⚠️ Low inventory on <strong>5 products</strong>
            </li>
            <li>
              🕓 <strong>8 unfulfilled orders</strong> pending
            </li>
            <li>
              📬 <strong>12 unread messages</strong> in contact form
            </li>
            <li>
              🖼️ <strong>3 products</strong> missing images
            </li>
            <li>
              🔐 New admin login detected from <strong>unknown device</strong>
            </li>
          </ul>
        </div>
      </div>

      {/* Top Selling Products - Dark Theme */}
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-800 mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">
          Top Selling Products
        </h2>
        <ul className="divide-y divide-gray-800">
          {[
            { name: "Wireless Headphones", sold: 320 },
            { name: "Smart Watch", sold: 289 },
            { name: "Bluetooth Speaker", sold: 245 },
            { name: "Fitness Tracker", sold: 210 },
            { name: "USB-C Cable", sold: 198 },
          ].map((product) => (
            <li
              key={product.name}
              className="py-3 flex justify-between items-center hover:bg-gray-800 px-2 rounded transition"
            >
              <span className="text-sm">{product.name}</span>
              <span className="font-bold text-green-400">
                {product.sold} sold
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Inventory Overview - Dark Theme */}
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-800 mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">
          Inventory Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-800 p-4 rounded shadow-inner">
            <h4 className="text-sm text-gray-400">In Stock</h4>
            <p className="text-xl font-semibold text-green-400">1,250</p>
          </div>
          <div className="bg-gray-800 p-4 rounded shadow-inner">
            <h4 className="text-sm text-gray-400">Low Stock</h4>
            <p className="text-xl font-semibold text-yellow-400">32</p>
          </div>
          <div className="bg-gray-800 p-4 rounded shadow-inner">
            <h4 className="text-sm text-gray-400">Out of Stock</h4>
            <p className="text-xl font-semibold text-red-400">7</p>
          </div>
          <div className="bg-gray-800 p-4 rounded shadow-inner">
            <h4 className="text-sm text-gray-400">Backordered</h4>
            <p className="text-xl font-semibold text-blue-400">15</p>
          </div>
        </div>
      </div>

      {/* Upcoming Tasks/Reminders */}
    </div>
  );
};

export default Page;
