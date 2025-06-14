import Link from "next/link";
import Image from "next/image";

import { NavbarUserType } from "../";
import { NavbarLinks } from "../Links";

import clsx from "clsx"
import s from "../style.module.scss";

export function NavbarDesktop({ navbarUserType }: { navbarUserType?: NavbarUserType }) {
  return (
    <div 
      className={ clsx(s.navbar, s.navbarDesktop) }
      id={ clsx(s.desktop, "desktop") }
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

      <NavbarLinks 
        navbarType="desktop"
        navbarUserType={ navbarUserType }
      />
    </div>
  )
}