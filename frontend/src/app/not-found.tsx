import { Btn, Title } from "@/app/components";

import clsx from "clsx";
import app from "@/styles/app.module.scss";

export default function NotFound() {
  return (
    <div className={ clsx(app.page, app.pageNotFound) }>
      <Title
        typeSeo={ 1 }
        typeStyle={ 1 }
        color="purple"
        align="center"
        text="PÁGINA NÃO ENCONTRADA"
      />

      <p>
        A página que você está tentando acessar não existe ou foi removida.
      </p>
      
      <Btn
        type="link"
        href="/"
        bgColor="purple"
        color="white"
        text="VOLTAR PARA O INÍCIO"
        fullWidth
      />
    </div>
  )
}