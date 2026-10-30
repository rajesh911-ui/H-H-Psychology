import React, { useState } from 'react';
import { Menu, X, Lock, Phone, Heart, ArrowUpRight } from 'lucide-react';
import { PRACTICE_INFO } from '../data/practiceData';

interface SidebarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenBooking: (serviceId?: string) => void;
  onOpenPortal: (tab?: 'client' | 'host' | 'copyright') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onNavigate,
  onOpenBooking,
  onOpenPortal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'Meet Dr. Vance' },
    { id: 'services', label: 'Clinical Services' },
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
      {/* Mobile Top Header Bar (Shown only on small screens) */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#F8F7F4]/95 backdrop-blur-md border-b border-[rgba(28,28,28,0.1)] px-4 py-3 flex items-center justify-between shrink-0">
        <div 
          onClick={() => handleLinkClick('home')}
          className="cursor-pointer"
        >
          <span className="label-mono block text-[10px]">H&H Psychology</span>
          <span className="font-serif text-lg font-semibold tracking-tight text-[#1C1C1C]">
            Haven & Hearth
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenPortal('client')}
            className="px-2.5 py-1 rounded border border-[#1C1C1C] text-[10px] font-mono tracking-wider text-[#1C1C1C] uppercase"
          >
            Portal
          </button>
          <button
            onClick={() => onOpenBooking()}
            className="px-3 py-1 bg-[#8E7B6D] text-white text-[10px] font-mono tracking-wider uppercase"
          >
            Book
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#1C1C1C]"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[75px] z-40 bg-[#FFFFFF] border-b border-[rgba(28,28,28,0.15)] p-6 space-y-4 shadow-xl animate-in fade-in duration-200">
          <nav className="space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`block w-full text-left font-sans text-sm py-1.5 transition-colors ${
                  activeSection === link.id
                    ? 'text-[#1C1C1C] font-semibold pl-2 border-l-2 border-[#8E7B6D]'
                    : 'text-[rgba(28,28,28,0.6)] hover:text-[#1C1C1C]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-[rgba(28,28,28,0.1)] space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPortal('client');
              }}
              className="btn-editorial w-full"
            >
              Client Telehealth Portal
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="btn-editorial btn-editorial-primary w-full"
            >
              Book Consultation
            </button>
            <div className="pt-2 flex justify-between text-[11px] font-mono text-[rgba(28,28,28,0.6)]">
              <a href="#crisis-info" onClick={() => setMobileMenuOpen(false)} className="text-[#991B1B] font-bold">
                Crisis: 988
              </a>
              <button onClick={() => { setMobileMenuOpen(false); onOpenPortal('host'); }}>
                Host Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Fixed Left Architectural Sidebar (Variation 2) */}
      <aside className="hidden lg:flex flex-col justify-between w-[280px] shrink-0 border-r border-[rgba(28,28,28,0.1)] p-8 bg-[#FFFFFF] h-full overflow-y-auto select-none">
        
        {/* Top: Branding & Navigation */}
        <div className="space-y-8">
          <div>
            <div className="label-mono">H&H Psychology</div>
            <h2 className="font-serif text-2xl font-semibold text-[#1C1C1C] mt-1 leading-none tracking-tight">
              Haven & Hearth
            </h2>
            <p className="label-mono text-[9px] text-[rgba(28,28,28,0.5)] mt-1.5">
              Dr. Elena Vance, PsyD · Lic #32918
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-3.5">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`block text-left text-[13px] transition-all w-full ${
                    isActive
                      ? 'text-[#1C1C1C] font-semibold pl-2.5 border-l-2 border-[#8E7B6D]'
                      : 'text-[rgba(28,28,28,0.6)] hover:text-[#1C1C1C]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Client Portal, Crisis Hotline, and Primary CTA */}
        <div className="space-y-4 pt-6 border-t border-[rgba(28,28,28,0.1)]">
          <button
            onClick={() => onOpenPortal('client')}
            className="flex items-center justify-between w-full text-left text-xs font-mono uppercase tracking-wider text-[#1C1C1C] hover:text-[#8E7B6D] transition-colors py-1"
          >
            <span>[ Client Portal ]</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8E7B6D]" />
          </button>

          <a 
            href="#crisis-info"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('contact');
            }}
            className="block text-[11px] font-mono text-[#991B1B] hover:underline"
          >
            24/7 Crisis Support: 988
          </a>

          <button
            onClick={() => onOpenBooking()}
            className="btn-editorial btn-editorial-primary w-full py-3"
          >
            Book Consultation
          </button>

          <div className="flex items-center justify-between text-[10px] font-mono text-[rgba(28,28,28,0.45)]">
            <button onClick={() => onOpenPortal('host')} className="hover:text-[#1C1C1C]">
              Clinician Host
            </button>
            <span>·</span>
            <button onClick={() => onOpenPortal('copyright')} className="hover:text-[#1C1C1C]">
              Copyright
            </button>
          </div>
        </div>

      </aside>
    </>
  );
};
