import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/db";

import { MoreHorizontal, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

async function getData() {
  const data = await prisma.banner.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
  return data;
}

export default async function Banner() {
  const data = await getData();

  return (
    <>
      <div className="flex items-center justify-end">
        <Button asChild>
          <Link href="/dashboard/banner/create">
            <PlusCircle className="w-4 h-4" />
            <p>Add Banner</p>
          </Link>
        </Button>
      </div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Banner Details</CardTitle>
          <CardDescription>This is a banner details page</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
             
                {data.map((item) => (
                  <>
                   <TableRow key={item.id}>
                    <TableCell>
                      <Image
                        alt="Banner Image"
                        src={item.imageBanner}
                        width={64}
                        height={64}
                        className="rounded-lg object-cover h-16 w-16"
                      />
                    </TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell className="text-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/banner/${item.id}/delete`}>
                              Delete
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    </TableRow>
                  </>
                ))}
              
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
