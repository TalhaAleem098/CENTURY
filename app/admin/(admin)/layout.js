import AdminAuthGuard from "./AdminAuthGuard";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <AdminAuthGuard>
      <div className="h-screen flex overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 h-full overflow-y-auto p-8 bg-gray-100">
          {children}
        </main>
      </div>
    </AdminAuthGuard>
  );
}
