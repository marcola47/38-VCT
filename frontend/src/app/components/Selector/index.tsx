"use client"
import { useState, useEffect } from "react";
import SimpleBar from "simplebar-react";
import { FaCaretDown, FaCircleExclamation, FaXmark } from "react-icons/fa6";

import { capitalize } from "@/libs/helpers";

import clsx from "clsx";
import s from "./style.module.scss"
import "simplebar-react/dist/simplebar.min.css";

type CommonSelectorProps = {
  name?: string,
  setItem: StateSetter<any>,
  defaultSelected?: any,
  error?: string,
  setError?: StateSetter<string>,
  errorDissmissDisable?: boolean,

  label?: string,
  placeholder?: string,
  color?: Color,
  shape?: "square" | "squircle" | "circle",
  border?: boolean,
  bg?: boolean,
  height?: "short" | "mid" | "tall"
  icon?: React.ReactElement | string,

  disabled?: boolean,
  removable?: boolean,
  searchable?: boolean,
  idMonoFont?: boolean,
  bold?: boolean,
  
  overrideStyle?: React.CSSProperties,
  overrideClasses?: string,
}

type SelectorProps = 
  (CommonSelectorProps & {
    items: object[], // WHY: if object contains objects, id and display can only be properties of the root object
    id: string, // WHY: if items are objects, an id (a property from the object) needs to be provided 
    properties: string[], // WHY: if items are objects, a display field(s) needs to be provided
  }) | 
  (CommonSelectorProps & {
    items: string[],
    id?: undefined,
    properties?: undefined,
  })

export function Selector(props: SelectorProps) {  
  const {
    name,
    items,
    setItem,
    defaultSelected,
    id,
    properties,
    error,
    setError,
    errorDissmissDisable,

    label,
    placeholder,
    color = "grey",
    shape = "square",
    border = true,
    bg = false,
    height,
    icon,
    
    disabled,
    removable = true,
    searchable,
    idMonoFont,
    bold,

    overrideStyle,
    overrideClasses,
  } = props;

  const [filter, setFilter] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(defaultSelected || null);
  const [listShown, setListShown] = useState<boolean>(false);

  const selectorColor = color 
  ? `color${capitalize(color)}`
  :  "colorGrey"

  const selectorShape = shape
  ? `shape${capitalize(shape)}`
  : "shapeSquare"

  const selectorHeight = height
  ? `height${capitalize(height)}`
  : "heightSquare"

  const className = clsx(
    s.selector,
    s[selectorColor],
    s[selectorShape],
    s[selectorHeight],
    error && s.error,
    setError && s.errorMargin,
    disabled && s.selectorDisabled,
    border && s[`${selectorColor}Border`],
    bg && s[`${selectorColor}Bg`],
    label && s.labelPadding,
    idMonoFont && s.idMonoFont,
    bold && s.bold,
    !searchable && s.cursorPointer,
    overrideClasses,
  )

  useEffect(() => {    
    if (items.length > 0) {
      const filtered: any[] = [];

      if (typeof items[0] === "object") {
        items.forEach(item => {
          let filterString = ""; // @ts-expect-error - for some reason typescript does not accept the typeof condition
          properties?.forEach(p => filterString += `${typeof item[p] === "string" ? (item as any)[p].toLowerCase() : item[p]} `)
          
          if (filterString.includes(filter.toLowerCase()))
            filtered.push(item);
        })
      }
  
      else if (typeof items[0] === "string")
        items.forEach((i: any) => i.toLowerCase().includes(filter.toLowerCase()) && filtered.push(i))
  
      setFilteredItems(filtered);
    }
  }, [filter, items])

  // WHY: If the default selected changes it probably means that the list should update
  useEffect(() => setSelected(defaultSelected), [defaultSelected])
  useEffect(() => setError && setError(""), [selected])

  return (
    <fieldset 
      className={ className }
      id={ name }
      style={ overrideStyle }
      onClick={ e => handleListVisibility(e, false) }
      role="list"
    >
      {
        error &&
        <span className={ s.errorMessage }>
          { error }
        </span>
      }
      
      {
        label &&
        <legend 
          className={ s.label }
          onClick={ e => handleListVisibility(e, false) }
        > { label }
        </legend>
      }
      
      { 
        icon && 
        <div className={ s.icon }>
          { icon }
        </div>
      }
      
      {
        selected || !searchable
        ? <Display/>
        : <input 
            className={ s.field }
            type="text" 
            name="filter" 
            id="filter" 
            placeholder={ placeholder }
            value={ filter }
            onClick={ e => handleListVisibility(e, true) }
            onFocus={ 
              !disabled
              ? () => { setListShown(true) } 
              : e => e.target.blur() 
            }
            onChange={ 
              e => { 
                if (!disabled) {
                  setFilter(e.currentTarget.value); 
                  setListShown(true)   
                }
              } 
            }
          />
      }

      {
        error && setError &&
        <FaCircleExclamation
          className={ clsx(s.toggle) }
          onClick={ errorDissmissDisable ? () => {} : e => handleErrorDismiss(e) }
        />
      }

      {
        !error && selected && removable &&
        <FaXmark 
          className={ s.chevron }
          onClick={ 
            () => {
              if (!disabled) {
                setItem(null);
                setSelected(null);  
              }
            } 
          }
        />
      }

      {
        !error && (!selected || !removable) &&
        <FaCaretDown 
          className={ clsx(s.chevron, listShown && s.chevronFlipped) }
          onClick={ () => { !disabled && setListShown(!listShown) } }
        />
      }

      {
        listShown &&
        <SimpleBar 
          className={ s.list }
          autoHide={ false }
          forceVisible="y" 
        >
          {
            filteredItems.map((item: any, index: number) => (
              <Item 
                key={ index }
                item={ item }
              />
            ))
          }
        </SimpleBar>
      }
    </fieldset>
  )

  function Display() {
    if (!selected)
      return <div className={ s.display }/>
      
    if (!properties) {
      return (
        <div className={ s.display }>
          { selected }
        </div>
      )
    }

    return (
      <div className={ s.display }>
        {
          properties.map((p, index) => (
            <span key={ selected[p] || index }>
              { selected[p] }
            </span>
          ))
        }
      </div>
    )
  }

  function Item({ item }: { item: any }) {
    let isItemSelected = false;
    
    if (selected && ((id && item[id] === selected[id]) || item === selected))
      isItemSelected = true;
    
    return (
      <div 
        className={ clsx(s.item, isItemSelected && s.itemSelected) }
        onClick={ () => handleSelect(item) }
        role="listitem"
      >
        {
          typeof item === "object" &&
          properties!.map((p: any, index: number) => (
            <span 
              key={ index }
              className={ clsx(index === 0 && s.first) }
            >
              { item[p] }
            </span>
          ))
        }

        {
          typeof item === "string" &&
          <span>
            { item }
          </span>
        }
      </div>
    )
  }
  
  function handleSelect(item: any) {
    if (!disabled) {
      setItem(item);
      setSelected(item);
      setListShown(false);  
    }
  }

  function handleListVisibility(e: React.MouseEvent, fromInput?: boolean) {
    e.stopPropagation();
    
    if (disabled)
      setListShown(false);

    else {
      if (fromInput)
        setListShown(true);

      else
        setListShown(!listShown);
    }
  }

  function handleErrorDismiss(e: React.MouseEvent) {
    e.stopPropagation();
     
    if (setError)
      setError("");
  }
}