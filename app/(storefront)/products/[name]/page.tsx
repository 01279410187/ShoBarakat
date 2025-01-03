import { ProductCard } from "@/components/ui/storefront/ProductCard";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

async function getData(productCategory: string) {
  switch (productCategory) {
    case "all": {
      const data = await prisma.product.findMany({
        where: {
          status: "published",
        },
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          price: true,
        },
      });
      return {
        title: "All Products",
        data: data,
      };
    }
    case "men": {
      const data = await prisma.product.findMany({
        where: {
          status: "published",
          category: "men",
        },
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          price: true,
        },
      });

      return {
        title: "Men's Products",
        data: data,
      };
    }

    case "women": {
      const data = await prisma.product.findMany({
        where: {
          status: "published",
          category: "women",
        },
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          price: true,
        },
      });

      return {
        title: "Women's Products",
        data: data,
      };
    }

    case "kids": {
      const data = await prisma.product.findMany({
        where: {
          status: "published",
          category: "kids",
        },
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          price: true,
        },
      });

      return {
        title: "Kid's Products",
        data: data,
      };
    }
    default: {
      return notFound();
    }
  }
}

export default async function CategoryPage(
  props: {
    params: Promise<{ name: string }>;
  }
) {
  const params = await props.params;
  const { data, title } = await getData(params?.name);
  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight my-4">{title}</h1>
        <div className="grid md:grid-cols-2 gap-5 lg:grid-cols-3">
          {data.map((item, index) => (
            <div key={index}>
              <ProductCard item={item} key={index} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
