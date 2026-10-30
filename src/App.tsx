/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { TherapistProfile } from './components/TherapistProfile';
import { ApproachSection } from './components/ApproachSection';
import { FeesAndInsurance } from './components/FeesAndInsurance';
import { GroundingCorner } from './components/GroundingCorner';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AiChatAssistant } from './components/AiChatAssistant';
import { PortalModal } from './components/PortalModal';
import { TelehealthVideoRoom } from './components/TelehealthVideoRoom';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);

  // Portal & Video Room States
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [portalDefaultTab, setPortalDefaultTab] = useState<'client' | 'host' | 'copyright'>('client');
  const [activeVideoCall, setActiveVideoCall] = useState<{
    roomId: string;
    name: string;
    role: 'client' | 'host';
  } | null>(null);

  const handleOpenBooking = (serviceId?: string) => {
    setPreselectedService(serviceId);
    setIsBookingOpen(true);
  };

  const handleOpenPortal = (tab: 'client' | 'host' | 'copyright' = 'client') => {
    setPortalDefaultTab(tab);
    setIsPortalOpen(true);
  };

  const handleJoinVideoCall = (roomId: string, name: string, role: 'client' | 'host' = 'client') => {
    setIsPortalOpen(false);
    setIsBookingOpen(false);
    setActiveVideoCall({ roomId, name, role });
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const mainEl = document.getElementById('main-content');
    if (sectionId === 'home') {
      if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Track active section on scroll inside main-content
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'services', 'approach', 'fees', 'sanctuary', 'resources', 'contact'];
      const mainEl = document.getElementById('main-content');
      const scrollPosition = (mainEl ? mainEl.scrollTop : window.scrollY) + 200;

      for (const sectionId of sections) {
        if (sectionId === 'home' && (mainEl ? mainEl.scrollTop : window.scrollY) < 300) {
          setActiveSection('home');
          return;
        }
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    const mainEl = document.getElementById('main-content');
    if (mainEl) {
      mainEl.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (mainEl) mainEl.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[#F8F7F4] text-[#1C1C1C] overflow-hidden selection:bg-[#8E7B6D] selection:text-white">
      {/* Live In-App Telehealth Video Call Room (when active) */}
      {activeVideoCall && (
        <TelehealthVideoRoom
          roomId={activeVideoCall.roomId}
          clientName={activeVideoCall.name}
          userRole={activeVideoCall.role}
          onLeaveCall={() => setActiveVideoCall(null)}
        />
      )}

      {/* Top Black Minimalist Banner (Variation 2) */}
      <div className="bg-[#1C1C1C] text-white py-2 px-4 text-center font-mono text-[10px] sm:text-[11px] tracking-wider uppercase z-50 shrink-0 flex items-center justify-between sm:justify-center gap-4">
        <span className="truncate">
          NOW WELCOMING NEW ADULT & COUPLES CLIENTS · IN-PERSON (SAN FRANCISCO) & CALIFORNIA TELEHEALTH
        </span>
        <button
          onClick={() => handleOpenPortal('copyright')}
          className="text-[#8E7B6D] hover:text-white underline text-[10px] shrink-0 hidden md:inline"
        >
          [ Data & Privacy ]
        </button>
      </div>

      {/* Variation 2 Architectural Grid Shell */}
      <div id="app-shell" className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Desktop Sidebar & Mobile Nav */}
        <Sidebar
          activeSection={activeSection}
          onNavigate={handleNavigate}
          onOpenBooking={() => handleOpenBooking()}
          onOpenPortal={handleOpenPortal}
        />

        {/* Scrollable Main Area (Variation 2) */}
        <main id="main-content" className="flex-1 overflow-y-auto scroll-smooth bg-[#F8F7F4] flex flex-col">
            {/* Hero Section */}
            <div id="home">
              <Hero
                onOpenBooking={() => handleOpenBooking()}
                onNavigate={handleNavigate}
                onExploreSanctuary={() => handleNavigate('sanctuary')}
              />
            </div>

            {/* Services Section */}
            <ServicesSection onOpenBooking={(id) => handleOpenBooking(id)} />

            {/* Therapist Profile (About Dr. Vance) */}
            <TherapistProfile onOpenBooking={() => handleOpenBooking()} />

            {/* How Therapy Works / 4-Step Client Journey */}
            <ApproachSection onOpenBooking={() => handleOpenBooking()} />

            {/* Fees, Insurance & Superbill Net Cost Estimator */}
            <FeesAndInsurance onOpenBooking={() => handleOpenBooking()} />

            {/* 3D Mindful Grounding Sanctuary & Clinical Articles */}
            <GroundingCorner />

            {/* Verified Client Testimonials */}
            <TestimonialsSection />

            {/* Physical Office, Transit, Contact Form & Crisis Resources */}
            <ContactSection />

            {/* 3-Column Footer (Variation 2) */}
            <Footer
              onOpenBooking={() => handleOpenBooking()}
              onNavigate={handleNavigate}
              onOpenPortal={handleOpenPortal}
            />
          </main>
      </div>

      {/* Interactive Appointment Booking Engine */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedService={preselectedService}
        onJoinVideoCall={(roomId, name) => handleJoinVideoCall(roomId, name, 'client')}
      />

      {/* Client & Clinician Host Portal Modal (Scheduled calls & Copyright) */}
      <PortalModal
        isOpen={isPortalOpen}
        onClose={() => setIsPortalOpen(false)}
        defaultTab={portalDefaultTab}
        onJoinVideoCall={handleJoinVideoCall}
      />

      {/* Floating Haven AI Practice Concierge */}
      <AiChatAssistant onOpenBooking={() => handleOpenBooking()} />
    </div>
  );
}
