import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Car,
  MapPin,
  Phone,
  Search,
  PlusCircle,
  ShieldCheck,
  Users,
  Clock3,
  Route,
  BadgeCheck,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * HEVAL - REAL DEPLOYABLE MVP (single-file demo)
 *
 * What to do before deploy:
 * 1) Create a Supabase project.
 * 2) Create a table named `trips` with the SQL shown in the About tab.
 * 3) In Vercel, add these environment variables:
 *    NEXT_PUBLIC_SUPABASE_URL=your_project_url
 *    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
 * 4) Deploy.
 *
 * Notes:
 * - This version uses Supabase for real data storage.
 * - It supports live trip creation and search.
 * - Realtime subscription is included.
 */

const SUPABASE_URL =
  typeof process !== "undefined" ? process.env.NEXT_PUBLIC_SUPABASE_URL : undefined;
const SUPABASE_ANON_KEY =
  typeof process !== "undefined" ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined;

const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const cities = ["Erbil", "Halabja", "Sulaymaniyah", "Duhok"];
const routes = ["Koya Road", "Dukan Road", "Kirkuk Road", "Other"];

const fallbackTrips = [
  {
    id: 1,
    driver_name: "Ahmed Karim",
    phone: "0750 123 4567",
    from_city: "Erbil",
    from_location: "Brayati",
    to_city: "Duhok",
    to_location: "Malta",
    trip_date: "2026-04-06",
    trip_time: "15:00",
    price_iqd: 10000,
    empty_seats: 3,
    route_name: "Koya Road",
    trip_note: "Stop in Koya. Leaving on time.",
    women_only: false,
    family_only: false,
    car_type: "Toyota Camry",
    verified: true,
    status: "published",
  },
  {
    id: 2,
    driver_name: "Shilan Hassan",
    phone: "0750 222 8899",
    from_city: "Sulaymaniyah",
    from_location: "Goizha",
    to_city: "Halabja",
    to_location: "Center",
    trip_date: "2026-04-06",
    trip_time: "10:30",
    price_iqd: 7000,
    empty_seats: 2,
    route_name: "Other",
    trip_note: "Women only. Small bags only.",
    women_only: true,
    family_only: false,
    car_type: "Kia Rio",
    verified: true,
    status: "published",
  },
];

function getTripLabel(date, seats) {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(now.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().slice(0, 10);

  if (seats <= 0) return { text: "FULL", variant: "destructive" };
  if (date === today) return { text: "TODAY", variant: "default" };
  if (date === tomorrow) return { text: "TOMORROW", variant: "secondary" };
  return { text: "UPCOMING", variant: "outline" };
}

function TripCard({ trip }) {
  const label = getTripLabel(trip.trip_date, trip.empty_seats);

  return (
    <Card className="rounded-3xl shadow-sm border-0 bg-white">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold text-slate-900">{trip.driver_name}</h3>
              <Badge variant={label.variant}>{label.text}</Badge>
              {trip.women_only && <Badge className="rounded-full">Women Only</Badge>}
              {trip.family_only && <Badge className="rounded-full" variant="secondary">Family</Badge>}
              {trip.verified && (
                <Badge variant="outline" className="rounded-full flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" /> Verified
                </Badge>
              )}
            </div>
            <p className="text-slate-500 mt-1">{trip.car_type || "Car not specified"}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold text-slate-900">
              {Number(trip.price_iqd || 0).toLocaleString()} IQD
            </div>
            <div className="text-sm text-slate-500">
              {trip.empty_seats} seat{trip.empty_seats !== 1 ? "s" : ""} left
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="rounded-2xl bg-slate-50 p-4 space-y-2">
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-4 h-4" />
              <span className="font-semibold">From:</span>
              {trip.from_city}{trip.from_location ? ` - ${trip.from_location}` : ""}
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-4 h-4" />
              <span className="font-semibold">To:</span>
              {trip.to_city}{trip.to_location ? ` - ${trip.to_location}` : ""}
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Clock3 className="w-4 h-4" />
              <span className="font-semibold">Date & Time:</span>
              {trip.trip_date} at {trip.trip_time}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 space-y-2">
            <div className="flex items-center gap-2 text-slate-700">
              <Route className="w-4 h-4" />
              <span className="font-semibold">Route:</span>
              {trip.route_name}
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Users className="w-4 h-4" />
              <span className="font-semibold">Seats:</span>
              {trip.empty_seats}
            </div>
            <p className="text-slate-700">
              <span className="font-semibold">Trip Note:</span> {trip.trip_note || "No note added."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <Button asChild className="rounded-2xl">
            <a href={`tel:${(trip.phone || "").replace(/\s+/g, "")}`}>
              <Phone className="w-4 h-4 mr-2" /> Call Driver
            </a>
          </Button>
          <Button variant="outline" className="rounded-2xl">{trip.phone}</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function HevalWebsite() {
  const [trips, setTrips] = useState(fallbackTrips);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [search, setSearch] = useState({
    fromCity: "Erbil",
    toCity: "Duhok",
    date: "",
    route: "all",
    womenOnly: false,
    familyOnly: false,
  });

  const [form, setForm] = useState({
    driverName: "",
    phone: "",
    fromCity: "Erbil",
    fromLocation: "",
    toCity: "Duhok",
    toLocation: "",
    date: "",
    time: "",
    price: "",
    seats: "",
    route: "Koya Road",
    note: "",
    womenOnly: false,
    familyOnly: false,
    carType: "",
  });

  async function loadTrips() {
    if (!supabase) return;
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("status", "published")
      .order("trip_date", { ascending: true })
      .order("trip_time", { ascending: true });

    if (error) {
      setError(error.message);
    } else if (data) {
      setTrips(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadTrips();
  }, []);

  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel("heval-trips-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "trips" },
        () => {
          loadTrips();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const cityMatch = trip.from_city === search.fromCity && trip.to_city === search.toCity;
      const dateMatch = !search.date || trip.trip_date === search.date;
      const routeMatch = search.route === "all" || trip.route_name === search.route;
      const womenMatch = !search.womenOnly || trip.women_only;
      const familyMatch = !search.familyOnly || trip.family_only;
      return cityMatch && dateMatch && routeMatch && womenMatch && familyMatch;
    });
  }, [trips, search]);

  async function handlePostTrip(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.driverName || !form.phone || !form.date || !form.time || !form.price || !form.seats) {
      setError("Please fill all required fields.");
      return;
    }

    const payload = {
      driver_name: form.driverName,
      phone: form.phone,
      from_city: form.fromCity,
      from_location: form.fromLocation || null,
      to_city: form.toCity,
      to_location: form.toLocation || null,
      trip_date: form.date,
      trip_time: form.time,
      price_iqd: Number(form.price),
      empty_seats: Number(form.seats),
      route_name: form.route,
      trip_note: form.note || null,
      women_only: form.womenOnly,
      family_only: form.familyOnly,
      car_type: form.carType || null,
      verified: false,
      status: "published",
    };

    if (!supabase) {
      setTrips((prev) => [{ id: Date.now(), ...payload }, ...prev]);
      setMessage("Trip added in demo mode. Add Supabase keys to make it live.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("trips").insert(payload);

    if (error) {
      setError(error.message);
    } else {
      setMessage("Trip published successfully.");
      setForm({
        driverName: "",
        phone: "",
        fromCity: "Erbil",
        fromLocation: "",
        toCity: "Duhok",
        toLocation: "",
        date: "",
        time: "",
        price: "",
        seats: "",
        route: "Koya Road",
        note: "",
        womenOnly: false,
        familyOnly: false,
        carType: "",
      });
      await loadTrips();
    }
    setSubmitting(false);
  }

  const sqlSetup = `create table if not exists public.trips (
  id bigint generated by default as identity primary key,
  created_at timestamp with time zone default now(),
  driver_name text not null,
  phone text not null,
  from_city text not null,
  from_location text,
  to_city text not null,
  to_location text,
  trip_date date not null,
  trip_time text not null,
  price_iqd integer not null,
  empty_seats integer not null,
  route_name text not null,
  trip_note text,
  women_only boolean default false,
  family_only boolean default false,
  car_type text,
  verified boolean default false,
  status text default 'published'
);

alter table public.trips enable row level security;

create policy "Anyone can read published trips"
on public.trips for select
using (status = 'published');

create policy "Anyone can insert trips"
on public.trips for insert
with check (true);`;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 lg:px-8">
        <header className="rounded-[2rem] bg-gradient-to-br from-slate-950 to-slate-800 text-white p-6 md:p-10 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm mb-5">
                <Car className="w-4 h-4" /> Heval - Ride Sharing for Kurdistan
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Find a seat. Share a ride. Travel together.</h1>
              <p className="text-slate-300 text-base md:text-lg mt-4 leading-7">
                A real deployable MVP for Erbil, Halabja, Sulaymaniyah, and Duhok. Search trips, post your own trip, and connect directly with drivers.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <Badge className="rounded-full px-4 py-2 text-sm">Currency: IQD</Badge>
                <Badge className="rounded-full px-4 py-2 text-sm" variant="secondary">Supabase ready</Badge>
                <Badge className="rounded-full px-4 py-2 text-sm" variant="secondary">Vercel deployable</Badge>
              </div>
            </div>

            <Card className="w-full max-w-xl rounded-[2rem] border-0 shadow-2xl bg-white text-slate-900">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2"><Search className="w-5 h-5" /> Search Trips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>From City *</Label>
                    <Select value={search.fromCity} onValueChange={(value) => setSearch((s) => ({ ...s, fromCity: value }))}>
                      <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>To City *</Label>
                    <Select value={search.toCity} onValueChange={(value) => setSearch((s) => ({ ...s, toCity: value }))}>
                      <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date (optional)</Label>
                    <Input type="date" className="rounded-2xl" value={search.date} onChange={(e) => setSearch((s) => ({ ...s, date: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Route (optional)</Label>
                    <Select value={search.route} onValueChange={(value) => setSearch((s) => ({ ...s, route: value }))}>
                      <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All routes</SelectItem>
                        {routes.map((route) => <SelectItem key={route} value={route}>{route}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 pt-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="women-search" checked={search.womenOnly} onCheckedChange={(checked) => setSearch((s) => ({ ...s, womenOnly: Boolean(checked) }))} />
                    <Label htmlFor="women-search">Women only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="family-search" checked={search.familyOnly} onCheckedChange={(checked) => setSearch((s) => ({ ...s, familyOnly: Boolean(checked) }))} />
                    <Label htmlFor="family-search">Family only</Label>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="rounded-2xl" onClick={loadTrips}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                  </Button>
                  {!supabase && (
                    <Badge variant="outline" className="rounded-full">
                      Demo mode - add Supabase env vars for live deployment
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        {(message || error) && (
          <div className="mt-6">
            <Alert className={`rounded-2xl ${error ? "border-red-300" : "border-emerald-300"}`}>
              <AlertDescription>{error || message}</AlertDescription>
            </Alert>
          </div>
        )}

        <section className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6 mt-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Available Trips</h2>
                <p className="text-slate-500 mt-1">
                  Showing {filteredTrips.length} matching trip{filteredTrips.length !== 1 ? "s" : ""}
                </p>
              </div>
              {loading && (
                <div className="inline-flex items-center gap-2 text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading trips...
                </div>
              )}
            </div>

            <div className="space-y-4">
              {filteredTrips.length > 0 ? (
                filteredTrips.map((trip) => <TripCard key={trip.id} trip={trip} />)
              ) : (
                <Card className="rounded-3xl border-dashed shadow-none bg-white">
                  <CardContent className="p-10 text-center">
                    <p className="text-xl font-semibold">No trips found</p>
                    <p className="text-slate-500 mt-2">Try another route, remove filters, or post a new trip.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <Tabs defaultValue="post">
              <TabsList className="grid grid-cols-2 rounded-2xl w-full">
                <TabsTrigger value="post">Post Trip</TabsTrigger>
                <TabsTrigger value="about">Setup</TabsTrigger>
              </TabsList>

              <TabsContent value="post" className="mt-4">
                <Card className="rounded-3xl border-0 shadow-sm bg-white">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2"><PlusCircle className="w-5 h-5" /> Post a Trip</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePostTrip} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>From City *</Label>
                          <Select value={form.fromCity} onValueChange={(value) => setForm((f) => ({ ...f, fromCity: value }))}>
                            <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {cities.map((city) => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>To City *</Label>
                          <Select value={form.toCity} onValueChange={(value) => setForm((f) => ({ ...f, toCity: value }))}>
                            <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {cities.map((city) => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Exact From Location</Label>
                          <Input className="rounded-2xl" value={form.fromLocation} onChange={(e) => setForm((f) => ({ ...f, fromLocation: e.target.value }))} placeholder="Optional" />
                        </div>
                        <div className="space-y-2">
                          <Label>Exact To Location</Label>
                          <Input className="rounded-2xl" value={form.toLocation} onChange={(e) => setForm((f) => ({ ...f, toLocation: e.target.value }))} placeholder="Optional" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Date *</Label>
                          <Input type="date" className="rounded-2xl" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <Label>Time *</Label>
                          <Input type="time" className="rounded-2xl" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Price (IQD) *</Label>
                          <Input type="number" className="rounded-2xl" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="10000" />
                        </div>
                        <div className="space-y-2">
                          <Label>Empty Seats *</Label>
                          <Input type="number" className="rounded-2xl" value={form.seats} onChange={(e) => setForm((f) => ({ ...f, seats: e.target.value }))} placeholder="3" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Route *</Label>
                        <Select value={form.route} onValueChange={(value) => setForm((f) => ({ ...f, route: value }))}>
                          <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {routes.map((route) => <SelectItem key={route} value={route}>{route}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Trip Note</Label>
                        <Textarea className="rounded-2xl min-h-[100px]" value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} placeholder="Stop in Koya, no smoking, family preferred..." />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Driver Name *</Label>
                          <Input className="rounded-2xl" value={form.driverName} onChange={(e) => setForm((f) => ({ ...f, driverName: e.target.value }))} placeholder="Your name" />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone Number *</Label>
                          <Input className="rounded-2xl" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="0750..." />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Car Type</Label>
                        <Input className="rounded-2xl" value={form.carType} onChange={(e) => setForm((f) => ({ ...f, carType: e.target.value }))} placeholder="Optional" />
                      </div>

                      <div className="flex flex-wrap gap-6 pt-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="women-post" checked={form.womenOnly} onCheckedChange={(checked) => setForm((f) => ({ ...f, womenOnly: Boolean(checked) }))} />
                          <Label htmlFor="women-post">Women only</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="family-post" checked={form.familyOnly} onCheckedChange={(checked) => setForm((f) => ({ ...f, familyOnly: Boolean(checked) }))} />
                          <Label htmlFor="family-post">Family only</Label>
                        </div>
                      </div>

                      <Button type="submit" className="w-full rounded-2xl h-12 text-base font-semibold" disabled={submitting}>
                        {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publishing...</> : "Create Trip Post"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="about" className="mt-4">
                <div className="space-y-4">
                  <Card className="rounded-3xl border-0 shadow-sm bg-white">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5" />
                        <h3 className="font-bold text-lg">Deploy steps</h3>
                      </div>
                      <ol className="space-y-2 text-slate-600 list-decimal pl-5">
                        <li>Create a Supabase project.</li>
                        <li>Create a table named <code>trips</code> with the SQL below.</li>
                        <li>Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in Vercel.</li>
                        <li>Deploy this app to Vercel.</li>
                      </ol>
                    </CardContent>
                  </Card>

                  <Card className="rounded-3xl border-0 shadow-sm bg-white">
                    <CardContent className="p-6 space-y-3">
                      <h3 className="font-bold text-lg">Supabase SQL</h3>
                      <pre className="whitespace-pre-wrap text-xs bg-slate-950 text-slate-100 rounded-2xl p-4 overflow-auto">{sqlSetup}</pre>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
    </div>
  );
}
