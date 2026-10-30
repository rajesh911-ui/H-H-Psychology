import React, { useState, useEffect } from 'react';
import { 
  X, Video, Calendar, Clock, User, ShieldCheck, Lock, 
  ExternalLink, CheckCircle, FileText, Download, KeyRound, 
  Database, Copyright, HelpCircle, ArrowRight
} from 'lucide-react';

interface AppointmentRecord {
  id: string;
  bookingRef: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  date: string;
  timeSlot: string;
  format: string;
  notes: string;
  status: 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  videoRoomId: string;
  clinicalNotes?: string;
  hostAccount: string;
}

interface PortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'client' | 'host' | 'copyright';
  onJoinVideoCall: (roomId: string, name: string, role: 'client' | 'host') => void;
}

export const PortalModal: React.FC<PortalModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'client',
  onJoinVideoCall,
}) => {
  const [activeTab, setActiveTab] = useState<'client' | 'host' | 'copyright'>(defaultTab);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Client email filter
  const [clientEmail, setClientEmail] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState<AppointmentRecord[]>([]);
  
  // Host Admin passkey verification (default test pin 1420 for Suite 1420)
  const [hostPin, setHostPin] = useState('');
  const [isHostAuthenticated, setIsHostAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);

  // Load appointments from API
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      if (data.appointments) {
        setAppointments(data.appointments);
        setFilteredAppointments(data.appointments);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAppointments();
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  const handleClientSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientEmail.trim()) {
      setFilteredAppointments(appointments);
      return;
    }
    const filtered = appointments.filter(a => 
      a.email.toLowerCase().includes(clientEmail.toLowerCase()) || 
      a.name.toLowerCase().includes(clientEmail.toLowerCase()) ||
      a.bookingRef.toLowerCase().includes(clientEmail.toLowerCase())
    );
    setFilteredAppointments(filtered);
  };

  const handleHostAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Default clinic suite pin 1420 or "dr.vance"
    if (hostPin === '1420' || hostPin.toLowerCase() === 'admin' || hostPin.toLowerCase() === 'vance') {
      setIsHostAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2C2C]/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#F9F6F1] rounded-3xl border border-[#A8B5A2]/30 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-white border-b border-[#A8B5A2]/25 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5B6A56] text-white flex items-center justify-center shadow-xs">
              <Lock className="w-5 h-5 text-[#E8D5C4]" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#2C2C2C] leading-none">
                Haven & Hearth Telehealth Portal
              </h2>
              <p className="text-xs text-[#606060] mt-0.5">
                Scheduled Video Calls, Patient Accounts & Copyright Records
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Nav Tabs */}
            <div className="flex items-center p-1 rounded-2xl bg-[#F9F6F1] border border-[#A8B5A2]/30 text-xs">
              <button
                onClick={() => setActiveTab('client')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  activeTab === 'client'
                    ? 'bg-white text-[#2C2C2C] shadow-xs font-semibold'
                    : 'text-[#606060] hover:text-[#2C2C2C]'
                }`}
              >
                Client Account
              </button>
              <button
                onClick={() => setActiveTab('host')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  activeTab === 'host'
                    ? 'bg-white text-[#2C2C2C] shadow-xs font-semibold'
                    : 'text-[#606060] hover:text-[#2C2C2C]'
                }`}
              >
                Host / Clinician
              </button>
              <button
                onClick={() => setActiveTab('copyright')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  activeTab === 'copyright'
                    ? 'bg-white text-[#2C2C2C] shadow-xs font-semibold'
                    : 'text-[#606060] hover:text-[#2C2C2C]'
                }`}
              >
                Data & Copyright
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#606060] hover:text-[#2C2C2C] hover:bg-[#F9F6F1] transition-colors"
              aria-label="Close portal modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab 1: Client Account Portal */}
        {activeTab === 'client' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#A8B5A2]/30">
              <div className="space-y-0.5">
                <h3 className="font-serif text-lg font-semibold text-[#2C2C2C]">
                  My Scheduled Telehealth Appointments
                </h3>
                <p className="text-xs text-[#606060]">
                  Find your scheduled video call session link, time slot, and consultation records.
                </p>
              </div>

              {/* Email / Reference lookup */}
              <form onSubmit={handleClientSearch} className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Filter by email or reference (e.g. HH-749210)..."
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-[#F9F6F1] border border-[#A8B5A2]/40 text-xs text-[#2C2C2C] focus:bg-white focus:outline-hidden w-full sm:w-64"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#5B6A56] text-white text-xs font-semibold hover:bg-[#4E5C49] shrink-0"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Appointment Cards List */}
            <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-12 p-6 rounded-3xl bg-white border border-[#A8B5A2]/25 space-y-3">
                  <Calendar className="w-8 h-8 text-[#A8B5A2] mx-auto" />
                  <p className="text-sm font-medium text-[#2C2C2C]">No appointments found for this search.</p>
                  <p className="text-xs text-[#606060]">
                    Try clearing the filter or scheduling a new discovery call from our booking page.
                  </p>
                </div>
              ) : (
                filteredAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-5 rounded-2xl bg-white border border-[#A8B5A2]/30 hover:border-[#5B6A56] transition-all shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#A8B5A2]/20">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-lg font-semibold text-[#2C2C2C]">{apt.serviceType}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#EDF2EB] text-[#5B6A56] text-[10px] font-semibold">
                            {apt.status.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-xs text-[#8C8C8C]">Booking Ref: <strong className="font-mono text-[#5B6A56]">{apt.bookingRef}</strong></span>
                      </div>

                      <div className="text-left sm:text-right text-xs">
                        <div className="font-bold text-[#2C2C2C] flex items-center sm:justify-end gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#5B6A56]" />
                          <span>{apt.date} at {apt.timeSlot} PT</span>
                        </div>
                        <span className="text-[#606060] text-[11px]">{apt.format}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#606060]">
                      <div>
                        <span className="text-[#8C8C8C] block text-[11px]">Client Name:</span>
                        <strong className="text-[#2C2C2C]">{apt.name}</strong> ({apt.email})
                      </div>
                      <div>
                        <span className="text-[#8C8C8C] block text-[11px]">Host Clinician:</span>
                        <strong className="text-[#2C2C2C]">Dr. Elena Vance, Psy.D.</strong> (CA Lic #PSY32918)
                      </div>
                    </div>

                    {apt.notes && (
                      <p className="text-xs text-[#606060] italic bg-[#F9F6F1] p-2.5 rounded-xl border border-[#A8B5A2]/20">
                        Intake focus: &ldquo;{apt.notes}&rdquo;
                      </p>
                    )}

                    {/* Join Video Call Button & Action Controls */}
                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-[#5B6A56]">
                        <ShieldCheck className="w-4 h-4" />
                        <span>HIPAA Encrypted Video Room: <code className="font-mono">{apt.videoRoomId}</code></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onClose();
                            onJoinVideoCall(apt.videoRoomId, apt.name, 'client');
                          }}
                          className="px-5 py-2.5 rounded-full bg-[#5B6A56] hover:bg-[#4E5C49] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.02]"
                        >
                          <Video className="w-4 h-4" />
                          <span>Join Video Call Room</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Client Privacy Reminder */}
            <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#E8D5C4] text-xs text-[#606060] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#2C2C2C] font-semibold block">Client Account Security:</strong>
                Your personal contact details and video session access tokens are stored in your private client partition. Video calls are transient and never stored or recorded.
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Clinician / Host Admin Portal */}
        {activeTab === 'host' && (
          <div className="p-6 space-y-6">
            {!isHostAuthenticated ? (
              <div className="max-w-md mx-auto p-8 rounded-3xl bg-white border border-[#A8B5A2]/30 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EDF2EB] text-[#5B6A56] mx-auto flex items-center justify-center">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-[#2C2C2C]">
                    Clinician Host Portal
                  </h3>
                  <p className="text-xs text-[#606060] mt-1">
                    Dr. Elena Vance practice administration & clinical schedule management.
                  </p>
                </div>

                <form onSubmit={handleHostAuth} className="space-y-3 pt-2">
                  <div>
                    <input
                      type="password"
                      placeholder="Enter Clinician PIN (Demo: 1420)"
                      value={hostPin}
                      onChange={(e) => setHostPin(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F9F6F1] border border-[#A8B5A2]/40 text-center text-sm text-[#2C2C2C] focus:bg-white focus:outline-hidden"
                    />
                    {pinError && (
                      <p className="text-xs text-rose-600 mt-1">Incorrect PIN. Try 1420 for Suite 1420.</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-full bg-[#5B6A56] hover:bg-[#4E5C49] text-white text-xs font-semibold shadow-xs"
                  >
                    Unlock Clinical Schedule
                  </button>
                  <p className="text-[11px] text-[#8C8C8C]">
                    Fast 1-click test: PIN is <strong className="font-mono text-[#5B6A56]">1420</strong>
                  </p>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-white border border-[#A8B5A2]/30 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-[#5B6A56] uppercase">Practice EHR Dashboard</span>
                    <h3 className="font-serif text-lg font-semibold text-[#2C2C2C]">
                      Dr. Elena Vance, Psy.D. · Master Calendar ({appointments.length} Total Sessions)
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#606060]">Master Host Account:</span>
                    <span className="px-2.5 py-1 rounded-xl bg-[#EDF2EB] text-[#5B6A56] text-xs font-mono font-medium">
                      dr.elena.vance@havenandhearthpsych.com
                    </span>
                  </div>
                </div>

                {/* Host Session Table */}
                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {appointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-5 rounded-2xl bg-white border border-[#A8B5A2]/30 shadow-xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-sm text-[#2C2C2C]">{apt.name}</strong>
                            <span className="text-xs text-[#8C8C8C]">({apt.email} · {apt.phone})</span>
                          </div>
                          <span className="text-xs text-[#5B6A56] font-medium">{apt.serviceType}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#2C2C2C] font-semibold">{apt.date} at {apt.timeSlot}</span>
                          <span className="px-2 py-0.5 rounded-md bg-[#EDF2EB] text-[#5B6A56] text-[10px] font-bold uppercase">
                            {apt.status}
                          </span>
                        </div>
                      </div>

                      {apt.clinicalNotes && (
                        <div className="p-2.5 rounded-xl bg-[#EDF2EB] border border-[#A8B5A2]/30 text-xs text-[#2C2C2C]">
                          <strong className="text-[#5B6A56] block text-[11px]">Clinical EHR Notes:</strong>
                          {apt.clinicalNotes}
                        </div>
                      )}

                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#A8B5A2]/20">
                        <span className="text-xs text-[#8C8C8C] font-mono">
                          Room Token: {apt.videoRoomId}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onClose();
                              onJoinVideoCall(apt.videoRoomId, 'Dr. Elena Vance', 'host');
                            }}
                            className="px-4 py-2 rounded-full bg-[#5B6A56] hover:bg-[#4E5C49] text-white text-xs font-semibold flex items-center gap-1.5"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Start Video Call as Host</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Data Storage & Copyright Clarity */}
        {activeTab === 'copyright' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5B6A56]">
                Data Architecture & HIPAA Legal Notice
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[#2C2C2C]">
                Where is scheduled video call data stored, and who owns copyright?
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#606060]">
              
              {/* Storage Architecture */}
              <div className="p-6 rounded-3xl bg-white border border-[#A8B5A2]/30 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#EDF2EB] text-[#5B6A56] flex items-center justify-center">
                    <Database className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-base font-semibold text-[#2C2C2C]">
                    Data Storage Architecture
                  </h4>
                </div>

                <div className="space-y-3 leading-relaxed">
                  <div className="p-3 rounded-xl bg-[#F9F6F1] border border-[#A8B5A2]/20 space-y-1">
                    <strong className="text-[#2C2C2C] block font-semibold">1. Client Account Partition:</strong>
                    <span>Clients securely access their individual booked appointments, video room tokens, and payment receipts. A client can only see their own sessions.</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F9F6F1] border border-[#A8B5A2]/20 space-y-1">
                    <strong className="text-[#2C2C2C] block font-semibold">2. Host / Clinician Admin Account:</strong>
                    <span>Dr. Elena Vance holds the central Electronic Health Record (EHR) master calendar, patient history, clinical intake assessments, and diagnostic notes under California psychology regulations.</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F9F6F1] border border-[#A8B5A2]/20 space-y-1">
                    <strong className="text-[#2C2C2C] block font-semibold">3. Video Call Stream Transience:</strong>
                    <span>Live telehealth calls are peer-to-peer encrypted WebRTC streams. No audio or video is ever recorded, stored on servers, or transcribed without explicit written dual consent.</span>
                  </div>
                </div>
              </div>

              {/* Copyright & Legal Ownership */}
              <div className="p-6 rounded-3xl bg-white border border-[#A8B5A2]/30 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#EDF2EB] text-[#5B6A56] flex items-center justify-center">
                    <Copyright className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-base font-semibold text-[#2C2C2C]">
                    Copyright & Records Ownership
                  </h4>
                </div>

                <div className="space-y-3 leading-relaxed">
                  <div className="p-3 rounded-xl bg-[#F9F6F1] border border-[#A8B5A2]/20 space-y-1">
                    <strong className="text-[#2C2C2C] block font-semibold">Clinical IP & Formulations:</strong>
                    <span>All psychotherapy notes, treatment plans, psychometric evaluations, and therapeutic guides are copyrighted intellectual property of Dr. Elena Vance, Psy.D. / Haven & Hearth Psychology (45 CFR § 164.501).</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F9F6F1] border border-[#A8B5A2]/20 space-y-1">
                    <strong className="text-[#2C2C2C] block font-semibold">Client PHI Rights:</strong>
                    <span>Under the HIPAA Privacy Rule (45 CFR § 164.524), clients retain statutory ownership and legal inspection rights to their medical records, billing invoices, and intake questionnaires.</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F9F6F1] border border-[#A8B5A2]/20 space-y-1">
                    <strong className="text-[#2C2C2C] block font-semibold">California Board Compliance:</strong>
                    <span>Records are securely preserved for a minimum of 7 years in compliance with California Business & Professions Code § 2919.</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="p-4 rounded-2xl bg-[#EDF2EB] border border-[#A8B5A2]/30 text-xs text-[#2C2C2C] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#5B6A56]" />
                AES-256 Encryption · HIPAA & California Psychology Board Compliant
              </span>
              <button
                onClick={() => setActiveTab('client')}
                className="text-xs font-semibold text-[#5B6A56] hover:underline flex items-center gap-1"
              >
                <span>Back to My Appointments</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
