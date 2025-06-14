import { redirect } from "next/navigation"
import { createClient } from "@/libs/supabase/server"

import clsx from "clsx"
import app from "@/styles/app.module.scss";
import s from "./style.module.scss";

export default async function Page() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user)
    redirect("/login")
  
  return (
    <div className={ clsx(app.page, s.page) }>
      <p>
        Hello { data.user.email }
      </p>
    </div>
  )
}