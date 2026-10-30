import React, { useState } from 'react';
import { ShieldCheck, FileText, CreditCard, AlertCircle } from 'lucide-react';

interface FeesAndInsuranceProps {
  onOpenBooking: () => void;
}

export const FeesAndInsurance: React.FC<FeesAndInsuranceProps> = ({ onOpenBooking }) => {
  // Interactive Superbill Calculator
  const [reimbursementRate, setReimbursementRate] = useState<number>(70); // 70% PPO coverage typical
  const sessionFee = 195;
  const estimatedReimbursement = Math.round((sessionFee * reimbursementRate) / 100);
  const estimatedOutOfPocket = sessionFee - estimatedReimbursement;

  const feeCards = [
    {
      label: 'Consult',
      name: '15-Minute Discovery Call',
      price: '$0',
      period: 'Complimentary Phone / Video',
      desc: 'Introductory conversation to explore fit, answer questions, and discuss therapy goals.',
      featured: false
    },
    {
      label: 'Intake',
      name: 'Comprehensive Intake',
      price: '$240',
      period: '75 min evaluation',
      desc: 'In-depth history mapping, symptom exploration, and collaborative care roadmap.',
      featured: false
    },
    {
      label: 'Individual',
      name: 'Individual Psychotherapy',
      price: '$195',
      period: '50 min ongoing session',
      desc: 'Weekly or bi-weekly session for anxiety, perfectionism, trauma recovery, or burnout.',
      featured: true
    },
    {
      label: 'Couples',
      name: 'Couples / Relationship Therapy',
      price: '$230',
      period: '60 min conjoint session',
      desc: 'Gottman and Emotionally Focused Therapy (EFT) to mend cycles and deepen intimacy.',
      featured: false
    }
  ];

  return (
    <section id="fees" className="py-20 lg:py-28 bg-[#F8F7F4] border-b border-[rgba(28,28,28,0.1)]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Section Header (Variation 2) */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="label-mono">[ Transparency ]</div>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#1C1C1C] tracking-tight">
            Transparent Pricing
          </h2>
          <p className="text-xs sm:text-sm text-[rgba(28,28,28,0.6)] leading-relaxed">
            Direct, predictable care with no hidden facility charges or insurance billing delays.
          </p>
        </div>

        {/* Pricing Grid (Variation 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {feeCards.map((card, i) => (
            <div
              key={i}
              className={`p-8 bg-[#FFFFFF] flex flex-col justify-between transition-all ${
                card.featured
                  ? 'border-2 border-[#1C1C1C] shadow-md'
                  : 'border border-[rgba(28,28,28,0.12)]'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="label-mono">{card.label}</span>
                  {card.featured && (
                    <span className="label-mono text-[9px] text-[#8E7B6D]">Featured</span>
                  )}
                </div>

                <div>
                  <span className="font-serif text-4xl text-[#1C1C1C] font-light block my-1">
                    {card.price}
                  </span>
                  <span className="label-mono text-[8px] text-[rgba(28,28,28,0.45)] block">
                    {card.period}
                  </span>
                </div>

                <p className="text-xs text-[rgba(28,28,28,0.6)] leading-relaxed pt-2 border-t border-[rgba(28,28,28,0.08)]">
                  {card.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[rgba(28,28,28,0.08)]">
                <button
                  onClick={onOpenBooking}
                  className={`btn-editorial w-full py-2.5 ${
                    card.featured ? 'btn-editorial-primary' : ''
                  }`}
                >
                  Select Option
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Out of Network & Superbill Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
          
          <div className="lg:col-span-7 bg-[#FFFFFF] p-8 border border-[rgba(28,28,28,0.12)] space-y-4">
            <div className="label-mono">[ Insurance Protocol ]</div>
            <h3 className="font-serif text-2xl font-light text-[#1C1C1C]">
              Out-of-Network Private Pay & Superbills
            </h3>
            <p className="text-xs sm:text-sm text-[rgba(28,28,28,0.65)] leading-relaxed">
              We operate as an out-of-network private practice to guarantee your therapeutic confidentiality and prevent insurance companies from dictating mandatory diagnoses or session limits.
            </p>
            <p className="text-xs sm:text-sm text-[rgba(28,28,28,0.65)] leading-relaxed">
              At the end of each month, we provide itemized psychiatric Superbills containing diagnostic CPT codes (e.g., 90837) for direct reimbursement from your PPO insurer.
            </p>

            <div className="pt-4 border-t border-[rgba(28,28,28,0.08)] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-[#F8F7F4] border border-[rgba(28,28,28,0.08)] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#8E7B6D]" />
                <span>HSA / FSA Cards Accepted</span>
              </div>
              <div className="p-3 bg-[#F8F7F4] border border-[rgba(28,28,28,0.08)] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#8E7B6D]" />
                <span>Monthly Superbill Issued</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#E8E4DF] p-8 border border-[rgba(28,28,28,0.15)] space-y-4">
            <span className="label-mono text-[#1C1C1C]">[ Reimbursement Estimator ]</span>
            <h3 className="font-serif text-xl font-light text-[#1C1C1C]">
              Estimate Your Net Session Cost
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span>PPO Rate:</span>
                <span className="font-bold text-[#1C1C1C]">{reimbursementRate}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={reimbursementRate}
                onChange={(e) => setReimbursementRate(Number(e.target.value))}
                className="w-full accent-[#1C1C1C] cursor-pointer"
              />
            </div>

            <div className="p-4 bg-white border border-[rgba(28,28,28,0.1)] space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-[rgba(28,28,28,0.6)]">
                <span>Standard Fee:</span>
                <span>${sessionFee}</span>
              </div>
              <div className="flex justify-between text-[#8E7B6D]">
                <span>Est. Reimbursement:</span>
                <span>-${estimatedReimbursement}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[rgba(28,28,28,0.1)] font-bold text-sm text-[#1C1C1C]">
                <span>Est. Net Cost:</span>
                <span className="text-[#8E7B6D]">${estimatedOutOfPocket} / session</span>
              </div>
            </div>
          </div>

        </div>

        {/* Good Faith Estimate Notice */}
        <div className="p-6 bg-white border border-[rgba(28,28,28,0.1)] flex items-start gap-3 text-xs text-[rgba(28,28,28,0.6)]">
          <ShieldCheck className="w-4 h-4 text-[#8E7B6D] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[#1C1C1C] font-semibold">Good Faith Estimate (No Surprises Act):</strong> Under federal law, you have the right to receive a written estimate of expected psychotherapy charges before treatment commences. Cancellations require 24 hours notice.
          </p>
        </div>

      </div>
    </section>
  );
};
