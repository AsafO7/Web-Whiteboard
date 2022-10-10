import React, { useContext } from 'react'
import useLocalStorage from '../Hooks/useLocalStorage';

interface SetUserName {
    user: {
      name: String,
      email: String,
    },
    setUser: React.Dispatch<any>
}

// @ts-ignore
const UserContext = React.createContext<SetUserName>()

export function useUserContext() {
  return useContext(UserContext)
}

export function UserProvider({ children }: any) {
    const [user, setUser] = useLocalStorage('user')

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}