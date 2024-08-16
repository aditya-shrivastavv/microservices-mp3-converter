'use client'
import Button from '@/components/ui/Button'
import { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import FormError from '@/components/FormErrorMessage'
import getLoginStatus from '@/lib/getLoginStatus'
import axios from 'axios'
import download from 'downloadjs'

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
    reset,
    formState: { errors },
  } = useForm<DownloadFormInputs>()

  const onSubmit: SubmitHandler<DownloadFormInputs> = async (data) => {
    try {
      setLoading(true)

      const gatewayIP = (await axios.get('/api/server')).data
      const response = await axios.post(
        '/api/download',
        {
          fid: data.fid,
          gatewayIP,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob',
        },
      )
      download(response.data, data.fid + '.mp3', 'audio/mp3')
      reset()
    } catch (error: any) {
      console.error(error)
      if (error.response.status === 401) {
        setError('fid', {
          type: 'manual',
          message: 'You are not authorized to download this file',
        })
      } else if (error.response.status === 500) {
        setError('fid', {
          type: 'manual',
          message: 'File not found',
        })
      }
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
        placeholder="File Id"
        className={`block px-3 py-2 mb-3 w-full border transition-all rounded-sm text-gray-700`}
        autoFocus
      />
      {errors.fid && <FormError message={errors.fid.message!} />}
      <a href="/upload" className="text-sm text-cyan-500 hover:underline">
        File upload?
      </a>
      <Button loading={loading} text="Download ⬇️" type="submit" />
    </form>
  )
}
