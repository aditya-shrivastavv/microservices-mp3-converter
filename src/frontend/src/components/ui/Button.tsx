import React from 'react'
import { CgSpinner } from 'react-icons/cg'

type SubmitButtonProps = {
  loading: boolean
  text: string
  type: 'submit' | 'button'
}

const Button = ({ loading, text, type }: SubmitButtonProps) => {
  return (
    <button
      className={`w-full h-full py-3 bg-cyan-500 text-white mt-5 absolute left-0 bottom-0 max-h-14 rounded-b-md transition-all border-b-4 border-cyan-400 flex justify-center items-center ${
        loading ? 'pointer-events-none bg-cyan-300' : ''
      }`}
      type={type}
    >
      <i className="spinner"></i>
      {loading ? (
        <CgSpinner className="animate-spin h-6 w-6" />
      ) : (
        <span>{text}</span>
      )}
    </button>
  )
}

export default Button
