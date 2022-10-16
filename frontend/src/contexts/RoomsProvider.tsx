import React, { useContext, useState } from 'react'

export interface Room {
    name: String,
    id: String,
    userWhoOpened: String,
    onlineUsers: String[],
    drawingHistory: [],
}

interface Rooms {
    roomsList: Room[],
    setRooms: React.Dispatch<any>
}

// @ts-ignore
const RoomsContext = React.createContext<Rooms>()

export function useRoomsContext() {
  return useContext(RoomsContext)
}

export function RoomsProvider({ children }: any) {
  const [roomsList, setRooms] = useState<Room[]>([])

  return (
    <RoomsContext.Provider value={{ roomsList, setRooms }}>
      {children}
    </RoomsContext.Provider>
  )
}