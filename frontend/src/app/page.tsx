"use client"
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPortal } from "react-dom";
import Link from "next/link";
import { toast } from "sonner";
import { FaSlack, FaEnvelope, FaRegTrashCan } from "react-icons/fa6";

import { Btn, Input, ModalConfirmation, Selector, Title } from "@/app/components";

import clsx from "clsx";
import app from "@/styles/app.module.scss";
import s from "./style.module.scss";

const projectsMock: any[] = [
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

const integrationsMock: any[] = [
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
  const queryClient = useQueryClient();
  
  const [modalDeleteShown, setModalDeleteShown] = useState<boolean>(false);
  const [integrationToDelete, setIntegrationToDelete] = useState<string>("");

  const [keyName, setKeyName] = useState<string>("");
  const [keyValue, setKeyValue] = useState<string>("");
  const [keyType, setKeyType] = useState<"slack" | "gmail" | null>(null);

  const projects = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  const integrations = useQuery({
    queryKey: ["integrations"],
    queryFn: fetchIntegrations,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  const integrationDeleteMutation = useMutation<void, Error>({
    mutationFn: deleteIntegration,
    onError: () => toast.error("Ocorreu um erro ao excluir integração"),
    onSuccess: () => {
      setModalDeleteShown(false);
      toast.success("Integração deletada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["integrations"] })
    }
  })

  const integrationCreateMutation = useMutation<void, Error>({
    mutationFn: createIntegration,
    onError: () => toast.error("Ocorreu um erro ao criar integração"),
    onSuccess: () => {
      setKeyName("");
      setKeyValue("");
      setKeyType(null);
      setModalDeleteShown(false);

      toast.success("Integração criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["integrations"] })
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
            onConfirm={ integrationDeleteMutation.mutate }
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
            projectsMock.map(project => (
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
            integrationsMock.map(integration => (
              <Integration
                key={ integration.id }
                integration={ integration }
              />
            ))
          }
        </div>

        <div className={ s.create }>
          <Title
            typeSeo={ 2 }
            typeStyle={ 2 }
            color="purple"
            text="CADASTRAR NOVA INTEGRAÇÃO"
          />
          
          <div className={ s.form }>
            <Input
              type="text"
              name="keyName"
              id={ s.keyName }
              value={ keyName }
              setValue={ setKeyName }
              label="Nome da chave"
              color="purple"
              overrideClasses={ s.keyName }
            />
            <Input
              type="password"
              name="keyValue"
              id={ s.keyValue }
              value={ keyValue }
              setValue={ setKeyValue }
              label="Chave"
              color="purple"
              overrideClasses={ s.keyValue }
            />

            <Selector
              items={["slack", "gmail"]}
              setItem={ setKeyType }
              removable={ false }
              color="purple"
              label="Tipo de integração"
              overrideClasses={ s.keyType }
            />

            <Btn
              type="button"
              onClick={ integrationCreateMutation.mutate }
              loading={ integrationCreateMutation.isPending }
              color="white"
              bgColor="purple"
              text="CRIAR INTEGRAÇÃO"
              transition="growSmall"
              overrideClasses={ s.btn }
            />
          </div>
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
          onClick={
            () => {
              setModalDeleteShown(true);
              setIntegrationToDelete(integration.id)
            }
          }
        />
      </div>
    )
  }

  async function fetchProjects() {
    const res = await fetch("", {
      headers: {
        "Content-type": "application/json"
      }
    })

    if (!res.ok)
      throw new Error("Ocorreu um erro ao buscar projetos");

    const { data } = await res.json();
    return data;
  }

  async function fetchIntegrations() {
    const res = await fetch("", {
      headers: {
        "Content-type": "application/json"
      }
    })

    if (!res.ok)
      throw new Error("Ocorreu um erro ao buscar projetos");
    
    const { data } = await res.json();
    return data;
  }

  async function createIntegration() {
    const res = await fetch("", {
      method: "DELETE",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        keyName,
        keyValue,
        keyType
      })
    })

    if (!res.ok)
      throw new Error("Ocorreu um erro ao deletar integração");
  }

  async function deleteIntegration() {
    const res = await fetch(`${integrationDeleteMutation}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json"
      },
    })

    if (!res.ok)
      throw new Error("Ocorreu um erro ao deletar integração");
  }
}