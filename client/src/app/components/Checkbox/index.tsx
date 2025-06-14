"use client"
import { FaCheck } from "react-icons/fa6";
import { capitalize } from "@/libs/helpers";

import clsx from "clsx"
import s from "./style.module.scss";

type CheckboxProps = {
  name?: string,
  required?: boolean,
  value?: boolean,
  setValue: StateSetter<boolean> | (() => void)
  // WHY: Some checkboxes might not set a singular state value
  //      but instead toggle an element from an array or something.

  color?: Color,
  text?: string | React.ReactElement,
  shape?: "square" | "squircle" | "circle",
  size?: "small" | "mid" | "large",
  lightness?: "light" | "dark",
  
  overrideClasses?: string,
  overrideStyles?: React.CSSProperties
}

export function Checkbox(props: CheckboxProps) {
  const {
    name,
    required,
    value,
    setValue,

    color,
    text,
    shape,
    size,
    lightness = "dark",

    overrideClasses,
    overrideStyles,
  } = props;

  const checkboxColor = color
  ? `color${capitalize(color)}${capitalize(lightness)}`
  : "colorGreyDark"

  const checkboxShape = shape
  ? `shape${capitalize(shape)}`
  : "shapeSquare"

  const checkboxSize = size
  ? `size${capitalize(size)}`
  : "sizeMid"

  const className = clsx(
    s.checkbox,
    s[checkboxColor],
    s[checkboxShape],
    s[checkboxSize],
    value && s.checkboxSelected,
    value && s[`${checkboxColor}Selected`],
    overrideClasses,
  )
  
  return (
    <div 
      className={ className }
      style={ overrideStyles }
      onClick={ () => setValue(!value) }
    >
      {
        name &&
        <input 
          className={ s.input }
          type="checkbox" 
          required={ required }
          name={ name } 
          id={ name }
          checked={ value }
          onChange={ (e) => setValue(e.target.checked) }
        />
      }
      
      <div className={ s.box }>
        <FaCheck className={ s.icon }/>
      </div>

      <div className={ s.text }>
        { text }
      </div>
    </div>
  )
}