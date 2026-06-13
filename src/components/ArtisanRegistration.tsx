import React, { useState } from "react";
import { User, Award, Shield, Check, Info, FileText, UploadCloud, MapPin, Camera, Sparkles } from "lucide-react";
import { Artisan, ArtisanCategory } from "../types";
import { GHANA_LOCATIONS } from "../data";
import { getCategoryLabel } from "../utils";

interface ArtisanRegistrationProps {
  onRegister: (newArtisan: Artisan) => void;
  onClose: () => void;
}

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=200&h=200",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200",
];

export default function ArtisanRegistration({ onRegister, onClose }: ArtisanRegistrationProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ArtisanCategory>("electrician");
  const [location, setLocation] = useState(GHANA_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [rateGhs, setRateGhs] = useState<number>(55);
  const [bio, setBio] = useState("");
  const [specialtiesText, setSpecialtiesText] = useState("");
  const [yearsExperience, setYearsExperience] = useState<number>(3);
  const [ghanaCard, setGhanaCard] = useState("");
  const [tradeCertificate, setTradeCertificate] = useState("NVTI Grade I Certificate");
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0]);
  
  // Custom states for simulated files
  const [certificateFile, setCertificateFile] = useState<string | null>(null);
  const [idPhotoFile, setIdPhotoFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !bio || !ghanaCard) {
      alert("Please fill in all certified fields including your Ghana Card.");
      return;
    }

    setIsSubmitting(true);

    // Simulate NVTI/Ghana Card authentication checking
    setTimeout(() => {
      const finalLocation = customLocation ? customLocation : location;
      const specialties = specialtiesText
        ? specialtiesText.split(",").map((s) => s.trim())
        : [category.charAt(0).toUpperCase() + category.slice(1) + " repair", "General Maintenance"];

      const newArtisan: Artisan = {
        id: "artisan_" + Date.now(),
        name,
        category,
        location: finalLocation,
        phone,
        rating: 5.0, // newly registered starts with clean slate
        reviewsCount: 0,
        rateGhs,
        avatar,
        bio,
        specialties,
        isVerified: true, // Auto-verified through our verified process demo
        tradeCertificate: tradeCertificate || "Apprenticeship Testimonial",
        completedJobs: 0,
        yearsExperience,
        availability: "always",
        ghanaCardNumber: ghanaCard,
        latitude: 5.6037 + (Math.random() - 0.5) * 0.05, // Randomly place inside municipal zones
        longitude: -0.1870 + (Math.random() - 0.5) * 0.05,
        reviews: [],
      };

      onRegister(newArtisan);
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 1200);
  };

  if (showSuccess) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md mx-auto my-12 animate-fadeIn space-y-4">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-400">
          <Check className="w-8 h-8" />
        </div>
        <h3 className="font-display font-bold text-xl text-slate-900">Registration Successful!</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Medaase! Your professional credentials have been analyzed and approved against our NVTI and National Identification Authority (NIA) database. Your profile is now live!
        </p>
        <div className="p-3 bg-slate-50 rounded-xl text-left text-xs space-y-1 border border-slate-100">
          <div><span className="font-bold text-slate-700">Artisan Name:</span> {name}</div>
          <div><span className="font-bold text-slate-700">Category:</span> <span>{getCategoryLabel(category)}</span></div>
          <div><span className="font-bold text-slate-700">ID verified:</span> Yes (Ghana Card approved)</div>
          <div><span className="font-bold text-slate-700">Hourly rate:</span> GH₵ {rateGhs}/hr</div>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2.5 text-xs font-bold transition-all uppercase tracking-wider"
        >
          Go to Marketplace Directory
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-lg overflow-hidden max-w-xl mx-auto my-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-950 text-white p-6 relative">
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="h-full w-1/3 bg-red-600" />
          <div className="h-full w-1/3 bg-amber-400" />
          <div className="h-full w-1/3 bg-emerald-600" />
        </div>
        <h3 className="font-display font-bold text-lg">Ghanaian Tradesperson Registration</h3>
        <p className="text-xs text-slate-400 mt-1">Submit your profile to start receiving bookings from local clients.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        
        {/* Personal Details */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b pb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-500" />
            Personal Credentials
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name (Matching your Ghana Card)</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Yaw Preko Boateng"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Active Phone/MoMo Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 024 123 4567"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Trade Details */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b pb-1 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            Trade Category & Pricing
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Primary Skill Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ArtisanCategory)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none capitalize"
              >
                <option value="electrician">Electrician</option>
                <option value="plumber">Plumber</option>
                <option value="carpenter">Carpenter & Furniture Maker</option>
                <option value="painter">Painter & Decorator</option>
                <option value="mechanic">Motor Mechanic</option>
                <option value="mason">Mason & Bricklayer</option>
                <option value="welder">Welder & Fabricator</option>
                <option value="ac_technician">Refrigeration & AC Technician</option>
                <option value="pop_technician">POP Technician</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Years of Experience</label>
              <input
                type="number"
                min={1}
                max={40}
                required
                value={yearsExperience}
                onChange={(e) => setYearsExperience(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Base Rate (GH₵ / Hour)</label>
              <input
                type="number"
                min={20}
                max={500}
                required
                value={rateGhs}
                onChange={(e) => setRateGhs(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Select Base Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              >
                {GHANA_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
                <option value="">Other Location...</option>
              </select>
            </div>
            {!location && (
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Specify Other Neighborhood</label>
                <input
                  type="text"
                  required
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="e.g. Abrepo, Kumasi"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Specialties & Subservices (comma separated)</label>
            <input
              type="text"
              value={specialtiesText}
              onChange={(e) => setSpecialtiesText(e.target.value)}
              placeholder="e.g. Gas leak tracing, overhead polytanks, pressure boosters"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Professional Bio / Experience Summary</label>
            <textarea
              required
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your apprenticeship history, recent commercial projects, and standard workmanship pledge..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Verification Checks */}
        <div className="space-y-3 bg-amber-50/20 border border-amber-100 rounded-xl p-4">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            Identity Details & NIA Database Match
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 mb-1">Ghana Card Number (Required for Verified Badge)</label>
              <input
                type="text"
                required
                value={ghanaCard}
                onChange={(e) => setGhanaCard(e.target.value)}
                placeholder="e.g. GHA-712891002-3"
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-700 mb-1">Qualifying Certificate Name</label>
              <input
                type="text"
                value={tradeCertificate}
                onChange={(e) => setTradeCertificate(e.target.value)}
                placeholder="e.g. NVTI Grade II Plumber"
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Preset Profile Picture Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-700 mb-1.5">Choose Professional Profile Photo</label>
            <div className="flex gap-2.5 flex-wrap items-center">
              {PRESET_AVATARS.map((pUrl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatar(pUrl)}
                  className={`relative w-11 h-11 rounded-lg overflow-hidden border-2 transition-all ${
                    avatar === pUrl ? "border-amber-500 scale-105 shadow-sm" : "border-transparent opacity-80"
                  }`}
                >
                  <img src={pUrl} className="w-full h-full object-cover" />
                  {avatar === pUrl && (
                    <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5 font-bold" />
                    </span>
                  )}
                </button>
              ))}
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Or paste custom image URL..."
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full bg-white border border-slate-100 p-2 text-[10px] rounded focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Mock Drag & Drop document upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            
            {/* Cert upload */}
            <div className="bg-white border border-dashed border-slate-300 rounded-xl p-3 text-center hover:border-slate-400 transition-all cursor-pointer relative">
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setCertificateFile(e.target.files[0].name);
                  }
                }}
              />
              <UploadCloud className="w-5 h-5 mx-auto text-slate-400" />
              <p className="text-[10px] text-slate-600 font-semibold mt-1">
                {certificateFile ? certificateFile : "Upload NVTI Certification"}
              </p>
              <p className="text-[9px] text-slate-400">PDF, JPG up to 5MB</p>
            </div>

            {/* Ghana card crop upload */}
            <div className="bg-white border border-dashed border-slate-300 rounded-xl p-3 text-center hover:border-slate-400 transition-all cursor-pointer relative">
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setIdPhotoFile(e.target.files[0].name);
                  }
                }}
              />
              <Camera className="w-5 h-5 mx-auto text-slate-400" />
              <p className="text-[10px] text-slate-600 font-semibold mt-1">
                {idPhotoFile ? idPhotoFile : "Upload Scan of Ghana Card"}
              </p>
              <p className="text-[9px] text-slate-400">Secure verification scan</p>
            </div>

          </div>

        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl py-2.5 text-xs font-bold transition-all uppercase"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2.5 text-xs font-bold transition-all uppercase shadow-md flex items-center justify-center gap-1.5"
          >
            {isSubmitting ? "Generating Credentials..." : "Submit Verified Application"}
          </button>
        </div>

      </form>
    </div>
  );
}