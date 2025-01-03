import { EditForm } from "@/components/ui/dashboard/EditForm";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

async function getData(productId: string) {
  const data = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!data) {
    return notFound();
  }
  return data;
}

// Define the correct type for params
type PageProps = {
  params: { id: string };
};

export default async function EditProduct({ params }: PageProps) {
  // Await params to satisfy Next.js's requirement
  const resolvedParams = await Promise.resolve(params);

  // Fetch data using the resolved params
  const data = await getData(resolvedParams.id);

  return <EditForm data={data} />;
}