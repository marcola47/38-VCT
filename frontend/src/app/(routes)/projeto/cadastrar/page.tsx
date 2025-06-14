"use client"
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { FaChevronRight, FaFile, FaPlus, FaRegTrashCan, FaXmark } from "react-icons/fa6";

import { Btn, Input, Textarea, Title } from "@/app/components";

import clsx from "clsx";
import app from "@/styles/app.module.scss";
import s from "./style.module.scss";
import { useRouter } from "next/navigation";

type Channel = {
  id: string,
  name: string,
  type: "in" | "out"
}

export default function Page() {    
  const router = useRouter();
  
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [channelId, setChannelId] = useState<string>("");
  const [channelName, setChannelName] = useState<string>("");
  const [channelType, setChannelType] = useState<"in" | "out">("in");
  
  const [channels, setChannels] = useState<Channel[]>([])

  const projectMutation = useMutation<void, Error>({
    mutationFn: createProject,
    onSuccess: id => {
      router.push(`/projeto/${id}`)  
    }
  })

  return (
    <div className={ clsx(app.page, s.page) }>
      <Title
        typeSeo={ 1 }
        typeStyle={ 1 }
        text="CADASTRAR NOVO PROJETO"
        color="blue"
        align="center"
      />

      <div className={ s.form }>
        <div className={ s.textData }>
          <Input
            type="text"
            name="name"
            id={ s.name }
            value={ name }
            setValue={ setName }
            label="Nome do projeto"
            color="blue"
          />

          <Textarea
            name="desc"
            rows={ 8 }
            value={ desc }
            setValue={ setDesc }
            color="blue"
            maxLength={ 1024 }
            placeholder="Descrição inicial do projeto"
          />
        </div>

        <div className={ s.files }>
          <div className={ s.header }>
            <Title
              typeSeo={ 2 }
              typeStyle={ 3 }
              color="blue"
              text="DOCUMENTOS INICIAIS"
            />

            <div className={ s.text }>
              Descrição explicando a importancia dos documentos
            </div>
          </div>
          
          <div className={ s.upload }>
            {
              files.map((file, index) => (
                <File
                  key={ index }
                  file={ file }
                  index={ index }
                />
              ))
            }

            <label 
              htmlFor="file-upload" 
              className={ s.btn }
            > <FaPlus className={ s.icon }/>
            </label>

            <input
              id="file-upload"
              type="file"
              multiple
              onChange={ handleFileChange }
              style={{ display: "none" }}
              disabled={ files.length >= 10 }
            />
          </div>
        </div>

        <div className={ s.integrations }>
          <div className={ s.header }>
            <Title
              typeSeo={ 2 }
              typeStyle={ 3 }
              color="blue"
              text="INTEGRAÇÕES DE CANAIS"
            />

            <div className={ s.text }>
              Integre seus canais do slack no RODAI
            </div>
          </div>

          <div className={ s.create }>
            <Input
              type="text"
              name="channelId"
              id={ s.channelId }
              value={ channelId }
              setValue={ setChannelId }
              label="ID do canal"
              color="purple"
              overrideClasses={ s.channelId }
            />

            <Input
              type="text"
              name="channelName"
              id={ s.channelName }
              value={ channelName }
              setValue={ setChannelName }
              label="Nome do canal"
              color="purple"
              overrideClasses={ s.channelName }
            />

            <div className={ s.btns }>
              <Btn
                type="button"
                onClick={ () => setChannelType("in") }
                color={ channelType === "in" ? "white" : "purple" }
                bgColor={ channelType === "in" ? "purple" : "white" }
                borderColor="purple"
                text="Interno"
                textSize="small"
                transition="bg"
                fillColor="purple"
                overrideClasses={ s.btn }
              />

              <Btn
                type="button"
                onClick={ () => setChannelType("out") }
                color={ channelType === "out" ? "white" : "purple" }
                bgColor={ channelType === "out" ? "purple" : "white" }
                borderColor="purple"
                text="Externo"
                textSize="small"
                transition="bg"
                fillColor="purple"
                overrideClasses={ s.btn }
              />
            </div>

            <Btn
              type="button"
              onClick={
                () => {
                  setChannels((prevChannels) => ([
                    ...prevChannels, 
                    { id: channelId, name: channelName, type: channelType }
                  ]))

                  setChannelId("");
                  setChannelName("");
                }
              }
              icon={ <FaPlus/> }
              iconColor="white"
              bgColor="green"
              textSize="large"
              transition="growSmall"
              overrideClasses={ s.btn }
            />
          </div>

          <div className={ s.list }>
            {
              channels.map((channel, index) => (
                <Channel
                  key={ index }
                  channel={ channel }
                />
              ))
            }
          </div>
        </div>

        <Btn
          type="button"
          onClick={ projectMutation.mutate }
          loading={ projectMutation.isPending } 
          color="white"
          bgColor="blue"
          text="CRIAR PROJETO"
          transition="growSmall"
        />
      </div>
    </div>
  )

  type FileProps = {
    file: File,
    index: number,
  }

  function File(props: FileProps) {
    const { file, index } = props;
    
    return (
      <div 
        className={ s.file }
        onClick={ () => removeFile(index) }
      >
        <FaXmark className={ s.delete }/>
        <FaFile className={ s.icon }/>

        <div className={ s.name }>
          { file.name }
        </div>
      </div>
    )
  }

  function Channel({ channel }: { channel: Channel }) {
    return (
      <div className={ s.channel }>
        <div className={ s.type }>
          { 
            channel.type === "in"
            ? "Interno"
            : "Externo" 
          }
        </div>

        <FaChevronRight/>
        
        <div className={ s.name }>
          { channel.name }
        </div>

        <FaRegTrashCan
          className={ s.delete }
          onClick={
            () => {
              const filteredChannels = channels.filter(c => c.id !== channel.id);
              setChannels(filteredChannels);
            }
          }
        />
      </div>
    )
  }

  async function createProject() {
    const resData = await fetch("", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        
      })
    })

    if (!resData.ok)
      throw new Error("Ocorreu um erro ao criar projeto.");

    const { id } = await resData.json();

    const formData = new FormData();
    files.forEach(f => formData.append("file", f));

    const resFiles = await fetch(`${id}`, {
      method: "PUT",
      body: formData,
    })

    if (!resFiles.ok)
      throw new Error("Ocorreu um erro ao criar projeto.")

    return id;
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files || []);
    
    if (files.length + selectedFiles.length > 10) {
      alert("Você pode enviar no máximo 10 arquivos");
      return;
    }
    
    setFiles(prev => [...prev, ...selectedFiles]);
  }

  function removeFile(index: number) {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
}