import Image from "next/image";
import { FaStar, FaRegStar, FaStarHalfStroke } from "react-icons/fa6";

import { Btn, Title } from "@/app/components";

import clsx from "clsx";
import app from "@/styles/app.module.scss";
import s from "./style.module.scss";

export default async function Home() {  
  return (
    <div className={ clsx(app.page, s.page) }>
      
    </div>
  )
}