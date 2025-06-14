import { Title } from "@/app/components";
import { Form } from "./form";

import clsx from "clsx"
import app from "@/styles/app.module.scss";
import s from "./style.module.scss";

export default function Page() {
  return (
    <div className={ clsx(app.page, s.page) }>
      <Title
        typeSeo={ 1 }
        typeStyle={ 1 }
        text="REALIZE SEU LOGIN"
        color="blue"
        align="center"
      />
      <Form/>
    </div>
  )
}