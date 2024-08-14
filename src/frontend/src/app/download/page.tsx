'use client'
import Button from '@/components/ui/Button'
import { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import FormError from '@/components/FormErrorMessage'
import getLoginStatus from '@/lib/getLoginStatus'

type DownloadFormInputs = {
  fid: string
}

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginStatusMessage, setLoginStatusMessage] = useState('')

  useEffect(() => {
    const loginStatus = getLoginStatus()
    setIsLoggedIn(loginStatus.loggedIn)
    setLoginStatusMessage(loginStatus.message)
  }, [])

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DownloadFormInputs>()

  const onSubmit: SubmitHandler<DownloadFormInputs> = (data) => {
    try {
      setLoading(true)
      console.log(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-md px-5 pt-3 pb-20 w-11/12 max-w-80 relative shadow-2xl"
    >
      <h2 className="text-gray-700 text-xl font-bold mt-3 mb-8 pb-5 border-b-[1px]">
        Download Audio File
        {isLoggedIn ? (
          <p className="text-green-500 text-sm mt-2">
            <FaCheckCircle className="inline-block mr-1 font-bold" />
            {loginStatusMessage}
          </p>
        ) : (
          <p className="text-red-500 text-sm mt-2">
            <FaExclamationCircle className="inline-block mr-1 font-bold" />
            {loginStatusMessage}
          </p>
        )}
      </h2>

      {/* File ID Input */}
      <input
        {...register('fid', { required: true })}
        type="text"
        placeholder="Username"
        className={`block px-4 py-3 mb-3 w-full border transition-all rounded-sm text-gray-700pass`}
        autoFocus
      />
      <a href="/upload" className="text-sm text-cyan-500 hover:underline">
        File upload?
      </a>
      <Button loading={loading} text="Download ⬇️" type="submit" />
    </form>
  )
}
