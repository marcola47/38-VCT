"use client"
import { useState } from "react";

import { Btn, Title } from "@/app/components";
import { ModalBase } from "..";

import base from "../style.module.scss";
import s from "./style.module.scss";

type ModalConfirmationProps = {
  title: string,
  message?: string,
  type: "danger" | "caution" | "success" | "info"
  onConfirm: () => void,
  onConfirmMessage: string,
  onCancel: () => void,
  onCancelMessage?: string,
}

export function ModalConfirmation(props: ModalConfirmationProps) {
  const {
    title,
    message,
    type,
    onConfirm,
    onConfirmMessage,
    onCancel,
    onCancelMessage,
  } = props;

  const [confirmed, setConfirmed] = useState<boolean>(false);

  const typeMap: Record<string, Record<string, Color>> = {
    info: {
      confirm: "blue",
      cancel: "grey"
    },
    
    danger: {
      confirm: "red"
    },

    caution: { 
      confirm: "orange"
    },

    success: {
      confirm: "green",
      cancel: "red"
    },
  }
  
  return (
    <ModalBase 
      onCancel={ onCancel }
      overrideClasses={ s.confirmation }
    >
      <div className={ base.header }>
        <Title
          typeSeo={ 0 }
          typeStyle={ 3 }
          color="black"
          text={ title }
          align="center"
        />

        {
          message &&
          <div className={ base.message }>
            { message }
          </div>
        }
      </div>

      <div className={ s.btns }>
        <Btn
          onClick={ handleOnConfirm }
          loading={ confirmed }
          color="white"
          bgColor={ typeMap[type].confirm }
          text={ onConfirmMessage }
          transition="growSmall"
        />

        <Btn
          onClick={ onCancel }
          color={ typeMap[type].cancel || typeMap.info.cancel }
          borderColor={ typeMap[type].cancel || typeMap.info.cancel }
          text={ onCancelMessage }
          transition="bg"
          fillColor={ typeMap[type].cancel || typeMap.info.cancel }
        />
      </div>
    </ModalBase>
  )

  function handleOnConfirm() {
    setConfirmed(true);
    onConfirm();
  }
}