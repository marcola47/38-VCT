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
        <Image
          src="/logo/logo--dark.png"
          alt="Logo"
          width={ 335 }
          height={ 63 }
        />
      </Link>

      <NavbarLinks 
        navbarType="desktop"
        navbarUserType={ navbarUserType }
        separator
      />
    </div>
  )
}