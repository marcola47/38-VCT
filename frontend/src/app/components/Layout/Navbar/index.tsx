"use client"
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const screenWidth = useScreenWidth();
  
  const [navbarUserType, setNavbarUserType] = useState<NavbarUserType>();

  useEffect(() => setNavbarUserType(getNavbarUserType()), [pathname])

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
          <div className={ s.logo }>
            RODAI
          </div>
        </Link>

        <div className={ clsx(app.loadingSprite, s.links) }/>
      </nav>
    )
  }

  if (screenWidth >= 1024)
    return <NavbarDesktop navbarUserType={ navbarUserType }/>

  return <NavbarMobile/>

  function getNavbarUserType(): NavbarUserType | undefined {
    return "visitor";
  }
}