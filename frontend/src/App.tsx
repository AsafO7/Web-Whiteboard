import { Routes, Route } from 'react-router-dom'
import Lobby from './components/Lobby/Lobby';
import Login from './components/Login/Login';
import Room from './components/Room/Room';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/lobby' element={<Lobby />} />
        <Route path='/room/:id' element={<Room />} />
      </Routes>
    </>
  );
}

export default App;
