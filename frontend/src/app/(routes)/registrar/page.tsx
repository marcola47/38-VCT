import { signup } from "@/libs/supabase/actions"

import clsx from "clsx"
import app from "@/styles/app.module.scss";
import s from "./style.module.scss";

// NAO DEVERÁ SER ACESSADO

export default function Page() {
  return (
    <div className={ clsx(app.page, s.page) }>
      <form className={ s.form }>
        <label htmlFor="email">
          Email:
        </label>
        
        <input id="email" name="email" type="email" required />
        
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        
        <button formAction={signup}>Sign up</button>
      </form>
    </div>
  )
}