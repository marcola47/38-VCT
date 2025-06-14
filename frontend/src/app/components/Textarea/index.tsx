"use client"
import { capitalize } from "lodash";

import clsx from "clsx";
import s from "./style.module.scss";

type TextareaProps = {
  name: string,
  required?: boolean,
  disabled?: boolean,
  rows: number,
  value: any,
  setValue: StateSetter<any>,
  maxLength?: number,
  placeholder?: string,
  label?: string,
  color?: Color,
  shape?: "square" | "squircle" | "circle",
}                                                                                                                                          

export default function Textarea(props: TextareaProps) {
  const {
    name,
    required,
    disabled,
    rows,
    value,
    setValue,
    maxLength,
    placeholder,
    label,
    color,
    shape,
  } = props;

  const textareaColor = color 
  ? `color${capitalize(color)}`
  :  "colorGrey"

  const textareaShape = shape
  ? `shape${capitalize(shape)}`
  : "shapeSquare"

  const className = clsx(
    s.textarea,
    s[textareaColor],
    s[textareaShape],
    disabled && s.textareaDisabled,
    label && s.labelMargin,
  )

  return (
    <div className={ className }>
      {
        label &&
        <label 
          className={ s.label }
          htmlFor={ name }
        > { label }
        </label>
      }

      <textarea 
        className={ s.field }
        name={ name }
        id={ name }
        required={ required }
        disabled={ disabled }
        rows={ rows }
        value={ value }
        onChange={ e => setValue(e.currentTarget.value) }
        maxLength={ maxLength || 255 }
        placeholder={ placeholder }
      />
    </div>
  )
}