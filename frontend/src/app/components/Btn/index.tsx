"use client"
import Link from "next/link";
import { capitalize } from "@/libs/helpers";

import clsx from "clsx";
import app from "@/styles/app.module.scss";
import s from "./style.module.scss";

export type CommonBtnProps = {
  type?: "button" | "submit" | "link"
  id?: string,
  
  color?: Color,
  bgColor?: Color,
  borderColor?: Color,

  text?: string,
  textSize?: "small" | "mid" | "large",
  textAlign?: "left" | "center" | "right",

  icon?: React.ReactElement | string,
  iconColor?: Color,
  padding?: "none" | "small" | "mid" | "large" | "uniform",
  transition?: "grow" | "growSmall" | "underline" | "bg" | "border" | "color",
  fillColor?: Color,
  
  disabled?: boolean,
  loading?: boolean,
  fullWidth?: boolean,
  circle?: boolean,
  bold?: boolean,
  underline?: boolean,

  overrideClasses?: string,
  overrideStyle?: React.CSSProperties,
}

export type BtnProps = 
  (CommonBtnProps & { 
    type: "link",
    href: string,
    external?: boolean,
    forcePageReload?: boolean,
    onClick?: (e?: any) => any,
  }) |
  (CommonBtnProps & { 
    type: "button",
    href?: undefined,
    external?: undefined,
    forcePageReload?: undefined,
    onClick: (e?: any) => any,
  }) |
  (CommonBtnProps & { 
    type: "submit",
    href?: undefined,
    external?: undefined,
    forcePageReload?: undefined,
    onClick?: undefined,
  }) |
  (CommonBtnProps & {
    type?: undefined,
    href?: undefined,
    external?: undefined,
    forcePageReload?: undefined,
    onClick: (e?: any) => any,
  })

export function Btn(props: BtnProps) {
  const { 
    type,
    onClick,
    href,
    external = false,
    forcePageReload,
    id,
    
    color,
    bgColor,
    borderColor,
    
    text,
    textSize,
    textAlign,
    
    icon,
    iconColor,
    padding,
    transition,
    fillColor,
    
    disabled,
    loading,
    fullWidth,
    circle,
    bold,
    underline,
    
    overrideClasses,
    overrideStyle,
  } = props;
  
  const btnColor = color 
  ? `color${capitalize(color)}`
  :  "colorGrey"

  const btnBgColor = bgColor
  ? `bg${capitalize(bgColor)}`
  :  ""

  const btnBorderColor = borderColor 
  ? `border${capitalize(borderColor)}`
  :  ""

  const btnPadding = padding
  ? `padding${capitalize(padding)}`
  : "paddingLarge"

  const btnTextSize = textSize
  ? `text${capitalize(textSize)}`
  : "textMid"

  const btnTextAlign = textAlign
  ? `text${capitalize(textAlign)}`
  : "textCenter"

  const btnIconColor = iconColor 
  ? `icon${capitalize(iconColor)}`
  :  "iconBlack"

  const btnTransition = transition 
  ? `trans${capitalize(transition)}`
  :  "transGrow"

  const btnFillColor = /Fill|Border|Bg|Color/.test(btnTransition)
  ? `${btnTransition}${capitalize(fillColor)}`
  :  ""

  const className = clsx(
    s.btn,
    s[btnColor],
    s[btnBgColor],
    s[btnBorderColor],
    s[btnPadding],
    s[btnTextSize],
    s[btnTextAlign],
    s[btnIconColor],
    s[btnTransition],
    s[btnFillColor],
    (loading || disabled) && s.disabled,
        
    fullWidth && s.fullWidth,
    circle && s.circle,
    bold && s.bold,
    underline && s.underline,
    overrideClasses
  ) 

  const spinnerClassName = clsx(
    app.loader,
    s.loader, 
    bgColor === "white" && app.loaderGrey,
    textSize === "small" || padding === "small" ? app.loaderXxs : app.loaderXs, 
  );

  if (type === "link") {
    return (
      <Link
        role="link"
        className={ className }
        id={ id }
        onClick={ 
          e => {
            e.stopPropagation();
            
            if (onClick)
              onClick();
            
            if (forcePageReload)
              window.location.href = href;
          } 
        }
        href={ href || process.env.NEXT_PUBLIC_URL || "/" }
        target={ external ?  "_blank" : "_self" }
        style={ overrideStyle }
      > 
        { icon && icon }
        { text && text }
      </Link>
    )
  }

  return (
    <button 
      role="button"
      className={ className }
      id={ id }
      onClick={ onClick }
      type={ type || "button" }
      disabled={ loading || disabled }
      style={ overrideStyle }
    >   
      {
        loading 
        ? <span className={ spinnerClassName }/>
        : <>
            { icon && icon }

            {
              text &&
              <span className={ clsx(s.text) }>
                { text }
              </span>
            }
          </>
      }
    </button>
  )
}