import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Charts } from "@/components/ui/dashboard/Charts";
import DashboardRecentSales from "@/components/ui/dashboard/DashboardRecentSales";
import DashboardStats from "@/components/ui/dashboard/DashboardStats";
import prisma from "@/lib/db";

async function getData() {
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);
  const data = await prisma.order.findMany({
    where: {
      createAt: sevenDaysAgo,
    },
    select: {
      amount: true,
      createAt: true,
    },
    orderBy: {
      createAt: "asc",
    },
  });

  const result = data.map((item) => ({
    date: new Intl.DateTimeFormat("en-US").format(item.createAt),
    revenue: item.amount / 100,
  }));

  return result;
}
export default async function AdminDashboard() {
  const data = await getData();
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <DashboardStats />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 md:gap-8 xl:grid-cols-3 mt-5 ">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle> Transactions</CardTitle>
            <CardDescription>
              Recent transactions from the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Charts data={data} />
          </CardContent>
        </Card>

        <DashboardRecentSales />
      </div>
    </>
  );
}
