"use client"
import { Btn, Title } from "@/app/components";

import clsx from "clsx";
import app from "@/styles/app.module.scss";

type ErrorPageProps = {
  error: Error,
  reset?: () => void,
}

export function ErrorPage(props: ErrorPageProps) {
  const { error, reset }= props;

  return (
    <div className={ clsx(app.page, app.pageError) }>
      <div className={ app.titles }>        
        <Title
          typeSeo={ 1 }
          typeStyle={ 2 }
          color="red"
          text="Ocorreu um erro ao processar sua requisição:"
          align="center"
        />
      </div>
      
      <div className={ app.block }>
        <div className={ app.meta }>
          <div className={ app.code }>
            <span>
              Código:
            </span>
            
            <strong>
              &nbsp;
              { "unknown.error" }
            </strong>
          </div>

          <div className={ app.status }>
            <span>
              Status:
            </span>
            
            <strong>
              &nbsp;
              { 500 }
            </strong>
          </div>
        </div>

        <div className={ app.message }>
          { error.message || "Um erro desconhecido aconteceu." }
        </div>
      </div>

      <div className={ app.btns }>
        <Btn
          type="button"
          onClick={ reset ?? (() => {}) }
          bgColor="red"
          color="white"
          text="TENTAR NOVAMENTE"
          transition="growSmall"
        />

        <Btn
          type="link"
          href="/"
          color="red"
          borderColor="red"
          bgColor="white"
          text="VOLTAR PARA PÁGINA INICIAL"
          transition="bg"
          fillColor="red"
        />
      </div>
    </div>
  )
}