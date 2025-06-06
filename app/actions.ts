"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {  redirect } from "next/navigation";

import { parseWithZod } from "@conform-to/zod";
import { bannerSchemas, productSchemas } from "./lib/zodSchemas";
import prisma from "@/lib/db";
import { redis } from "./lib/redis";
import { Cart } from "./lib/interfaces";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";


export async function createProduct(prevState: unknown, formData: FormData) {
  const { getUser } = getKindeServerSession();

  const user = await getUser();
  if (!user || user.email !== "ab560968@gmail.com") {
    return redirect("/");
  }

  const submission = parseWithZod(formData, {
    schema: productSchemas,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }
  const flattenUrls = submission.value.image.flatMap((urlString) =>
    urlString.split(",").map((url) => url.trim())
  );

  await prisma.product.create({
    data: {
      name: submission.value.name,
      description: submission.value.description,
      status: submission.value.status,
      price: submission.value.price,
      image: flattenUrls,
      category: submission.value.category,
      isFeatured: submission.value.isFeatured === true ? true : false,
    },
  });

  redirect("/dashboard/products");
}

export async function editProduct(prevState: unknown, formData: FormData) {
  const { getUser } = getKindeServerSession();

  const user = await getUser();
  if (!user || user.email !== "ab560968@gmail.com") {
    return redirect("/");
  }

  const submission = parseWithZod(formData, {
    schema: productSchemas,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }
  const flattenUrls = submission.value.image.flatMap((urlString) =>
    urlString.split(",").map((url) => url.trim())
  );
  const productId = formData.get("productId") as string;
  await prisma.product.update({
    where: { id: productId },
    data: {
      name: submission.value.name,
      description: submission.value.description,
      status: submission.value.status,
      price: submission.value.price,
      image: flattenUrls,
      category: submission.value.category,
      isFeatured: submission.value.isFeatured === true ? true : false,
    },
  });

  redirect("/dashboard/products");
}

export async function deleteProduct(formData: FormData) {
  const { getUser } = getKindeServerSession();

  const user = await getUser();
  if (!user || user.email !== "ab560968@gmail.com") {
    return redirect("/");
  }

  await prisma.product.delete({
    where: {
      id: formData.get("productId") as string,
    },
  });
  redirect("/dashboard/products");
}

export async function createBanner(pervState: unknown, formData: FormData) {
  const { getUser } = getKindeServerSession();

  const user = await getUser();
  if (!user || user.email !== "ab560968@gmail.com") {
    return redirect("/");
  }

  const submission = parseWithZod(formData, { schema: bannerSchemas });
  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.banner.create({
    data: {
      title: submission.value.title,
      imageBanner: submission.value.imageBanner,
    },
  });

  redirect("/dashboard/banner");
}

export async function deleteBanner(formData: FormData) {
  const { getUser } = getKindeServerSession();

  const user = await getUser();
  if (!user || user.email !== "ab560968@gmail.com") {
    return redirect("/");
  }

  await prisma.banner.delete({
    where: {
      id: formData.get("bannerId") as string,
    },
  });
  redirect("/dashboard/banner");
}

// export async function addItem(productId: string) {
//   const { getUser } = getKindeServerSession();

//   const user = await getUser();

//   if (!user) {
//     return redirect("/");
//   }
//   let cart: Cart | null = await redis.get(`cart-${user?.id}`);

//   const selectedProduct = await prisma.product.findUnique({
//     where: {
//       id: productId,
//     },
//     select: {
//       id: true,
//       price: true,
//       name: true,
//       image: true,
//     },
//   });
//   if (!selectedProduct) {
//     throw new Error("No product with this id");
//   }
//   let myCart = {} as Cart;

//   if (!cart || !cart.items) {
//     myCart = {
//       userId: user.id,
//       items: [
//         {
//           id: selectedProduct.id,
//           quantity: 1,
//           price: selectedProduct.price,
//           image: selectedProduct.image[0],
//           name: selectedProduct.name,
//         },
//       ],
//     };
//   } else {

//     let itemFound = false;

//     myCart.items = cart.items.map((item) => {
//       if (item.id === productId) {
//         itemFound = true;
//         item.quantity += 1;
//       }

//       return item;
//     });
//   }

//   if (!itemFound) {
//     myCart.items.push({
//       id: selectedProduct.id,
//       quantity: 1,
//       name: selectedProduct.name,
//       price: selectedProduct.price,
//       image: selectedProduct.image[0],
//     });
//   }

//   await redis.set(`cart-${user.id}`);

//   revalidatePath("/", "layout");
// }

export async function addItem(productId: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/");
  }

  const cart: Cart | null = await redis.get(`cart-${user.id}`);

  const selectedProduct = await prisma.product.findUnique({
    select: {
      id: true,
      name: true,
      price: true,
      image: true,
    },
    where: {
      id: productId,
    },
  });

  if (!selectedProduct) {
    throw new Error("No product with this id");
  }
  let myCart = {} as Cart;

  if (!cart || !cart.items) {
    myCart = {
      userId: user.id,
      items: [
        {
          price: selectedProduct.price,
          id: selectedProduct.id,
          image: selectedProduct.image[0],
          name: selectedProduct.name,
          quantity: 1,
        },
      ],
    };
  } else {
    let itemFound = false;

    myCart.items = cart.items.map((item) => {
      if (item.id === productId) {
        itemFound = true;
        item.quantity += 1;
      }

      return item;
    });

    if (!itemFound) {
      myCart.items.push({
        id: selectedProduct.id,
        image: selectedProduct.image[0],
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity: 1,
      });
    }
  }

  await redis.set(`cart-${user.id}`, myCart);

  revalidatePath("/", "layout");
}

export async function deleteItem(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/");
  }

  const productId = formData.get("productId");

  const cart: Cart | null = await redis.get(`cart-${user.id}`);

  if (cart && cart.items) {
    const updateCart: Cart = {
      userId: user.id,
      items: cart.items.filter((item) => item.id !== productId),
    };

    await redis.set(`cart-${user.id}`, updateCart);
  }

  revalidatePath("/bag");
}




export async function checkOut (){
  const {getUser} = getKindeServerSession()
  const user= await getUser()
  if(!user){
    return redirect('/')
  }
  const cart : Cart | null = await redis.get(`cart-${user.id}`)
  if(cart && cart.items){
    const lineItems : Stripe.Checkout.SessionCreateParams.LineItem[] = cart.items.map((item)=>({
      price_data: {
        currency: 'usd',
        unit_amount: item.price*100,
        product_data: {
          name : item.name,
          images: [item.image]
        }
      },
      quantity: item.quantity
    }))

    const session = await stripe.checkout.sessions.create({
      mode:"payment",
      line_items: lineItems,
      success_url:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}"
        : "http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url : process.env.NODE_ENV === "development"
      ? "http://localhost:3000/payment/cancel"
      : "http://localhost:3000/payment/success",
      metadata :{
        userId: user.id
      }
    })
    return redirect(session.url as string)
  }
}
