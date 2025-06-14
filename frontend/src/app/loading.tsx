import clsx from "clsx"
import app from "@/styles/app.module.scss";

export default function Loading() {
  return (
    <div className={ clsx(app.page, app.pageLoading) }>
      <div className={ clsx(app.loader, app.loaderGrey, app.loaderXl) }/>
    </div>
  )
}