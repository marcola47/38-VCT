"use client"
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createPortal } from "react-dom";
import { FaSlack, FaEnvelope, FaRegTrashCan } from "react-icons/fa6";

import { Btn, ModalConfirmation, Title } from "@/app/components";

import clsx from "clsx";
import app from "@/styles/app.module.scss";
import s from "./style.module.scss";
import Link from "next/link";
import { toast } from "sonner";

const projects: any[] = [
  {
    id: "1",
    name: "Projeto 1",
    desc: "Lorem ipsum dolor sit amet consecutur ad elipsit."
  },
  {
    id: "2",
    name: "Projeto 2",
    desc: "Lorem ipsum dolor sit amet consecutur ad elipsit."
  },
  {
    id: "3",
    name: "Projeto 3",
    desc: "Lorem ipsum dolor sit amet consecutur ad elipsit."
  },
  {
    id: "4",
    name: "Projeto 4",
    desc: "Lorem ipsum dolor sit amet consecutur ad elipsit."
  },
  {
    id: "5",
    name: "Projeto 5",
    desc: "Lorem ipsum dolor sit amet consecutur ad elipsit."
  },
  {
    id: "6",
    name: "Projeto 6",
    desc: "Lorem ipsum dolor sit amet consecutur ad elipsit."
  },
]

const integrations: any[] = [
  {
    id: "1",
    name: "Slack - test 1",
    type: "slack",
  },
  {
    id: "2",
    name: "Slack - test 2",
    type: "slack",
  },
  {
    id: "3",
    name: "Gmail - test 1",
    type: "gmail",
  },
]

export default function Home() {  
  const [modalDeleteShown, setModalDeleteShown] = useState<boolean>(false);

  const integrationMutation = useMutation<void, Error>({
    mutationFn: deleteIntegration,
    onError: () => toast.error("Ocorreu um erro ao excluir integração"),
    onSuccess: () => {
      setModalDeleteShown(false);
      toast.success("Integração deletada com sucesso!");
      // invalidate query
    }
  })
  
  return (
    <div className={ clsx(app.page, s.page) }>
      {
        modalDeleteShown && 
        createPortal(
          <ModalConfirmation
            type="danger"
            title="Você tem certeza que deseja excluir esta integração?"
            message="Todos canais usados não serão mais acompanhados"
            onConfirm={ integrationMutation.mutate }
            onConfirmMessage="SIM"
            onCancel={ () => setModalDeleteShown(false) }
            onCancelMessage="NÃO"
          />,
          document.body
        )
      }
      
      <div className={ s.projects }>
        <Title
          typeSeo={ 1 }
          typeStyle={ 1 }
          text="PROJETOS"
          color="blue"
        />

        <div className={ s.list }>
          {
            projects.map(project => (
              <Project
                key={ project.id }
                project={ project }
              />
            ))
          }
        </div>

        <Btn
          type="link"
          href="/projeto/cadastrar"
          color="white"
          bgColor="blue"
          text="CADASTRAR NOVO PROJETO"
          transition="growSmall"
          overrideClasses={ s.btn }
        />
      </div>

      <div className={ s.integrations }>
        <Title
          typeSeo={ 1 }
          typeStyle={ 1 }
          text="INTEGRAÇÕES"
          color="purple"
        />

        <div className={ s.list }>
          {
            integrations.map(integration => (
              <Integration
                key={ integration.id }
                integration={ integration }
              />
            ))
          }
        </div>
      </div>
    </div>
  )

  function Project({ project }: { project: any }) {
    return (
      <Link 
        className={ s.project }
        href={`/projeto/${project.id}`}
      >
        <div className={ s.name }>
          { project.name }
        </div>

        <div className={ s.desc }>
          { project.desc }
        </div>
      </Link>
    )
  }

  function Integration({ integration }: { integration: any }) {
    return (
      <div className={ s.integration }>
        <div className={ s.type }>
          {
            integration.type === "slack" &&
            <FaSlack className={ s.icon }/>
          }
          {
            integration.type === "gmail" &&
            <FaEnvelope className={ s.icon }/>
          }
        </div>
        
        <div className={ s.name }>
          { integration.name }
        </div>

        <FaRegTrashCan 
          className={ s.delete }
          onClick={ () => setModalDeleteShown(true) }
        />
      </div>
    )
  }

  async function deleteIntegration() {
    
  }
}