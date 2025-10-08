'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

export const NetworkEventsProvider: React.FC<NetworkEventsProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<NetworkEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastFetchTimeRef = React.useRef<number>(Date.now());

  const fetchEvents = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/network-events?fromDate=${lastFetchTimeRef.current}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newEvents = await response.json();

      if (newEvents.length > 0) {
        setEvents(prevEvents => [...newEvents, ...prevEvents]);
        lastFetchTimeRef.current = Date.now();
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchEvents();

    // Set up polling every 10 seconds
    const interval = setInterval(() => {
      fetchEvents();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <NetworkEventsContext.Provider value={{ events, loading, error }}>
      {children}
    </NetworkEventsContext.Provider>
  );
};
