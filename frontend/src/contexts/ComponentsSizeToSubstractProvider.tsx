import React, { useContext, useState } from 'react'

export interface SizeProperties {
    onlineUsersWidth: number,
    setOnlineUsersWidth: React.Dispatch<React.SetStateAction<number>>,
    chatWidth: number,
    setChatWidth: React.Dispatch<React.SetStateAction<number>>,
    headerHeight: number,
    setHeaderHeight: React.Dispatch<React.SetStateAction<number>>,
    paintUIHeight: number,
    setPaintUIHeight: React.Dispatch<React.SetStateAction<number>>,
}

// @ts-ignore
const ComponentsSizeToSubstractContext = React.createContext<SizeProperties>()

export function useComponentsSizeToSubstractContext() {
  return useContext(ComponentsSizeToSubstractContext)
}

export function ComponentsSizeToSubstractProvider({ children }: {children: React.ReactNode}) {
  const [onlineUsersWidth, setOnlineUsersWidth] = useState<number>(250)
  const [chatWidth, setChatWidth] = useState<number>(250)
  const [headerHeight, setHeaderHeight] = useState<number>(150)
  const [paintUIHeight, setPaintUIHeight] = useState<number>(150)

  return (
    <ComponentsSizeToSubstractContext.Provider value={{ onlineUsersWidth, setOnlineUsersWidth, chatWidth, setChatWidth,
    headerHeight, setHeaderHeight, paintUIHeight, setPaintUIHeight }}>
      {children}
    </ComponentsSizeToSubstractContext.Provider>
  )
}