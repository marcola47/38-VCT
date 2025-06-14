"use client"

import clsx from "clsx";
import app from "@/styles/app.module.scss";
import s from "./style.module.scss";

export default function Page() {  
  return (
    <div className={ clsx(app.page, s.page) }>

    </div>
  )
}