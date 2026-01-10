import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading]  =  useState(true);

  //this runs on every reload to get the current user.
  useEffect(()=>{
    const fetchCurrentUser = async()=>{
      try{
        const res = await api.get("/users/current-user")
        setUser(res.data.data)
      }catch(error){
        setUser(null)
      }finally{
        setLoading(false)
      }
    }
    fetchCurrentUser()
  }, [])

  const login = async(credentials)=>{
    const res = await api.post("/users/login", credentials)
    setUser(res.data.data.user)
  }

  const logout = async()=>{
    const res = await api.post("/users/logout")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{user, isAuthenticated:!!user, loading, login, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

