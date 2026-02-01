"use client";

import { usePathname } from "next/navigation";
import NavbarMain from "../Navbar/NavbarMain";
import FooterMain from "../Footer/FooterMain";
import NavbarAuth from "../Navbar/NavbarAuth";

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
      <main className="min-h-screen">{children}</main>
      {!hideLayout && <FooterMain />}
    </>
  );
}
