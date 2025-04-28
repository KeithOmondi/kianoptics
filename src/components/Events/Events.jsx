import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import EventCard from "./EventCard";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  return (
    <div>
      {!isLoading && (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>Popular Events</h1>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {allEvents.length !== 0 ? (
              <EventCard data={allEvents[0]} />
            ) : (
              <h4>No events have been added!</h4>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
