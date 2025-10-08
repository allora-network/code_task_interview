'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface NetworkEvent {
  id: string;
  timestamp: number;
  [key: string]: any;
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
  const [lastFetchTime, setLastFetchTime] = useState<number>(Date.now());

  const fetchEvents = async (fromDate: number) => {
    try {
      const response = await fetch(`/api/network-events?fromDate=${fromDate}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newEvents = await response.json();

      setEvents(prevEvents => [...prevEvents, ...newEvents]);
      setLastFetchTime(Date.now());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchEvents(lastFetchTime);

    // Set up polling every 10 seconds
    const interval = setInterval(() => {
      fetchEvents(lastFetchTime);
    }, 10000);

    return () => clearInterval(interval);
  }, [lastFetchTime]);

  return (
    <NetworkEventsContext.Provider value={{ events, loading, error }}>
      {children}
    </NetworkEventsContext.Provider>
  );
};
