import {createSlice} from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
export type Role = 'USER' | 'ADMIN'
export interface User {
    id: string,
    name: string,
    email: string,
    role: Role
}

interface AuthState {
    token: string | null
    user: User | null
}

const initialState: AuthState = {
    token: localStorage.getItem('token'),
    user: null,
}
const authSlice = createSlice ({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<{token: string; user: User}>){
            state.token = action.payload.token
            state.user = action.payload.user
            localStorage.setItem('token', action.payload.token)
        },
        setUser(state, action: PayloadAction<User>){
            state.user = action.payload
        },
        logout(state){
            state.token = null
            state.user = null
            localStorage.removeItem('token')
        },
    },

});
export const { setCredentials, setUser, logout} = authSlice.actions
export default authSlice.reducer