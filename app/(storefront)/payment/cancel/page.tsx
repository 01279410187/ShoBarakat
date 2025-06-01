// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { XCircle } from "lucide-react";
// import Link from "next/link";

// export default function Cancel(){
//     return (
//         <section className="w-full min-h-[80vh] flex items-center justify-center">
//         <Card className="w-[350px]">
//           <div className="p-6">
//             <div className="w-full flex justify-center">
//               <XCircle className="w-12 h-12 rounded-full bg-red-500/30 text-red-500 p-2" />
//             </div>
  
//             <div className="mt-3 text-center sm:mt-5 w-full">
//               <h3 className="text-lg leading-6 font-medium">Payment Cancelled</h3>
//               <p className="mt-2 text-sm text-muted-foreground">
//                 Something went wrong with your payment. You havent been charged.
//                 Please try again
//               </p>
  
//               <Button asChild className="w-full mt-5 sm:mt-6">
//                 <Link href="/">Back to Homepage</Link>
//               </Button>
//             </div>
//           </div>
//         </Card>
//       </section>
//     )
// }




// app/payment/success/page.tsx

import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

export default async function Success({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return redirect("/");
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return (
      <section className="w-full min-h-[80vh] flex items-center justify-center">
        <p className="text-center text-sm text-muted-foreground">
          Processing your payment... please wait.
        </p>
      </section>
    );
  }

  return (
    <section className="w-full min-h-[80vh] flex items-center justify-center">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="w-full flex justify-center">
            <Check className="w-12 h-12 rounded-full bg-green-500/30 text-green-500 p-2" />
          </div>

          <div className="mt-3 text-center sm:mt-5 w-full">
            <h3 className="text-lg leading-6 font-medium">
              Payment Successful
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Congrats on your purchase. Your payment was successful. Your cart has been cleared.
            </p>

            <Button asChild className="w-full mt-5 sm:mt-6">
              <Link href="/">Back to Homepage</Link>
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}
