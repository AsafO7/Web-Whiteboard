import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
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
              <Provider store={store}>
                <App />
              </Provider>
            </BrowserRouter>
          </UserProvider>
        </RoomProvider>
      </RoomsProvider>
  </React.StrictMode>
);