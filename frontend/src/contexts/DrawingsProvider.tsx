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

// @ts-ignore
const DrawingsContext = React.createContext<RoomState>()

export function useDrawingsContext() {
  return useContext(DrawingsContext)
}

export function DrawingsProvider({ children }: {children: React.ReactNode}) {

  const [drawingHistory, setDrawingHistory] = useState<Drawing[]>([])

  return (
    <DrawingsContext.Provider value={{ drawingHistory, setDrawingHistory }}>
      {children}
    </DrawingsContext.Provider>
  )
}