"use client";

import { useEffect, useState } from "react";
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

import MonthlySalesChart from "./components/MonthlySalesChart";
import MonthlyOrdersChart from "./components/MonthlyOrdersChart";

// Keep category and revenue data for other sections of dashboard
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
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    refunds: 0, // Static value as no refund tracking yet
  });
  const fetchMonthlySales = async (year = new Date().getFullYear()) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/monthly-sales?year=${year}`);
      const result = await response.json();


      if (result.success && result.data && result.data.length > 0) {
        const transformedData = result.data.map((item) => {
          const monthName = item.monthName.substring(0, 3); // First 3 letters of month
          const yearShort = item.year.toString().substring(2); // Last 2 digits of year

          return {
            month: `${monthName} ${yearShort}`, // e.g., "Jun 25"
            sales: item.totalSales || 0, // Use totalSales from API
            orders: item.totalOrders || 0, // Use totalOrders from API
            monthNumber: item.month, // Keep original month number for sorting
            fullMonthName: item.monthName, // Keep full month name
            year: item.year, // Keep year
          };
        });
        setMonthlySalesData(transformedData);

        // Calculate dashboard statistics from API data
        const totalSales =
          result.summary?.totalSales ||
          result.data.reduce((sum, item) => sum + (item.totalSales || 0), 0);
        const totalOrders =
          result.summary?.totalOrders ||
          result.data.reduce((sum, item) => sum + (item.totalOrders || 0), 0);

        setDashboardStats({
          totalSales: totalSales,
          totalOrders: totalOrders,
          totalCustomers: totalOrders,
          refunds: 0,
        });

      } else {
        setMonthlySalesData([]);
        setDashboardStats({
          totalSales: 0,
          totalOrders: 0,
          totalCustomers: 0,
          refunds: 0,
        });
        setError("No sales data found for the selected year");
      }
    } catch (err) {
      console.error("Error fetching monthly sales:", err);
      setError("Failed to fetch sales data from server");
      setMonthlySalesData([]);
      setDashboardStats({
        totalSales: 0,
        totalOrders: 0,
        totalCustomers: 0,
        refunds: 0,
      });
    } finally {
      setLoading(false);
    }
  };
  // Background cleanup function (called silently)
  const backgroundCleanup = async () => {
    try {
    } catch (err) {
    }
  };

  useEffect(() => {
    document.title = "Admin Dashboard | Century Market";

    // Fetch current year data
    fetchMonthlySales();

    // Run background cleanup
    backgroundCleanup();

    // Set up interval to refresh data every 5 minutes
    const interval = setInterval(() => {
      fetchMonthlySales();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    document.title = "Admin Dashboard | Century Market";
  }, []);
  return (
    <div className="sm:p-4 md:p-6 space-y-8 bg-white min-h-screen">
      <h1 className="text-3xl mt-10 md:mt-2 font-bold text-black">
        Admin Dashboard
      </h1>
      
      <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        
      </div>


      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {" "}
        {[
          {
            label: "Total Sales",
            value: `Rs ${dashboardStats.totalSales.toLocaleString()}`,
            color: "text-green-600",
          },          {
            label: "Total Orders",
            value: dashboardStats.totalOrders.toLocaleString(),
            color: "text-blue-600",
          },
          {
            label: "Total Customers",
            value: dashboardStats.totalCustomers.toLocaleString(),
            color: "text-purple-600",
          },
          {
            label: "Refunds",
            value: dashboardStats.refunds.toString(),
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
      <div className="space-y-8 bg-white">
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-8">
          <MonthlySalesChart data={monthlySalesData} loading={loading} />
          <MonthlyOrdersChart data={monthlySalesData} loading={loading} />
        </div>

        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => fetchMonthlySales()}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh Data"}
          </button>
        </div>
      </div>
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
                  tickFormatter={(value) => `Rs. ${value / 1000}k`}
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
                  tickFormatter={(value) => `Rs. ${value / 1000}k`}
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
                    `Rs ${value.toLocaleString()}`,
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
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-black">
            Quick Actions
          </h2>
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
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-black">
            System Alerts
          </h2>
          <ul className="text-sm space-y-2 text-red-600">
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
      <div className="bg-white text-black p-4 sm:p-6 rounded-lg shadow-lg border border-gray-200 mt-6 sm:mt-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-black">
          Top Selling Products
        </h2>
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
              <span className="font-bold text-green-600">
                {product.sold} sold
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white text-black p-4 sm:p-6 rounded-lg shadow-lg border border-gray-200 mt-6 sm:mt-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-black">
          Inventory Overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-gray-50 border border-gray-200 p-3 sm:p-4 rounded shadow-sm">
            <h4 className="text-sm text-gray-600">In Stock</h4>
            <p className="text-lg sm:text-xl font-semibold text-green-600">
              1,250
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 p-3 sm:p-4 rounded shadow-sm">
            <h4 className="text-sm text-gray-600">Low Stock</h4>
            <p className="text-lg sm:text-xl font-semibold text-yellow-600">
              32
            </p>
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
