'use client'
import FormError from '@/components/FormErrorMessage'
import Button from '@/components/ui/Button'
import Config from '@/config/main'
import getLoginStatus from '@/lib/getLoginStatus'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'

type LoginFormInputs = {
  username: string
  password: string
}

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginStatusMessage, setLoginStatusMessage] = useState('')

  const { register, handleSubmit, setError, formState } =
    useForm<LoginFormInputs>()

  useEffect(() => {
    const loginStatus = getLoginStatus()
    setIsLoggedIn(loginStatus.loggedIn)
    setLoginStatusMessage(loginStatus.message)
  }, [])

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      setLoading(true)
      const response = await axios.post(
        Config.API_URL + '/login',
        {},
        {
          auth: {
            username: data.username,
            password: data.password,
          },
        },
      )
      console.log(response)
      if (response.status == 200) {
        localStorage.setItem('token', response.data)
        setIsLoggedIn(true)
      }
      console.log('response: ' + response)
      location.reload()
    } catch (error: any) {
      console.error(error)
      if (error.response.status == 401) {
        setError('username', {
          type: 'manual',
          message: 'Invalid username or password',
        })
        return
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
        Login
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
      {/* Username */}
      <input
        {...register('username', { required: true })}
        type="text"
        placeholder="Username"
        className={`block px-3 py-2 mb-3 w-full border transition-all rounded-sm text-gray-700 ${
          isLoggedIn && 'cursor-not-allowed'
        }`}
        disabled={isLoggedIn}
        autoFocus
        required
      />

      {/* Password */}
      <input
        {...register('password', { required: true })}
        type="password"
        placeholder="Password"
        required
        disabled={isLoggedIn}
        className={`block px-3 py-2 mb-3 w-full border transition-all rounded-sm text-gray-700 ${
          isLoggedIn && 'cursor-not-allowed'
        }`}
      />
      {formState.errors.username && (
        <FormError message={formState.errors.username.message!} />
      )}
      <a href="/register" className="text-sm text-cyan-500 hover:underline">
        New user? Register
      </a>
      <Button loading={loading} text="Log in" type="submit" />
    </form>
  )
}
