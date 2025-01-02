import { DollarSign, PartyPopper, ShoppingBag, User2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import prisma from "@/lib/db";

async function getData() {
  const [user, product, order] = await Promise.all([
    await prisma.user.findMany({
      select: {
        id: true,
      },
    }),
    await prisma.product.findMany({
      select: {
        id: true,
      },
    }),
    await prisma.order.findMany({
      select: {
        amount: true,
      },
    }),
  ]);

  return {
    user,
    product,
    order,
  };
}

export default async function DashboardStats() {
  const { user, product, order } = await getData();

  const totalAmount = order.reduce((acc, curnetValue) => {
    return acc + curnetValue.amount;
  }, 0);
  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between flex-row pb-2">
          <CardTitle>Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            ${new Intl.NumberFormat("en-US").format(totalAmount / 100)}
          </p>
          <p className="text-xs text-muted-foreground">Based on 100 Charges </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex items-center justify-between flex-row pb-2">
          <CardTitle>Total Sales</CardTitle>
          <ShoppingBag className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">+{order.length}</p>
          <p className="text-xs text-muted-foreground">
            Total Sales on AMIB Market{" "}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex items-center justify-between flex-row pb-2">
          <CardTitle>Total Products</CardTitle>
          <PartyPopper className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{product.length}</p>
          <p className="text-xs text-muted-foreground">
            Total Products created
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex items-center justify-between flex-row pb-2">
          <CardTitle>Total Users</CardTitle>
          <User2 className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{user.length}</p>
          <p className="text-xs text-muted-foreground">
            {" "}
            Total Users Signed Up
          </p>
        </CardContent>
      </Card>
    </>
  );
}
