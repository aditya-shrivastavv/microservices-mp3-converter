import React from 'react'

type InputProps = {
  placeholder: string
  type: string
  className?: string
  autoFocus?: boolean
}

const Input = ({
  placeholder,
  type,
  className,
  autoFocus = false,
  ...props
}: InputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`block px-4 py-3 mb-3 w-full border transition-all rounded-sm text-gray-700 ${className}`}
      autoFocus={autoFocus}
      {...props}
    />
  )
}

export default Input
