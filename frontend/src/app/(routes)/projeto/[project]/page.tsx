import clsx from "clsx";
import app from "@/styles/app.module.scss";
import s from "./style.module.scss";

type PageParams = {
  params: Promise<{
    project: string
  }>
}

export default async function Page({ params }: PageParams) {
  const { project } = await params;
  
  return (
    <div className={ clsx(app.page, s.page) }>

    </div>
  )
}