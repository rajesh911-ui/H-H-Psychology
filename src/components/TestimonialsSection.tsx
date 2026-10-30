import React from 'react';
import { Star, Quote, Heart, CheckCircle2 } from 'lucide-react';
import { TESTIMONIALS } from '../data/practiceData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#FFFFFF] border-b border-[rgba(28,28,28,0.1)]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 space-y-14">
        <div className="max-w-3xl space-y-3">
          <span className="label-mono">[ Clinical Reflections ]</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#1C1C1C] tracking-tight">
            Words from those who sat in our chair.
          </h2>
          <p className="text-[rgba(28,28,28,0.6)] text-sm sm:text-base leading-relaxed">
            Shared with explicit informed consent. All personal identifying details and timelines have been altered to protect client confidentiality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[rgba(28,28,28,0.1)] border border-[rgba(28,28,28,0.1)]">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={t.id}
              className="p-8 sm:p-10 bg-[#F8F7F4] hover:bg-white transition-colors duration-200 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#8E7B6D] font-bold">
                    [0{idx + 1}]
                  </span>
                  <span className="label-mono">
                    {t.tag}
                  </span>
                </div>

                <Quote className="w-5 h-5 text-[#8E7B6D] opacity-40" />
                
                <p className="font-serif text-lg sm:text-xl text-[#1C1C1C] leading-relaxed font-light italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-5 border-t border-[rgba(28,28,28,0.08)] flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-[#1C1C1C]">{t.clientContext}</div>
                  <div className="text-[rgba(28,28,28,0.5)] font-mono text-[11px] mt-0.5">{t.durationWithUs}</div>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E7B6D]">
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
