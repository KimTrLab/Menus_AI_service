import AppLayout from "@/components/layout/AppLayout";
import MenuDashboard from "@/components/menu/MenuDashboard";

export default function HomePage() {
  return (
    <AppLayout>
      <h1>음식 메뉴 관리 시스템</h1>

      <MenuDashboard />
    </AppLayout>
  );
}