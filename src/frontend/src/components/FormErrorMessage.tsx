import React from 'react'

type Props = {
  message: string
}

const FormError = ({ message }: Props) => {
  return <p className="text-red-500 font-light text-sm mb-2">{message}</p>
}

export default FormError
