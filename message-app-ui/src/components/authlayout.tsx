import React, { useEffect, useState, ReactNode } from 'react'
// import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setAuth, setUser } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

interface AuthLayoutProps {
  children: ReactNode
  authentication?: boolean
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, authentication = true }) => {
  const authStatus = useAppSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [loader, setLoader] = useState<boolean>(true)

  useEffect(() => {
    let prefix: string
    const host = window.location.hostname

    prefix = host === 'localhost' ? 'dev_' : 'prod_'

    const token = sessionStorage.getItem(`${prefix}authtoken`)

    if (token && token !== 'undefined') {
      const userDataRaw = sessionStorage.getItem(`${prefix}userData`)
      if (userDataRaw && userDataRaw !== 'undefined') {
        const user = JSON.parse(userDataRaw)
        dispatch(setAuth(true))
        dispatch(setUser(user))
      }
    }

    if (authentication && authStatus !== authentication) {
      navigate('/login')
    } else if (!authentication && authStatus !== authentication) {
      navigate('/')
    }

    setLoader(false)
  }, [authStatus, authentication, navigate, dispatch])

  return loader ? null : <>{children}</>
}

export default AuthLayout
