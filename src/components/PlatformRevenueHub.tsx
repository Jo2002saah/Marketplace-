import React, { useState } from "react";
import { 
  DollarSign, 
  Percent, 
  Sparkles, 
  Award, 
  Megaphone, 
  Unlock, 
  Users, 
  TrendingUp, 
  Sliders, 
  ShieldCheck, 
  Crown, 
  Activity, 
  Coins, 
  HelpCircle,
  HelpCircle as InfoIcon
} from "lucide-react";
import { Artisan, Booking } from "../types";

interface PlatformRevenueHubProps {
  artisans: Artisan[];
  bookings: Booking[];
  onTogglePremium: (artisanId: string) => void;
  onToggleFeatured: (artisanId: string) => void;
}

export default function PlatformRevenueHub({ 
  artisans, 
  bookings, 
  onTogglePremium, 
  onToggleFeatured 
}: PlatformRevenueHubProps) {
  
  // Custom interactive fee configuration states
  const [commissionRate, setCommissionRate] = useState<number>(10); // Default 10%
  const [monthlySubFee, setMonthlySubFee] = useState<number>(120); // GHS 120/mo
  const [leadFeeGhs, setLeadFeeGhs] = useState<number>(5); // GHS 5 per AI brief unlock
  const [adFeaturedFeeDays, setAdFeaturedFeeDays] = useState<number>(15); // GHS 15 per day for featured spot
  
  // Help state toggles
  const [activeExplainTab, setActiveExplainTab] = useState<"commission" | "subscription" | "ads" | "leads" | "partners">("commission");

  // Calculations based on actual local state
  const completedBookings = bookings.filter((b) => b.status === "completed");
  const totalCompletedGhs = completedBookings.reduce((sum, b) => sum + b.estimatedCostGhs, 0);
  
  // Calculation parameters
  const calculatedCommissionEarned = Math.round(totalCompletedGhs * (commissionRate / 100));
  
  const premiumArtisansCount = artisans.filter((a) => a.isPremium).length;
  const calculatedMonthlySubsEarned = premiumArtisansCount * monthlySubFee;

  const featuredArtisansCount = artisans.filter((a) => a.isFeatured).length;
  // Imagine featured ads run for an average of 7 days
  const calculatedAdRevenueEarned = featuredArtisansCount * adFeaturedFeeDays * 7;

  // Imagine every booking generates an unlocked AI-optimized lead brief
  const calculatedLeadFeesEarned = bookings.length * leadFeeGhs;

  // Aggregate simulated platform revenue
  const grossEstimatedRevenue = calculatedCommissionEarned + calculatedMonthlySubsEarned + calculatedAdRevenueEarned + calculatedLeadFeesEarned;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden p-6 animate-fadeIn space-y-8">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
        <div>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-emerald-100">
            Platform Treasury Simulator
          </span>
          <h3 className="font-display font-bold text-lg text-slate-900 mt-1 flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-500" />
            Revenue & Partnership Ecosystem
          </h3>
          <p className="text-xs text-slate-400 font-medium">Explore and simulate the multi-channel business model powering the marketplace.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 text-white p-3 rounded-xl border border-slate-800 shadow-md">
          <TrendingUp className="w-5 h-5 text-emerald-400 animate-pulse" />
          <div>
            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Est. Gross Treasury</span>
            <span className="text-sm font-black text-amber-400">GH₵ {grossEstimatedRevenue.toLocaleString()}.00</span>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Job Commission Status */}
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-start gap-3 relative overflow-hidden select-none">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Job Commissions</span>
            <p className="text-lg font-bold text-slate-900">GH₵ {calculatedCommissionEarned}</p>
            <span className="text-[9.5px] text-slate-500 font-medium">
              {commissionRate}% fee • {completedBookings.length} completed jobs
            </span>
          </div>
        </div>

        {/* 2. Subscription Status */}
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-start gap-3 relative overflow-hidden select-none">
          <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Premium Subs</span>
            <p className="text-lg font-bold text-slate-900">GH₵ {calculatedMonthlySubsEarned}<span className="text-xs text-slate-400 font-normal">/mo</span></p>
            <span className="text-[9.5px] text-slate-500 font-medium">
              GH₵ {monthlySubFee}/mo • {premiumArtisansCount} premium pros
            </span>
          </div>
        </div>

        {/* 3. Advertising Premium */}
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-start gap-3 relative overflow-hidden select-none">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Ad Campaigns</span>
            <p className="text-lg font-bold text-slate-900">GH₵ {calculatedAdRevenueEarned}</p>
            <span className="text-[9.5px] text-slate-500 font-medium">
              ~7 days campaign • {featuredArtisansCount} active ads
            </span>
          </div>
        </div>

        {/* 4. Service Lead unlock */}
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-start gap-3 relative overflow-hidden select-none">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <Unlock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Service Lead Fees</span>
            <p className="text-lg font-bold text-slate-900">GH₵ {calculatedLeadFeesEarned}</p>
            <span className="text-[9.5px] text-slate-500 font-medium">
              GH₵ {leadFeeGhs}/brief • {bookings.length} totals booked
            </span>
          </div>
        </div>

      </div>

      {/* Control & Interactive Strategy Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        
        {/* Left Side: interactive simulator inputs */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200/60 p-5 rounded-2xl space-y-4">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
            <Sliders className="w-4 h-4 text-amber-500" />
            Parameter Configurations
          </h4>

          {/* Commission slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Commission Rate per Job:</span>
              <span className="font-bold text-amber-600 font-mono">{commissionRate}%</span>
            </div>
            <input 
              type="range" 
              min={5} 
              max={25} 
              value={commissionRate}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <p className="text-[10px] text-slate-400">Direct cut deducted from completed escrow payout transactions.</p>
          </div>

          {/* Sub Fee slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Premium Pro Monthly Fee:</span>
              <span className="font-bold text-amber-600 font-mono">GH₵ {monthlySubFee}</span>
            </div>
            <input 
              type="range" 
              min={40} 
              max={300} 
              step={10}
              value={monthlySubFee}
              onChange={(e) => setMonthlySubFee(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <p className="text-[10px] text-slate-400">Flat standard subscription fee for verified premium artisan priority listings.</p>
          </div>

          {/* Lead fee slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Lead Brief Unlock Fee:</span>
              <span className="font-bold text-amber-600 font-mono">GH₵ {leadFeeGhs}</span>
            </div>
            <input 
              type="range" 
              min={2} 
              max={20} 
              value={leadFeeGhs}
              onChange={(e) => setLeadFeeGhs(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <p className="text-[10px] text-slate-400">Fee for non-subscribed artisans to acquire high-quality, AI-estimated briefs.</p>
          </div>

          {/* Ad fee slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Featured Ad cost/Day:</span>
              <span className="font-bold text-amber-600 font-mono">GH₵ {adFeaturedFeeDays}</span>
            </div>
            <input 
              type="range" 
              min={5} 
              max={55} 
              value={adFeaturedFeeDays}
              onChange={(e) => setAdFeaturedFeeDays(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <p className="text-[10px] text-slate-400">Standard daily ad rate for banners and prominent top-row catalog placement.</p>
          </div>
          
        </div>

        {/* Right Side: Educational strategy explainer tabs */}
        <div className="lg:col-span-7 flex flex-col h-full space-y-4">
          
          {/* Strategy Tabs */}
          <div className="flex overflow-x-auto gap-1 border-b pb-px scrollbar-none">
            {([
              { id: "commission", label: "Job Commission", color: "border-amber-400 text-slate-900" },
              { id: "subscription", label: "Premium Pro Subs", color: "border-pink-500 text-slate-900" },
              { id: "ads", label: "Featured Ads", color: "border-indigo-500 text-slate-900" },
              { id: "leads", label: "Service Leads", color: "border-emerald-500 text-slate-900" },
              { id: "partners", label: "Partnerships", color: "border-slate-800 text-slate-900" }
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveExplainTab(tab.id)}
                className={`pb-2 text-xs font-bold transition-all px-2 border-b-2 whitespace-nowrap ${
                  activeExplainTab === tab.id
                    ? `${tab.color} font-black`
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 bg-slate-50/50 border border-slate-100 rounded-2xl p-5 space-y-4">
            
            {activeExplainTab === "commission" && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wide">1. Commission on Completed Hires</h5>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every time a customer clears their invoice using our **checked-out Mobile Money flow**, the platform captures a **{commissionRate}% brokerage fee** from the total labor estimate prior to dispersing payouts into the artisan’s MoMo digital wallet.
                </p>
                <div className="bg-white border rounded-xl p-3 space-y-2 text-[11px] text-slate-700 font-mono">
                  <div className="flex justify-between border-b pb-1">
                    <span>Simulated Job Labor:</span>
                    <span>GH₵ 250.00</span>
                  </div>
                  <div className="flex justify-between border-b pb-1 text-slate-500">
                    <span>Platform Commission ({commissionRate}%):</span>
                    <span>- GH₵ {(250 * commissionRate / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-600">
                    <span>Artisan Final Payout:</span>
                    <span>GH₵ {(250 - (250 * commissionRate / 100)).toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 italic">
                  ✓ Satisfies high safety metrics representing structured, automatic escrow security loops.
                </p>
              </div>
            )}

            {activeExplainTab === "subscription" && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shrink-0" />
                  <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wide">2. Premium Artisan Membership Subscriptions</h5>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Verified tradesmen can subscribe to the **Premium Pro Subscription** at **GH₵ {monthlySubFee}/month**. Subscribers gain priority exposure in directory listings, get custom highlighted tags, and have complete waivers on basic lead purchase fees.
                </p>

                <div className="bg-white border rounded-xl p-3 space-y-2.5">
                  <span className="text-[10.5px] font-bold text-slate-700 block">Configure premium subscribers in active database:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {artisans.map(art => (
                      <button
                        key={art.id}
                        type="button"
                        onClick={() => onTogglePremium(art.id)}
                        className={`text-[10px] px-2.5 py-1.5 rounded-lg font-bold border transition-all flex items-center gap-1 ${
                          art.isPremium 
                            ? "bg-pink-50 text-pink-700 border-pink-200 shadow-xs" 
                            : "bg-white border-slate-200 text-slate-500 hover:border-slate-350"
                        }`}
                      >
                        <Crown className="w-3 h-3 text-pink-500" />
                        {art.name.split(" ")[0]} 
                        <span className="text-[8px] opacity-75">{art.isPremium ? "(Subscriber)" : ""}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeExplainTab === "ads" && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
                  <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wide">3. Featured Artisan Advertisements (Sponsorship)</h5>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Handymen pay **GH₵ {adFeaturedFeeDays}/day** to run display advertisements. Ad spots place their profiles in top hero highlights, display a custom *Featured Sponsor* banner on search results, and pin their location on the live GPS Satellite Radar page.
                </p>

                <div className="bg-white border rounded-xl p-3 space-y-2.5">
                  <span className="text-[10.5px] font-bold text-slate-700 block">Manage sponsored ad statuses on live dataset:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {artisans.map(art => (
                      <button
                        key={art.id}
                        type="button"
                        onClick={() => onToggleFeatured(art.id)}
                        className={`text-[10px] px-2.5 py-1.5 rounded-lg font-bold border transition-all flex items-center gap-1 ${
                          art.isFeatured 
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-xs" 
                            : "bg-white border-slate-200 text-slate-500 hover:border-slate-350"
                        }`}
                      >
                        <Megaphone className="w-3 h-3 text-indigo-500" />
                        {art.name.split(" ")[0]}
                        <span className="text-[8px] opacity-75">{art.isFeatured ? "(Featured)" : ""}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeExplainTab === "leads" && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wide">4. Service Lead Generation & Unlock Fees</h5>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Non-subscribed tradesmen who do not want standard monthly recurring subscription fees are charged small pay-per-lead fees of **GH₵ {leadFeeGhs}** to unlock AI-optimized customer briefs (diagnostics specs, localized materials guides, and step-by-step milestones prepared via Gemini models).
                </p>
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-[11px] leading-relaxed border border-emerald-100 flex items-start gap-2">
                  <Unlock className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
                  <span>
                    Premium subscribers get **100% free unlocks** on unlimited briefs, driving high loyalty and increasing recurring subscription conversion rates across Accra and Kumasi.
                  </span>
                </div>
              </div>
            )}

            {activeExplainTab === "partners" && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-900 shrink-0" />
                  <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wide">5. Corporate Enterprise Partnerships</h5>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We maintain premium partnerships with national organizations to drive certification trust and generate business-to-business sponsorships.
                </p>
                
                {/* Corporate badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="bg-white border p-3 rounded-xl flex items-center gap-2.5">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                    <div>
                      <span className="text-[10px] text-slate-800 font-extrabold block">NVTI Ghana</span>
                      <span className="text-[9px] text-slate-400">National Vocational Certification Link</span>
                    </div>
                  </div>

                  <div className="bg-white border p-3 rounded-xl flex items-center gap-2.5">
                    <Activity className="w-6 h-6 text-rose-500" />
                    <div>
                      <span className="text-[10px] text-slate-800 font-extrabold block">Enterprise Insurance Ltd</span>
                      <span className="text-[9px] text-slate-400">Guarantees up to GH₵25,000 protection</span>
                    </div>
                  </div>
                </div>

                <p className="text-[10.5px] text-slate-500">
                  Business sponsors supply tools, training spaces, and bulk insurance covers at volume discounts, which we monetize via partner listing integrations.
                </p>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
