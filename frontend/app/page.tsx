'use client';

import { useNetworkEvents } from '@/contexts/NetworkEventsContext';

export default function Home() {
  const { events, loading, error } = useNetworkEvents();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Network Events</h1>

        {loading && events.length === 0 && (
          <p className="text-gray-500">Loading events...</p>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error: {error}
          </div>
        )}

        <div className="space-y-4">
          {events.length === 0 && !loading && (
            <p className="text-gray-500">No events yet</p>
          )}

          {events.map((event, index) => (
            <div
              key={event.eventId || index}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="text-sm text-gray-500 mb-2">
                {new Date(event.timestamp).toLocaleString()}
              </div>
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(event, null, 2)}
              </pre>
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Total events: {events.length}
        </div>
      </div>
    </div>
  );
}
