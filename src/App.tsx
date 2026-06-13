import React, { useState, useEffect } from "react";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  Award, 
  Star, 
  CheckCircle, 
  FileText, 
  ChevronRight, 
  X, 
  SlidersHorizontal, 
  AlertTriangle, 
  Wrench, 
  User, 
  Check,
  MessageSquare,
  Sparkles,
  Info
} from "lucide-react";
import { Artisan, Booking, ArtisanCategory } from "./types";
import { INITIAL_ARTISANS, GHANA_LOCATIONS } from "./data";
import AICoach from "./components/AICoach";
import ArtisanRegistration from "./components/ArtisanRegistration";
import RealTimeChat from "./components/RealTimeChat";
import GPSTracker from "./components/GPSTracker";
import MomoPayment from "./components/MomoPayment";
import { Compass, ShieldCheck, Wallet, Plus, Coins, Crown, Megaphone } from "lucide-react";
import PlatformRevenueHub from "./components/PlatformRevenueHub";
import { getCategoryColor, getCategoryLabel, getCategoryThemeColor } from "./utils";

export default function App() {
  // Artisans State
  const [artisans, setArtisans] = useState<Artisan[]>(() => {
    const saved = localStorage.getItem("ghana_marketplace_artisans");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_ARTISANS;
      }
    }
    return INITIAL_ARTISANS;
  });

  // Bookings State
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem("ghana_marketplace_bookings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Save states to local storage
  useEffect(() => {
    localStorage.setItem("ghana_marketplace_artisans", JSON.stringify(artisans));
  }, [artisans]);

  useEffect(() => {
    localStorage.setItem("ghana_marketplace_bookings", JSON.stringify(bookings));
  }, [bookings]);

  // Search & Filter State
  const [selectedCategory, setSelectedCategory] = useState<ArtisanCategory | "all">("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  // Modal / Interaction State
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
  const [bookingArtisan, setBookingArtisan] = useState<Artisan | null>(null);
  const [reviewArtisan, setReviewArtisan] = useState<Artisan | null>(null);
  const [paymentBooking, setPaymentBooking] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState<'directory' | 'gps' | 'chats' | 'register' | 'revenue'>('directory');
  const [activeChatArtisanId, setActiveChatArtisanId] = useState<string>("");

  // Booking Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerLocation, setCustomerLocation] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [suggestedCost, setSuggestedCost] = useState(0);
  const [aiBrief, setAiBrief] = useState<any | null>(null);

  // Review Form State
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");
  const [bookingIdToReview, setBookingIdToReview] = useState<string>("");

  // Handle applied diagnostics from AICoach
  const handleApplyAIResult = (data: {
    category: ArtisanCategory;
    description: string;
    estimatedCost: number;
    optimizedBrief?: any;
  }) => {
    setSelectedCategory(data.category);
    setJobDescription(data.description);
    setSuggestedCost(data.estimatedCost);
    if (data.optimizedBrief) {
      setAiBrief(data.optimizedBrief);
    }
    
    // Auto-scroll to directory layout and trigger location help
    const targetElement = document.getElementById("artisan-directory");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filter artisans based on query & categories
  const filteredArtisans = artisans.filter((artisan) => {
    const matchesCategory = selectedCategory === "all" || artisan.category === selectedCategory;
    
    // Flexible region matches (e.g. searching 'Accra' matches 'East Legon, Accra')
    const matchesLocation = selectedLocation === "all" || 
      artisan.location.toLowerCase().includes(selectedLocation.toLowerCase());
      
    const matchesQuery = 
      artisan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artisan.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      artisan.bio.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesVerification = !showVerifiedOnly || artisan.isVerified;

    return matchesCategory && matchesLocation && matchesQuery && matchesVerification;
  });

  // Handle Form Submission for new bookings
  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingArtisan) return;

    const newBooking: Booking = {
      id: "booking_" + Date.now(),
      artisanId: bookingArtisan.id,
      artisanName: bookingArtisan.name,
      artisanCategory: bookingArtisan.category,
      customerName,
      customerPhone,
      customerLocation: customerLocation || bookingArtisan.location,
      date: bookingDate,
      time: bookingTime,
      description: jobDescription,
      optimizedBrief: aiBrief,
      status: "confirmed", // Real automation step
      estimatedCostGhs: suggestedCost || (bookingArtisan.rateGhs * 3), // typical 3h job
    };

    setBookings([newBooking, ...bookings]);
    
    // Increment completed jobs on the selected artisan
    setArtisans(prev => prev.map(art => {
      if (art.id === bookingArtisan.id) {
        return { ...art, completedJobs: art.completedJobs + 1 };
      }
      return art;
    }));

    // Reset Form
    setCustomerName("");
    setCustomerPhone("");
    setCustomerLocation("");
    setBookingDate("");
    setBookingTime("");
    setJobDescription("");
    setSuggestedCost(0);
    setAiBrief(null);
    setBookingArtisan(null);
  };

  // Handle Review Submission
  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewArtisan || !bookingIdToReview) return;

    const newReview = {
      id: "rev_" + Date.now(),
      customerName: customerName || "Anonymous Customer",
      rating: Number(ratingInput),
      comment: commentInput || "Great service! Professional and punctual.",
      date: new Date().toISOString().split("T")[0]
    };

    setArtisans(prev => prev.map(art => {
      if (art.id === reviewArtisan.id) {
        const updatedReviews = [newReview, ...art.reviews];
        const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
        const newAverage = Number((totalRating / updatedReviews.length).toFixed(1));
        return {
          ...art,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
          rating: newAverage
        };
      }
      return art;
    }));

    // Update the booking so it doesn't prompt for review again
    setBookings(prev => prev.map(b => {
      if (b.id === bookingIdToReview) {
        return { ...b, ratingLeft: true };
      }
      return b;
    }));

    // Clean up
    setCommentInput("");
    setRatingInput(5);
    setReviewArtisan(null);
    setBookingIdToReview("");
  };

  const handlePaySuccess = (bookingId: string, provider: string, number: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          paymentStatus: 'paid',
          paymentProvider: provider as any,
          paymentNumber: number
        };
      }
      return b;
    }));
  };

  const handleRegisterArtisan = (newArtisan: Artisan) => {
    setArtisans(prev => [newArtisan, ...prev]);
  };

  const handleTogglePremium = (artisanId: string) => {
    setArtisans(prev => prev.map(art => {
      if (art.id === artisanId) {
        return { ...art, isPremium: !art.isPremium };
      }
      return art;
    }));
  };

  const handleToggleFeatured = (artisanId: string) => {
    setArtisans(prev => prev.map(art => {
      if (art.id === artisanId) {
        return { ...art, isFeatured: !art.isFeatured };
      }
      return art;
    }));
  };

  // Quick helper to categorize colors deleted (imported from utils.ts instead)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* GHANA THEME HERO BANNER */}
      <header className="relative bg-slate-900 text-white overflow-hidden border-b border-slate-800">
        {/* Subtle Ghana Color Accent Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="h-full w-1/3 bg-red-600" />
          <div className="h-full w-1/3 bg-amber-400" />
          <div className="h-full w-1/3 bg-emerald-600" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Accra, Kumasi & Takoradi
                </span>
                <span className="flex items-center gap-1 text-slate-400 text-xs">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  NVTI Verified Directory
                </span>
              </div>
              
              <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                Ghana Artisan <span className="text-amber-400 underline decoration-emerald-500 decoration-3 underline-offset-4">Marketplace</span>
              </h1>
              <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
                Connect with trustworthy carpenters, masons, electricians, plumbers, fabricators, AC technicians, painters, mechanics, and POP plasterers. 
                Use our built-in Gemini analyzer to check fair labor pricing, review safety instructions, and craft clear job descriptions.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 shrink-0 bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
              <div className="text-center md:text-left">
                <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Platform Stats</div>
                <div className="text-xl font-bold text-amber-400 mt-0.5">9 Verified Trades</div>
                <div className="text-xs text-slate-300">Certified local handymen</div>
              </div>
              <div className="w-px bg-slate-700 hidden sm:block" />
              <div className="text-center md:text-left">
                <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Average Rate</div>
                <div className="text-xl font-bold text-white mt-0.5">₵55 - ₵80<span className="text-xs text-slate-400 font-normal"> /hr</span></div>
                <div className="text-xs text-slate-300">Fair-market local rates</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* NAVIGATION TABS BAR */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto justify-start md:justify-center items-center gap-1.5 py-3 scrollbar-none">
            
            <button
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-2 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap uppercase tracking-wider ${
                activeTab === 'directory'
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200/40'
              }`}
            >
              <Wrench className="w-4 h-4 text-amber-500" />
              Artisan Marketplace
            </button>

            <button
              onClick={() => setActiveTab('gps')}
              className={`flex items-center gap-2 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap uppercase tracking-wider ${
                activeTab === 'gps'
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200/40'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-500 animate-spin-slow" />
              Live GPS Radar
            </button>

            <button
              onClick={() => setActiveTab('chats')}
              className={`flex items-center gap-2 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap uppercase tracking-wider ${
                activeTab === 'chats'
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200/40'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              Direct Channels
            </button>

            <button
              onClick={() => {
                setActiveTab('register');
              }}
              className={`flex items-center gap-2 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap uppercase tracking-wider ${
                activeTab === 'register'
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200/40'
              }`}
            >
              <Plus className="w-4 h-4 text-amber-500" />
              Be an Artisan
            </button>

            <button
              onClick={() => {
                setActiveTab('revenue');
              }}
              className={`flex items-center gap-2 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap uppercase tracking-wider ${
                activeTab === 'revenue'
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200/40'
              }`}
            >
              <Coins className="w-4 h-4 text-emerald-500" />
              Business & Revenue
            </button>

          </div>
        </div>
      </div>

      {/* RENDER ACTIVE TAB */}
      {activeTab === 'directory' && (
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: DIAGNOSTICS & BOOKINGS (4 COLS) */}
        <section className="lg:col-span-5 space-y-6">
          
          {/* AI Diagnostic Board */}
          <AICoach onApplyIssue={handleApplyAIResult} />

          {/* ACTIVE BOOKINGS MANAGER */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-base leading-none">Your Bookings & Invoices</h3>
                <p className="text-xs text-slate-500 mt-1">Track pending and complete hires locally</p>
              </div>
              <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full font-bold">
                {bookings.length} jobs
              </span>
            </div>

            {bookings.length === 0 ? (
              <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-100">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-400">No active bookings yet.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Select an artisan on the directory or ask our AI diagnostic to prepare rates.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white border border-slate-100 p-4 rounded-xl space-y-3 shadow-xs hover:border-slate-200 transition-all">
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          booking.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'
                        }`} />
                        <span className="text-xs font-bold text-slate-800 capitalize">
                          {booking.artisanCategory} • {booking.artisanName}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-900 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg">
                        GH₵ {booking.estimatedCostGhs}
                      </span>
                    </div>

                    <div className="bg-slate-50/70 p-2.5 rounded-lg text-xs space-y-1">
                      <div className="flex items-center gap-1 text-slate-600 font-medium">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{booking.date} at {booking.time}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600 font-medium">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{booking.customerLocation}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600 font-medium">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{booking.customerPhone} ({booking.customerName})</span>
                      </div>
                      {booking.paymentStatus === 'paid' ? (
                        <div className="flex items-center gap-1 text-emerald-600 font-bold text-[11px] pt-1.5 border-t border-slate-205/80 mt-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600 font-extrabold" />
                          <span>Paid via {booking.paymentProvider} ({booking.paymentNumber})</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-rose-500 font-bold text-[11px] pt-1.5 border-t border-slate-205/80 mt-1">
                          <Wallet className="w-3.5 h-3.5" />
                          <span>Unpaid (MoMo checkout pending)</span>
                        </div>
                      )}
                    </div>

                    {booking.optimizedBrief ? (
                      <div className="border border-dashed border-slate-200 p-2.5 rounded-lg bg-amber-50/10">
                        <span className="text-[10px] font-bold text-amber-700 uppercase flex items-center gap-1">
                          <Sparkles className="w-3 h-3 fill-amber-500 text-amber-500" />
                          Gemini Optimized Scope
                        </span>
                        <div className="text-[11px] font-semibold text-slate-800 mt-1">{booking.optimizedBrief.title}</div>
                        <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{booking.optimizedBrief.optimizedDescription}</p>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-600 line-clamp-2 italic bg-slate-50 p-2 rounded">
                        "{booking.description}"
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        booking.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {booking.status === 'completed' ? 'Job Finished' : 'Confirmed'}
                      </span>

                      <div className="flex flex-wrap gap-1.5 justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveChatArtisanId(booking.artisanId);
                            setActiveTab('chats');
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-1 rounded transition-colors"
                        >
                          💬 Chat
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveChatArtisanId(booking.artisanId);
                            setActiveTab('gps');
                          }}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded border border-indigo-100 transition-colors"
                        >
                          🛰️ GPS Track
                        </button>

                        {booking.paymentStatus !== 'paid' ? (
                          <button
                            type="button"
                            onClick={() => setPaymentBooking(booking)}
                            className="bg-amber-400 text-slate-950 hover:bg-amber-500 text-[10px] font-black px-2.5 py-1 rounded transition-all shadow-xs shrink-0"
                          >
                            💳 Pay MoMo
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                            ✓ Paid
                          </span>
                        )}

                        {booking.status !== 'completed' && (
                          <button
                            type="button"
                            onClick={() => {
                              setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: 'completed' } : b));
                            }}
                            className="bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-bold px-2.5 py-1 rounded transition-colors"
                          >
                            Mark Done
                          </button>
                        )}
                        {booking.status === 'completed' && !booking.ratingLeft && (
                          <button
                            type="button"
                            onClick={() => {
                              const art = artisans.find(a => a.id === booking.artisanId);
                              if (art) {
                                setReviewArtisan(art);
                                setBookingIdToReview(booking.id);
                              }
                            }}
                            className="bg-amber-300 hover:bg-amber-400 text-slate-950 font-bold text-[10px] px-2 py-1 rounded flex items-center gap-1 transition-all"
                          >
                            <Star className="w-3 h-3 fill-slate-950 text-slate-950" />
                            Rate
                          </button>
                        )}
                        {booking.ratingLeft && (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Reviewed
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: ARTISAN DIRECTORY (7 COLS) */}
        <section id="artisan-directory" className="lg:col-span-7 space-y-6">
          
          {/* CONTROL BAR: SEARCH, LOCATION, CATEGORIES */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
            
            {/* Standard filters */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              
              {/* Search text */}
              <div className="md:col-span-5 relative">
                <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search specialties, names, tool certifications..."
                  className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-700"
                />
              </div>

              {/* Location Selector */}
              <div className="md:col-span-4 relative">
                <MapPin className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-700 appearance-none"
                >
                  <option value="all">Everywhere in Ghana</option>
                  {GHANA_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Checkbox for verification */}
              <div className="md:col-span-3 flex items-center gap-2 px-1">
                <input
                  id="verified-only"
                  type="checkbox"
                  checked={showVerifiedOnly}
                  onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                  className="rounded border-slate-300 text-amber-500 focus:ring-amber-400 w-4 h-4"
                />
                <label htmlFor="verified-only" className="text-[11px] font-bold text-slate-600 flex items-center gap-1 cursor-pointer">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-500" />
                  Verified Only
                </label>
              </div>

            </div>

            {/* Quick Categories Bar */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-50">
              <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Categories:</span>
              <button
                onClick={() => setSelectedCategory("all")}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-semibold ${
                  selectedCategory === "all"
                    ? "bg-slate-900 border-slate-900 text-white"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                All Handymen
              </button>
              {(["electrician", "plumber", "carpenter", "painter", "mechanic", "mason", "welder", "ac_technician", "pop_technician"] as ArtisanCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-bold ${
                    selectedCategory === cat
                      ? "bg-amber-400 border-amber-400 text-slate-950 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {getCategoryLabel(cat)}
                </button>
              ))}
            </div>

          </div>

          {/* ARTISANS CARDS LIST */}
          <div className="space-y-4">
            {filteredArtisans.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center">
                <SlidersHorizontal className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="font-bold text-slate-700 text-base">No matches found in this region</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Try clearing some terms or looking in another neighborhood. Our verified network is adding new candidates daily.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedLocation("all");
                    setSearchQuery("");
                    setShowVerifiedOnly(false);
                  }}
                  className="mt-4 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredArtisans.map((artisan) => (
                <div 
                  key={artisan.id} 
                  className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-xs hover:border-slate-200 transition-all space-y-4 relative overflow-hidden"
                >
                  {/* Category Accent Stripe on side */}
                  <div className={`absolute top-0 bottom-0 left-0 w-1 ${getCategoryThemeColor(artisan.category)}`} />

                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Avatar */}
                    <img
                      src={artisan.avatar}
                      alt={artisan.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200 self-center sm:self-start bg-slate-100"
                    />

                    {/* Meta */}
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                        <h4 className="text-base font-bold text-slate-900">{artisan.name}</h4>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getCategoryColor(artisan.category)}`}>
                          {getCategoryLabel(artisan.category)}
                        </span>
                        {artisan.isVerified && (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] px-2 py-0.5 rounded flex items-center gap-0.5">
                            <CheckCircle className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                            Verified NVTI
                          </span>
                        )}
                        {artisan.isPremium && (
                          <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] px-2 py-0.5 rounded flex items-center gap-0.5 font-bold">
                            <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />
                            Premium Pro
                          </span>
                        )}
                        {artisan.isFeatured && (
                          <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] px-2 py-0.5 rounded flex items-center gap-0.5 font-bold">
                            <Megaphone className="w-3 h-3 text-indigo-500 fill-indigo-500" />
                            Featured Ad
                          </span>
                        )}
                      </div>

                      <div className="flex flex-flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-xs justify-center sm:justify-start">
                        <span className="flex items-center gap-1 justify-center">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {artisan.location}
                        </span>
                        <span className="flex items-center gap-1 justify-center">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          完成 {artisan.completedJobs} Jobs
                        </span>
                        <span className="flex items-center gap-1 justify-center text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {artisan.rating} ({artisan.reviewsCount} reviews)
                        </span>
                      </div>

                      <p className="text-slate-600 text-xs leading-relaxed text-center sm:text-left pt-1">
                        {artisan.bio}
                      </p>
                    </div>

                    {/* Rates & Order button */}
                    <div className="sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start border-t sm:border-t-0 border-slate-50 pt-3 sm:pt-0 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Hourly Rate</span>
                        <span className="text-xl font-bold text-slate-900">₵{artisan.rateGhs}</span>
                        <span className="text-slate-400 text-[11px]">/hr</span>
                      </div>
                      
                      <div className="flex gap-1.5 flex-wrap justify-end">
                        <button
                          onClick={() => {
                            setActiveChatArtisanId(artisan.id);
                            setActiveTab('chats');
                          }}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-2 rounded-xl transition-all border border-emerald-200"
                        >
                          💬 Chat
                        </button>
                        <button
                          onClick={() => setSelectedArtisan(artisan)}
                          className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-2 rounded-xl transition-all border border-slate-200"
                        >
                          Profile & Reviews
                        </button>
                        <button
                          onClick={() => {
                            setBookingArtisan(artisan);
                            setCustomerLocation(artisan.location);
                          }}
                          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-xs"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Specialties tag bundle */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-dashed border-slate-100">
                    {artisan.specialties.map((spec) => (
                      <span key={spec} className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2.5 py-0.5 rounded-lg border border-slate-200/50">
                        {spec}
                      </span>
                    ))}
                  </div>

                </div>
              ))
            )}
          </div>

        </section>

      </main>
      )}

      {activeTab === 'gps' && (
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
          <GPSTracker
            artisans={artisans}
            bookings={bookings}
            selectedArtisanId={activeChatArtisanId}
            onSelectArtisan={(id) => {
              const art = artisans.find(a => a.id === id);
              if (art) {
                setSelectedArtisan(art);
              }
            }}
          />
        </main>
      )}

      {activeTab === 'chats' && (
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
          <RealTimeChat
            artisans={artisans}
            activeArtisanId={activeChatArtisanId || (artisans.length > 0 ? artisans[0].id : undefined)}
            onClose={() => setActiveTab('directory')}
          />
        </main>
      )}

      {activeTab === 'register' && (
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
          <ArtisanRegistration
            onRegister={(newArt) => {
              handleRegisterArtisan(newArt);
              setActiveTab('directory');
            }}
            onClose={() => setActiveTab('directory')}
          />
        </main>
      )}

      {activeTab === 'revenue' && (
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
          <PlatformRevenueHub
            artisans={artisans}
            bookings={bookings}
            onTogglePremium={handleTogglePremium}
            onToggleFeatured={handleToggleFeatured}
          />
        </main>
      )}

      {/* MODAL 1: BOOK ARTISAN FORM */}
      {bookingArtisan && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 my-8">
            <div className="bg-slate-900 text-white p-6 relative">
              {/* Subtle Ghana ribbon inside modal */}
              <div className="absolute top-0 left-0 right-0 h-1.5 flex">
                <div className="h-full w-1/3 bg-red-600" />
                <div className="h-full w-1/3 bg-amber-400" />
                <div className="h-full w-1/3 bg-emerald-600" />
              </div>

              <button 
                onClick={() => setBookingArtisan(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <span className="text-[10px] bg-amber-400 text-slate-900 uppercase tracking-widest font-bold px-2 py-0.5 rounded">
                Direct Booking Form
              </span>
              <h2 className="text-xl font-bold mt-2 font-display">Book {bookingArtisan.name}</h2>
              <p className="text-xs text-slate-300 mt-0.5">{getCategoryLabel(bookingArtisan.category)} • Base: GH₵{bookingArtisan.rateGhs}/hr • Cert: {bookingArtisan.tradeCertificate}</p>
            </div>

            <form onSubmit={handleCreateBooking} className="p-6 space-y-4">
              
              {/* If AI has optimized brief, let them know */}
              {aiBrief && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex  gap-2.5 items-start">
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h5 className="text-xs font-bold text-amber-800">Gemini Recommended Estimate Loaded</h5>
                    <p className="text-[11px] text-amber-700 leading-tight">
                      We auto-populated your booking price estimate (GH₵ {suggestedCost}) and issue diagnostics based on your pre-assessment. Click any fields below to customize!
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Benjamin Osei"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Your Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 0244 123 456"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Booking Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Preferred Time</label>
                  <input
                    type="time"
                    required
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Your Site Location in Ghana</label>
                <input
                  type="text"
                  required
                  value={customerLocation}
                  onChange={(e) => setCustomerLocation(e.target.value)}
                  placeholder="e.g., East Legon, Accra (near ANC Mall)"
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Job Details & Fault Description</label>
                <textarea
                  required
                  rows={3}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Tell the artisan what you need fixed..."
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-600 block font-medium">Verified Cost Booking Base</span>
                  <span className="text-[10px] text-slate-400 italic">Pre-approved estimate or custom agreement</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-bold text-xs">GH₵</span>
                  <input
                    type="number"
                    value={suggestedCost || ""}
                    onChange={(e) => setSuggestedCost(Number(e.target.value))}
                    placeholder="Enter Ghs Amount"
                    className="w-24 bg-white border border-slate-300 font-bold rounded-lg p-2 text-xs focus:ring-1 focus:ring-amber-500 text-center"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBookingArtisan(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl py-2.5 text-xs font-bold transition-all uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2.5 text-xs font-bold transition-all uppercase shadow-md flex items-center justify-center gap-1"
                >
                  Confirm Booking
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DETAIL PROFILE & HISTORIC REVIEWS */}
      {selectedArtisan && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100 my-8">
            
            <div className="bg-slate-900 text-white p-6 relative">
              <button 
                onClick={() => setSelectedArtisan(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex gap-4 items-center">
                <img
                  src={selectedArtisan.avatar}
                  alt={selectedArtisan.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-700 bg-slate-800"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold font-display">{selectedArtisan.name}</h2>
                    <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {getCategoryLabel(selectedArtisan.category)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{selectedArtisan.location} • Base Rate: GH₵{selectedArtisan.rateGhs}/hr</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Stats & Cert details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Reputation</span>
                  <div className="text-base font-bold text-amber-500 flex items-center justify-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-current" />
                    {selectedArtisan.rating} / 5.0
                  </div>
                </div>
                <div className="border-t md:border-t-0 md:border-l md:border-r border-slate-200 py-2 md:py-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Output</span>
                  <div className="text-base font-bold text-slate-800 mt-1">
                    {selectedArtisan.completedJobs} Jobs Done
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">NVTI Certificate</span>
                  <div className="text-xs font-bold text-slate-700 mt-1.5 truncate px-1">
                    {selectedArtisan.tradeCertificate}
                  </div>
                </div>
              </div>

              {/* Bio & specialties */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">About the Artisan</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {selectedArtisan.bio}
                </p>
              </div>

              {/* Reviews count */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center justify-between">
                  <span>Customer Reviews ({selectedArtisan.reviews.length})</span>
                  <span className="text-amber-500 font-bold">{selectedArtisan.rating} Stars Avg</span>
                </h4>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {selectedArtisan.reviews.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center italic py-4">No reviews yet. Be the first to secure work and rate!</p>
                  ) : (
                    selectedArtisan.reviews.map((rev) => (
                      <div key={rev.id} className="border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{rev.customerName}</span>
                          <span className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5 my-1">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star 
                              key={idx} 
                              className={`w-3 h-3 ${idx < Math.floor(rev.rating) ? 'text-amber-400 fill-current' : 'text-slate-200'}`} 
                            />
                          ))}
                        </div>
                        <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedArtisan(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold transition-all uppercase"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setActiveChatArtisanId(selectedArtisan.id);
                    setActiveTab('chats');
                    setSelectedArtisan(null);
                  }}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl px-4 py-2.5 text-xs font-bold transition-all uppercase border border-emerald-200 flex items-center justify-center gap-1.5"
                >
                  💬 Chat
                </button>
                <button
                  onClick={() => {
                    setBookingArtisan(selectedArtisan);
                    setSelectedArtisan(null);
                  }}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2.5 text-xs font-bold transition-all uppercase shadow-md"
                >
                  Book {selectedArtisan.name}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* MODAL 3: LEAVE REVIEW */}
      {reviewArtisan && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100">
            <div className="bg-slate-900 text-white p-6 relative">
              <button 
                onClick={() => setReviewArtisan(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <span className="text-[10px] bg-amber-400 text-slate-900 uppercase font-bold px-2 py-0.5 rounded">
                Submit Rating & Feedback
              </span>
              <h2 className="text-base font-bold mt-2 font-display">Rate {reviewArtisan.name}</h2>
              <p className="text-xs text-slate-300 mt-1 capitalize">Verify trade service completion and reward quality workmanship</p>
            </div>

            <form onSubmit={handleCreateReview} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Your Rating (1 to 5 Stars)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => setRatingInput(starValue)}
                      className="p-1 px-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-amber-50 hover:border-amber-400 transition-all text-sm font-bold flex items-center gap-1 text-slate-700"
                    >
                      <Star className={`w-4 h-4 ${starValue <= ratingInput ? 'text-amber-400 fill-current' : 'text-slate-300'}`} />
                      {starValue}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Your Feedback / Review Comment</label>
                <textarea
                  required
                  rows={3}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Tell us about the handyman's punctuality, skill level, and if they cleaned up after fixing!"
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReviewArtisan(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl py-2.5 text-xs font-bold transition-all uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2.5 text-xs font-bold transition-all uppercase shadow-md"
                >
                  Submit Review
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: MOBILE MONEY PAYMENT & CHECKOUT */}
      {paymentBooking && (
        <MomoPayment
          booking={paymentBooking}
          onPaySuccess={(bookingId, provider, number) => {
            handlePaySuccess(bookingId, provider, number);
            setPaymentBooking(null);
          }}
          onClose={() => setPaymentBooking(null)}
        />
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 mt-12 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>© 2026 Ghana Artisan Marketplace. All local prices referenced in Ghana Cedis (GH₵). Connected via Google Gemini AI.</p>
        </div>
      </footer>

    </div>
  );
}
