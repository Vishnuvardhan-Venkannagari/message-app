import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserData {
  email?: string
  name?: string
  [key: string]: any
}

interface AuthState {
  status: boolean
  userData: UserData | null
  authtoken: string | null
}

const initialState: AuthState = {
  status: false,
  userData: null,
  authtoken: null,
}

const authSlicer = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logIn: (
      state,
      action: PayloadAction<{
        status?: boolean
        userData?: UserData
        authtoken?: string
      }>
    ) => {
      const { status, userData, authtoken } = action.payload
      state.status = status ?? false
      state.userData = userData ?? null
      state.authtoken = authtoken ?? null
    },
    logOut: (state) => {
      state.status = false
      state.userData = null
      state.authtoken = null
    },
    setAuth: (state, action: PayloadAction<boolean>) => {
      state.status = action.payload
    },
    setUser: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.authtoken = action.payload
    },
  },
})

export const { logIn, logOut, setAuth, setUser, setToken } = authSlicer.actions
export default authSlicer.reducer
