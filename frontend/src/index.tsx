import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './stylesheets/main.css'
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './Contexts/UserProvider';
import { RoomsProvider } from './Contexts/RoomsProvider';
import { RoomProvider } from './Contexts/RoomProvider';
import { ComponentsSizeToSubstractProvider } from './Contexts/ComponentsSizeToSubstractProvider';

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