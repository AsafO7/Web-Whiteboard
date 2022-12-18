import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './stylesheets/main.css'
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './contexts/UserProvider';
import { RoomsProvider } from './contexts/RoomsProvider';
import { RoomProvider } from './contexts/RoomProvider';
import { ComponentsSizeToSubstractProvider } from './contexts/ComponentsSizeToSubstractProvider';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
      <RoomsProvider>
        <RoomProvider>
          <ComponentsSizeToSubstractProvider>
            <UserProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </UserProvider>
          </ComponentsSizeToSubstractProvider>
        </RoomProvider>
      </RoomsProvider>
  </React.StrictMode>
);