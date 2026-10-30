import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PRACTICE_INFO } from '../data/practiceData';

interface FooterProps {
  onOpenBooking: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenPortal?: (tab?: 'client' | 'host' | 'copyright') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onNavigate, onOpenPortal }) => {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [goodFaithOpen, setGoodFaithOpen] = useState(false);

  return (
    <footer className="border-t border-[rgba(28,28,28,0.12)] bg-[#FFFFFF] py-14 text-xs text-[rgba(28,28,28,0.7)]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 space-y-12">
        
        {/* 3-Column Editorial Layout (Variation 2) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Column 1: Disclaimer & Copyright */}
          <div className="md:col-span-6 space-y-3">
            <div className="label-mono">[ Clinical Disclaimer & Ethics ]</div>
            <p className="text-xs text-[rgba(28,28,28,0.65)] leading-relaxed max-w-lg">
              The information provided on this website is for educational and appointment-scheduling purposes only and does not establish a formal psychologist-patient relationship. In an emergency or acute mental health crisis, please dial 988 or 911 immediately.
            </p>
            <p className="font-mono text-[11px] text-[rgba(28,28,28,0.5)] pt-2">
              © {new Date().getFullYear()} Haven & Hearth Psychology. Dr. Elena Vance, Psy.D. (CA License #PSY32918).
            </p>
          </div>

          {/* Column 2: Physical Office */}
          <div className="md:col-span-3 space-y-2">
            <div className="label-mono">[ San Francisco Office ]</div>
            <p className="text-xs leading-relaxed text-[#1C1C1C] font-light">
              {PRACTICE_INFO.address.street}<br />
              {PRACTICE_INFO.address.city}, {PRACTICE_INFO.address.state} {PRACTICE_INFO.address.zip}<br />
              <span className="text-[11px] text-[rgba(28,28,28,0.5)]">{PRACTICE_INFO.address.neighborhood}</span>
            </p>
            <p className="text-[11px] text-[rgba(28,28,28,0.6)] pt-1">
              Mon–Thu 8:30 AM – 6:00 PM<br />Fri Telehealth 9:00 AM – 2:00 PM
            </p>
          </div>

          {/* Column 3: Connect & Portals */}
          <div className="md:col-span-3 space-y-2">
            <div className="label-mono">[ Communications ]</div>
            <p className="text-xs text-[#1C1C1C] font-mono">
              <a href={`mailto:${PRACTICE_INFO.email}`} className="hover:underline block">
                {PRACTICE_INFO.email}
              </a>
              <a href={`tel:${PRACTICE_INFO.phone}`} className="hover:underline block mt-0.5">
                {PRACTICE_INFO.phone}
              </a>
            </p>

            <div className="pt-2 flex flex-col gap-1.5 text-[11px] font-mono">
              {onOpenPortal && (
                <>
                  <button
                    onClick={() => onOpenPortal('client')}
                    className="text-left text-[#8E7B6D] hover:underline"
                  >
                    → Client Telehealth Portal
                  </button>
                  <button
                    onClick={() => onOpenPortal('copyright')}
                    className="text-left text-[rgba(28,28,28,0.6)] hover:underline"
                  >
                    → Data Storage & Copyright
                  </button>
                  <button
                    onClick={() => onOpenPortal('host')}
                    className="text-left text-[rgba(28,28,28,0.6)] hover:underline"
                  >
                    → Clinician Host Portal
                  </button>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Legal Substrip */}
        <div className="pt-6 border-t border-[rgba(28,28,28,0.08)] flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-[rgba(28,28,28,0.5)]">
          <div>
            <span>California Board of Psychology Registered Provider</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setPrivacyOpen(true)}
              className="hover:text-[#1C1C1C] underline"
            >
              Privacy & HIPAA Notice
            </button>
            <span>·</span>
            <button
              onClick={() => setGoodFaithOpen(true)}
              className="hover:text-[#1C1C1C] underline"
            >
              Good Faith Estimate
            </button>
          </div>
        </div>

      </div>

      {/* Privacy Notice Modal */}
      {privacyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1C1C]/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white p-8 border border-[rgba(28,28,28,0.2)] shadow-2xl space-y-4">
            <button
              onClick={() => setPrivacyOpen(false)}
              className="absolute top-5 right-5 p-2 text-[rgba(28,28,28,0.6)] hover:text-[#1C1C1C]"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="label-mono">[ Notice of Privacy Practices ]</div>
            <h3 className="font-serif text-2xl font-light text-[#1C1C1C]">
              HIPAA Confidentiality
            </h3>
            <p className="text-xs text-[rgba(28,28,28,0.7)] leading-relaxed">
              Haven & Hearth Psychology is committed to protecting your confidential healthcare information. Personal health information (PHI) is kept strictly confidential and cannot be disclosed to employers, insurers, or third parties without your explicit, voluntary written consent.
            </p>
            <div className="pt-2 text-right">
              <button
                onClick={() => setPrivacyOpen(false)}
                className="btn-editorial py-2 px-5 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Good Faith Estimate Modal */}
      {goodFaithOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1C1C]/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white p-8 border border-[rgba(28,28,28,0.2)] shadow-2xl space-y-4">
            <button
              onClick={() => setGoodFaithOpen(false)}
              className="absolute top-5 right-5 p-2 text-[rgba(28,28,28,0.6)] hover:text-[#1C1C1C]"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="label-mono">[ Consumer Protection ]</div>
            <h3 className="font-serif text-2xl font-light text-[#1C1C1C]">
              Good Faith Estimate
            </h3>
            <p className="text-xs text-[rgba(28,28,28,0.7)] leading-relaxed">
              Under Section 2799B-6 of the Public Health Service Act, healthcare providers must provide clients who are not enrolled in an insurance plan or who are not submitting a claim to insurance a &ldquo;Good Faith Estimate&rdquo; of expected charges before your first session.
            </p>
            <div className="pt-2 text-right">
              <button
                onClick={() => setGoodFaithOpen(false)}
                className="btn-editorial py-2 px-5 text-xs"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
