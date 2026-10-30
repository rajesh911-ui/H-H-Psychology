import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, AlertCircle, Calendar, Bot, User, Volume2, VolumeX } from 'lucide-react';
import { ChatMessage } from '../types';

interface AiChatAssistantProps {
  onOpenBooking: () => void;
}

export const AiChatAssistant: React.FC<AiChatAssistantProps> = ({ onOpenBooking }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello, and welcome. I'm Haven, Dr. Elena Vance's practice assistant. Whether you're curious about our therapeutic approaches (like ACT, EMDR, or somatic work), session fees, or what your first conversation might look like, I am here to help you navigate with ease.",
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages, loading]);

  const quickPrompts = [
    'How does the free 15-min discovery call work?',
    'What is the difference between ACT and CBT?',
    'How does out-of-network insurance reimbursement work?',
    'I feel overwhelmed by anxiety and perfectionism—can you help?',
    'What should I expect in my first therapy session?'
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          messages: newHistory.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();
      const replyContent = data.reply || "Thank you for reaching out. Dr. Vance would be happy to discuss your goals during a free 15-minute consultation.";

      const assistantMessage: ChatMessage = {
        id: 'ast-' + Date.now(),
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCrisis: data.isCrisis
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          role: 'assistant',
          content: "I'm having a brief connection pause, but Dr. Vance's team is always glad to assist. Feel free to book a free 15-minute discovery call or email hello@havenandhearthpsych.com.",
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Optional calm client speech synthesis
  const toggleSpeech = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[#*•]/g, ''));
    utterance.rate = 0.92;
    utterance.pitch = 0.98;
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);
    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right with soft soothing presence) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
          {/* Gentle teaser pill */}
          <div 
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-white/95 text-[#2C2C2C] px-3.5 py-2 rounded-full border border-[#A8B5A2]/30 shadow-md cursor-pointer hover:border-[#A8B5A2] transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5B6A56]" />
            <span className="text-xs font-medium">Questions about therapy? Ask Haven</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Practice Assistant"
            className="relative group p-4 rounded-full bg-[#5B6A56] text-white shadow-lg hover:bg-[#4E5C49] transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-hidden focus:ring-3 focus:ring-[#A8B5A2]/50"
          >
            {/* Soft decorative aura ring */}
            <span className="absolute -inset-1 rounded-full bg-[#A8B5A2]/25 animate-ping opacity-60 pointer-events-none" />
            <MessageCircle className="w-6 h-6 relative z-10" />
          </button>
        </div>
      )}

      {/* Slide-Up / Expandable Chat Drawer */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[440px] h-full sm:h-[640px] z-50 flex flex-col bg-[#F9F6F1] sm:rounded-3xl border border-[#A8B5A2]/40 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="px-5 py-4 bg-white border-b border-[#A8B5A2]/25 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EDF2EB] border border-[#A8B5A2]/40 flex items-center justify-center text-[#5B6A56]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg font-semibold text-[#2C2C2C] leading-none">Haven</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#EDF2EB] text-[#5B6A56] text-[10px] font-medium border border-[#A8B5A2]/30">
                    Practice Concierge
                  </span>
                </div>
                <p className="text-xs text-[#606060] mt-0.5">Haven & Hearth Psychology</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenBooking();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EDF2EB] hover:bg-[#E2EBE0] text-[#5B6A56] text-xs font-medium transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Call</span>
              </button>
              <button
                onClick={() => {
                  if (speakingMsgId) {
                    window.speechSynthesis?.cancel();
                    setSpeakingMsgId(null);
                  }
                  setIsOpen(false);
                }}
                className="p-2 rounded-xl text-[#606060] hover:text-[#2C2C2C] hover:bg-[#F9F6F1] transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mandatory Clear Crisis Disclaimer */}
          <div className="px-4 py-2.5 bg-[#FFF9F2] border-b border-[#E8D5C4]/60 flex items-start gap-2.5 text-xs text-[#606060]">
            <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Haven provides general practice information and scheduling guidance. <strong className="font-semibold text-[#2C2C2C]">Not a licensed therapist or crisis service.</strong> In an emergency, please call <strong className="font-semibold text-[#2C2C2C]">988</strong> or <strong className="font-semibold text-[#2C2C2C]">911</strong>.
            </p>
          </div>

          {/* Chat Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 rounded-xl bg-[#EDF2EB] border border-[#A8B5A2]/30 flex items-center justify-center text-[#5B6A56] shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                    isAssistant
                      ? msg.isCrisis
                        ? 'bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B]'
                        : 'bg-white border border-[#A8B5A2]/25 text-[#2C2C2C] shadow-xs'
                      : 'bg-[#5B6A56] text-white'
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    <div className={`mt-2 flex items-center justify-between text-[10px] ${
                      isAssistant ? 'text-[#8C8C8C]' : 'text-white/80'
                    }`}>
                      <span>{msg.timestamp}</span>
                      {isAssistant && (
                        <button
                          onClick={() => toggleSpeech(msg.id, msg.content)}
                          className="hover:text-[#2C2C2C] p-1 flex items-center gap-1 transition-colors"
                          title="Listen with calm voice"
                        >
                          {speakingMsgId === msg.id ? (
                            <VolumeX className="w-3.5 h-3.5 text-[#5B6A56]" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {!isAssistant && (
                    <div className="w-7 h-7 rounded-xl bg-[#E8D5C4] flex items-center justify-center text-[#2C2C2C] shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-[#606060] py-2 px-3 bg-white/70 rounded-xl border border-[#A8B5A2]/20 w-fit">
                <span className="w-2 h-2 rounded-full bg-[#5B6A56] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#5B6A56] animate-bounce [animation-delay:0.15s]" />
                <span className="w-2 h-2 rounded-full bg-[#5B6A56] animate-bounce [animation-delay:0.3s]" />
                <span className="ml-1 text-[11px]">Haven is reflecting...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="px-4 py-2 border-t border-[#A8B5A2]/20 bg-white/50 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="text-xs px-2.5 py-1.5 rounded-full bg-white hover:bg-[#EDF2EB] text-[#2C2C2C] border border-[#A8B5A2]/30 transition-colors shadow-2xs shrink-0 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3.5 bg-white border-t border-[#A8B5A2]/25">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about modalities, fees, or scheduling..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#F9F6F1] border border-[#A8B5A2]/40 text-sm text-[#2C2C2C] placeholder:text-[#8C8C8C] focus:outline-hidden focus:ring-2 focus:ring-[#5B6A56] focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl bg-[#5B6A56] text-white hover:bg-[#4E5C49] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
