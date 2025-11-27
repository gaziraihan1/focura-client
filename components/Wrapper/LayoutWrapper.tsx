"use client";

import { usePathname } from "next/navigation";
import NavbarMain from "../Navbar/NavbarMain";
import FooterMain from "../Footer/FooterMain";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideRoutes = ["/dashboard", "/admin-dashboard"];
  const hideLayout = hideRoutes.some((route) => pathname.startsWith(route));



  

  return (
    <>
      {!hideLayout && <NavbarMain />}
      <main className="min-h-screen">{children}</main>
      {
        !pathname.startsWith("/dashboard") && (
            <FooterMain />
        )
      }
    </>
  );
}
