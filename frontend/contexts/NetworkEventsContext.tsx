'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NetworkEvent {
  eventId: string;
  eventType: string;
  timestamp: string;
  userId: string;
  productId: string;
  productName: string;
  category: string;
  price: number;
  currency: string;
  quantity: number;
  metadata: {
    source: string;
    sessionId: string;
    ipAddress: string;
  };
}

interface NetworkEventsContextType {
  events: NetworkEvent[];
  loading: boolean;
  error: string | null;
  selectedEventType: string | null;
  setSelectedEventType: (eventType: string | null) => void;
}

const NetworkEventsContext = createContext<NetworkEventsContextType | undefined>(undefined);

export const useNetworkEvents = () => {
  const context = useContext(NetworkEventsContext);
  if (!context) {
    throw new Error('useNetworkEvents must be used within NetworkEventsProvider');
  }
  return context;
};

interface NetworkEventsProviderProps {
  children: ReactNode;
}

const API_URL = 'http://localhost:3001';

export const NetworkEventsProvider: React.FC<NetworkEventsProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<NetworkEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //
  // Your code here
  //


  return (
    <NetworkEventsContext.Provider value={{ events, loading, error, selectedEventType: "product.viewed", setSelectedEventType: () => {} }}>
      {children}
    </NetworkEventsContext.Provider>
  );
};
