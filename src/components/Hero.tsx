import React from 'react';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import EchoText from './EchoText/EchoText';

interface HeroProps {
  onOpenBooking: () => void;
  onNavigate: (sectionId: string) => void;
  onExploreSanctuary: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onNavigate, onExploreSanctuary }) => {
  return (
    <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-[rgba(28,28,28,0.1)]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Main Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-end">
          
          {/* Left Narrative Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="label-mono">[ Welcome · Private Practice ]</div>
            
            {/* Editorial Headline with EchoText */}
            <div className="space-y-1">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1C1C1C] font-light leading-[1.08] tracking-tight">
                A safe, grounded space to
              </h1>
              <div className="py-1">
                <EchoText
                  text="Be Heard & Heal"
                  echoes={10}
                  lag={0.24}
                  offset={24}
                  direction="right"
                  fade={0.72}
                  blur={2.2}
                  echoColors={['#8E7B6D', '#C9BAAE']}
                  echoStyle="solid"
                  echoScale={1.04}
                  mode="both"
                  trail="auto"
                  clickBurst={true}
                  cursorRadius={420}
                  duration={1000}
                  ease="ease-out"
                  fontSize="clamp(2.5rem, 5.8vw, 4.2rem)"
                  fontWeight={400}
                  color="#8E7B6D"
                  className="font-serif italic tracking-tight select-none"
                />
              </div>
              <span className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1C1C] font-light italic block">
                and rebuild authentic connection.
              </span>
            </div>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[rgba(28,28,28,0.7)] leading-relaxed max-w-2xl font-light">
              Dr. Elena Vance combines deep clinical warmth with evidence-based psychology (ACT, EMDR, and Somatic Regulation) to help you unhook from anxiety, heal past injuries, and reconnect with your life.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenBooking}
                className="btn-editorial btn-editorial-primary"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book a Free Consultation</span>
              </button>

              <button
                onClick={() => onNavigate('about')}
                className="btn-editorial"
              >
                <span>Meet the Psychologist</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#8E7B6D]" />
              </button>

              <button
                onClick={onExploreSanctuary}
                className="px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-[#8E7B6D] hover:text-[#1C1C1C] transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3" />
                <span>3D Grounding Sanctuary</span>
              </button>
            </div>
          </div>

          {/* Right Column: Architectural Vignette (Variation 2) */}
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <div className="relative w-full sm:w-[320px] h-[380px] bg-[#E8E4DF] border border-[rgba(28,28,28,0.12)] p-6 flex flex-col justify-between overflow-hidden shadow-sm">
              <div className="flex justify-between items-start">
                <span className="label-mono text-[9px] text-[#1C1C1C]">Union Square Studio</span>
                <span className="font-mono text-[10px] text-[rgba(28,28,28,0.5)]">SF · CA</span>
              </div>

              {/* Minimalist Graphic Therapy Room Arch */}
              <div className="relative flex-1 flex items-center justify-center my-2">
                <svg className="w-48 h-48 opacity-80" viewBox="0 0 200 200" fill="none">
                  <path d="M 30 180 L 30 90 A 70 70 0 0 1 170 90 L 170 180 Z" stroke="#1C1C1C" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="100" cy="110" r="42" fill="#FFFFFF" fillOpacity="0.7" />
                  <path d="M 70 150 C 75 125, 125 125, 130 150" stroke="#8E7B6D" strokeWidth="2" />
                  <circle cx="100" cy="98" r="16" fill="#8E7B6D" fillOpacity="0.8" />
                  <line x1="30" y1="180" x2="170" y2="180" stroke="#1C1C1C" strokeWidth="1" />
                </svg>
              </div>

              <div className="flex items-end justify-between border-t border-[rgba(28,28,28,0.1)] pt-3">
                <div>
                  <span className="font-serif text-base font-semibold text-[#1C1C1C] block leading-none">
                    Dr. Elena Vance
                  </span>
                  <span className="label-mono text-[8px] text-[rgba(28,28,28,0.6)] mt-0.5 block">
                    Clinical Director · Psy.D.
                  </span>
                </div>
                <span className="label-mono text-[8px] text-[#8E7B6D]">Suite 1420</span>
              </div>
            </div>
          </div>

        </div>

        {/* Sharp Architectural Stat Grid (Variation 2) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-b border-[#1C1C1C] mt-16 divide-y lg:divide-y-0 lg:divide-x divide-[rgba(28,28,28,0.12)]">
          <div className="py-7 px-5 sm:px-8">
            <span className="label-mono block">Experience</span>
            <span className="font-serif text-3xl sm:text-4xl text-[#1C1C1C] font-light block my-1">
              14+ Years
            </span>
            <span className="label-mono text-[9px] text-[rgba(28,28,28,0.45)] block">
              Clinical Practice
            </span>
          </div>

          <div className="py-7 px-5 sm:px-8">
            <span className="label-mono block">Licensing</span>
            <span className="font-serif text-3xl sm:text-4xl text-[#1C1C1C] font-light block my-1">
              Psy.D.
            </span>
            <span className="label-mono text-[9px] text-[rgba(28,28,28,0.45)] block">
              CA #PSY32918
            </span>
          </div>

          <div className="py-7 px-5 sm:px-8">
            <span className="label-mono block">Dedicated</span>
            <span className="font-serif text-3xl sm:text-4xl text-[#1C1C1C] font-light block my-1">
              2,400+
            </span>
            <span className="label-mono text-[9px] text-[rgba(28,28,28,0.45)] block">
              Client Sessions
            </span>
          </div>

          <div className="py-7 px-5 sm:px-8">
            <span className="label-mono block">Satisfaction</span>
            <span className="font-serif text-3xl sm:text-4xl text-[#1C1C1C] font-light block my-1">
              4.9 / 5.0
            </span>
            <span className="label-mono text-[9px] text-[rgba(28,28,28,0.45)] block">
              Client Feedback
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
