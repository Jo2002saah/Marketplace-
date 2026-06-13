import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Image, Mic, Play, Pause, User, ArrowLeft, Paperclip, CheckCheck, Loader2 } from "lucide-react";
import { Artisan, Message, ChatSession } from "../types";
import { getCategoryLabel } from "../utils";

interface RealTimeChatProps {
  artisans: Artisan[];
  activeArtisanId?: string;
  onClose?: () => void;
}

const DEFAULT_SAMPLES = [
  "Hello boss! Are you available to come look at my ceiling POP water stain today?",
  "Yes please, what neighborhood in Kumasi are you around?",
  "I'm at Adum, close to the Melcom store.",
  "Great, I can pass by around 2:00 PM. Rate is GH₵50 per hour plus transport. Does that work?"
];

export default function RealTimeChat({ artisans, activeArtisanId, onClose }: RealTimeChatProps) {
  // Select active chat session
  const [selectedArtisanId, setSelectedArtisanId] = useState<string>(
    activeArtisanId || (artisans.length > 0 ? artisans[0].id : "")
  );

  const activeArtisan = artisans.find((a) => a.id === selectedArtisanId);

  // Loaded Chats from LocalStorage or generated defaults
  const [sessions, setSessions] = useState<Record<string, ChatSession>>(() => {
    const saved = localStorage.getItem("ghana_marketplace_chats");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    
    // Generate some interesting pre-filled chats for default artisans to make the interactive experience feel extremely real on load
    const initialSessions: Record<string, ChatSession> = {};
    artisans.forEach((art, i) => {
      initialSessions[art.id] = {
        artisanId: art.id,
        artisanName: art.name,
        messages: [
          {
            id: `msg_init_${art.id}_1`,
            sender: "customer",
            text: `Hi ${art.name}, I found your certificate profile under the ${getCategoryLabel(art.category)} list. Are you available for a urgent job?`,
            timestamp: "09:12 AM"
          },
          {
            id: `msg_init_${art.id}_2`,
            sender: "artisan",
            text: `Hello there! Yes, I am fully available nearby. What's the main issue with your equipment?`,
            timestamp: "09:15 AM"
          }
        ]
      };
    });
    return initialSessions;
  });

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem("ghana_marketplace_chats", JSON.stringify(sessions));
  }, [sessions]);

  // Input States
  const [textInput, setTextInput] = useState("");
  
  // Voice note recording simulation
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);

  // Simulated image attachments
  const [attachedPhoto, setAttachedPhoto] = useState<string | null>(null);
  const [photoSelectedName, setPhotoSelectedName] = useState("");

  // Auto Scroll
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedArtisanId, sessions]);

  // Timer for simulated voice recording duration
  useEffect(() => {
    if (isRecording) {
      recordingTimer.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
      setRecordDuration(0);
    }
    return () => {
      if (recordingTimer.current) clearInterval(recordingTimer.current);
    };
  }, [isRecording]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedArtisanId || (!textInput.trim() && !attachedPhoto)) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newMsg: Message = {
      id: "msg_" + Date.now(),
      sender: "customer",
      text: textInput,
      timestamp,
      photoUrl: attachedPhoto || undefined
    };

    // Update active session
    const currentSession = sessions[selectedArtisanId] || {
      artisanId: selectedArtisanId,
      artisanName: activeArtisan?.name || "Artisan",
      messages: []
    };

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, newMsg]
    };

    setSessions({
      ...sessions,
      [selectedArtisanId]: updatedSession
    });

    setTextInput("");
    setAttachedPhoto(null);
    setPhotoSelectedName("");

    // Simulate responsive artisan reply after 2 seconds
    setTimeout(() => {
      const respTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const artisanAnswers = [
        "Medaase (Thank you)! Received clearly. Let me finish packing my tool bag and I will set off.",
        "Oh understood! I know that area near the bus terminal. I can be there in 20 minutes.",
        "Yes, the price is fair in GHS. I am happy to carry out the inspection.",
        "Can you send me your location pin or neighborhood milestone name so I locate your house easily?",
        "No problem at all! I have the spare parts with me already. Let me confirm the schedule."
      ];
      const randomAnswer = artisanAnswers[Math.floor(Math.random() * artisanAnswers.length)];

      const respMsg: Message = {
        id: "msg_reply_" + Date.now(),
        sender: "artisan",
        text: randomAnswer,
        timestamp: respTimestamp
      };

      setSessions((prev) => {
        const prevSession = prev[selectedArtisanId] || {
          artisanId: selectedArtisanId,
          artisanName: activeArtisan?.name || "Artisan",
          messages: []
        };
        return {
          ...prev,
          [selectedArtisanId]: {
            ...prevSession,
            messages: [...prevSession.messages, respMsg]
          }
        };
      });
    }, 2000);
  };

  // Simulated Voice note creation
  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopAndSendVoice = () => {
    setIsRecording(false);
    if (recordDuration === 0) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const minutes = Math.floor(recordDuration / 60);
    const seconds = recordDuration % 60;
    const durStr = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    const newVoiceMsg: Message = {
      id: "msg_voice_" + Date.now(),
      sender: "customer",
      text: "[Voice Note]",
      timestamp,
      isVoiceNote: true,
      voiceNoteDuration: durStr
    };

    const currentSession = sessions[selectedArtisanId] || {
      artisanId: selectedArtisanId,
      artisanName: activeArtisan?.name || "Artisan",
      messages: []
    };

    setSessions({
      ...sessions,
      [selectedArtisanId]: {
        ...currentSession,
        messages: [...currentSession.messages, newVoiceMsg]
      }
    });

    // Simulated artisan response to audio
    setTimeout(() => {
      const respTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const respMsg: Message = {
        id: "msg_reply_voice_" + Date.now(),
        sender: "artisan",
        text: "Understood clear and loud! I hear the sparking sounds from the record. I will bring heavy-duty insulated tools.",
        timestamp: respTimestamp
      };

      setSessions((prev) => {
        const prevSession = prev[selectedArtisanId] || {
          artisanId: selectedArtisanId,
          artisanName: activeArtisan?.name || "Artisan",
          messages: []
        };
        return {
          ...prev,
          [selectedArtisanId]: {
            ...prevSession,
            messages: [...prevSession.messages, respMsg]
          }
        };
      });
    }, 2500);
  };

  // Click simulation to attach sample photos of job
  const handleAttachPhotoPreset = (type: string) => {
    let pUrl = "";
    let pName = "";
    if (type === "leak") {
      pUrl = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300&h=200";
      pName = "kitchen_leaky_faucet.jpg";
    } else if (type === "socket") {
      pUrl = "https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&q=80&w=300&h=200";
      pName = "charred_ac_breaker_plug.jpg";
    } else {
      pUrl = "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&q=80&w=300&h=200";
      pName = "damaged_POP_gypsum_drywall.jpg";
    }

    setAttachedPhoto(pUrl);
    setPhotoSelectedName(pName);
  };

  // Mock voice note playback state
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const toggleVoicePlayback = (msgId: string) => {
    if (playingVoiceId === msgId) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(msgId);
      // Automatically stop after 4 seconds
      setTimeout(() => {
        setPlayingVoiceId((curr) => curr === msgId ? null : curr);
      }, 4000);
    }
  };

  const activeMessages = (sessions[selectedArtisanId]?.messages) || [];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden h-[540px] flex animate-fadeIn">
      
      {/* LEFT PANEL: Artisans Chats List (Hidden on narrow mobile screens) */}
      <div className="w-1/3 border-r border-slate-100 flex flex-col h-full bg-slate-50/50">
        <div className="p-4 border-b border-slate-100 bg-white">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-amber-500" />
            Direct Messages
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5 font-bold">MoMo Verified Chat Channels</p>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {artisans.map((art) => {
            const lastMsg = sessions[art.id]?.messages?.slice(-1)[0];
            const isSelected = selectedArtisanId === art.id;

            return (
              <button
                key={art.id}
                onClick={() => setSelectedArtisanId(art.id)}
                className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all ${
                  isSelected ? "bg-white border border-rose-100/50 shadow-xs" : "hover:bg-slate-100/50 border border-transparent"
                }`}
              >
                <div className="relative">
                  <img src={art.avatar} className="w-9 h-9 rounded-xl object-cover border" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-800 truncate block">{art.name}</span>
                    <span className="text-[9px] text-slate-400 shrink-0">{getCategoryLabel(art.category)}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {lastMsg ? lastMsg.text : "Tap to open chat"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT PANEL: Active Conversation feed */}
      <div className="flex-1 flex flex-col h-full bg-white">
        
        {/* Active Conversation Header */}
        {activeArtisan ? (
          <div className="p-4 border-b border-slate-150 flex items-center justify-between bg-slate-900 text-white">
            <div className="flex items-center gap-2.5 select-none">
              <img src={activeArtisan.avatar} className="w-10 h-10 rounded-xl object-cover border border-slate-600" />
              <div>
                <h4 className="text-xs font-bold font-display tracking-tight text-white flex items-center gap-1">
                  {activeArtisan.name}
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                </h4>
                <p className="text-[10px] text-slate-300">{getCategoryLabel(activeArtisan.category)} • {activeArtisan.tradeCertificate || "NVTI Certified"} • {activeArtisan.location}</p>
              </div>
            </div>

            {onClose && (
              <button onClick={onClose} className="text-xs text-slate-400 hover:text-white bg-slate-800 p-1 px-2 rounded-lg">
                Close Chat
              </button>
            )}
          </div>
        ) : (
          <div className="p-8 text-center my-auto text-slate-400">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-xs">Select any verified Ghana artisan to start chatting instantly.</p>
          </div>
        )}

        {/* Messages Stream */}
        {activeArtisan && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/70">
            <div className="text-center p-1.5 bg-slate-200/50 rounded-xl max-w-xs mx-auto border border-slate-100 select-none">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                🔒 Protected End-to-End Handshake
              </span>
            </div>

            {activeMessages.map((msg) => {
              const isMe = msg.sender === "customer";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 max-w-[85%] ${isMe ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                >
                  <div className={`p-3 rounded-2xl text-xs space-y-1.5 relative shadow-xs ${
                    isMe ? "bg-slate-900 text-white rounded-br-none" : "bg-white border border-slate-100 text-slate-800 rounded-bl-none"
                  }`}>
                    
                    {/* Attached Photo Display */}
                    {msg.photoUrl && (
                      <div className="rounded-xl overflow-hidden border border-slate-700/10 max-w-[200px]">
                        <img src={msg.photoUrl} className="w-full h-auto object-cover" />
                      </div>
                    )}

                    {/* Voice Note Display */}
                    {msg.isVoiceNote ? (
                      <div className="flex items-center gap-2 bg-slate-800 text-white p-2 rounded-xl border border-slate-700">
                        <button
                          type="button" 
                          onClick={() => toggleVoicePlayback(msg.id)}
                          className="w-7 h-7 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center hover:scale-105 transition-all grow-0 shrink-0"
                        >
                          {playingVoiceId === msg.id ? (
                            <Pause className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          )}
                        </button>
                        <div className="w-24 h-5 flex items-center justify-around gap-0.5">
                          {/* Animated wave lines */}
                          {[1, 2, 3, 4, 5, 4, 2, 5, 1, 3, 4].map((v, i) => (
                            <span 
                              key={i} 
                              className={`w-0.5 bg-slate-400 rounded-full transition-all ${
                                playingVoiceId === msg.id ? "animate-pulse" : ""
                              }`} 
                              style={{ height: `${v * (playingVoiceId === msg.id ? 4 : 2)}px` }}
                            />
                          ))}
                        </div>
                        <span className="text-[9px] font-mono text-slate-300">{msg.voiceNoteDuration}</span>
                      </div>
                    ) : (
                      <p className="leading-relaxed whitespace-pre-line break-words">{msg.text}</p>
                    )}

                    <div className="flex items-center justify-end gap-1 text-[9px] opacity-70">
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-amber-400" />}
                    </div>

                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Bar with photo & recording simulations */}
        {activeArtisan && (
          <div className="p-3 border-t border-slate-100 space-y-2.5">
            
            {/* Live attachments bar */}
            {photoSelectedName && (
              <div className="flex items-center justify-between bg-amber-50 border border-amber-100 p-2 rounded-xl">
                <span className="text-[10px] text-amber-800 font-mono truncate max-w-xs">
                  📎 Attached: {photoSelectedName}
                </span>
                <button 
                  onClick={() => { setAttachedPhoto(null); setPhotoSelectedName(""); }}
                  className="p-1 text-amber-500 hover:text-amber-800 text-[10px] font-bold"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Quick pre-set fault photo selections */}
            <div className="flex items-center justify-between gap-1.5 p-1 bg-slate-50 border border-slate-200/50 rounded-xl">
              <span className="text-[9px] text-slate-400 font-bold uppercase pl-1 shrink-0">Attach Repair Photo:</span>
              <div className="flex gap-1.5 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => handleAttachPhotoPreset("leak")}
                  className="text-[9px] bg-white border border-slate-200 text-slate-600 p-1 px-2 rounded-lg hover:border-slate-300"
                >
                  💦 Pipe Leak
                </button>
                <button
                  type="button"
                  onClick={() => handleAttachPhotoPreset("socket")}
                  className="text-[9px] bg-white border border-slate-200 text-slate-600 p-1 px-2 rounded-lg hover:border-slate-300"
                >
                  ⚡Spark Socket
                </button>
                <button
                  type="button"
                  onClick={() => handleAttachPhotoPreset("gypsum")}
                  className="text-[9px] bg-white border border-slate-200 text-slate-600 p-1 px-2 rounded-lg hover:border-slate-300"
                >
                  🏚️ POP Crack
                </button>
              </div>
            </div>

            {/* Simulated Voice note active cover */}
            {isRecording ? (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block animate-ping" />
                  <span className="text-xs font-bold text-red-800">
                    Recording voice note... {Math.floor(recordDuration / 60)}:{(recordDuration % 60) < 10 ? "0" : ""}{recordDuration % 60}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleStopAndSendVoice}
                  className="bg-red-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl hover:bg-red-700 transition-colors uppercase cursor-pointer"
                >
                  Release & Send Note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                
                {/* Voice Record Mic Trigger */}
                <button
                  type="button"
                  onClick={handleStartRecording}
                  title="Simulate Voice Note Record"
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl hover:text-red-500 transition-colors shrink-0 tooltip"
                >
                  <Mic className="w-4.5 h-4.5" />
                </button>

                {/* Text entry field */}
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Ask for site arrival, negotiate MoMo rates..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-800"
                />

                <button
                  type="submit"
                  disabled={!textInput.trim() && !attachedPhoto}
                  className="p-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 disabled:opacity-50 text-white rounded-xl transition-all"
                >
                  <Send className="w-4.5 h-4.5 text-amber-400" />
                </button>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
}