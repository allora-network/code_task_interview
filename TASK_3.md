# Task 3: Frontend Event Filtering

## Overview
The frontend at `http://localhost:3000` is stuck on loading and the filter buttons don't work. Implement the missing functionality to fetch and filter events by type.

## Your Task
Complete the implementation in `frontend/contexts/NetworkEventsContext.tsx` to:
- Fetch events from the API endpoint (Task 2)
- Re-fetch when the user selects a different event type
- Properly manage `selectedEventType` state

## API Endpoint
```
GET http://localhost:3001/api/network-events?eventType={type}
```

## Hints
- Implement the `selectedEventType` state and `setSelectedEventType` function
- Use `useEffect` to fetch events when the filter changes
- Build the API URL conditionally based on `selectedEventType`

## Testing
```bash
npm run dev:frontend
```
Visit `http://localhost:3000` and verify the filter buttons work.

## Success Criteria
✅ Events load on page render  
✅ Filter buttons update displayed events  
✅ "All Events" shows unfiltered results

