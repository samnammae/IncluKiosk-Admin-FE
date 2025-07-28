import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <Sidebar />
      <div className="ml-60 p-8 bg-gray-50 min-h-screen">{children}</div>
    </div>
  );
}
