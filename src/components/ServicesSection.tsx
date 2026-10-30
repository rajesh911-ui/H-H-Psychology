import React, { useState } from 'react';
import { ArrowRight, Check, X, ChevronRight } from 'lucide-react';
import { SERVICES } from '../data/practiceData';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  onOpenBooking: (serviceId?: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenBooking }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'anxiety', label: 'Anxiety & Worry' },
    { id: 'trauma', label: 'Trauma & EMDR' },
    { id: 'individual', label: 'Burnout & Life' },
    { id: 'couples', label: 'Couples & Repair' },
    { id: 'telehealth', label: 'Virtual Care' },
  ];

  const filteredServices = selectedCategory === 'all'
    ? SERVICES
    : SERVICES.filter(s => s.category === selectedCategory);

  return (
    <section id="services" className="py-20 lg:py-28 bg-[#F8F7F4] border-b border-[rgba(28,28,28,0.1)]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Section Header (Variation 2) */}
        <div className="border-b border-[rgba(28,28,28,0.1)] pb-8 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="label-mono">[ Areas of Care ]</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#1C1C1C] leading-none tracking-tight">
              Clinical Focus Areas
            </h2>
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-[#1C1C1C] text-white border-[#1C1C1C]'
                    : 'bg-white text-[rgba(28,28,28,0.6)] border-[rgba(28,28,28,0.15)] hover:border-[#1C1C1C] hover:text-[#1C1C1C]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Architectural 1px Border Grid (Variation 2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[rgba(28,28,28,0.12)] border border-[rgba(28,28,28,0.12)]">
          {filteredServices.map((service, idx) => (
            <div
              key={service.id}
              className="bg-[#FFFFFF] p-8 sm:p-10 flex flex-col justify-between hover:bg-[#FAF9F7] transition-colors group space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="label-mono text-[#8E7B6D]">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  {service.badge && (
                    <span className="label-mono text-[9px] text-[rgba(28,28,28,0.5)]">
                      {service.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-light text-[#1C1C1C] group-hover:text-[#8E7B6D] transition-colors leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-xs text-[rgba(28,28,28,0.65)] leading-relaxed mt-3">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-[rgba(28,28,28,0.08)] space-y-1.5 text-xs text-[#1C1C1C]">
                  {service.whoItIsFor.slice(0, 2).map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-[rgba(28,28,28,0.7)]">
                      <span className="text-[#8E7B6D] shrink-0">·</span>
                      <span className="line-clamp-1">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[rgba(28,28,28,0.08)] flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-[#1C1C1C] block">
                    {service.rate}
                  </span>
                  <span className="label-mono text-[8px] text-[rgba(28,28,28,0.45)]">
                    {service.sessionLength}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveModalService(service)}
                    className="text-[11px] font-mono uppercase tracking-wider text-[rgba(28,28,28,0.6)] hover:text-[#1C1C1C] px-2 py-1"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onOpenBooking(service.id)}
                    className="btn-editorial py-1.5 px-3 text-[10px]"
                  >
                    <span>Book</span>
                    <ArrowRight className="w-3 h-3 text-[#8E7B6D]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Service Detail Modal */}
        {activeModalService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1C1C]/50 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-[#FFFFFF] border border-[rgba(28,28,28,0.2)] p-8 sm:p-10 shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setActiveModalService(null)}
                className="absolute top-6 right-6 p-2 text-[rgba(28,28,28,0.6)] hover:text-[#1C1C1C]"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <span className="label-mono">[ Service Overview ]</span>
                <h3 className="font-serif text-3xl font-light text-[#1C1C1C]">
                  {activeModalService.title}
                </h3>
                <p className="text-sm text-[rgba(28,28,28,0.7)] leading-relaxed">
                  {activeModalService.detailedDescription}
                </p>
              </div>

              <div className="p-5 bg-[#F8F7F4] border border-[rgba(28,28,28,0.1)] space-y-2.5">
                <h4 className="label-mono text-[#1C1C1C]">Who This Is For</h4>
                <ul className="space-y-1.5 text-xs text-[rgba(28,28,28,0.7)]">
                  {activeModalService.whoItIsFor.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#8E7B6D] font-bold">―</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 bg-[#F8F7F4] border border-[rgba(28,28,28,0.1)] space-y-2.5">
                <h4 className="label-mono text-[#8E7B6D]">Clinical Methods & Modalities</h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {activeModalService.modalities.map((m, i) => (
                    <span key={i} className="px-3 py-1 bg-white border border-[rgba(28,28,28,0.15)] text-[11px] font-mono text-[#1C1C1C]">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[rgba(28,28,28,0.1)] flex items-center justify-between">
                <div>
                  <span className="font-mono text-sm font-bold text-[#1C1C1C]">{activeModalService.rate}</span>
                  <span className="label-mono text-[9px] text-[rgba(28,28,28,0.45)] ml-2">({activeModalService.sessionLength})</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveModalService(null)}
                    className="btn-editorial py-2 px-4"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const sid = activeModalService.id;
                      setActiveModalService(null);
                      onOpenBooking(sid);
                    }}
                    className="btn-editorial btn-editorial-primary py-2 px-5"
                  >
                    Schedule Consultation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
