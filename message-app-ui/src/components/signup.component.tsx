import { useState } from 'react'
import authservice from '../apiInterface/auth'
import { Link, useNavigate } from "react-router-dom"
import Button from "./button"
import Input from "./input"
import { useForm, SubmitHandler } from "react-hook-form"
import { useDispatch } from "react-redux"
import { logIn as authLogin } from "../store/authSlice"
import './signup.css'

interface FormData {
  email: string
  password: string
  firstName: string
  lastName: string
}

export default function SignUp() {
  const navigate = useNavigate()
  const [error, setError] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const sendSignUp: SubmitHandler<FormData> = async (data) => {
    setError("")
    setIsSubmitting(true)
    try {
      const session= await authservice.signUp(data)
      if (session) {
        const payload = {
          userData: session.user,
          authtoken: session.token,
          status: false
        }

        const prefix = window.location.hostname === "localhost" ? "dev_" : "prod_"
        sessionStorage.setItem(`${prefix}authtoken`, session.token)
        sessionStorage.setItem(`${prefix}userData`, JSON.stringify(session.user))

        dispatch(authLogin(payload))
        setTimeout(() => {
            navigate(`/`)
        }, 100)
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='flex items-center justify-center w-full'>
      <div className='signup-container'>
        <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
          <h2 className="signup-container-h2">Sign in to your account</h2>
          <p className="mt-2 text-center text-base text-black/60">
            Already have an account?&nbsp;
            <Link to="/login" className="font-medium text-primary transition-all duration-200 hover:underline">
              Login
            </Link>
          </p>

          {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

          <form onSubmit={handleSubmit(sendSignUp)} className="mt-8">
            <div className="space-y-4">
              <Input
                label="Email"
                placeholder="Email Address"
                className="w-full"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address"
                  }
                })}
                error={errors.email?.message}
              />
              <Input
                label="Password"
                type="password"
                className="w-full"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required"
                })}
                error={errors.password?.message}
              />
              <Input
                label="First Name"
                type="text"
                className="w-full"
                placeholder="First Name"
                {...register("firstName", {
                  required: "First Name is required"
                })}
                error={errors.firstName?.message}
              />
              <Input
                label="Last Name"
                type="text"
                className="w-full"
                placeholder="Last Name"
                {...register("lastName", {
                  required: "Last Name is required"
                })}
                error={errors.lastName?.message}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
