import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="h-screen flex overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 py-6 h-full overflow-y-auto p-2 bg-gray-100">
        {children}
      </main>
    </div>
  );
}