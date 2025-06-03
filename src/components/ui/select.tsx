"use client"

import type React from "react"
import { useState, useRef, useEffect, createContext, useContext, Children, isValidElement, cloneElement } from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

// --- Interfaces ---

interface SelectOption {
  value: string
  label: string
}

interface SelectContextType {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  onValueChange?: (value: string) => void
  selectedValue?: string
}

const SelectContext = createContext<SelectContextType | undefined>(undefined)

interface SelectProps {
  children?: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  onClick?: () => void
}

interface SelectValueProps {
  children?: React.ReactNode
}

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  isOpen: boolean
}

interface SelectItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  value: string
  children?: React.ReactNode
}

interface SimpleSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  options: SelectOption[]
  className?: string
}

// --- Componentes ---

export function Select({ children, value, onValueChange, ...props }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <SelectContext.Provider value={{ setIsOpen, onValueChange, selectedValue: value }}>
      <div className="relative" ref={selectRef} {...props}>
        {
          Children.map(children, child => {
            if (isValidElement(child) && typeof child.type !== 'string' && (child.type as React.FunctionComponent).displayName === SelectContent.displayName) {
              return cloneElement(child, { isOpen: isOpen } as SelectContentProps);
            }
            return child;
          })
        }
      </div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ className, children, onClick, ...props }: SelectTriggerProps) {
  const context = useContext(SelectContext)

  if (!context) {
    throw new Error("SelectTrigger must be used within a Select component")
  }

  const handleClick = () => {
    context.setIsOpen((prev) => !prev)
    onClick?.()
  }

  return (
    <button
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      <span className="block truncate">{children}</span>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
}

export function SelectValue({ children }: SelectValueProps) {
  return <span className="block truncate">{children}</span>
}

export function SelectContent({ className, children, isOpen, ...props }: SelectContentProps) {
  if (!isOpen) return null

  return (
    <div
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
        "top-full mt-1 w-full",
        className,
      )}
      {...props}
    >
      <div className="p-1">{children}</div>
    </div>
  )
}

SelectContent.displayName = "SelectContent";


export function SelectItem({ className, children, value, ...props }: SelectItemProps) {
  const context = useContext(SelectContext)

  if (!context) {
    throw new Error("SelectItem must be used within a Select component")
  }

  const handleClick = () => {
    context.onValueChange?.(value)
    context.setIsOpen(false)
  }

  const isSelected = context.selectedValue === value

  return (
    <div
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
      {children}
    </div>
  )
}

export function SimpleSelect({ value, onValueChange, placeholder, options, className, ...props }: SimpleSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((option) => option.value === value)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSelect = (optionValue: string) => {
    onValueChange?.(optionValue)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={selectRef} {...props}>
      <button
        type="button"
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="block truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 top-full mt-1 w-full">
          <div className="p-1">
            {options.map((option) => (
              <div
                key={option.value}
                className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                onClick={() => handleSelect(option.value)}
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  {value === option.value && <Check className="h-4 w-4" />}
                </span>
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}