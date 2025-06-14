// TO-DO: add small indicator on notifications and cart links if applicable
"use client"
import type { NavbarUserType } from "../";

import clsx from "clsx"
import s from "../style.module.scss";

type NavbarLinksProps = {
  navbarType?: "desktop" | "mobile"
  navbarUserType?: NavbarUserType,
  setNavbarOpen?: StateSetter<boolean>,
}

export function NavbarLinks(props: NavbarLinksProps) {
  const { 
    navbarType, 
    navbarUserType,
    setNavbarOpen,
  } = props;

  if (navbarUserType === "visitor") {
    return (
      <div className={ clsx(s.links, s.linksVisitor) }>
        
      </div>
    )
  }

  return <div className={ s.links }/>

  function handleClick() {
    if (navbarType === "mobile" && typeof setNavbarOpen === "function")
      setNavbarOpen(false);
  }
}