import { Navbar } from "@/components/ui/storefront/Navbar";
import { ReactNode } from "react";

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</main>
    </>
  );
}
