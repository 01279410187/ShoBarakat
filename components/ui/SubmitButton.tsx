"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./button";
import { Loader2, ShoppingBag } from "lucide-react";

export function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled>
          <Loader2 className="mr-2 w-2 h-2" />
          Please Wait
        </Button>
      ) : (
        <Button type="submit">{text}</Button>
      )}
    </>
  );
}

export function ShoppingCart() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled className="w-full mt-3">
          <Loader2 className="mr-2 w-2 h-2" />
          Please Wait
        </Button>
      ) : (
        <Button type="submit" className="w-full mt-3">
          <ShoppingBag className="mr-2 w-2 h-2" />
          Add To Cart
        </Button>
      )}
    </>
  );
}

export function DeleteItem() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <button disabled className="font-medium text-primary text-end">
          Removing...
        </button>
      ) : (
        <button type="submit" className="font-medium text-primary text-end">
          Delete
        </button>
      )}
    </>
  );
}

export function ChceckoutButton() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled size="lg" className="w-full mt-5">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Please Wait
        </Button>
      ) : (
        <Button type="submit" size="lg" className="w-full mt-5">
          Checkout
        </Button>
      )}
    </>
  );
}
