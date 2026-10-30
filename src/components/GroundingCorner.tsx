import React, { useState } from 'react';
import { Wind, BookOpen, Clock, ChevronRight, X, Sparkles, Heart } from 'lucide-react';
import { ZenGroundingScene } from './ZenGroundingScene';
import { RESOURCE_ARTICLES } from '../data/practiceData';
import { ResourceArticle } from '../types';
import EchoText from './EchoText/EchoText';

export const GroundingCorner: React.FC = () => {
  const [activeArticle, setActiveArticle] = useState<ResourceArticle | null>(null);

  return (
    <section id="sanctuary" className="py-20 lg:py-28 bg-[#FFFFFF] border-b border-[rgba(28,28,28,0.1)]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 space-y-20">
        
        {/* 1. Interactive 3D Mindful Grounding Sanctuary */}
        <div className="space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="label-mono">[ Somatic Grounding Sanctuary ]</span>

            <div className="py-2 flex flex-col items-start">
              <EchoText
                text="Breathe & Regulate"
                echoes={10}
                lag={0.22}
                offset={24}
                direction="right"
                fade={0.7}
                blur={3}
                echoColors={['#8E7B6D', '#B5A89B']}
                echoStyle="solid"
                echoScale={1.04}
                mode="both"
                trail="pointer"
                clickBurst={true}
                cursorRadius={300}
                duration={900}
                ease="ease-out"
                fontSize="clamp(2.4rem, 5vw, 4rem)"
                fontWeight={300}
                color="#1C1C1C"
                className="font-serif cursor-pointer font-light"
              />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[rgba(28,28,28,0.5)] mt-2">
                Interactive Mindful Motion · Move cursor or tap text
              </span>
            </div>

            <p className="text-[rgba(28,28,28,0.65)] text-sm sm:text-base leading-relaxed">
              Take 60 seconds right now. Synchronize your breathing cadence with the kinetic ring or gently rotate the natural balancing stones.
            </p>
          </div>

          {/* Three.js Procedural 3D Scene */}
          <div className="max-w-5xl">
            <ZenGroundingScene isHeroEmbedded={false} />
          </div>
        </div>

        {/* 2. Resources & Clinical Reflections */}
        <div id="resources" className="pt-12 border-t border-[rgba(28,28,28,0.1)] space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="label-mono">[ Clinical Essays & Guidance ]</span>
              <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#1C1C1C]">
                Compassionate insights for your nervous system.
              </h3>
            </div>
            <p className="text-xs text-[rgba(28,28,28,0.6)] max-w-sm">
              Authored by Dr. Elena Vance to help demystify psychological therapy and somatic regulation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[rgba(28,28,28,0.1)] border border-[rgba(28,28,28,0.1)]">
            {RESOURCE_ARTICLES.map((article, idx) => (
              <div
                key={article.id}
                onClick={() => setActiveArticle(article)}
                className="group p-8 bg-[#F8F7F4] hover:bg-white transition-colors duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="label-mono">
                      {article.category}
                    </span>
                    <span className="font-mono text-[10px] text-[rgba(28,28,28,0.5)] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#8E7B6D]" />
                      {article.readTime}
                    </span>
                  </div>

                  <h4 className="font-serif text-xl sm:text-2xl font-light text-[#1C1C1C] group-hover:text-[#8E7B6D] transition-colors leading-snug">
                    {article.title}
                  </h4>

                  <p className="text-xs text-[rgba(28,28,28,0.65)] leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-5 mt-6 border-t border-[rgba(28,28,28,0.08)] flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#1C1C1C] group-hover:text-[#8E7B6D]">
                  <span>Read Article</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Article Reader Modal */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white border border-[rgba(28,28,28,0.2)] p-8 sm:p-10 my-8 shadow-2xl animate-in fade-in duration-200">
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-6 right-6 p-2 text-[rgba(28,28,28,0.6)] hover:text-[#1C1C1C] transition-colors"
                aria-label="Close article modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="label-mono">{activeArticle.category}</span>
                    <span className="text-[rgba(28,28,28,0.3)]">·</span>
                    <span className="font-mono text-[10px] text-[rgba(28,28,28,0.5)]">{activeArticle.readTime}</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#1C1C1C]">
                    {activeArticle.title}
                  </h3>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#8E7B6D] mt-1">By Dr. Elena Vance, Psy.D.</p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-[rgba(28,28,28,0.8)] leading-relaxed">
                  {activeArticle.content.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                {/* Key takeaways box */}
                <div className="p-6 bg-[#F8F7F4] border border-[rgba(28,28,28,0.1)] space-y-3">
                  <span className="label-mono block">
                    Key Somatic & Clinical Takeaways
                  </span>
                  <ul className="space-y-2">
                    {activeArticle.keyTakeaways.map((takeaway, tIdx) => (
                      <li key={tIdx} className="text-xs text-[rgba(28,28,28,0.75)] flex items-start gap-2">
                        <span className="font-mono text-[#8E7B6D] text-[10px] mt-0.5">•</span>
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[rgba(28,28,28,0.1)] flex justify-end">
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="btn-editorial text-xs uppercase tracking-wider px-6 py-2.5"
                  >
                    Close Article
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
