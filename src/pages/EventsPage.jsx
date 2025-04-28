import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader/Loader";
import Header from "../components/Layout/Header";
import EventCard from "../components/Events/EventCard";
import Footer from "../components/Layout/Footer";
import { getAllEvents } from "../redux/actions/event";

const EventsPage = () => {
  const dispatch = useDispatch();
  const { allEvents, isLoading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getAllEvents()); // Dispatch action to fetch events on mount
  }, [dispatch]);

  return (
    <>
      <Header />
      {isLoading ? (
        <Loader />
      ) : (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
          <h1 style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
            Popular Events
          </h1>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {allEvents.length > 0 ? (
              allEvents.map((event) => <EventCard key={event._id} data={event} active={true} />)
            ) : (
              <h4>No events available!</h4>
            )}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default EventsPage;
