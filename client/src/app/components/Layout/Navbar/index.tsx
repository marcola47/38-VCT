"use client"
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

import { useScreenWidth } from "@/libs/hooks";
import { NavbarDesktop } from "./Desktop";
import { NavbarMobile } from "./Mobile";

import clsx from "clsx";
import app from "@/styles/app.module.scss";
import s from "./style.module.scss";

export type NavbarUserType = "user" | "visitor" | "none";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const screenWidth = useScreenWidth();
  
  const [navbarUserType, setNavbarUserType] = useState<NavbarUserType>();

  useEffect(() => {
    if (pathname && session !== undefined)
      setNavbarUserType(getNavbarUserType())
  }, [pathname, session])

  if (!screenWidth || !navbarUserType) {
    return (
      <nav 
        className={ clsx(s.navbar, s.navbarLoading, s.navbarWrapper, s.navbarWrapperOpen) }
        id={ clsx(s.wrapper, "wrapper") }
        role="navigation"
        aria-label="Main Navigation"
      > 
        <Link 
          className={ s.logo }
          href="/"
        >
          <Image
            src="/logo/logo--dark.png"
            alt="Logo"
            width={ 335 }
            height={ 63 }
          />
        </Link>

        <div className={ clsx(app.loadingSprite, s.links) }/>
      </nav>
    )
  }

  if (screenWidth >= 1024)
    return <NavbarDesktop navbarUserType={ navbarUserType }/>

  return <NavbarMobile/>

  function getNavbarUserType(): NavbarUserType | undefined {    
    if (session?.user) {
      return "user"
    }

    if (pathname === "/admin/login")
      return "none";

    return "visitor";
  }
}