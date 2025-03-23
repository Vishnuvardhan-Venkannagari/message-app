import React, { useState } from 'react'
import authservice from '../apiInterface/auth'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { logIn as authLogin } from '../store/authSlice'
import './login.css'
import Input from './input'
import Button from './button'

interface LoginFormInputs {
    email: string
    password: string
}

const Login: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [error, setError] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>()
    const login: SubmitHandler<LoginFormInputs> = async (data) => {
        setError("")
        setIsSubmitting(true)
        console.log(data)
        try {
          const session = await authservice.logIn(data)
          setIsLoading(true)
    
          if (session) {
            const payload = {
              userData: session.user,
              authtoken: session.token,
              status: true
            }
    
            const host = window.location.hostname
            const prefix = host === 'localhost' ? 'dev_' : 'prod_'
    
            sessionStorage.setItem(`${prefix}authtoken`, session.token)
            sessionStorage.setItem(`${prefix}userData`, JSON.stringify(session.user))
    
            if (session.user) {
              dispatch(authLogin(payload))
              navigate("/")
            } else {
              sessionStorage.removeItem(`${prefix}authtoken`)
              navigate("/login")
            }
          }
    
          setIsLoading(false)
        } catch (error: any) {
          setIsLoading(false)
          setError(error.message || "Something went wrong")
        } finally {
          setIsLoading(false)
          setIsSubmitting(false)
        }
    }
    return (
        <div className="flex items-center justify-center w-full py-8">
          <div className="login-container">
            <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
              <h2 className="login-container-h2">Sign in to your account</h2>
              <p className="mt-2 text-center text-base text-black/60">
                Don&apos;t have any account?&nbsp;
                <Link
                  to="/signup"
                  className="font-medium text-primary transition-all duration-200 hover:underline"
                >
                  Sign Up
                </Link>
              </p>
    
              {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
    
              <form onSubmit={handleSubmit(login)} className="mt-8">
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
                  {...register("password", { required: "Password is required" })}
                  error={errors.password?.message}
                />
    
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
    
                <div className="py-2 text-center">
                  <Link
                    to="/signup"
                    className="font-medium text-primary transition-all duration-200 hover:underline"
                  >
                    Forgot Password
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      )
}

export default Login