"use client"
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaTimes, FaBars } from "react-icons/fa";

import { NavbarLinks } from "../Links";

import clsx from "clsx";
import s from "../style.module.scss";

export function NavbarMobile() {
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false);

  return (
    <>
      <div 
        className={ clsx(s.navbar, s.navbarMobile, navbarOpen && s.navbarMobileOpen) }
        id={ clsx(s.mobile, "mobile") }
        role="navigation"
        aria-label="Main Navigation"
      >
        <FaTimes
          className={ clsx(s.toggle, s.toggleClose) }
          onClick={ () => setNavbarOpen(false) }
        />
        
        <Link 
          className={ s.logo }
          href="/"
          onClick={ () => setNavbarOpen(false) }
        >
          <div className={ s.logo }>
            RODAI
          </div>
        </Link>

        <NavbarLinks
          navbarType="mobile"
          setNavbarOpen={ setNavbarOpen }
        />
      </div>

      <div 
        className={ clsx(s.navbar, s.navbarWrapper, !navbarOpen && s.navbarWrapperOpen) }
        id={ clsx(s.wrapper, "wrapper") }
      >
        <Link 
          className={ s.logo }
          href="/"
          onClick={ () => setNavbarOpen(false) }
        >
          <Image
            src="/logo/logo--dark.png"
            alt="Logo"
            width={ 335 }
            height={ 63 }
          />
        </Link>

        <FaBars
          className={ clsx(s.toggle, s.toggleOpen) }
          onClick={ () => setNavbarOpen(true) }
        />
      </div>
    </>
  )
}