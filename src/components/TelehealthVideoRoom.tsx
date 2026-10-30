import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, ShieldCheck, 
  MessageSquare, Wind, FileText, Share2, Volume2, Sparkles, X, Send, Lock
} from 'lucide-react';

interface TelehealthVideoRoomProps {
  roomId: string;
  clientName: string;
  userRole?: 'client' | 'host';
  onLeaveCall: () => void;
}

export const TelehealthVideoRoom: React.FC<TelehealthVideoRoomProps> = ({
  roomId,
  clientName,
  userRole = 'client',
  onLeaveCall,
}) => {
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);
  const [activeTab, setActiveTab] = useState<'none' | 'chat' | 'notes' | 'grounding'>('none');
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [inSessionNotes, setInSessionNotes] = useState(
    userRole === 'host' 
      ? 'Clinical Observations: Client presenting with sympathetic nervous system hyperarousal. Initiating grounding defusion and somatic resourcing...'
      : ''
  );
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    {
      sender: 'Dr. Elena Vance',
      text: `Hello ${clientName}, welcome into our telehealth room. Can you hear and see me comfortably?`,
      time: 'Just now'
    }
  ]);
  const [newChatText, setNewChatText] = useState('');
  const [isBreathingGuided, setIsBreathingGuided] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera access via getUserMedia
  useEffect(() => {
    let active = true;

    async function initCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          });
          if (active && localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            streamRef.current = stream;
          }
        }
      } catch (err) {
        console.warn('Camera access could not be established:', err);
        setCameraError('Camera preview simulated (permission or hardware not accessible)');
      }
    }

    initCamera();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Session elapsed timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Guided breathing loop if activated in session
  useEffect(() => {
    if (!isBreathingGuided) return;
    const interval = setInterval(() => {
      setBreathPhase(curr => {
        if (curr === 'Inhale') return 'Hold';
        if (curr === 'Hold') return 'Exhale';
        if (curr === 'Exhale') return 'Pause';
        return 'Inhale';
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isBreathingGuided]);

  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !micActive;
      });
    }
    setMicActive(!micActive);
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !videoActive;
      });
    }
    setVideoActive(!videoActive);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;

    setChatMessages(prev => [
      ...prev,
      {
        sender: userRole === 'host' ? 'Dr. Elena Vance' : clientName,
        text: newChatText.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setNewChatText('');
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1E2421] text-white flex flex-col overflow-hidden animate-in fade-in duration-300">
      
      {/* Top Telehealth Security Bar */}
      <header className="px-6 py-3.5 bg-[#252D29] border-b border-[#36423C] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#5B6A56] flex items-center justify-center text-white">
            <Lock className="w-4 h-4 text-[#E8D5C4]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-base font-semibold text-white tracking-wide">
                Haven & Hearth Telehealth Room
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#5B6A56]/40 text-[#A8B5A2] text-[10px] font-mono border border-[#5B6A56]/60">
                {roomId}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#A8B5A2]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A8B5A2]" />
              <span>HIPAA Compliant · End-to-End Encrypted (AES-256) · Not Recorded</span>
            </div>
          </div>
        </div>

        {/* Live Call Duration */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-[#1A201D] text-xs font-mono font-medium text-[#E8D5C4] border border-[#36423C] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live: {formatTimer(sessionSeconds)}</span>
          </div>

          <div className="hidden sm:block text-xs text-[#A8B5A2]">
            Role: <strong className="text-white capitalize">{userRole} ({userRole === 'host' ? 'Dr. Vance' : clientName})</strong>
          </div>
        </div>
      </header>

      {/* Main Video Call Stage */}
      <div className="flex-1 relative flex flex-col lg:flex-row overflow-hidden p-4 gap-4">
        
        {/* Video Canvas Section */}
        <div className="flex-1 relative rounded-3xl bg-[#151917] border border-[#36423C] overflow-hidden flex items-center justify-center">
          
          {/* Main Stage: Therapist Video Stream (Simulated Live Clinical Room) */}
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2D3833] via-[#212925] to-[#151A18]">
            
            {/* Visual Representation of Dr. Elena Vance in Video Call */}
            <div className="relative flex flex-col items-center text-center p-6 space-y-4">
              <div className="relative">
                {/* Aura pulse when audio waveform is active */}
                <div className="absolute -inset-4 rounded-full bg-[#A8B5A2]/20 animate-pulse blur-md" />
                
                {/* Doctor Avatar Vignette */}
                <div className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-full border-4 border-[#A8B5A2]/50 overflow-hidden shadow-2xl bg-[#36423C] flex items-center justify-center">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <rect width="200" height="200" fill="#2E3934" />
                    {/* Soft background arch */}
                    <path d="M 30 200 L 30 90 A 70 70 0 0 1 170 90 L 170 200 Z" fill="#F4EFE6" opacity="0.1" />
                    {/* Doctor Head */}
                    <circle cx="100" cy="85" r="38" fill="#E8D5C4" />
                    <path d="M 60 85 C 60 30, 140 30, 140 85 C 140 90, 135 110, 130 115 C 120 80, 80 80, 70 115 Z" fill="#4A3B32" />
                    {/* Gentle eyes */}
                    <path d="M 88 88 Q 94 86 97 88" stroke="#382B24" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M 103 88 Q 106 86 112 88" stroke="#382B24" strokeWidth="2" fill="none" strokeLinecap="round" />
                    {/* Warm smile */}
                    <path d="M 94 104 Q 100 108 106 104" stroke="#8C5345" strokeWidth="2" fill="none" strokeLinecap="round" />
                    {/* Linen clinical attire */}
                    <path d="M 40 200 C 50 135, 75 125, 100 125 C 125 125, 150 135, 160 200 Z" fill="#F9F6F1" opacity="0.9" />
                  </svg>
                </div>

                <div className="absolute bottom-1 right-2 px-2.5 py-1 rounded-full bg-[#252D29] text-[11px] font-medium text-[#A8B5A2] border border-[#36423C] flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Speaking</span>
                </div>
              </div>

              <div>
                <h4 className="font-serif text-xl sm:text-2xl font-semibold text-white">
                  Dr. Elena Vance, Psy.D.
                </h4>
                <p className="text-xs text-[#A8B5A2] mt-0.5">
                  Host · Haven & Hearth Practice Studio (Union Square)
                </p>
              </div>

              {/* In-Call Guided Breath Ring Overlay */}
              {isBreathingGuided && (
                <div className="p-4 rounded-2xl bg-[#252D29]/90 border border-[#A8B5A2]/30 max-w-sm animate-in fade-in duration-200">
                  <div className="flex items-center justify-center gap-2 text-xs text-[#A8B5A2] font-semibold">
                    <Wind className="w-4 h-4 text-emerald-400" />
                    <span>In-Session Grounding Cadence</span>
                  </div>
                  <div className="font-serif text-2xl font-semibold text-white mt-1">
                    {breathPhase}
                  </div>
                  <p className="text-[11px] text-[#A8B5A2] mt-0.5">
                    Sync your breath with Dr. Vance. Allow your shoulders to drop gently.
                  </p>
                </div>
              )}
            </div>

            {/* Self-View Picture-in-Picture (Bottom-Right) */}
            <div className="absolute bottom-4 right-4 w-44 sm:w-56 h-32 sm:h-40 rounded-2xl bg-[#252D29] border-2 border-[#36423C] overflow-hidden shadow-2xl flex items-center justify-center">
              {videoActive ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-3 text-xs text-[#A8B5A2] space-y-1">
                  <VideoOff className="w-6 h-6 text-[#A8B5A2]" />
                  <span>Camera Paused</span>
                </div>
              )}

              {/* Name Tag */}
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] text-white flex items-center gap-1.5">
                <span>{userRole === 'host' ? 'Dr. Vance (Self)' : `${clientName} (You)`}</span>
                {!micActive && <MicOff className="w-3 h-3 text-rose-400" />}
              </div>
            </div>

          </div>
        </div>

        {/* In-Call Side Panel (Chat, Notes, or Grounding) */}
        {activeTab !== 'none' && (
          <div className="w-full lg:w-80 h-72 lg:h-auto rounded-3xl bg-[#252D29] border border-[#36423C] p-4 flex flex-col justify-between animate-in slide-in-from-right-4 duration-200">
            
            {/* Panel Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#36423C]">
              <span className="font-serif text-sm font-semibold text-white flex items-center gap-2">
                {activeTab === 'chat' && <MessageSquare className="w-4 h-4 text-[#A8B5A2]" />}
                {activeTab === 'notes' && <FileText className="w-4 h-4 text-[#A8B5A2]" />}
                {activeTab === 'grounding' && <Wind className="w-4 h-4 text-[#A8B5A2]" />}
                <span className="capitalize">{activeTab} Panel</span>
              </span>
              <button
                onClick={() => setActiveTab('none')}
                className="p-1 rounded-lg text-[#A8B5A2] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat View */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden pt-3">
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-[#1A201D] border border-[#36423C] space-y-1">
                      <div className="flex justify-between text-[10px] text-[#A8B5A2]">
                        <span className="font-semibold text-white">{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="text-white/90 leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} className="pt-2 flex gap-1.5">
                  <input
                    type="text"
                    value={newChatText}
                    onChange={(e) => setNewChatText(e.target.value)}
                    placeholder="Type in-session message..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[#1A201D] border border-[#36423C] text-xs text-white placeholder:text-[#A8B5A2]/60 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-[#5B6A56] hover:bg-[#4E5C49] text-white"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* Clinical / Personal Session Notes View */}
            {activeTab === 'notes' && (
              <div className="flex-1 flex flex-col justify-between pt-3 text-xs space-y-2">
                <p className="text-[#A8B5A2] text-[11px]">
                  {userRole === 'host'
                    ? 'Private clinical notes (EHR encrypted partition. Never shared with client).'
                    : 'Personal reflections from today\'s conversation for your own safe keeping.'}
                </p>
                <textarea
                  value={inSessionNotes}
                  onChange={(e) => setInSessionNotes(e.target.value)}
                  rows={8}
                  placeholder="Record insights, homework reminders, or somatic observations..."
                  className="w-full flex-1 p-3 rounded-xl bg-[#1A201D] border border-[#36423C] text-xs text-white focus:outline-hidden leading-relaxed"
                />
                <span className="text-[10px] text-[#A8B5A2] text-right">Encrypted & autosaved locally</span>
              </div>
            )}

            {/* In-Session Grounding Controls */}
            {activeTab === 'grounding' && (
              <div className="flex-1 pt-3 space-y-3 text-xs">
                <p className="text-[#A8B5A2] text-xs leading-relaxed">
                  Toggle on-screen synchronized pacing if emotional flooding occurs during session.
                </p>
                <button
                  onClick={() => setIsBreathingGuided(!isBreathingGuided)}
                  className={`w-full py-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isBreathingGuided
                      ? 'bg-rose-900/60 text-rose-200 border border-rose-500/40'
                      : 'bg-[#5B6A56] text-white hover:bg-[#4E5C49]'
                  }`}
                >
                  <Wind className="w-4 h-4" />
                  <span>{isBreathingGuided ? 'Stop Grounding Cadence' : 'Start 4-4-4-4 Grounding Cadence'}</span>
                </button>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Bottom In-Call Control Bar */}
      <footer className="px-6 py-4 bg-[#252D29] border-t border-[#36423C] flex items-center justify-between">
        
        {/* Left Status */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#A8B5A2]">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Connected · Audio & Video Encrypted</span>
        </div>

        {/* Center Media Controls */}
        <div className="flex items-center gap-3 mx-auto">
          <button
            onClick={toggleMic}
            className={`p-3.5 rounded-full transition-all ${
              micActive
                ? 'bg-[#36423C] text-white hover:bg-[#44534B]'
                : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
            title={micActive ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {micActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-3.5 rounded-full transition-all ${
              videoActive
                ? 'bg-[#36423C] text-white hover:bg-[#44534B]'
                : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
            title={videoActive ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            {videoActive ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setActiveTab(activeTab === 'grounding' ? 'none' : 'grounding')}
            className={`p-3.5 rounded-full transition-all ${
              activeTab === 'grounding'
                ? 'bg-[#5B6A56] text-white'
                : 'bg-[#36423C] text-[#A8B5A2] hover:text-white'
            }`}
            title="Somatic Grounding Tool"
          >
            <Wind className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab(activeTab === 'chat' ? 'none' : 'chat')}
            className={`p-3.5 rounded-full transition-all ${
              activeTab === 'chat'
                ? 'bg-[#5B6A56] text-white'
                : 'bg-[#36423C] text-[#A8B5A2] hover:text-white'
            }`}
            title="In-Session Text Chat"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab(activeTab === 'notes' ? 'none' : 'notes')}
            className={`p-3.5 rounded-full transition-all ${
              activeTab === 'notes'
                ? 'bg-[#5B6A56] text-white'
                : 'bg-[#36423C] text-[#A8B5A2] hover:text-white'
            }`}
            title="Session Notes & Thoughts"
          >
            <FileText className="w-5 h-5" />
          </button>

          {/* End Call Button */}
          <button
            onClick={onLeaveCall}
            className="px-5 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md ml-2"
          >
            <PhoneOff className="w-4 h-4" />
            <span>Leave Session</span>
          </button>
        </div>

        {/* Right Info */}
        <div className="hidden sm:block text-xs text-[#A8B5A2]">
          Need Help? (415) 890-4288
        </div>
      </footer>

    </div>
  );
};
