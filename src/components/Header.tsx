import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Menu, X, Phone, Heart } from 'lucide-react';
import { PRACTICE_INFO } from '../data/practiceData';

interface HeaderProps {
  onOpenBooking: (serviceId?: string) => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenPortal: (tab?: 'client' | 'host' | 'copyright') => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBooking, activeSection, onNavigate, onOpenPortal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'Meet Dr. Vance' },
    { id: 'services', label: 'Services' },
    { id: 'approach', label: 'Our Approach' },
    { id: 'fees', label: 'Fees & Insurance' },
    { id: 'sanctuary', label: 'Mindful Sanctuary' },
    { id: 'resources', label: 'Resources' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <>
      {/* Top Reassurance & Crisis Ribbon */}
      <div className="bg-[#EDF2EB] text-[#5B6A56] border-b border-[#A8B5A2]/30 text-xs py-1.5 px-4 text-center flex flex-wrap items-center justify-center gap-3">
        <span className="hidden sm:inline">Now welcoming new adult & couples clients · In-Person (San Francisco) & California Telehealth</span>
        <span className="sm:hidden">Welcoming new clients · SF & CA Telehealth</span>
        <span className="text-[#A8B5A2]">·</span>
        <button
          onClick={() => onOpenPortal('copyright')}
          className="underline hover:text-[#2C2C2C] font-medium transition-colors"
        >
          Data Storage & Copyright Policy
        </button>
        <span className="text-[#A8B5A2]">·</span>
        <a 
          href="#crisis-info"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('contact');
          }}
          className="underline hover:text-[#2C2C2C] font-medium transition-colors"
        >
          24/7 Crisis Support: 988
        </a>
      </div>

      {/* Main Sticky Header */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F9F6F1]/90 backdrop-blur-md shadow-xs py-3.5 border-b border-[#A8B5A2]/25'
          : 'bg-[#F9F6F1] py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => handleLinkClick('home')}
            className="cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#5B6A56] text-white flex items-center justify-center shadow-xs group-hover:bg-[#4E5C49] transition-all duration-300">
              <Heart className="w-5 h-5 text-[#E8D5C4]" />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-[#2C2C2C] block leading-none">
                Haven & Hearth
              </span>
              <span className="text-[11px] uppercase tracking-wider text-[#606060] font-medium block mt-0.5">
                Psychology & Psychotherapy
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-[#606060]">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`relative py-1 transition-colors hover:text-[#2C2C2C] ${
                    isActive ? 'text-[#2C2C2C] font-semibold' : ''
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5B6A56] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={() => onOpenPortal('client')}
              className="px-3.5 py-2 rounded-full bg-white hover:bg-[#EDF2EB] text-[#2C2C2C] border border-[#A8B5A2]/40 text-xs font-medium transition-all shadow-2xs flex items-center gap-1.5"
              title="Access scheduled video calls and client portal"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Client Portal</span>
            </button>

            <button
              onClick={() => onOpenBooking()}
              className="px-5 py-2.5 rounded-full bg-[#5B6A56] hover:bg-[#4E5C49] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Consultation</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => onOpenPortal('client')}
              className="px-3 py-1.5 rounded-full bg-white border border-[#A8B5A2]/40 text-[#2C2C2C] text-xs font-medium"
            >
              Portal
            </button>
            <button
              onClick={() => onOpenBooking()}
              className="px-3.5 py-1.5 rounded-full bg-[#5B6A56] text-white text-xs font-semibold"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#2C2C2C] hover:bg-[#EDF2EB] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-4 pb-6 bg-[#F9F6F1] border-b border-[#A8B5A2]/30 space-y-3 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-left p-2.5 rounded-xl transition-colors ${
                    activeSection === link.id
                      ? 'bg-[#EDF2EB] text-[#5B6A56] font-semibold'
                      : 'hover:bg-white text-[#2C2C2C]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-[#A8B5A2]/20 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPortal('client');
                }}
                className="w-full py-2.5 rounded-full bg-white border border-[#A8B5A2]/40 text-[#2C2C2C] text-xs font-semibold flex items-center justify-center gap-2"
              >
                <span>My Client Portal & Video Calls</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPortal('host');
                }}
                className="w-full py-2 text-xs text-[#5B6A56] hover:underline"
              >
                Clinician Host Dashboard (Dr. Vance)
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3 rounded-full bg-[#5B6A56] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-xs"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Free Discovery Call</span>
              </button>
              <a
                href={`tel:${PRACTICE_INFO.phone.replace(/[^0-9]/g, '')}`}
                className="text-center py-2 text-xs text-[#606060] flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-[#5B6A56]" />
                <span>Direct Line: {PRACTICE_INFO.phone}</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
