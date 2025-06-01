// import { redis } from "@/app/lib/redis";
// import prisma from "@/lib/db";
// import { stripe } from "@/lib/stripe";
// import { headers } from "next/headers"

// export async function POST(req: Request) {
//   const body = await req.text();

//   const signature = (await headers()).get("Stripe-Signature") as string;

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       body,
//       signature,
//       process.env.STRIPE_SECRET_WEBHOOK as string
//     );
//   } catch (error: unknown) {
//     return new Response(`${error}`, { status: 400 });
//   }

//   switch (event.type) {
//     case "checkout.session.completed": {
//       const session = event.data.object;

//       await prisma.order.create({
//         data: {
//           amount: session.amount_total as number,
//           status: session.status as string,
//           userId: session.metadata?.userId,
//         },
//       });

//       await redis.del(`cart-${session.metadata?.userId}`);
//       break;
//     }
//     default: {
//       console.log("unhandled event");
//     }
//   }

//   return new Response(null, { status: 200 });
// }




import { redis } from "@/app/lib/redis";
import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const body = await req.text();

  const signature = (await headers()).get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_SECRET_WEBHOOK as string
    );
  } catch (error: unknown) {
    return new Response(`Webhook Error: ${error}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      // Ensure required fields are present and valid
      if (
        typeof session.amount_total !== "number" ||
        typeof session.status !== "string" ||
        !session.metadata?.userId
      ) {
        return new Response("Invalid session data", { status: 400 });
      }

      try {
        // Save order to database
        await prisma.order.create({
          data: {
            amount: session.amount_total,
            status: session.status,
            userId: session.metadata.userId,
          },
        });

        // Clear cart from Redis
        await redis.del(`cart-${session.metadata.userId}`);
      } catch (err) {
        console.error("Database or Redis error:", err);
        return new Response("Internal Server Error", { status: 500 });
      }

      break;
    }

    default: {
      console.log("Unhandled Stripe event type:", event.type);
    }
  }

  return new Response(null, { status: 200 });
}
