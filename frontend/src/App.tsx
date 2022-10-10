import { Routes, Route, Navigate } from 'react-router-dom'
import Lobby from './components/Lobby/Lobby';
import Login from './components/Login/Login';
import Room from './components/Room/Room';
import { useUserContext } from './contexts/UserProvider';

function App() {
  const { user } = useUserContext()
  console.log(user)
  
  return (
    <>
      <Routes>
        <Route path='/' element={ user.name ? <Navigate replace to='/lobby' /> : <Login /*onRegister={setUsername}*//>} />
        <Route path='/lobby' element={!user.name ? <Navigate replace to='/' /> : <Lobby />} />
        <Route path='/room/:id' element={<Room />} />
      </Routes>
    </>
  );
}

export default App;
