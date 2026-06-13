import React, { useState } from "react";
import { Sparkles, ShieldAlert, Coins, FileText, ClipboardCheck, ArrowRight, CornerDownRight, Loader2, HelpCircle } from "lucide-react";
import { ArtisanCategory, MatchmakeResult, CostEstimateResult } from "../types";
import { SUGGEST_ISSUES } from "../data";

interface AICoachProps {
  onApplyIssue: (data: {
    category: ArtisanCategory;
    description: string;
    estimatedCost: number;
    optimizedBrief?: any;
  }) => void;
}

export default function AICoach({ onApplyIssue }: AICoachProps) {
  const [roughDesc, setRoughDesc] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // AI Results
  const [matchResult, setMatchResult] = useState<MatchmakeResult | null>(null);
  const [costResult, setCostResult] = useState<CostEstimateResult | null>(null);
  const [polishedBrief, setPolishedBrief] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"diagnostics" | "costs" | "brief">("diagnostics");
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const handleSuggestClick = (desc: string) => {
    setRoughDesc(desc);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roughDesc.trim()) return;

    setIsAnalyzing(true);
    setMatchResult(null);
    setCostResult(null);
    setPolishedBrief(null);
    setErrorNotice(null);

    try {
      // 1. Call matchmaking API
      const matchRes = await fetch("/api/ai/matchmake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: roughDesc }),
      });
      if (!matchRes.ok) throw new Error("Matchmaking failed");
      const matchData: MatchmakeResult = await matchRes.json();
      setMatchResult(matchData);

      // 2. Call cost estimate API using the determined category
      const costRes = await fetch("/api/ai/estimate-cost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: matchData.recommendedArtisanCategory,
          issueDescription: roughDesc,
        }),
      });
      if (costRes.ok) {
        const costData: CostEstimateResult = await costRes.json();
        setCostResult(costData);
      }

      // 3. Call optimize-brief API
      const briefRes = await fetch("/api/ai/optimize-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: roughDesc }),
      });
      if (briefRes.ok) {
        const briefData = await briefRes.json();
        setPolishedBrief(briefData);
      }

      setActiveTab("diagnostics");
    } catch (err: any) {
      console.error(err);
      setErrorNotice("Could not connect to Gemini API. Providing local smart estimator instead.");
      
      // Local recovery simulations so the interface is 100% robust and useful:
      const fallbackCat: ArtisanCategory = roughDesc.toLowerCase().includes("wire") || roughDesc.toLowerCase().includes("light") || roughDesc.toLowerCase().includes("spark") || roughDesc.toLowerCase().includes("power") ? "electrician" :
                          roughDesc.toLowerCase().includes("leak") || roughDesc.toLowerCase().includes("pipe") || roughDesc.toLowerCase().includes("tank") || roughDesc.toLowerCase().includes("water") ? "plumber" :
                          roughDesc.toLowerCase().includes("car") || roughDesc.toLowerCase().includes("mechanic") || roughDesc.toLowerCase().includes("engine") || roughDesc.toLowerCase().includes("brake") ? "mechanic" :
                          roughDesc.toLowerCase().includes("wood") || roughDesc.toLowerCase().includes("furniture") || roughDesc.toLowerCase().includes("door") || roughDesc.toLowerCase().includes("cabinet") ? "carpenter" : "painter";
      
      setMatchResult({
        recommendedArtisanCategory: fallbackCat,
        confidence: "medium",
        explanation: "Offline-Estimate: This matches trade scopes handled by our certified local " + fallbackCat + " list.",
        immediateSafetyTips: [
          "Do not touch any exposed segments with your bare hands.",
          "Kindly tell children to keep clear of the workspace.",
          "Ensure secondary supply lines (valves or breakers) are shut off if active leakage or heating occurs."
        ],
        preliminaryQuestions: [
          "Does the problem worsen when other devices or taps are in usage?",
          "Are you noticing any smoke, smell of burn, or moisture?"
        ]
      });

      setCostResult({
        estimatedRangeGhs: { min: 140, max: 320 },
        laborCostEstimateGhs: { min: 90, max: 180 },
        materialsEstimateGhs: { min: 50, max: 140 },
        typicalDuration: "1 - 3 hours",
        costFactors: [
          "Price of raw materials / plumbing fittings in the nearest local hardware shop.",
          "Travel distance from the artisan's base station.",
          "Whether the booking falls on an off-peak weekday or a weekend."
        ],
        materialsRequired: ["Tapes & insulation adhesive", "Basic repair screws & custom couplings"]
      });

      setPolishedBrief({
        title: "Domestic " + fallbackCat.charAt(0).toUpperCase() + fallbackCat.slice(1) + " Fix Order",
        optimizedDescription: "Customer reported issue: " + roughDesc + " requiring targeted diagnosis.",
        scopeOfWork: [
          "Perform complete visual inspection and detect failure source.",
          "Acquire optimal replacement hardware components from local suppliers.",
          "Assemble structural parts and run testing to verify structural correction."
        ],
        suggestedMilestones: [
          "Inspection and fault check",
          "Component assembly",
          "Pristine operation handover"
        ]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApply = () => {
    if (!matchResult) return;
    
    // Average or min cost as base estimate
    const cost = costResult ? Math.floor((costResult.estimatedRangeGhs.min + costResult.estimatedRangeGhs.max) / 2) : 150;
    
    onApplyIssue({
      category: matchResult.recommendedArtisanCategory,
      description: polishedBrief ? polishedBrief.optimizedDescription : roughDesc,
      estimatedCost: cost,
      optimizedBrief: polishedBrief,
    });
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
          <Sparkles className="w-5 h-5 fill-current" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 text-base leading-none">AI Repair Diagnostic Assistant</h3>
          <p className="text-xs text-slate-500 mt-1">Submit your issue to find correct artisans, safety tips, & Ghana market prices</p>
        </div>
      </div>

      <form onSubmit={handleAnalyze} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Describe what you need fixed (be as simple or detailed as you want):
          </label>
          <textarea
            value={roughDesc}
            onChange={(e) => setRoughDesc(e.target.value)}
            placeholder="e.g., Water is leaking from my kitchen sink joint underneath the cupboard, creating a pool..."
            rows={3}
            className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-slate-700"
            required
          />
        </div>

        {/* Suggested Quick Buttons */}
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-slate-400">Ghana Common Issues Quick-Test:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGEST_ISSUES.map((issue, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestClick(issue.description)}
                className="text-[11px] bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-600 px-2.5 py-1 rounded-lg transition-all"
              >
                {issue.title}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isAnalyzing || !roughDesc.trim()}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>Analyzing Issue via Gemini...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Analyze, Cost Estimate & Optimize</span>
            </>
          )}
        </button>
      </form>

      {errorNotice && (
        <div className="mt-4 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500">
          {errorNotice}
        </div>
      )}

      {/* AI Output Result Section */}
      {matchResult && (
        <div className="mt-6 border-t border-slate-100 pt-5 space-y-4 animate-fadeIn">
          {/* Tabs header */}
          <div className="flex border-b border-slate-100 pb-px gap-1">
            <button
              onClick={() => setActiveTab("diagnostics")}
              className={`flex items-center gap-1.5 pb-2 text-xs font-medium border-b px-2 transition-all ${
                activeTab === "diagnostics"
                  ? "border-amber-500 text-slate-800 font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Diagnostics & Safety
            </button>
            <button
              onClick={() => setActiveTab("costs")}
              className={`flex items-center gap-1.5 pb-2 text-xs font-medium border-b px-2 transition-all ${
                activeTab === "costs"
                  ? "border-amber-500 text-slate-800 font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              GHS Cost Estimate
            </button>
            <button
              onClick={() => setActiveTab("brief")}
              className={`flex items-center gap-1.5 pb-2 text-xs font-medium border-b px-2 transition-all ${
                activeTab === "brief"
                  ? "border-amber-500 text-slate-800 font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Optimized Brief
            </button>
          </div>

          {/* TAB 1: Diagnostics & Safety */}
          {activeTab === "diagnostics" && (
            <div className="space-y-4 text-sm animate-fadeIn">
              <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-100/40">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Recommended Artisan</span>
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    matchResult.confidence === 'high' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {matchResult.confidence} Confidence
                  </span>
                </div>
                <p className="text-slate-800 font-bold text-base capitalize">
                  {matchResult.recommendedArtisanCategory}
                </p>
                <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                  {matchResult.explanation}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-red-600 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Immediate Ghanaian Safety Measures:
                </h4>
                <ul className="space-y-1 bg-red-50/30 p-3 rounded-xl border border-red-100/50">
                  {matchResult.immediateSafetyTips.map((tip, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                      <span className="text-red-500 mt-1 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  Questions to ask yourself before booking:
                </h4>
                <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {matchResult.preliminaryQuestions.map((q, i) => (
                    <div key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                      <span className="text-amber-500 font-semibold">Q:</span>
                      <span className="italic">{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Cost Estimator */}
          {activeTab === "costs" && costResult && (
            <div className="space-y-4 text-sm animate-fadeIn">
              <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-inner">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Estimated Cost Range</span>
                  <p className="text-2xl font-bold text-amber-400 mt-1">
                    GH₵ {costResult.estimatedRangeGhs.min} - GH₵ {costResult.estimatedRangeGhs.max}
                  </p>
                  <p className="text-[11px] text-slate-300 mt-0.5">Typical Job Duration: <span className="font-semibold">{costResult.typicalDuration}</span></p>
                </div>
                <div className="w-full md:w-auto text-left md:text-right border-t md:border-t-0 border-slate-700 pt-2 md:pt-0">
                  <div className="text-xs text-slate-300">
                    <span className="text-slate-400">Est. Labor:</span> GH₵ {costResult.laborCostEstimateGhs.min} - {costResult.laborCostEstimateGhs.max}
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    <span className="text-slate-400">Est. Materials:</span> GH₵ {costResult.materialsEstimateGhs.min} - {costResult.materialsEstimateGhs.max}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <h4 className="text-xs font-bold text-slate-700 mb-2">Likely Materials Required:</h4>
                  <ul className="space-y-1">
                    {costResult.materialsRequired.map((mat, i) => (
                      <li key={i} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                        <CornerDownRight className="w-3 h-3 text-slate-400" />
                        <span>{mat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <h4 className="text-xs font-bold text-slate-700 mb-2">local Price Influencers:</h4>
                  <ul className="space-y-1">
                    {costResult.costFactors.map((factor, i) => (
                      <li key={i} className="text-[11px] text-slate-600 flex items-start gap-1">
                        <span className="text-amber-500 font-bold mt-0.5">•</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Job Brief */}
          {activeTab === "brief" && polishedBrief && (
            <div className="space-y-4 text-sm animate-fadeIn">
              <div className="bg-amber-50/25 border border-dashed border-amber-300 rounded-xl p-4">
                <h4 className="font-bold text-slate-800 text-sm mb-1">{polishedBrief.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{polishedBrief.optimizedDescription}"
                </p>

                <div className="mt-4 space-y-2">
                  <div className="text-xs font-semibold text-slate-700">Scope of Work:</div>
                  <ul className="space-y-1">
                    {polishedBrief.scopeOfWork.map((scope: string, i: number) => (
                      <li key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                        <span className="text-amber-500 text-xs">✓</span>
                        <span>{scope}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="text-xs font-semibold text-slate-700">Recommended Milestone Checks:</div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-1">
                    {polishedBrief.suggestedMilestones.map((milestone: string, i: number) => (
                      <div key={i} className="text-[10px] bg-white border border-slate-200 p-2 rounded-lg text-slate-600 flex-1 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold text-[9px] shrink-0">{i+1}</span>
                        <span className="line-clamp-2 leading-tight">{milestone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Apply button */}
          <div className="border-t border-slate-100 pt-4 flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-50 -mx-6 -mb-6 p-6">
            <div className="text-xs text-slate-500 max-w-sm">
              <span className="font-semibold text-slate-700">Ready to hire?</span> This AI analysis will match directory categories and pre-estimate cost values in the booking panel.
            </div>
            <button
              type="button"
              onClick={handleApply}
              className="w-full md:w-auto flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm shrink-0 uppercase"
            >
              <ClipboardCheck className="w-4 h-4 text-amber-400" />
              Apply AI Estimate & Find Artisans
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
