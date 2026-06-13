import React, { useState, useEffect } from "react";
import { MapPin, Navigation, Compass, ShieldAlert, Check, Car, Loader2, RefreshCw } from "lucide-react";
import { Artisan, Booking } from "../types";

interface GPSTrackerProps {
  artisans: Artisan[];
  bookings: Booking[];
  selectedArtisanId?: string;
  onSelectArtisan?: (artisanId: string) => void;
}

// Simulated map coordinates and landmark setups
const MAP_MARKERS = [
  { name: "Kejetia Central Market", lat: 6.6961, lng: -1.6212, isLandmark: true },
  { name: "Suame Magazine Hub", lat: 6.7200, lng: -1.6350, isLandmark: true },
  { name: "East Legon Underbridge", lat: 5.6350, lng: -0.1550, isLandmark: true },
  { name: "Kotoka Intl Airport (ACC)", lat: 5.6062, lng: -0.1681, isLandmark: true },
  { name: "Takoradi Harbour", lat: 4.8870, lng: -1.7510, isLandmark: true }
];

export default function GPSTracker({ artisans, bookings, selectedArtisanId, onSelectArtisan }: GPSTrackerProps) {
  const [activeCity, setActiveCity] = useState<"Accra" | "Kumasi" | "Takoradi">("Accra");
  const [trackingBookingId, setTrackingBookingId] = useState<string | null>(null);

  // Tracking animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [movementStep, setMovementStep] = useState(0); // 0 to 10
  const [etaMinutes, setEtaMinutes] = useState(12);

  // Set default city based on selected artisan if available
  useEffect(() => {
    if (selectedArtisanId) {
      const art = artisans.find((a) => a.id === selectedArtisanId);
      if (art) {
        if (art.location.toLowerCase().includes("accra")) setActiveCity("Accra");
        else if (art.location.toLowerCase().includes("kumasi")) setActiveCity("Kumasi");
        else if (art.location.toLowerCase().includes("takoradi")) setActiveCity("Takoradi");
      }
    }
  }, [selectedArtisanId, artisans]);

  // Handle active dispatch simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAnimating) {
      timer = setInterval(() => {
        setMovementStep((prev) => {
          if (prev >= 10) {
            setIsAnimating(false);
            setEtaMinutes(0);
            return 10;
          }
          const next = prev + 1;
          setEtaMinutes(Math.max(1, Math.round(12 - (next * 1.2))));
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isAnimating]);

  const startTracking = (bookingId: string) => {
    setTrackingBookingId(bookingId);
    setMovementStep(0);
    setEtaMinutes(12);
    setIsAnimating(true);
  };

  // Find target coordinates for map display
  // Client is always placed at the "Center" of simulation
  const clientLocation = {
    Accra: { lat: 5.6037, lng: -0.1870, label: "Your Villa (East Legon)" },
    Kumasi: { lat: 6.6906, lng: -1.6244, label: "Your Store (Adum)" },
    Takoradi: { lat: 4.8992, lng: -1.7583, label: "Your Office (Beach Rd)" }
  }[activeCity];

  // Subset of artisans in current city
  const cityArtisans = artisans.filter((art) => {
    if (activeCity === "Accra") return art.location.toLowerCase().includes("accra");
    if (activeCity === "Kumasi") return art.location.toLowerCase().includes("kumasi");
    return art.location.toLowerCase().includes("takoradi");
  });

  // Calculate coordinates for moving car
  // Linear interpolation between the active tracking artisan and the client
  const getSimulatedVehicleCoords = () => {
    if (!trackingBookingId) return clientLocation;
    const bk = bookings.find((b) => b.id === trackingBookingId);
    if (!bk) return clientLocation;
    const art = artisans.find((a) => a.id === bk.artisanId);
    if (!art) return clientLocation;

    const startLat = art.latitude;
    const startLng = art.longitude;
    const endLat = clientLocation.lat;
    const endLng = clientLocation.lng;

    // Interpolation factor 0 to 1
    const factor = movementStep / 10;
    return {
      lat: startLat + (endLat - startLat) * factor,
      lng: startLng + (endLng - startLng) * factor
    };
  };

  const currentVehicle = getSimulatedVehicleCoords();

  // Convert GPS coordinates to local SVG coordinates
  // Map bounds:
  // Accra map approx: Lat 5.55 to 5.65, Lng -0.22 to -0.10
  // Kumasi map approx: Lat 6.65 to 6.75, Lng -1.67 to -1.58
  // Takoradi map approx: Lat 4.85 to 4.95, Lng -1.80 to -1.70
  const coordToSvg = (lat: number, lng: number) => {
    let minLat = 5.55, maxLat = 5.65, minLng = -0.22, maxLng = -0.10;

    if (activeCity === "Kumasi") {
      minLat = 6.65; maxLat = 6.75; minLng = -1.67; maxLng = -1.58;
    } else if (activeCity === "Takoradi") {
      minLat = 4.85; maxLat = 4.95; minLng = -1.80; maxLng = -1.70;
    }

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - (((lat - minLat) / (maxLat - minLat)) * 100); // SVG flip Y coord
    return { x: Math.min(95, Math.max(5, x)), y: Math.min(95, Math.max(5, y)) };
  };

  // SVG coordinate positions
  const clientSvg = coordToSvg(clientLocation.lat, clientLocation.lng);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden p-6 animate-fadeIn space-y-6">
      
      {/* City Switcher Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b pb-4">
        <div>
          <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-500 animate-spin-slow" />
            Live Artisan GPS Radar
          </h3>
          <p className="text-xs text-slate-400 font-medium">Toggle municipal grids to map nearest handymen in real time.</p>
        </div>

        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
          {(["Accra", "Kumasi", "Takoradi"] as const).map((city) => (
            <button
              key={city}
              onClick={() => {
                setActiveCity(city);
                setTrackingBookingId(null);
                setIsAnimating(false);
              }}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeCity === city
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {city} Municipal
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Nearby Handymen list with quick track triggers */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-3 bg-indigo-50/40 border border-indigo-100 rounded-xl space-y-1.5">
            <span className="text-[9.5px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded-md uppercase">
              Municipal Radius Search
            </span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Your device reports GPS coordinates in <span className="font-bold">{activeCity}</span>. All dispatch routes are mapped directly using Ghana’s digital address schema.
            </p>
          </div>

          {/* Active Dispatches tracking segment */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Bookings dispatch status</h4>
            {bookings.length === 0 ? (
              <p className="text-xs text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">No bookings placed yet.</p>
            ) : (
              <div className="space-y-2">
                {bookings.map((bk) => {
                  const art = artisans.find((a) => a.id === bk.artisanId);
                  const isBeingTracked = trackingBookingId === bk.id;

                  return (
                    <div 
                      key={bk.id}
                      className={`p-3 rounded-xl border ${
                        isBeingTracked ? "border-amber-300 bg-amber-50/20" : "border-slate-100 bg-white"
                      } space-y-2`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[11px] font-bold text-slate-800 block">{bk.artisanName}</span>
                          <span className="text-[9px] text-slate-400 capitalize">{bk.artisanCategory} • GH₵ {bk.estimatedCostGhs} fee</span>
                        </div>
                        <span className={`text-[8.5px] font-bold uppercase px-1.5 py-0.5 rounded-md ${
                          bk.status === "completed" ? "bg-emerald-100 text-emerald-800" :
                          bk.status === "in_progress" ? "bg-blue-100 text-blue-800 animate-pulse" :
                          "bg-amber-100 text-amber-800"
                        }`}>
                          {bk.status}
                        </span>
                      </div>

                      {/* Let customers track if booking is confirmed, in-progress or completed */}
                      <button
                        type="button"
                        onClick={() => startTracking(bk.id)}
                        className="w-full bg-slate-900 text-white text-[10px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1 hover:bg-slate-800 transition-all cursor-pointer"
                      >
                        <Navigation className="w-3 h-3 text-amber-400" />
                        {isBeingTracked ? "Recalibrate Dispatch Track" : "Track Artisan Arrival"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Artisans found in selected city */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Artisans on Map ({cityArtisans.length})</h4>
            <div className="space-y-1.5 max-h-[170px] overflow-y-auto">
              {cityArtisans.map((art) => (
                <button
                  key={art.id}
                  onClick={() => onSelectArtisan?.(art.id)}
                  className={`w-full flex items-center gap-2 p-2 rounded-xl border text-left text-xs transition-all ${
                    selectedArtisanId === art.id 
                      ? "bg-slate-50 border-amber-300 shadow-xs" 
                      : "bg-white border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  <img src={art.avatar} className="w-8 h-8 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-slate-800 block truncate">{art.name}</span>
                    <span className="text-[10px] text-slate-400 truncate block">{art.location}</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-600 font-bold shrink-0">★ {art.rating}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Center/Right: SVG Map Graphics canvas with animation simulation overlay */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Tracking metadata overlay standard */}
          {trackingBookingId && (
            <div className="p-3 bg-slate-950 text-white rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b-2 border-amber-400">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                  <Car className="w-4 h-4 text-amber-400 animate-bounce" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ghana GPS Dispatch Link</span>
                  <p className="text-xs font-bold text-white">
                    {etaMinutes > 0 ? `Artisan is arriving in ${etaMinutes} mins...` : "Artisan has Arrived outside!"}
                  </p>
                </div>
              </div>
              
              {isAnimating ? (
                <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-400 text-slate-950 rounded-lg text-[10px] font-bold">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Active Satellite Link
                </div>
              ) : (
                <button
                  onClick={() => startTracking(trackingBookingId)}
                  className="flex items-center gap-1 px-2 py-1 bg-slate-800 text-[10px] font-bold rounded hover:bg-slate-700 hover:text-white"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  Re-simulate Run
                </button>
              )}
            </div>
          )}

          {/* Map Vector Stage */}
          <div className="relative bg-slate-100 rounded-2xl overflow-hidden h-[360px] border border-slate-200 shadow-sm">
            
            {/* Cool background SVG map representation of local road grids */}
            <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />
                </pattern>
                <radialGradient id="accGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f3f4f6" stopOpacity="0.1" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <rect width="100%" height="100%" fill="url(#accGradient)" />

              {/* Main arterial highway paths */}
              <path d="M -50 180 Q 250 120 500 240 T 1100 80" fill="none" stroke="#94a3b8" strokeWidth="6" strokeDasharray="3 3" />
              <path d="M 150 450 L 150 -50" fill="none" stroke="#cbd5e1" strokeWidth="4" />
              <path d="M 450 450 L 450 -50" fill="none" stroke="#cbd5e1" strokeWidth="4" />
              <path d="M 800 -50 Q 500 200 450 450" fill="none" stroke="#cbd5e1" strokeWidth="3.5" />
              <path d="M 50 100 Q 300 200 700 80" fill="none" stroke="#64748b" strokeWidth="5" />

              {/* Major Ring Road circuit */}
              <circle cx="50%" cy="50%" r="90" fill="none" stroke="#94a3b8" strokeWidth="3" strokeDasharray="4 8" />

              {/* Grid outline borders */}
              <rect x="5" y="5" width="98%" height="96%" fill="none" stroke="#cbd5e1" strokeWidth="2" rx="10" />
            </svg>

            {/* Landmark text tags on map */}
            <div className="absolute top-2 left-3 bg-white/80 p-1 px-2 rounded-md border text-[9px] text-slate-500 font-bold select-none uppercase tracking-wider">
              🗺️ {activeCity} Municipal Map Grid
            </div>

            {MAP_MARKERS.map((lm, i) => {
              const svgVal = coordToSvg(lm.lat, lm.lng);
              // Only render if it shares coordinate neighborhood
              if (activeCity === "Accra" && lm.name.includes("Kumasi")) return null;
              if (activeCity === "Kumasi" && (lm.name.includes("Airport") || lm.name.includes("Legon") || lm.name.includes("Takoradi"))) return null;
              if (activeCity === "Takoradi" && !lm.name.includes("Takoradi")) return null;

              return (
                <div
                  key={i}
                  style={{ left: `${svgVal.x}%`, top: `${svgVal.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center select-none"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span className="text-[8.5px] font-bold text-slate-400 bg-white/70 p-0.5 rounded px-1 mt-0.5 truncate max-w-[100px] border border-slate-200">
                    {lm.name}
                  </span>
                </div>
              );
            })}

            {/* Target Client Coordinate Pin (marked "You") */}
            <div
              style={{ left: `${clientSvg.x}%`, top: `${clientSvg.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
            >
              <div className="relative">
                <span className="absolute -inset-1.5 bg-red-500 rounded-full animate-ping opacity-40" />
                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md border-2 border-white">
                  <MapPin className="w-4.5 h-4.5 fill-current" />
                </div>
              </div>
              <span className="text-[10px] font-black text-slate-900 bg-amber-400 p-0.5 px-1.5 rounded shadow-sm border border-slate-900 mt-1 select-none">
                You (Default Base)
              </span>
            </div>

            {/* Artisan Pins */}
            {cityArtisans.map((art) => {
              const artSvg = coordToSvg(art.latitude, art.longitude);
              const isSelected = selectedArtisanId === art.id;

              return (
                <div
                  key={art.id}
                  style={{ left: `${artSvg.x}%`, top: `${artSvg.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group cursor-pointer"
                  onClick={() => onSelectArtisan?.(art.id)}
                >
                  <div className={`relative transition-transform ${isSelected ? "scale-110" : "hover:scale-105"}`}>
                    <div className={`w-8 h-8 rounded-xl overflow-hidden border-2 shadow-md ${
                      isSelected ? "border-amber-500 ring-2 ring-amber-300" : "border-slate-800"
                    }`}>
                      <img src={art.avatar} className="w-full h-full object-cover" />
                    </div>
                    {/* Tiny Category Icon representation pin */}
                    <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-slate-900 border border-white flex items-center justify-center text-[8px] text-amber-400 font-bold select-none">
                      {art.category.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-800 bg-white p-0.5 px-1 rounded shadow-sm border border-slate-100 mt-1">
                    {art.name.split(" ")[0]} ({art.rateGhs} GHS)
                  </span>
                </div>
              );
            })}

            {/* Vehicle Tracking Icon Overlay Animation */}
            {trackingBookingId && (
              <div
                style={{
                  left: `${coordToSvg(currentVehicle.lat, currentVehicle.lng).x}%`,
                  top: `${coordToSvg(currentVehicle.lat, currentVehicle.lng).y}%`
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center transition-all duration-300 pointer-events-none"
              >
                <div className="relative">
                  <span className="absolute -inset-2 bg-amber-400 rounded-full animate-ping opacity-60" />
                  <div className="w-7 h-7 rounded-full bg-slate-950 border-2 border-amber-400 text-amber-400 flex items-center justify-center shadow-lg">
                    <Car className="w-3.5 h-3.5 animate-bounce" />
                  </div>
                </div>
                <span className="text-[9.5px] font-black text-white bg-slate-950 p-0.5 px-1.5 rounded-md border border-amber-400 mt-1 shadow-sm select-none">
                  🚜 Dispatch (GHA-1)
                </span>
              </div>
            )}

          </div>

          {/* Quick helpful map instructions card */}
          <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
            <p className="text-[10px] text-slate-500 leading-normal">
              <span className="font-bold text-slate-700">Dispatch Integrity Notice:</span> All handymen on this satellite map have vetted NVTI diplomas. If you hire through our platform, you benefit from a free insurance policy of up to GH₵25,000 for unexpected property damage or wiring fires.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}