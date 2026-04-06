import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [trips, setTrips] = useState([]);
  const [form, setForm] = useState({
    driver_name: "",
    phone: "",
    from_city: "Erbil",
    to_city: "Duhok",
    trip_date: "",
    trip_time: "",
    price_iqd: "",
    empty_seats: ""
  });

  async function loadTrips() {
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .order("trip_date", { ascending: true });

    if (!error && data) setTrips(data);
  }

  useEffect(() => {
    loadTrips();
  }, []);

  async function addTrip(e) {
    e.preventDefault();

    const { error } = await supabase.from("trips").insert([
      {
        driver_name: form.driver_name,
        phone: form.phone,
        from_city: form.from_city,
        to_city: form.to_city,
        trip_date: form.trip_date,
        trip_time: form.trip_time,
        price_iqd: Number(form.price_iqd),
        empty_seats: Number(form.empty_seats),
        route_name: "Other"
      }
    ]);

    if (!error) {
      setForm({
        driver_name: "",
        phone: "",
        from_city: "Erbil",
        to_city: "Duhok",
        trip_date: "",
        trip_time: "",
        price_iqd: "",
        empty_seats: ""
      });
      loadTrips();
    } else {
      alert(error.message);
    }
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px", fontFamily: "Arial" }}>
      <h1>Heval</h1>
      <p>Share a ride between cities in Kurdistan.</p>

      <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
        <h2>Post a Trip</h2>
        <form onSubmit={addTrip} style={{ display: "grid", gap: "10px" }}>
          <input
            placeholder="Driver name"
            value={form.driver_name}
            onChange={(e) => setForm({ ...form, driver_name: e.target.value })}
          />

          <input
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <select
            value={form.from_city}
            onChange={(e) => setForm({ ...form, from_city: e.target.value })}
          >
            <option>Erbil</option>
            <option>Sulaymaniyah</option>
            <option>Halabja</option>
            <option>Duhok</option>
          </select>

          <select
            value={form.to_city}
            onChange={(e) => setForm({ ...form, to_city: e.target.value })}
          >
            <option>Erbil</option>
            <option>Sulaymaniyah</option>
            <option>Halabja</option>
            <option>Duhok</option>
          </select>

          <input
            type="date"
            value={form.trip_date}
            onChange={(e) => setForm({ ...form, trip_date: e.target.value })}
          />

          <input
            type="time"
            value={form.trip_time}
            onChange={(e) => setForm({ ...form, trip_time: e.target.value })}
          />

          <input
            placeholder="Price in IQD"
            value={form.price_iqd}
            onChange={(e) => setForm({ ...form, price_iqd: e.target.value })}
          />

          <input
            placeholder="Empty seats"
            value={form.empty_seats}
            onChange={(e) => setForm({ ...form, empty_seats: e.target.value })}
          />

          <button type="submit">Post Trip</button>
        </form>
      </div>

      <div style={{ background: "#fff", padding: "20px", borderRadius: "10px" }}>
        <h2>Available Trips</h2>
        {trips.length === 0 ? (
          <p>No trips yet.</p>
        ) : (
          trips.map((trip) => (
            <div
              key={trip.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "10px"
              }}
            >
              <strong>{trip.from_city} → {trip.to_city}</strong>
              <div>Driver: {trip.driver_name}</div>
              <div>Phone: {trip.phone}</div>
              <div>Date: {trip.trip_date}</div>
              <div>Time: {trip.trip_time}</div>
              <div>Price: {trip.price_iqd} IQD</div>
              <div>Seats: {trip.empty_seats}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
