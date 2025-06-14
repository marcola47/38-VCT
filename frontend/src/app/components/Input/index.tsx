// TO-DO: use native pattern input property and style based on invalid 
// TO-DO: check how to make error be either a boolean or string
//        - remove necessity for errorMargin? and do these kinds of checks if error is boolean

// TO-DO: create uncontrolled inputs
//        - use refs to get and set input states
//        - uncontrolled inputs 

// TO-DO: create server component inputs
//        - the form action would get the inputs by input name
//        - all formatting logic should remain the same

"use client"
import { useState, useEffect, forwardRef, Ref } from "react";
import { type HTMLInputTypeAttribute } from "react";
import { FaEye, FaEyeSlash, FaCircleExclamation } from "react-icons/fa6";

import { capitalize } from "@/libs/helpers";

import clsx from "clsx";
import s from "./style.module.scss";

type InputProps = {
  type: HTMLInputTypeAttribute,
  name: string,
  id?: string,
  required?: boolean,
  disabled?: boolean,
  
  error?: string,
  setError?: StateSetter<string>
  errorDissmissOnType?: boolean,
  errorDissmissDisable?: boolean,
  errorMargin?: boolean,
  errorIndicator?: boolean,
  pattern?: RegExp,
  patternMessage?: string,

  value: any,
  setValue: StateSetter<any>,
  formatter?: (value: any) => any,
  maxLength?: number,
  placeholder?: string,
  placeholderPersistant?: string,
  
  label?: string,
  color?: Color,
  padding?: "no" | "s" | "m" | "l",
  border?: boolean,
  bg?: boolean,
  shape?: "square" | "squircle" | "circle",
  icon?: React.ReactElement | string,
  
  overrideClasses?: string,
  overrideStyle?: React.CSSProperties,
  children?: React.ReactNode | React.ReactNode[]
}

function InputComponent(props: InputProps, ref: Ref<HTMLInputElement>) {
  const {
    type,
    name,
    id,
    required,
    disabled,

    error,
    setError,
    errorDissmissOnType,
    errorDissmissDisable,
    errorMargin = true,
    errorIndicator = true,
    pattern,
    patternMessage,

    value,
    setValue,
    formatter,
    maxLength,

    placeholder,
    placeholderPersistant,
    label,
    color = "grey",
    padding = "l",
    border = true,
    bg = false,
    shape = "square",
    icon,
    
    overrideClasses,
    overrideStyle,
    children,
  } = props;

  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const [typed, setTyped] = useState<boolean>(false);

  const inputColor = `color${capitalize(color)}`;
  const inputPadding = `padding${capitalize(padding)}`;
  const inputShape = `shape${capitalize(shape)}`;
  
  const className = clsx(
    s.input,
    s[inputColor],
    s[inputPadding],
    s[inputShape],
    border && s[`${inputColor}Border`],
    bg && s[`${inputColor}Bg`],
    disabled && s.inputDisabled,
    error && s.error,
    setError && errorMargin && s.errorMargin,
    label && s.labelPadding,
    overrideClasses,
  )

  useEffect(() => {
    if (typed && setError) {
      if (errorDissmissOnType)
        setError("");

      else if (pattern) {
        if (!pattern.test(value))
          setError(patternMessage ?? "");
  
        else
          setError("");  
      } 
    }
    
    setTyped(true);
  }, [value])

  return (
    <fieldset 
      className={ className }
      style={ overrideStyle }
      id={ id || name }
    >
      {
        error &&
        <span className={ s.errorMessage }>
          { capitalize(error) }
        </span>
      }
      
      {
        label &&
        <legend className={ s.label }> 
          { label }
        </legend>
      }

      {
        placeholderPersistant &&
        <span className={ s.placeholderPersistant }> 
          { placeholderPersistant }
        </span>
      }
      
      { 
        icon && 
        <div className={ s.icon }>
          { icon }
        </div>
      }

      <input 
        ref={ ref }
        className={ s.field }
        type={ type === "password" && passwordShown ? "text" : type } 
        name={ name }
        {...(type === "password" ? { role: "textbox" } : {})}
        aria-label={ name }
        aria-describedby={ name }
        required={ required }
        disabled={ disabled }
        value={ value }
        onChange={ 
          formatter 
          ? e => setValue(formatter(e.currentTarget.value)) 
          : e => setValue(e.currentTarget.value) 
        }
        maxLength={ maxLength || 255 }
        placeholder={ placeholder }
      />

      {
        error && setError && errorIndicator &&
        <FaCircleExclamation
          className={ clsx(s.toggle) }
          onClick={ errorDissmissDisable ? () => {} : () => setError("") }
        />
      }

      {
        !error && type === "password" && passwordShown &&
        <FaEyeSlash
          className={ clsx(s.toggle, s.toggleSlash) }
          onClick={ () => setPasswordShown(false) }
        />
      }

      {
        !error && type === "password" && !passwordShown &&
        <FaEye
          className={ s.toggle }
          onClick={ () => setPasswordShown(true) }
        />
      }

      {
        children &&
        children
      }
    </fieldset>
  )
}

const Input = forwardRef(InputComponent);
Input.displayName = "Input";

export {
  Input
};