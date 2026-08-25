"use client";

import { usePathname } from "next/navigation";
import NavbarMain from "@/components/navbar/NavbarMain";
import FooterMain from "@/components/footer/FooterMain";
import NavbarAuth from "@/components/navbar/NavbarAuth";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideRoutes = ["/dashboard", "/admin-dashboard", "/authentication"];
  const hideLayout = hideRoutes.some((route) => pathname.startsWith(route));

  return (
    <>
      {!hideLayout && <NavbarMain />}
      {pathname.startsWith("/authentication") && <NavbarAuth />}
      <main id="main-content" className="min-h-screen" tabIndex={-1}>{children}</main>
      {!hideLayout && <FooterMain />}
    </>
  );
}
