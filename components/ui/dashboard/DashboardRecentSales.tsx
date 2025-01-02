import prisma from "@/lib/db";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../card";

async function getData() {
  const data = await prisma.order.findMany({
    select: {
      id: true,
      amount: true,
      User: {
        select: {
          FirstName: true,
          email: true,
          profileImage: true,
        },
      },
    },
    orderBy: {
      createAt: "desc",
    },
    take: 7,
  });
  return data;
}
export default async function DashboardRecentSales() {
  const data = await getData();
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          {data.map((item) => (
            <div className="flex items-center gap-4" key={item.id}>
              <Avatar className="hidden sm:flex h-9 w-9">
                <AvatarImage src={item.User?.profileImage} alt="Avatar Image" />
                <AvatarFallback>
                  {item.User?.FirstName.slice(0, 3)}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium">{item.User?.FirstName}</p>
                <p className="text-sm text-muted-foreground">
                  {item.User?.email}
                </p>
              </div>
              <p className="ml-auto font-medium">
                +${new Intl.NumberFormat("en-US").format(item.amount / 100)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
