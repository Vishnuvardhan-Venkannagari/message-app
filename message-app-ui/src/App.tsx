import { useState, useEffect } from 'react'
import authservice from './apiInterface/auth.ts'
import './App.css'
import { Outlet } from 'react-router-dom'
import Header from './components/header/header.component.tsx'
import { useDispatch } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import { logIn, logOut } from "./store/authSlice"
import { setAuth, setUser, setToken } from "./store/authSlice.ts" 

const App = () => {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const prefix = window.location.hostname === "localhost" ? "dev_" : "prod_"
    const token = sessionStorage.getItem(`${prefix}authtoken`)
    const userRaw = sessionStorage.getItem(`${prefix}userData`)
  
    if (token && token !== 'undefined' && userRaw && userRaw !== "undefined") {
      try {
        const user = JSON.parse(userRaw)
        dispatch(setAuth(true))  
        dispatch(setUser(user)) 
        dispatch(setToken(token))  
        const payload = { userData: user, authtoken: token, status: true }
        dispatch(logIn(payload))
      } catch (e) {
        console.error("Error parsing user JSON", e)
        dispatch(logOut())
      } finally {
        setLoading(false)
      }
    } else {
      console.log("Inside")
      authservice.getCurrentUser(token || '').then((userData) => {
        if (userData) {
          dispatch(logIn(userData))
        } else {
          dispatch(logOut())
          if (!['/login', '/signup'].includes(location.pathname)) {
            navigate('/login')
          }
        }
      }).finally(() => setLoading(false))
    }
  }, [dispatch, navigate, location])
  
return (
  <div className='min-h-screen flex flex-col'>
    <Header />
    <main className='flex-grow pt-20 bg-gray-300'>
      <Outlet />
    </main>
  </div>
)
}

export default App
