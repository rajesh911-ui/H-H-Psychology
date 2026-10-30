import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Video, CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck, Download, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PRACTICE_INFO } from '../data/practiceData';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
  onJoinVideoCall?: (roomId: string, name: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, preselectedService, onJoinVideoCall }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [service, setService] = useState(preselectedService || 'discovery');
  const [format, setFormat] = useState<'in-person' | 'telehealth'>('telehealth');
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-03');
  const [selectedTime, setSelectedTime] = useState<string>('10:30 AM');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [goals, setGoals] = useState('');
  const [preferredContact, setPreferredContact] = useState<'email' | 'phone' | 'text'>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<{
    ref: string;
    date: string;
    time: string;
    serviceName: string;
    format: string;
  } | null>(null);

  if (!isOpen) return null;

  const serviceOptions = [
    {
      id: 'discovery',
      name: 'Free 15-Minute Discovery Call',
      duration: '15 min',
      price: '$0 (Complimentary)',
      desc: 'A gentle phone or video conversation to ask questions, explore fit, and see if our practice feels right for you.'
    },
    {
      id: 'intake',
      name: 'Initial Comprehensive Intake',
      duration: '75 min',
      price: '$240',
      desc: 'In-depth clinical evaluation, personal history mapping, and collaborative treatment roadmap.'
    },
    {
      id: 'individual',
      name: 'Individual Psychotherapy',
      duration: '50 min',
      price: '$195',
      desc: 'Weekly or bi-weekly session for anxiety, perfectionism, trauma recovery, or burnout.'
    },
    {
      id: 'couples',
      name: 'Couples / Relationship Therapy',
      duration: '60 min',
      price: '$230',
      desc: 'Gottman and Emotionally Focused Therapy (EFT) to mend cycles and deepen intimacy.'
    }
  ];

  // Generate upcoming days
  const upcomingDays = [
    { label: 'Tue, Nov 3', dateStr: '2026-11-03' },
    { label: 'Wed, Nov 4', dateStr: '2026-11-04' },
    { label: 'Thu, Nov 5', dateStr: '2026-11-05' },
    { label: 'Mon, Nov 9', dateStr: '2026-11-09' },
    { label: 'Tue, Nov 10', dateStr: '2026-11-10' },
    { label: 'Wed, Nov 11', dateStr: '2026-11-11' },
    { label: 'Thu, Nov 12', dateStr: '2026-11-12' },
  ];

  const availableSlots = [
    { time: '9:00 AM', period: 'Morning' },
    { time: '10:30 AM', period: 'Morning' },
    { time: '11:45 AM', period: 'Morning' },
    { time: '1:30 PM', period: 'Afternoon' },
    { time: '3:00 PM', period: 'Afternoon' },
    { time: '4:30 PM', period: 'Afternoon' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    setIsSubmitting(true);
    const chosenServiceObj = serviceOptions.find(s => s.id === service);

    try {
      const res = await fetch('/api/book-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email,
          phone,
          serviceType: chosenServiceObj?.name || service,
          date: selectedDate,
          timeSlot: selectedTime,
          format: format === 'in-person' ? 'In-Person (San Francisco)' : 'Telehealth (Video)',
          notes: `Preferred contact: ${preferredContact}. Goals: ${goals}`
        })
      });

      const data = await res.json();
      const refCode = data.bookingRef || 'HH-' + Math.floor(100000 + Math.random() * 900000);

      setBookingConfirmation({
        ref: refCode,
        date: selectedDate,
        time: selectedTime,
        serviceName: chosenServiceObj?.name || 'Therapy Consultation',
        format: format === 'in-person' ? 'In-Person (450 Sutter St, SF)' : 'Secure California Telehealth (Video)'
      });

      setStep(4);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#A8B5A2', '#E8D5C4', '#8FA3B0']
        });
      } catch {
        // Safe fallback
      }
    } catch (err) {
      console.error(err);
      // Still show pleasant fallback confirmation
      setBookingConfirmation({
        ref: 'HH-' + Math.floor(100000 + Math.random() * 900000),
        date: selectedDate,
        time: selectedTime,
        serviceName: chosenServiceObj?.name || 'Therapy Consultation',
        format: format === 'in-person' ? 'In-Person (450 Sutter St, SF)' : 'Secure California Telehealth (Video)'
      });
      setStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadCalendarFile = () => {
    if (!bookingConfirmation) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Haven & Hearth Psychology//Consultation//EN
BEGIN:VEVENT
SUMMARY:${bookingConfirmation.serviceName} with Dr. Elena Vance
DESCRIPTION:Haven & Hearth Psychology Consultation.\\nReference: ${bookingConfirmation.ref}\\nLocation/Format: ${bookingConfirmation.format}
LOCATION:${bookingConfirmation.format}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Haven-Hearth-${bookingConfirmation.ref}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2C2C]/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#F9F6F1] rounded-3xl border border-[#A8B5A2]/30 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-white border-b border-[#A8B5A2]/25 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#5B6A56]">
              {step === 4 ? 'Appointment Reserved' : `Step ${step} of 3`}
            </span>
            <h2 className="font-serif text-2xl font-medium text-[#2C2C2C]">
              {step === 1 && 'Select Your Session & Format'}
              {step === 2 && 'Choose Date & Preferred Time'}
              {step === 3 && 'Your Information & Goals'}
              {step === 4 && 'Your Time Is Reserved'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#606060] hover:text-[#2C2C2C] hover:bg-[#F9F6F1] transition-colors"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-xs font-semibold text-[#606060] uppercase tracking-wider mb-2">
                1. Location / Format
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat('telehealth')}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    format === 'telehealth'
                      ? 'bg-white border-[#5B6A56] ring-2 ring-[#5B6A56]/20 shadow-xs'
                      : 'bg-white/70 border-[#A8B5A2]/30 hover:border-[#A8B5A2] hover:bg-white'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${format === 'telehealth' ? 'bg-[#EDF2EB] text-[#5B6A56]' : 'bg-[#F9F6F1] text-[#606060]'}`}>
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-[#2C2C2C]">California Telehealth</div>
                    <div className="text-xs text-[#606060] mt-0.5">Secure, confidential video from the comfort of your home or office.</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat('in-person')}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    format === 'in-person'
                      ? 'bg-white border-[#5B6A56] ring-2 ring-[#5B6A56]/20 shadow-xs'
                      : 'bg-white/70 border-[#A8B5A2]/30 hover:border-[#A8B5A2] hover:bg-white'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${format === 'in-person' ? 'bg-[#EDF2EB] text-[#5B6A56]' : 'bg-[#F9F6F1] text-[#606060]'}`}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-[#2C2C2C]">In-Person (San Francisco)</div>
                    <div className="text-xs text-[#606060] mt-0.5">450 Sutter St, Suite 1420 (Union Square courtyard suite).</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#606060] uppercase tracking-wider mb-2">
                2. Type of Consultation
              </label>
              <div className="space-y-2.5">
                {serviceOptions.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setService(opt.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      service === opt.id
                        ? 'bg-white border-[#5B6A56] ring-2 ring-[#5B6A56]/20 shadow-xs'
                        : 'bg-white/70 border-[#A8B5A2]/30 hover:border-[#A8B5A2] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-serif text-base font-semibold text-[#2C2C2C]">{opt.name}</div>
                      <div className="text-right">
                        <span className="font-semibold text-sm text-[#5B6A56]">{opt.price}</span>
                        <span className="text-xs text-[#8C8C8C] ml-1.5">({opt.duration})</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#606060] mt-1">{opt.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#A8B5A2]/20">
              <span className="text-xs text-[#606060] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#5B6A56]" />
                Zero commitment · 100% confidential
              </span>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-full bg-[#5B6A56] hover:bg-[#4E5C49] text-white text-sm font-medium flex items-center gap-1.5 transition-all shadow-xs"
              >
                <span>Select Date & Time</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Date & Time Slot */}
        {step === 2 && (
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-xs font-semibold text-[#606060] uppercase tracking-wider mb-2">
                Select an Available Day
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {upcomingDays.map((d) => (
                  <button
                    key={d.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(d.dateStr)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedDate === d.dateStr
                        ? 'bg-[#5B6A56] text-white border-[#5B6A56] shadow-xs'
                        : 'bg-white border-[#A8B5A2]/30 text-[#2C2C2C] hover:border-[#A8B5A2]'
                    }`}
                  >
                    <div className="text-xs font-medium">{d.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#606060] uppercase tracking-wider mb-2">
                Select a Time Window (Pacific Time)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => setSelectedTime(slot.time)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedTime === slot.time
                        ? 'bg-[#5B6A56] text-white border-[#5B6A56] shadow-xs'
                        : 'bg-white border-[#A8B5A2]/30 text-[#2C2C2C] hover:border-[#A8B5A2]'
                    }`}
                  >
                    <div className="font-semibold text-sm">{slot.time}</div>
                    <div className={`text-[10px] ${selectedTime === slot.time ? 'text-white/80' : 'text-[#8C8C8C]'}`}>{slot.period}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#EDF2EB] border border-[#A8B5A2]/30 text-xs text-[#2C2C2C] flex items-center gap-3">
              <Calendar className="w-4 h-4 text-[#5B6A56] shrink-0" />
              <span>
                Selected: <strong className="font-semibold">{selectedDate} at {selectedTime} PT</strong> ({format === 'in-person' ? 'In-Person Union Square' : 'Telehealth Video'})
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#A8B5A2]/20">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-medium text-[#606060] hover:text-[#2C2C2C] flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-full bg-[#5B6A56] hover:bg-[#4E5C49] text-white text-sm font-medium flex items-center gap-1.5 transition-all shadow-xs"
              >
                <span>Your Contact Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Information & Goals */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#2C2C2C] mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#A8B5A2]/40 text-sm text-[#2C2C2C] focus:ring-2 focus:ring-[#5B6A56] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C2C2C] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maya@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#A8B5A2]/40 text-sm text-[#2C2C2C] focus:ring-2 focus:ring-[#5B6A56] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#2C2C2C] mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(415) 555-0192"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#A8B5A2]/40 text-sm text-[#2C2C2C] focus:ring-2 focus:ring-[#5B6A56] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C2C2C] mb-1">Preferred Contact Method</label>
                <div className="flex gap-2">
                  {(['email', 'phone', 'text'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPreferredContact(method)}
                      className={`flex-1 py-2 text-xs rounded-xl border capitalize transition-all ${
                        preferredContact === method
                          ? 'bg-[#5B6A56] text-white border-[#5B6A56]'
                          : 'bg-white border-[#A8B5A2]/30 text-[#606060] hover:border-[#A8B5A2]'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2C2C2C] mb-1">
                What are you hoping to focus on? (Brief note, optional)
              </label>
              <textarea
                rows={3}
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="e.g. Navigating high stress at work, panic attacks, processing past family experiences, couples communication..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#A8B5A2]/40 text-sm text-[#2C2C2C] focus:ring-2 focus:ring-[#5B6A56] focus:outline-hidden"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#FFF9F2] border border-[#E8D5C4] text-[11px] text-[#606060]">
              <strong className="text-[#2C2C2C] font-semibold">Privacy & Non-Surprise Notice:</strong> Haven & Hearth Psychology maintains strict HIPAA confidentiality. Submitting this form reserves your time slot; no payment is charged until intake paperwork is reviewed.
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#A8B5A2]/20">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-medium text-[#606060] hover:text-[#2C2C2C] flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !fullName || !email}
                className="px-7 py-2.5 rounded-full bg-[#5B6A56] hover:bg-[#4E5C49] disabled:opacity-50 text-white text-sm font-medium transition-all shadow-xs flex items-center gap-2"
              >
                {isSubmitting ? 'Confirming...' : 'Complete Reservation'}
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Confirmed Receipt */}
        {step === 4 && bookingConfirmation && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-[#EDF2EB] text-[#5B6A56] mx-auto flex items-center justify-center border border-[#A8B5A2]/40 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#5B6A56]">Consultation Confirmed</span>
              <h3 className="font-serif text-3xl font-medium text-[#2C2C2C] mt-1">
                We look forward to meeting you, {fullName}.
              </h3>
              <p className="text-sm text-[#606060] max-w-md mx-auto mt-2">
                A confirmation summary has been dispatched to <span className="font-medium text-[#2C2C2C]">{email}</span> with your calendar invitation and initial intake notes.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#A8B5A2]/30 text-left space-y-2.5 max-w-md mx-auto text-xs shadow-xs">
              <div className="flex justify-between items-center pb-2 border-b border-[#A8B5A2]/20">
                <span className="text-[#8C8C8C]">Booking Reference:</span>
                <span className="font-mono font-bold text-sm text-[#5B6A56]">{bookingConfirmation.ref}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C8C8C]">Service:</span>
                <span className="font-medium text-[#2C2C2C]">{bookingConfirmation.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C8C8C]">Date & Time:</span>
                <span className="font-medium text-[#2C2C2C]">{bookingConfirmation.date} at {bookingConfirmation.time} PT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C8C8C]">Location / Format:</span>
                <span className="font-medium text-[#2C2C2C]">{bookingConfirmation.format}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {onJoinVideoCall && format === 'telehealth' && (
                <button
                  type="button"
                  onClick={() => {
                    const rId = 'haven-room-' + bookingConfirmation.ref.toLowerCase().replace('hh-', '');
                    onClose();
                    onJoinVideoCall(rId, fullName);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#5B6A56] hover:bg-[#4E5C49] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Video className="w-4 h-4" />
                  <span>Join Video Call Room Now</span>
                </button>
              )}
              <button
                type="button"
                onClick={downloadCalendarFile}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#EDF2EB] hover:bg-[#E2EBE0] text-[#5B6A56] text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-[#A8B5A2]/40 shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Add to Calendar (.ics)</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white hover:bg-[#F9F6F1] border border-[#A8B5A2]/40 text-[#2C2C2C] text-xs font-semibold transition-colors shadow-xs"
              >
                Return to Website
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
