import React, { useContext, useState } from 'react'
import { Room } from './RoomsProvider'

interface RoomState {
    room: Room,
    setRoom: React.Dispatch<any>,
    // setOnlineUsers: React.Dispatch<React.SetStateAction<String[]>>
}

// @ts-ignore
const RoomContext = React.createContext<RoomState>()

export function useRoomContext() {
  return useContext(RoomContext)
}

export function RoomProvider({ children }: any) {
  // const [onlineUsers, setOnlineUsers] = useState<String[]>([])
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