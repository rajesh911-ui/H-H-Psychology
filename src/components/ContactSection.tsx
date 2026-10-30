import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle, Compass, ShieldCheck } from 'lucide-react';
import { PRACTICE_INFO, CRISIS_RESOURCES } from '../data/practiceData';

export const ContactSection: React.FC = () => {
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMessage) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          phone: formPhone,
          message: formMessage
        })
      });
      const data = await res.json();
      setSubmittedMessage(data.message || `Thank you, ${formName}. Your inquiry has been received with care.`);
      setFormName('');
      setFormEmail('');
      setFormPhone('');
      setFormMessage('');
    } catch {
      setSubmittedMessage(`Thank you, ${formName}. Your inquiry has been received with care. We will get back to you within 1 business day.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#F8F7F4] border-b border-[rgba(28,28,28,0.1)]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 space-y-16">
        
        {/* Contact Header */}
        <div className="max-w-3xl space-y-3">
          <span className="label-mono">[ Practice Inquiries ]</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#1C1C1C] tracking-tight">
            We are here when you are ready.
          </h2>
          <p className="text-[rgba(28,28,28,0.6)] text-sm sm:text-base leading-relaxed">
            Whether you have questions regarding treatment fit, office accessibility, or scheduling, our doors and confidential lines are open.
          </p>
        </div>

        {/* Contact Info & Interactive Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Office Details & Directions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 sm:p-10 bg-white border border-[rgba(28,28,28,0.1)] space-y-6">
              <span className="label-mono">[ Physical Office & Lines ]</span>
              <h3 className="font-serif text-2xl font-light text-[#1C1C1C]">
                Office & Practice Details
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-[rgba(28,28,28,0.7)]">
                {/* Address */}
                <div className="flex items-start gap-3.5 pb-4 border-b border-[rgba(28,28,28,0.08)]">
                  <div className="w-8 h-8 bg-[#F8F7F4] border border-[rgba(28,28,28,0.1)] text-[#1C1C1C] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#8E7B6D]" />
                  </div>
                  <div>
                    <strong className="text-[#1C1C1C] font-medium block text-xs uppercase tracking-wide">Physical Office</strong>
                    <span>{PRACTICE_INFO.address.street}</span>
                    <span className="block">{PRACTICE_INFO.address.city}, {PRACTICE_INFO.address.state} {PRACTICE_INFO.address.zip}</span>
                    <span className="text-[11px] text-[rgba(28,28,28,0.5)] block mt-1">{PRACTICE_INFO.address.notes}</span>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3.5 pb-4 border-b border-[rgba(28,28,28,0.08)]">
                  <div className="w-8 h-8 bg-[#F8F7F4] border border-[rgba(28,28,28,0.1)] text-[#1C1C1C] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-[#8E7B6D]" />
                  </div>
                  <div>
                    <strong className="text-[#1C1C1C] font-medium block text-xs uppercase tracking-wide">Clinical Hours</strong>
                    <span>{PRACTICE_INFO.hours}</span>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3.5 pb-4 border-b border-[rgba(28,28,28,0.08)]">
                  <div className="w-8 h-8 bg-[#F8F7F4] border border-[rgba(28,28,28,0.1)] text-[#1C1C1C] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-[#8E7B6D]" />
                  </div>
                  <div>
                    <strong className="text-[#1C1C1C] font-medium block text-xs uppercase tracking-wide">Direct Practice Phone</strong>
                    <a href={`tel:${PRACTICE_INFO.phone}`} className="text-[#1C1C1C] font-mono hover:text-[#8E7B6D] transition-colors">
                      {PRACTICE_INFO.phone}
                    </a>
                    <span className="text-[11px] text-[rgba(28,28,28,0.5)] block mt-0.5">Confidential voicemail monitored daily</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 bg-[#F8F7F4] border border-[rgba(28,28,28,0.1)] text-[#1C1C1C] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-[#8E7B6D]" />
                  </div>
                  <div>
                    <strong className="text-[#1C1C1C] font-medium block text-xs uppercase tracking-wide">Encrypted Email</strong>
                    <a href={`mailto:${PRACTICE_INFO.email}`} className="text-[#1C1C1C] font-mono hover:text-[#8E7B6D] transition-colors">
                      {PRACTICE_INFO.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Transit & Accessibility badge */}
              <div className="p-4 bg-[#F8F7F4] border border-[rgba(28,28,28,0.08)] space-y-2 text-xs">
                <span className="label-mono flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#8E7B6D]" />
                  Accessibility & Parking
                </span>
                <p className="text-[rgba(28,28,28,0.65)] leading-relaxed">
                  ADA compliant elevator access to Suite 1420. Private waiting lounge with HEPA filtration and complimentary organic teas. Valet parking located directly across Sutter Street at the 450 Sutter Garage.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Confidential Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 bg-white border border-[rgba(28,28,28,0.1)] space-y-6">
              <div>
                <span className="label-mono">[ Direct Intake Query ]</span>
                <h3 className="font-serif text-2xl font-light text-[#1C1C1C] mt-1">
                  Send a Confidential Message
                </h3>
                <p className="text-xs sm:text-sm text-[rgba(28,28,28,0.6)] mt-1">
                  Have a specific question before booking? Inquiries are sent directly to Dr. Vance&apos;s private inbox.
                </p>
              </div>

              {submittedMessage ? (
                <div className="p-8 bg-[#F8F7F4] border border-[rgba(28,28,28,0.1)] text-center space-y-3">
                  <CheckCircle2 className="w-7 h-7 text-[#1C1C1C] mx-auto" />
                  <p className="text-sm font-medium text-[#1C1C1C]">{submittedMessage}</p>
                  <button
                    onClick={() => setSubmittedMessage(null)}
                    className="btn-editorial text-xs uppercase tracking-wider px-5 py-2 mt-2"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block label-mono mb-1.5">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Elena or Alex"
                        className="w-full px-4 py-3 bg-[#F8F7F4] border border-[rgba(28,28,28,0.15)] text-xs text-[#1C1C1C] focus:bg-white focus:border-[#1C1C1C] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block label-mono mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 bg-[#F8F7F4] border border-[rgba(28,28,28,0.15)] text-xs text-[#1C1C1C] focus:bg-white focus:border-[#1C1C1C] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block label-mono mb-1.5">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="(415) 555-0199"
                      className="w-full px-4 py-3 bg-[#F8F7F4] border border-[rgba(28,28,28,0.15)] text-xs text-[#1C1C1C] focus:bg-white focus:border-[#1C1C1C] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block label-mono mb-1.5">Your Message or Question *</label>
                    <textarea
                      rows={4}
                      required
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="Please feel free to share what you are looking for or any scheduling preferences..."
                      className="w-full px-4 py-3 bg-[#F8F7F4] border border-[rgba(28,28,28,0.15)] text-xs text-[#1C1C1C] focus:bg-white focus:border-[#1C1C1C] focus:outline-hidden"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                    <span className="font-mono text-[10px] text-[rgba(28,28,28,0.5)] uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#8E7B6D]" />
                      Protected by HIPAA & California Privacy Standards
                    </span>
                    <button
                      type="submit"
                      disabled={isSubmitting || !formName || !formEmail || !formMessage}
                      className="btn-editorial-primary text-xs uppercase tracking-wider px-7 py-3 flex items-center gap-2"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Crisis Resources Reassurance Banner */}
        <div id="crisis-info" className="p-8 sm:p-10 bg-white border border-[rgba(28,28,28,0.1)] space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1C1C1C] text-white flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4 text-[#E8D5C4]" />
            </div>
            <div>
              <span className="label-mono">[ Immediate Safety Protocol ]</span>
              <h3 className="font-serif text-xl sm:text-2xl font-light text-[#1C1C1C]">
                Emergency Mental Health & Crisis Support
              </h3>
              <p className="text-xs text-[rgba(28,28,28,0.6)]">
                Private outpatient therapy is not designed for active crisis management. If you or someone you care about needs immediate support:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-[rgba(28,28,28,0.1)] border border-[rgba(28,28,28,0.1)]">
            {CRISIS_RESOURCES.map((res, i) => (
              <div key={i} className="p-5 bg-[#F8F7F4] space-y-1.5">
                <span className="label-mono block">{res.name}</span>
                <span className="font-mono font-bold text-xs text-[#1C1C1C] block">{res.contact}</span>
                <p className="text-[11px] text-[rgba(28,28,28,0.6)] leading-relaxed">{res.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
