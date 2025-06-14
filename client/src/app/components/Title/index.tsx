import { JSX } from "react";

import { capitalize } from "@/libs/helpers";

import clsx from "clsx";
import s from "./style.module.scss"

type TitleProps = {
  typeSeo?: 0 | 1 | 2 | 3 | 4 | 5,
  typeStyle?: 1 | 2 | 3 | 4 | 5,
  text: string | React.ReactNode,
  color?: Color,
  align?: "left" | "center" | "right",
  lightness?: "dark" | "light",

  thin?: boolean,
  padding?: boolean,

  overrideStyle?: React.CSSProperties,
  overrideClasses?: string,
}

export function Title(props: TitleProps) {
  const {
    typeSeo,
    typeStyle,

    color,
    text,
    align,
    lightness,
    thin,
    padding,

    overrideStyle,
    overrideClasses,
  } = props;
  
  const titleType = typeStyle 
  ? `typeH${typeStyle}`
  :  "typeH1"

  const titleColor = color 
  ? `color${capitalize(color)}${capitalize(lightness)}`
  :  "colorGrey"

  const titleAlign = align
  ? `align${capitalize(align)}`
  :  "alignLeft"

  const className = clsx(
    overrideClasses,
    s[titleType],
    s[titleColor],
    s[titleAlign],
    thin && s.thin,
    padding && s.padding,
  )

  const HeadingTag = `h${typeSeo}` as keyof JSX.IntrinsicElements;

  if (typeSeo === 0) {
    return (
      <div 
        className={ className }
        style={ overrideStyle }
      > { text }
      </div>
    )
  }

  return (
    <HeadingTag 
      className={ className }
      style={ overrideStyle }
    > { text }
    </HeadingTag>
  )
}