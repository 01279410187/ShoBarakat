// import { EditForm } from "@/components/ui/dashboard/EditForm";
// import prisma from "@/lib/db";
// import { notFound } from "next/navigation";

// async function getData(productId: string) {
//   const data = await prisma.product.findUnique({
//     where: {
//       id: productId,
//     },
//   });
//   if (!data) {
//     return notFound();
//   }
//   return data;
// }

// export default async function EditProduct({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const data = await getData((await params).id);

//   return <EditForm data={data} />;
// }




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
  const data = await getData(params.id);

  return <EditForm data={data} />;
}