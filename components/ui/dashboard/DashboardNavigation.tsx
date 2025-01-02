"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
  },
  {
    name: "Products",
    href: "/dashboard/products",
  },
  {
    name: "Banner Picture",
    href: "/dashboard/banner",
  },
];

export default function DashboardNavigation() {
  const pathname = usePathname();
  return (
    <>
      {links.map((links) => (
        <Link
          key={links.href}
          href={links.href}
          className={cn(
            links.href === pathname
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {links.name}
        </Link>
      ))}
    </>
  );
}
