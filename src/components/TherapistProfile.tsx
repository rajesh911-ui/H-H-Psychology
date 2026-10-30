import React from 'react';
import { Award, BookOpen, GraduationCap, ShieldCheck, Heart, Sparkles, CheckCircle, Coffee, Check } from 'lucide-react';
import { PRACTICE_INFO } from '../data/practiceData';

interface TherapistProfileProps {
  onOpenBooking: () => void;
}

export const TherapistProfile: React.FC<TherapistProfileProps> = ({ onOpenBooking }) => {
  const credentials = [
    { title: 'Doctor of Psychology (Psy.D.)', detail: 'Pepperdine University Graduate School of Education & Psychology' },
    { title: 'Bachelor of Arts in Psychology & Human Biology', detail: 'Stanford University (With Honors)' },
    { title: 'Postdoctoral Clinical Fellowship', detail: 'University of California, San Francisco (UCSF) Medical Center' },
    { title: 'California Licensed Psychologist', detail: 'License #PSY32918 (Active & In Good Standing)' },
    { title: 'Certified EMDR Clinician', detail: 'EMDR International Association (EMDRIA)' },
    { title: 'Level 2 Clinical Training', detail: 'The Gottman Institute for Couples Therapy' },
  ];

  const approaches = [
    {
      name: 'Acceptance & Commitment (ACT)',
      desc: 'Developing psychological flexibility so anxiety no longer dictates your life choices.'
    },
    {
      name: 'Trauma & Somatic EMDR',
      desc: 'Reprocessing deep-seated distressing memories using bilateral nervous system stimulation.'
    },
    {
      name: 'Compassion-Focused Therapy (CFT)',
      desc: 'Transforming relentless inner criticism and shame into an internal ally of fierce self-kindness.'
    },
    {
      name: 'Polyvagal Nervous System Regulation',
      desc: 'Translating body sensations (tightness, panic, freeze) into understandable safety cues.'
    }
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-[#FFFFFF] border-b border-[rgba(28,28,28,0.1)]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Top Tag */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="label-mono">[ Meet the Clinician ]</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#1C1C1C] tracking-tight">
            &ldquo;Therapy is not about fixing what is broken. It is about remembering who you are.&rdquo;
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Portrait & Studio Vignette */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-3xl overflow-hidden bg-white p-3 border border-[#A8B5A2]/30 shadow-xl">
              <div className="relative h-[480px] rounded-2xl overflow-hidden bg-gradient-to-t from-[#36423A] via-[#7B8B79] to-[#D5DFD3] flex flex-col justify-end p-7">
                
                {/* Artistic representation of Dr. Elena Vance in natural therapy light */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,_var(--tw-gradient-stops))] from-amber-50/20 via-transparent to-black/40" />
                
                {/* Dr. Vance Illustrated Portrait Silhouette & Botanical Framing */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 480" preserveAspectRatio="xMidYMid slice">
                  {/* Soft background arch */}
                  <path d="M 50 480 L 50 160 A 140 140 0 0 1 330 160 L 330 480 Z" fill="#F4EFE6" opacity="0.35" />
                  
                  {/* Plant leaves frame */}
                  <path d="M 0 300 Q 80 260 70 180 Q 120 220 100 320" stroke="#8E9E8A" strokeWidth="4" fill="none" opacity="0.7" />
                  <path d="M 380 320 Q 300 270 320 190 Q 270 230 290 330" stroke="#8E9E8A" strokeWidth="4" fill="none" opacity="0.7" />

                  {/* Stylized Doctor portrait silhouette */}
                  {/* Head & shoulders */}
                  <circle cx="190" cy="190" r="55" fill="#E8D5C4" />
                  {/* Soft hairstyle */}
                  <path d="M 130 190 C 130 110, 250 110, 250 190 C 250 195, 245 225, 235 235 C 220 185, 160 185, 145 235 Z" fill="#4A3B32" />
                  <ellipse cx="190" cy="225" rx="20" ry="16" fill="#E8D5C4" />
                  {/* Eyes / calm expression */}
                  <path d="M 172 195 Q 180 192 184 195" stroke="#382B24" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 196 195 Q 200 192 208 195" stroke="#382B24" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  {/* Gentle warm smile */}
                  <path d="M 183 218 Q 190 224 197 218" stroke="#8C5345" strokeWidth="2" fill="none" strokeLinecap="round" />
                  {/* Warm linen knit sweater */}
                  <path d="M 90 480 C 100 300, 140 270, 190 270 C 240 270, 280 300, 290 480 Z" fill="#FDFBF7" opacity="0.95" />
                  {/* Warm terracotta scarf */}
                  <path d="M 160 270 C 175 300, 180 350, 180 390 L 195 390 C 200 340, 205 300, 220 270 Z" fill="#D29985" opacity="0.9" />
                </svg>

                <div className="relative z-10 text-white space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-[#E8D5C4] font-medium">Founder & Clinical Director</span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-semibold leading-tight">
                    Dr. Elena Vance, Psy.D.
                  </h3>
                  <p className="text-xs text-white/90">
                    Licensed Clinical Psychologist · California License #PSY32918
                  </p>
                </div>
              </div>

              {/* Personal values strip */}
              <div className="p-4 grid grid-cols-2 gap-3 text-xs text-[#606060] bg-white">
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-[#5B6A56]" />
                  <span>Warm, unhurried presence</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#5B6A56]" />
                  <span>Trauma-informed safety</span>
                </div>
              </div>
            </div>

            {/* Quick Consultation Callout */}
            <div className="p-6 bg-[#F8F7F4] border border-[rgba(28,28,28,0.1)] space-y-3">
              <span className="label-mono">[ Therapeutic Fit ]</span>
              <h4 className="font-serif text-xl font-light text-[#1C1C1C]">
                Curious if we are the right fit?
              </h4>
              <p className="text-xs text-[rgba(28,28,28,0.6)] leading-relaxed">
                The therapeutic relationship is the single greatest predictor of success. That is why I invite every prospective client to a complimentary 15-minute discovery consultation first.
              </p>
              <button
                onClick={onOpenBooking}
                className="w-full btn-editorial-primary text-center justify-center py-2.5 text-xs uppercase tracking-wider"
              >
                Schedule Free 15-Min Call →
              </button>
            </div>
          </div>

          {/* Right Column: Personal Story, Clinical Philosophy & Credentials */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Story */}
            <div className="space-y-4">
              <span className="label-mono">[ Clinical Perspective ]</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#1C1C1C]">
                A Message From Dr. Vance
              </h3>
              <p className="text-[rgba(28,28,28,0.7)] text-sm sm:text-base leading-relaxed">
                Throughout my 14 years of clinical practice in California, I have worked with hundreds of remarkable people: tech leaders, physicians, creative artists, teachers, parents, and couples who looked completely put-together on the outside, yet felt quietly overwhelmed or disconnected inside.
              </p>
              <p className="text-[rgba(28,28,28,0.7)] text-sm sm:text-base leading-relaxed">
                So many clients tell me they hesitated to start therapy because they feared feeling judged, having to relive childhood memories before they were ready, or being reduced to a diagnosis.
              </p>
              <p className="text-[rgba(28,28,28,0.7)] text-sm sm:text-base leading-relaxed">
                My approach is rooted in profound equality and compassion. When you enter my office (or our virtual room), you are in a sanctuary where your defense mechanisms are recognized as intelligent ways you learned to survive—and where we gently collaborate to help you discover newer, lighter ways of living.
              </p>
            </div>

            {/* Therapeutic Approach Breakdown */}
            <div className="space-y-4 pt-6 border-t border-[rgba(28,28,28,0.1)]">
              <span className="label-mono">[ Modalities ]</span>
              <h3 className="font-serif text-2xl font-light text-[#1C1C1C]">
                Therapeutic Approaches Grounded in Science
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {approaches.map((app, i) => (
                  <div key={i} className="p-5 bg-[#F8F7F4] border border-[rgba(28,28,28,0.1)] space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-[#8E7B6D]">0{i + 1}</span>
                      <h4 className="text-xs font-semibold text-[#1C1C1C] uppercase tracking-wide">{app.name}</h4>
                    </div>
                    <p className="text-xs text-[rgba(28,28,28,0.65)] leading-relaxed">{app.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education & Credentials */}
            <div className="space-y-4 pt-6 border-t border-[rgba(28,28,28,0.1)]">
              <span className="label-mono">[ Rigor & Accreditation ]</span>
              <h3 className="font-serif text-2xl font-light text-[#1C1C1C]">
                Education, Fellowships & Board Licenses
              </h3>
              <div className="space-y-2.5">
                {credentials.map((cred, i) => (
                  <div key={i} className="p-3.5 bg-white border border-[rgba(28,28,28,0.08)] flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#F8F7F4] border border-[rgba(28,28,28,0.1)] text-[#1C1C1C] flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono">
                      0{i + 1}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#1C1C1C]">{cred.title}</div>
                      <div className="text-xs text-[rgba(28,28,28,0.6)] mt-0.5">{cred.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
