import { getLatestDashboardData } from "@/lib/dashboard-store";
import { DashboardClient } from "@/components/DashboardClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getLatestDashboardData();
  return <DashboardClient data={data} />;
}
