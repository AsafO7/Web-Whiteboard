import React, { useContext } from 'react'
import useLocalStorage from '../Hooks/useLocalStorage';

interface SetUserName {
    user: {
      name: String,
      email: String,
      currentRoom: String,
    },
    setUser: React.Dispatch<React.SetStateAction<Object>>,
}

// @ts-ignore
const UserContext = React.createContext<SetUserName>()

export function useUserContext() {
  return useContext(UserContext)
}

export function UserProvider({ children }: {children: React.ReactNode}) {
  const [user, setUser] = useLocalStorage('user', {name: "", email: "", currentRoom: ""})
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}