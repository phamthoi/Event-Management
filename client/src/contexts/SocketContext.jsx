import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (token && currentUser.id) {
     
      const newSocket = io('http://localhost:4000', {
        auth: {
          token
        }
      });

      newSocket.on('connect', () => {
        console.log('✅ Connected to server');
        setIsConnected(true);
        
        // Join user's personal room
        newSocket.emit('join-user', currentUser.id);
        
        // Join organization room if user has organization
        if (currentUser.organizationId) {
          newSocket.emit('join-organization', currentUser.organizationId);
        }
      });

      newSocket.on('disconnect', () => {
        console.log('❌ Disconnected from server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('❌ Connection error:', error);
        setIsConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, []);

  const value = {
    socket,
    isConnected
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};