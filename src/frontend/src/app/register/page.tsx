'use client'
import Button from '@/components/ui/Button'
import { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import FormError from '@/components/FormErrorMessage'
import axios from 'axios'
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import getLoginStatus from '@/lib/getLoginStatus'

type RegisterFormInputs = {
  username: string
  password: string
  confirmPassword: string
}

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginStatusMessage, setLoginStatusMessage] = useState('')

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<RegisterFormInputs>()

  useEffect(() => {
    const loginStatus = getLoginStatus()
    setIsLoggedIn(loginStatus.loggedIn)
    setLoginStatusMessage(loginStatus.message)
  }, [])

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      setLoading(true)
      setIsRegistered(false)

      // Pre Validations
      if (data.password !== data.confirmPassword) {
        setError('confirmPassword', {
          type: 'manual',
          message: 'Passwords do not match',
        })
        return
      }

      const gatewayIP = (await axios.get('/api/server')).data
      console.log('gatewayIP: ', gatewayIP)
      const response = await axios.post(
        '/api/register',
        {
          gatewayIP,
        },
        {
          auth: {
            username: data.username,
            password: data.password,
          },
        },
      )
      console.log('response: ', response)
      if (response.status == 200) {
        setIsRegistered(true)
        reset()
        return
      }
    } catch (error: any) {
      if (error.response.status == 500) {
        setError('username', {
          type: 'manual',
          message: error.response.data,
        })
        return
      }
      setError('root', {
        type: 'manual',
        message: error.response.data,
      })
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
        Register
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
        autoFocus
        disabled={isLoggedIn}
        required
      />
      {errors.username && <FormError message={errors.username.message!} />}

      {/* Password */}
      <input
        {...register('password', { required: true })}
        type="password"
        placeholder="Password"
        disabled={isLoggedIn}
        required
        className={`block px-3 py-2 mb-3 w-full border transition-all rounded-sm text-gray-700 ${
          isLoggedIn && 'cursor-not-allowed'
        }`}
      />

      {/* Confirm Password */}
      <input
        {...register('confirmPassword', { required: true })}
        type="password"
        required
        disabled={isLoggedIn}
        placeholder="Confirm password"
        className={`block px-3 py-2 mb-3 w-full border transition-all rounded-sm text-gray-700 ${
          isLoggedIn && 'cursor-not-allowed'
        }`}
      />
      {errors.confirmPassword && (
        <FormError message={errors.confirmPassword.message!} />
      )}
      {isRegistered && (
        <p className="text-green-500 text-sm mb-4">
          <FaCheckCircle className="inline-block mr-1" />
          Registration successful!{' '}
          <a href="/login" className="underline">
            Please login.
          </a>
        </p>
      )}
      <a href="/login" className="text-sm text-cyan-500 hover:underline">
        Already registered? Login
      </a>
      <Button loading={loading} text="Register" type="submit" />
    </form>
  )
}
