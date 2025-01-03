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
export type paramsType = Promise<{ id: string }>;

export default async function EditProduct(props: { params: paramsType }) {
  const data = await getData((await props.params).id);

  return <EditForm data={data} />;
}
