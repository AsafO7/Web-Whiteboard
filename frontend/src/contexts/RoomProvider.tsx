import React, { useContext, useState } from 'react'
import { Room } from './RoomsProvider'

interface RoomState {
    room: Room,
    setRoom: React.Dispatch<React.SetStateAction<Room>>,
}

// @ts-ignore
const RoomContext = React.createContext<RoomState>()

export function useRoomContext() {
  return useContext(RoomContext)
}

export function RoomProvider({ children }: {children: React.ReactNode}) {
  const [room, setRoom] = useState<Room>({
    name: "",
    id: "",
    userWhoOpened: "",
    onlineUsers: [],
    drawingHistory: [],
  })

  return (
    <RoomContext.Provider value={{ room, setRoom }}>
      {children}
    </RoomContext.Provider>
  )
}