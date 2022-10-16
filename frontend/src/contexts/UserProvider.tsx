import React, { useContext, useState } from 'react'
import useLocalStorage from '../Hooks/useLocalStorage';

interface SetUserName {
    user: {
      name: String,
      email: String,
      currentRoom: String,
    },
    setUser: React.Dispatch<any>,
    // currentRoom: string,
    // setCurrentRoom: React.Dispatch<any>,
}

// @ts-ignore
const UserContext = React.createContext<SetUserName>()

export function useUserContext() {
  return useContext(UserContext)
}

export function UserProvider({ children }: any) {
  const [user, setUser] = useLocalStorage('user', {name: "", email: "", currentRoom: ""})
  // const currentRoom = useRef("")
  // const [currentRoom, setCurrentRoom] = useState("")
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}