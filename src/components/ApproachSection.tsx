import React from 'react';
import { Coffee, Compass, Sparkles, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';

interface ApproachSectionProps {
  onOpenBooking: () => void;
}

export const ApproachSection: React.FC<ApproachSectionProps> = ({ onOpenBooking }) => {
  const steps = [
    {
      number: '01',
      title: 'A Gentle 15-Minute Discovery',
      icon: Coffee,
      badge: 'Step One',
      summary: 'A relaxed, complimentary phone or video call to share what has been on your mind and see how it feels to talk together.',
      details: [
        'No commitment or pressure whatsoever',
        'Ask about modalities, schedule availability, and fees',
        'Confirm mutual comfort and rapport'
      ]
    },
    {
      number: '02',
      title: 'Co-Creating Your Safe Foundation',
      icon: Compass,
      badge: 'Step Two',
      summary: 'In our 75-minute intake, we map out your story, pinpoint current triggers, and establish immediate somatic calming tools.',
      details: [
        'Explore your history at your own comfort level',
        'Identify what your nervous system needs right now',
        'Co-create a personalized, values-based roadmap'
      ]
    },
    {
      number: '03',
      title: 'Empathetic, Evidence-Based Sessions',
      icon: Sparkles,
      badge: 'Step Three',
      summary: 'Weekly or bi-weekly 50-minute sessions combining deep validation with actionable psychological techniques.',
      details: [
        'ACT to unhook from paralyzing thought spirals',
        'EMDR to resolve stuck emotional triggers & trauma',
        'Polyvagal exercises to restore real physical calm'
      ]
    },
    {
      number: '04',
      title: 'Sustainable Resilience & Integration',
      icon: HeartHandshake,
      badge: 'Step Four',
      summary: 'Gradually stepping down frequency as you feel anchored, self-compassionate, and confident navigating life’s storms.',
      details: [
        'Internalize your own resilient coping toolkit',
        'Celebrate measurable shifts in relationships & sleep',
        'Long-term maintenance or periodic check-ins as desired'
      ]
    }
  ];

  return (
    <section id="approach" className="py-20 lg:py-28 bg-[#F8F7F4] border-b border-[rgba(28,28,28,0.1)]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-3">
          <span className="label-mono">[ The Methodology ]</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#1C1C1C] tracking-tight">
            How therapy unfolds: 4 thoughtful phases.
          </h2>
          <p className="text-[rgba(28,28,28,0.6)] text-sm sm:text-base leading-relaxed">
            Starting therapy should never feel like a high-pressure commitment. We proceed at your cadence, grounded in mutual transparency and empirical clinical science.
          </p>
        </div>

        {/* Steps Grid - Variation 2 1px gap architectural grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-[rgba(28,28,28,0.1)] border border-[rgba(28,28,28,0.1)]">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative flex flex-col justify-between p-8 bg-white hover:bg-[#F8F7F4] transition-colors duration-200"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#8E7B6D] tracking-widest font-bold">
                      [{step.number}]
                    </span>
                    <Icon className="w-4 h-4 text-[#8E7B6D]" />
                  </div>

                  <div>
                    <span className="label-mono">
                      {step.badge}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-light text-[#1C1C1C] mt-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[rgba(28,28,28,0.65)] leading-relaxed mt-3">
                      {step.summary}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-4 border-t border-[rgba(28,28,28,0.08)]">
                    {step.details.map((detail, dIdx) => (
                      <li key={dIdx} className="text-xs text-[rgba(28,28,28,0.7)] flex items-start gap-2">
                        <span className="font-mono text-[#8E7B6D] text-[10px] mt-0.5">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 mt-6 border-t border-[rgba(28,28,28,0.08)] font-mono text-[10px] uppercase tracking-wider text-[#8E7B6D]">
                  Paced for emotional safety
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive CTA Banner */}
        <div className="mt-12 p-8 sm:p-10 bg-white border border-[rgba(28,28,28,0.1)] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="label-mono">[ Initial Step ]</span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#1C1C1C]">
              Ready to take the first conversation?
            </h3>
            <p className="text-xs sm:text-sm text-[rgba(28,28,28,0.6)]">
              Schedule your complimentary 15-minute phone or video discovery consultation.
            </p>
          </div>
          <button
            onClick={onOpenBooking}
            className="btn-editorial-primary text-xs uppercase tracking-wider px-8 py-3.5 flex items-center gap-3 shrink-0"
          >
            <span>Book Discovery Call</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
