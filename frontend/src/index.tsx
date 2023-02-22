import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './stylesheets/main.css'
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './contexts/UserProvider';
import { RoomsProvider } from './contexts/RoomsProvider';
import { RoomProvider } from './contexts/RoomProvider';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
      <RoomsProvider>
        <RoomProvider>
            <UserProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </UserProvider>
        </RoomProvider>
      </RoomsProvider>
  </React.StrictMode>
);