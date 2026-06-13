import React, { useState } from "react";
import { CreditCard, Landmark, Check, AlertCircle, Phone, Lock, FileText, ChevronRight, Sparkles, Loader2, Download } from "lucide-react";
import { Booking } from "../types";

interface MomoPaymentProps {
  booking: Booking;
  onPaySuccess: (bookingId: string, provider: string, number: string) => void;
  onClose: () => void;
}

export default function MomoPayment({ booking, onPaySuccess, onClose }: MomoPaymentProps) {
  const [paymentType, setPaymentType] = useState<"momo" | "card">("momo");
  const [provider, setProvider] = useState<"MTN MoMo" | "Telecel Cash" | "AirtelTigo Money">("MTN MoMo");
  const [phoneNumber, setPhoneNumber] = useState(booking.customerPhone || "055 120 7800");
  
  // Card states
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Transaction simulation workflow stages
  // 'idle' -> 'initiating' -> 'push_sent' -> 'pin_requested' -> 'processing' -> 'success'
  const [txStage, setTxStage] = useState<"idle" | "initiating" | "push_sent" | "pin_requested" | "processing" | "success">("idle");
  const [momoPin, setMomoPin] = useState("");
  const [simulatedTxId, setSimulatedTxId] = useState("");

  // Price Calculation Breakdown
  const laborCharge = booking.estimatedCostGhs;
  const transportCharge = 45; // Flat transportation surcharge in GHS for fuel in Accra/Kumasi
  const platformFee = Math.round((laborCharge + transportCharge) * 0.05); // 5% platform service levy
  const totalAmount = laborCharge + transportCharge + platformFee;

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentType === "momo" && !phoneNumber) {
      alert("Please provide a valid Mobile Money phone number.");
      return;
    }
    if (paymentType === "card" && !cardNumber) {
      alert("Please provide card credentials.");
      return;
    }

    setTxStage("initiating");

    // Sequence the payment pipeline
    setTimeout(() => {
      if (paymentType === "momo") {
        setTxStage("push_sent");
        
        // Ask for MoMo PIN after 1.5 seconds
        setTimeout(() => {
          setTxStage("pin_requested");
        }, 1500);
      } else {
        // Card payments skip push popup, go directly to processing
        setTxStage("processing");
        setTimeout(() => {
          const generatedTx = "TXN-" + Math.floor(Math.random() * 899999 + 100000);
          setSimulatedTxId(generatedTx);
          setTxStage("success");
        }, 2000);
      }
    }, 1200);
  };

  const handleApprovePin = () => {
    if (momoPin.length < 4) {
      alert("Please enter your standard 4-digit mobile money authorization PIN.");
      return;
    }
    setTxStage("processing");
    
    // Process final transaction clearance
    setTimeout(() => {
      const generatedTx = "TXN-" + Math.floor(Math.random() * 899999 + 100000);
      setSimulatedTxId(generatedTx);
      setTxStage("success");
    }, 1800);
  };

  const handleCloseAndComplete = () => {
    const finalProvider = paymentType === "momo" ? provider : "Visa/Mastercard";
    const finalNumber = paymentType === "momo" ? phoneNumber : "Card ending " + cardNumber.slice(-4);
    
    onPaySuccess(booking.id, finalProvider, finalNumber);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn border border-slate-100">
        
        {/* Banner header showing flag colors and security tag */}
        <div className="bg-slate-900 text-white p-6 relative">
          <div className="absolute top-0 left-0 right-0 h-1.5 flex">
            <div className="h-full w-1/3 bg-red-600" />
            <div className="h-full w-1/3 bg-amber-400" />
            <div className="h-full w-1/3 bg-emerald-600" />
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase">Secured Gateway</span>
              <h3 className="font-display font-black text-lg text-white mt-1">GHS Checkout Payment</h3>
            </div>
            <Lock className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* STAGE A: Success Receipt */}
        {txStage === "success" ? (
          <div className="p-6 space-y-5">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-400 animate-bounce">
              <Check className="w-7 h-7" />
            </div>
            
            <div className="text-center space-y-1">
              <h4 className="font-display font-extrabold text-lg text-slate-900">Payment Cleared Successfully!</h4>
              <p className="text-xs text-slate-400">Transaction authenticated by bank gateway</p>
            </div>

            {/* Custom high-fidelity Ghanian receipt card */}
            <div className="border border-slate-150 rounded-2xl p-4 bg-slate-50 relative overflow-hidden select-none">
              {/* Slit design backgrounds */}
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-red-600 via-amber-400 to-emerald-600" />
              
              <div className="text-center font-mono text-[9px] text-slate-400 border-b border-dashed pb-2 mb-3">
                ⭐ ACCRA MUNICIPAL TRADES TAX RECEIPT ⭐
              </div>

              <div className="space-y-2 text-xs font-mono text-slate-700">
                <div className="flex justify-between">
                  <span>BILL TO:</span>
                  <span className="font-bold text-slate-900">{booking.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>ARTISAN:</span>
                  <span className="font-bold text-slate-900">{booking.artisanName}</span>
                </div>
                <div className="flex justify-between">
                  <span>CATEGORY:</span>
                  <span className="font-bold uppercase text-slate-900">{booking.artisanCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span>GATEWAY_ID:</span>
                  <span className="font-bold text-indigo-600">{simulatedTxId}</span>
                </div>
                <div className="flex justify-between">
                  <span>CHANNEL:</span>
                  <span className="font-bold text-slate-900">{paymentType === "momo" ? provider : "Card"}</span>
                </div>
                
                <div className="border-t border-dashed pt-2 mt-2 space-y-1 text-slate-500">
                  <div className="flex justify-between text-[11px]">
                    <span>Labor Base:</span>
                    <span>GH₵ {laborCharge}.00</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>Transport Surcharge:</span>
                    <span>GH₵ {transportCharge}.00</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>Service Platform Levy:</span>
                    <span>GH₵ {platformFee}.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 text-sm border-t border-slate-200 pt-1.5 mt-1">
                    <span>GRAND TOTAL GHS:</span>
                    <span className="text-emerald-600">GH₵ {totalAmount}.00</span>
                  </div>
                </div>
              </div>

              <div className="text-center text-[8px] text-slate-400 mt-3 uppercase tracking-wider font-mono">
                ✓ Insured • Guaranteed by Artisans Federation
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => alert("Invoice PDF download is being generated against our Revenue Authority index API.")}
                className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl py-2.5 text-xs font-bold flex-1"
              >
                <Download className="w-3.5 h-3.5" />
                Download In GHS Format
              </button>
              <button
                onClick={handleCloseAndComplete}
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2.5 text-xs font-bold flex-1 uppercase tracking-wider"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Show normal payment options selection */}
            {txStage === "idle" && (
              <form onSubmit={handleStartPayment} className="space-y-4">
                
                {/* Method selector tabs */}
                <div className="flex gap-2 bg-slate-150 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setPaymentType("momo")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      paymentType === "momo" ? "bg-white text-slate-950 shadow-xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Mobile Money
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType("card")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      paymentType === "card" ? "bg-white text-slate-950 shadow-xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    Credit/Debit Card
                  </button>
                </div>

                {/* Sub-form A: Mobile Money Providers */}
                {paymentType === "momo" && (
                  <div className="space-y-3 p-3 bg-amber-50/20 border border-amber-100 rounded-xl">
                    <label className="block text-[11px] font-bold text-slate-600">Select MoMo Network Provider</label>
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { id: "MTN MoMo", color: "bg-amber-400 text-black border-amber-500" },
                        { id: "Telecel Cash", color: "bg-red-600 text-white border-red-700" },
                        { id: "AirtelTigo Money", color: "bg-blue-600 text-white border-blue-700" }
                      ] as const).map((net) => (
                        <button
                          key={net.id}
                          type="button"
                          onClick={() => setProvider(net.id)}
                          className={`p-2 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center border transition-all truncate ${
                            provider === net.id 
                              ? `${net.color} scale-105 shadow-sm` 
                              : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                          }`}
                        >
                          <Landmark className="w-4 h-4 mb-1" />
                          {net.id.split(" ")[0]}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Your Registered MoMo Number</label>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g. 055 876 5432"
                        className="w-full bg-white border border-slate-250 p-2.5 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800 font-bold"
                      />
                    </div>
                  </div>
                )}

                {/* Sub-form B: Credit/Debit Cards */}
                {paymentType === "card" && (
                  <div className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Ama Asantewaa"
                        className="w-full bg-white border border-slate-200 p-2 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Visa/Mastercard Number</label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4111 8900 1200 4567"
                        maxLength={19}
                        className="w-full bg-white border border-slate-200 p-2 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          maxLength={5}
                          className="w-full bg-white border border-slate-200 p-2 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">Security Code (CVV)</label>
                        <input
                          type="password"
                          placeholder="123"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          maxLength={3}
                          className="w-full bg-white border border-slate-200 p-2 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-Total Bill Breakdown Details */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs space-y-1.5 leading-normal">
                  <h4 className="font-bold text-slate-700 text-[10px] uppercase tracking-wider mb-1">Detailed Bill Breakdown</h4>
                  <div className="flex justify-between text-slate-600">
                    <span>Labor ({booking.artisanName} rate estimate):</span>
                    <span>GH₵ {laborCharge}.00</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Transport Surcharge (Fuel premium):</span>
                    <span>GH₵ {transportCharge}.00</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Ghana Municipal Trades Fee (5%):</span>
                    <span>GH₵ {platformFee}.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 border-t pt-2 mt-2 font-display text-sm">
                    <span>Total Checkout Price:</span>
                    <span className="text-emerald-600">GH₵ {totalAmount}.00</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl py-2.5 text-xs font-bold uppercase transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2.5 text-xs font-bold uppercase transition-all shadow-md flex items-center justify-center gap-1"
                  >
                    {paymentType === "momo" ? "Authorize MoMo Push" : "Process Card Securely"}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </form>
            )}

            {/* STAGE B: Notification progress */}
            {txStage === "initiating" && (
              <div className="p-8 text-center space-y-4 my-8">
                <Loader2 className="w-12 h-12 text-slate-950 animate-spin mx-auto" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Contacting National Payment Hub...</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Acquiring cryptographic handshake lines</p>
                </div>
              </div>
            )}

            {txStage === "push_sent" && (
              <div className="p-8 text-center space-y-4 my-8">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">MoMo Push Alert Triggered</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                    Check your registered phone screen <span className="font-bold text-slate-850">{phoneNumber}</span> for the authorization popup from <span className="font-bold text-amber-600">{provider}</span>.
                  </p>
                </div>
              </div>
            )}

            {/* STAGE C: Interactive prompt overlay for Mobile PIN code entry simulation */}
            {txStage === "pin_requested" && (
              <div className="border border-amber-200 bg-amber-50/30 rounded-2xl p-5 space-y-4 animate-scaleIn select-none">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <span className="text-xs font-bold text-slate-800">Ghana Interbank Payment System Prompt</span>
                </div>
                
                <p className="text-xs text-slate-600 leading-normal">
                  To complete the secure checkout of <span className="font-bold text-slate-800">GH₵ {totalAmount}.00</span>, enter your {provider} secure authorization PIN:
                </p>

                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-500 font-bold uppercase">Enter 4-Digit MoMo PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={momoPin}
                    onChange={(e) => setMomoPin(e.target.value)}
                    placeholder="••••"
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-center text-lg tracking-widest focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleApprovePin}
                  className="w-full bg-slate-900 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-slate-800 transition-all uppercase tracking-wider"
                >
                  Approve Transaction
                </button>
              </div>
            )}

            {/* STAGE D: Processing actual checkout clearance */}
            {txStage === "processing" && (
              <div className="p-8 text-center space-y-4 my-8 animate-pulse">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Validating Cryptographic Seal...</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Clearing funds directly into the artisan escrow treasury pot</p>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}