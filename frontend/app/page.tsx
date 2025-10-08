'use client';

import { useNetworkEvents } from '@/contexts/NetworkEventsContext';

const EVENT_TYPES = [
  'product.purchased',
  'product.viewed',
  'cart.added',
  'cart.removed',
  'user.login',
  'user.logout',
];

export default function Home() {
  const { events, loading, error, selectedEventType, setSelectedEventType } = useNetworkEvents();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Network Events</h1>

        {/* Filter Section */}
        <div className="sticky top-0 z-10 bg-black pb-6 mb-6">
          <label className="block text-sm font-medium mb-2">Filter by Event Type:</label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedEventType(null)}
              className={`px-4 py-2 rounded ${
                selectedEventType === null
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Events
            </button>
            {EVENT_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedEventType(type)}
                className={`px-4 py-2 rounded ${
                  selectedEventType === type
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

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
              className="bg-transparent border border-white rounded-lg p-4"
            >
              <div className="text-sm text-white mb-2">
                {new Date(event.timestamp).toLocaleString()}
              </div>
              <pre className="text-sm text-white overflow-x-auto">
                {JSON.stringify(event, null, 2)}
              </pre>
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Total events: {events.length}
          {selectedEventType && ` (filtered by ${selectedEventType})`}
        </div>
      </div>
    </div>
  );
}
