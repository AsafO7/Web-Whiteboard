import { lazy, Suspense } from 'react';
import { useEffect, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import { io } from 'socket.io-client';
import { logoutUser } from './app/apiCalls';
import { useRoomContext } from './contexts/RoomProvider';
import { useUserContext } from './contexts/UserProvider';

const Lobby = lazy(() => import("./components/Lobby/Lobby"))
const Login = lazy(() => import("./components/Login/Login"))
const Room = lazy(() => import("./components/Room/Room"))

function App() {
  const { user, setUser } = useUserContext()
  const { setRoom } = useRoomContext()
  const socket = useRef(io(`http://localhost:5000/`))
  
  useEffect(() => {
    if(user.currentRoom === "") socket.current.close()
  },[user.currentRoom])

  useEffect(() => {
    const handleTabClose = async (event: { preventDefault: () => void; returnValue: string; }) => {
      event.preventDefault();
      const oldUser = user
      setUser((prev) => { return {...prev, currentRoom: ""}})
      setRoom((prev) => { return { ...prev, name: "",
      id: "",
      userWhoOpened: "",
      onlineUsers: [],
      drawingHistory: []}})
      await logoutUser(oldUser)
      return "beforeunload"
    }

    window.addEventListener('beforeunload', handleTabClose)

    return () => {
      window.removeEventListener('beforeunload', handleTabClose)
    }
  })
  
  return (
    <>
      <Suspense fallback={<h1>Loading...</h1>}>
        <Routes>
          <Route path='/' element={ user.name ? <Navigate replace to='/lobby' /> : <Login />} />
          <Route path='/lobby' element={!user.name ? <Navigate replace to='/' /> : <Lobby socket={socket.current} />} />
          <Route path='/room/:id' element={user.currentRoom ? <Room socket={socket.current}/> : <Navigate replace to='/' />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
