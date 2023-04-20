import React, { useContext, useState } from 'react'

export interface Room {
    name: String,
    id: String,
    userWhoOpened: String,
    onlineUsers: String[],
    drawingUsers: String[],
}

interface Rooms {
    roomsList: Room[],
    setRooms: React.Dispatch<React.SetStateAction<Room[]>>
}

// @ts-ignore
const RoomsContext = React.createContext<Rooms>()

export function useRoomsContext() {
  return useContext(RoomsContext)
}

export function RoomsProvider({ children }: {children: React.ReactNode}) {
  const [roomsList, setRooms] = useState<Room[]>([])

  return (
    <RoomsContext.Provider value={{ roomsList, setRooms }}>
      {children}
    </RoomsContext.Provider>
  )
}