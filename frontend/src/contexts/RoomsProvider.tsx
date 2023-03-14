import React, { useContext, useState } from 'react'

export type Point = {
  x: number,
  y: number,
}

export type Drawing = {
  path: Point[],
  color: string | undefined, 
  width: number, 
  isEraser: boolean, 
  userWhoDrew: String}

export interface Room {
    name: String,
    id: String,
    userWhoOpened: String,
    onlineUsers: String[],
    drawingHistory: Drawing[],
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