"use client"
import { useState, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";

import clsx from "clsx";
import s from "./style.module.scss";

type ModalBaseProps = {
  children: React.ReactNode[] | React.ReactNode,
  onCancel: () => void,
  overrideClasses: string,
}

export function ModalBase(props: ModalBaseProps) {
  const { 
    children, 
    onCancel, 
    overrideClasses 
  } = props;

  const [hasScrollbar, setHasScrollbar] = useState<boolean>(true);

  useEffect(() => {
    setHasScrollbar(
      document.body.scrollHeight > document.body.clientHeight ||                  
      document.documentElement.scrollHeight > document.documentElement.clientHeight
    )
  }, []);

  return (
    <div 
      className={ clsx(s.bg, hasScrollbar && s.bgHasScrollbar) }
      onClick={ onCancel }
    >
      <div 
        className={ clsx(s.modal, overrideClasses) }
        onClick={ e => e.stopPropagation() }
      > 
        <FaXmark 
          className={ s.close }
          onClick={ onCancel }
        />

        { children }
      </div>
    </div>
  )
}