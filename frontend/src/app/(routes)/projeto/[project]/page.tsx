"use client"
import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Btn, Textarea, Title } from "@/app/components";

import clsx from "clsx";
import app from "@/styles/app.module.scss";
import s from "./style.module.scss";

type PageParams = {
  params: Promise<{
    project: string
  }>
}

export default function Page({ params }: PageParams) {
  const { project: projectId } = use(params);
  
  const [context, setContext] = useState<string>("");

  const project = useQuery({
    queryKey: ["project", projectId],
    queryFn: fetchProject,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  // if (!project.isSuccess && !project.data)
  //   return null;

  return (
    <div className={ clsx(app.page, s.page) }>
      <Title
        typeSeo={ 1 }
        typeStyle={ 1 }
        color="blue"
        text="NOME DO PROJETO"
        align="center"
      />

      <div className={ s.satisfaction }>
        <Title
          typeSeo={ 2 }
          typeStyle={ 2 }
          color="blue"
          text={
            <>
              <span>
                SATISFAÇÃO DO CLIENTE&nbsp;
              </span>
              -&nbsp;
              <span>
                69%
              </span> 
            </>
          }
        />
        
        <div className={ s.bar }>
          <div 
            className={ s.value }
            style={{ width: "69%" }}
          />
        </div>
        
        <div className={ s.reason }>
          Lorem Ipsum dolor sit amet consecutur Lorem Ipsum dolor sit amet consecutur Lorem Ipsum dolor sit amet consecutur Lorem Ipsum dolor sit amet consecutur Lorem Ipsum dolor sit amet consecutur Lorem Ipsum dolor sit amet consecutur Lorem Ipsum dolor sit amet consecutur Lorem Ipsum dolor sit amet consecutur Lorem Ipsum dolor sit amet consecutur Lorem Ipsum dolor sit amet consecutur Lorem Ipsum dolor sit amet consecutur Lorem Ipsum dolor sit amet consecutur Lorem Ipsum dolor sit amet consecutur Lorem Ipsum dolor sit amet consecutur Lorem Ipsum dolor sit amet consecutur Lorem Ipsum dolor sit amet consecutur Lorem Ipsum dolor sit amet consecutur Lorem Ipsum dolor sit amet consecutur Lorem Ipsum dolor sit amet consecutur Lorem Ipsum dolor sit amet consecutur Lorem Ipsum dolor sit amet consecutur Lorem Ipsum dolor sit amet consecutur Lorem Ipsum dolor sit amet consecutur Lorem Ipsum dolor sit amet consecutur 
        </div>
      </div>

      <div className={ s.roadmap }>
        <Title
          typeSeo={ 2 }
          typeStyle={ 2 }
          color="blue"
          text="ROADMAP"
          align="center"
        />
        
        <div className={ s.visualization }>
          
        </div>

        <div className={ s.context }>
          <Textarea
            name="context"
            rows={ 8 }
            value={ context }
            setValue={ setContext }
            color="blue"
            maxLength={ 1024 }
            placeholder="Janela de contexto"
          />
        </div>

        <div className={ s.btns }>
          <Btn
            type="button"
            onClick={ () => {} }
            color="white"
            bgColor="blue"
            text="ATUALIZAR COM IA"
            transition="growSmall"
          />

          <Btn
            type="button"
            onClick={ () => {} }
            color="white"
            bgColor="red"
            text="REVERTER"
            transition="growSmall"
          />

          <Btn
            type="button"
            onClick={ () => {} }
            color="white"
            bgColor="green"
            text="SALVAR"
            transition="growSmall"
          />
        </div>
      </div>
    </div>
  )

  async function fetchProject() {
    const res = await fetch(`https://vctapi.marcola.shop/api/v1/projects/1`, {
      headers: {
        "Content-type": "application/json",
      },
    })

    if (!res.ok)
      throw new Error("Ocorreu um erro ao buscar o projeto");

    const data = await res.json();
    console.log(data);
    return data;
  }
}