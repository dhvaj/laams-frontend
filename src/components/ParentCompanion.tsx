import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Smile, Sparkles, Mic, MicOff, Volume2, VolumeX, 
  Send, X, BookOpen, Lightbulb, Zap
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';

interface Message {
  id: string;
  sender: 'student' | 'companion';
  text: string;
  timestamp: string;
  suggestedAction?: string | null;
}

interface ParentCompanionProps {
  lessonTitle: string;
  currentCardText?: string;
  profile?: string;
  onBrainBreakRequested?: () => void;
}

export const ParentCompanion: React.FC<ParentCompanionProps> = ({
  lessonTitle,
  currentCardText = '',
  profile = 'typical',
  onBrainBreakRequested
}) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [persona, setPersona] = useState<'mom' | 'dad' | 'buddy'>('mom');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [soundOutResult, setSoundOutResult] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Set default initial greeting when persona or open state changes
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = persona === 'mom'
        ? "Hey sweetie! I'm right here beside you. How is this lesson feeling? Need a fun story or want to ask anything?"
        : persona === 'dad'
          ? "Hey champ! Team LAAMS ready for action! What part of this card should we tackle together?"
          : "Hey friend! Study buddy reporting for duty! Let me know whenever you want a hint or a story!";
      
      setMessages([
        {
          id: 'initial-greeting',
          sender: 'companion',
          text: greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [persona]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Speech Synthesis
  const speakText = (text: string) => {
    if (!autoSpeak || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Pick suitable pitch based on persona
    if (persona === 'mom') {
      utterance.pitch = 1.2;
      utterance.rate = 0.95;
    } else if (persona === 'dad') {
      utterance.pitch = 0.85;
      utterance.rate = 0.95;
    } else {
      utterance.pitch = 1.0;
      utterance.rate = 1.0;
    }
    
    // Try to match active language
    const lang = i18n.language || 'en';
    utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-US';

    window.speechSynthesis.speak(utterance);
  };

  // Speech Recognition (Web Speech API)
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition isn't supported on this browser. You can type your question directly!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
      handleSendMessage(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'student',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await api.post('/api/companion/chat', {
        message: query,
        profile,
        persona,
        lessonContext: currentCardText || lessonTitle,
        history: messages.slice(-4),
        lang: i18n.language || 'en'
      });

      const replyText = res.data?.reply || "I'm right here with you! You are doing awesome.";
      const action = res.data?.suggestedAction;

      const companionMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'companion',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: action
      };

      setMessages(prev => [...prev, companionMsg]);
      speakText(replyText);

      if (action === 'brain_break' && onBrainBreakRequested) {
        onBrainBreakRequested();
      }
    } catch (err) {
      console.warn("Companion chat error:", err);
      const fallbackReply = persona === 'dad' 
        ? "No worries champ! Let's take a deep breath and keep going." 
        : "I'm right here sweetie, don't worry at all. You are doing fantastic!";
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'companion',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const requestStoryAnalogy = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('/api/companion/analogy', {
        concept: currentCardText || lessonTitle,
        profile,
        persona,
        lang: i18n.language || 'en'
      });

      const story = res.data?.analogy || "Think of it like building with Lego blocks!";
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'student',
          text: "Can you explain this with a story?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: (Date.now() + 1).toString(),
          sender: 'companion',
          text: `📖 Here's a story: ${story}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      speakText(story);
    } catch (err) {
      console.warn("Analogy error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const requestSoundOut = async (word: string) => {
    try {
      const res = await api.post('/api/companion/sound_out', {
        word,
        lang: i18n.language || 'en'
      });
      if (res.data?.phoneticDisplay) {
        setSoundOutResult(`${res.data.word} ➔ ${res.data.phoneticDisplay}`);
        speakText(res.data.speechPrompt || res.data.phoneticDisplay);
      }
    } catch (err) {
      console.warn("Sound out error:", err);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Expanded Companion Modal */}
      {isOpen && (
        <div 
          className="pointer-events-auto mb-4 w-96 max-w-[calc(100vw-2rem)] h-[520px] max-h-[80vh] bg-white dark:bg-slate-900 border-2 border-primary/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-up backdrop-blur-xl"
          role="dialog"
          aria-label="Parent Co-Learning Companion"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/15 via-indigo-500/10 to-purple-500/15 p-4 border-b border-primary/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md">
                {persona === 'mom' ? <Heart className="w-5 h-5 fill-white" /> : persona === 'dad' ? <Zap className="w-5 h-5 fill-white" /> : <Smile className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-bold text-sm theme-text flex items-center gap-1.5">
                  {persona === 'mom' ? "Mom's Co-Learning Hug" : persona === 'dad' ? "Dad's Adventure Coach" : "Study Buddy"}
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </h3>
                <p className="text-[11px] theme-text-muted">
                  {persona === 'mom' ? "Loving, patient & nurturing" : persona === 'dad' ? "Energetic & encouraging" : "Fun peer partner"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setAutoSpeak(!autoSpeak)}
                className={`p-1.5 rounded-xl border transition-colors ${autoSpeak ? 'bg-primary/10 border-primary text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                title={autoSpeak ? "Mute Voice" : "Enable Voice"}
                aria-label={autoSpeak ? "Voice output enabled" : "Voice output muted"}
              >
                {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 theme-text-muted"
                aria-label="Close Companion"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Persona Switcher Tabs */}
          <div className="flex bg-slate-50 dark:bg-slate-800/60 p-1.5 border-b theme-border gap-1">
            <button
              onClick={() => setPersona('mom')}
              className={`flex-1 py-1 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                persona === 'mom' ? 'bg-white dark:bg-slate-900 text-primary shadow-sm border theme-border' : 'theme-text-muted hover:text-primary'
              }`}
            >
              🌸 Mom Mode
            </button>
            <button
              onClick={() => setPersona('dad')}
              className={`flex-1 py-1 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                persona === 'dad' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border theme-border' : 'theme-text-muted hover:text-indigo-500'
              }`}
            >
              🚀 Dad Mode
            </button>
            <button
              onClick={() => setPersona('buddy')}
              className={`flex-1 py-1 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                persona === 'buddy' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border theme-border' : 'theme-text-muted hover:text-emerald-500'
              }`}
            >
              🤝 Buddy
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-sm">
            {messages.map(msg => (
              <div 
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'student' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl ${
                    msg.sender === 'student'
                      ? 'bg-primary text-white rounded-br-none shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800/90 theme-text rounded-bl-none border theme-border shadow-sm'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-[10px] theme-text-muted mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs theme-text-muted px-2 py-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></div>
                <span>{persona === 'mom' ? "Mom is thinking..." : persona === 'dad' ? "Dad is finding a cool way to explain..." : "Buddy is thinking..."}</span>
              </div>
            )}

            {soundOutResult && (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/50 rounded-2xl p-3 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
                <div>
                  <span className="font-bold">Sound It Out:</span> {soundOutResult}
                </div>
                <button 
                  onClick={() => setSoundOutResult(null)}
                  className="text-amber-600 hover:text-amber-800 font-bold ml-2"
                >
                  ✕
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Suggestion Pills */}
          <div className="p-2 border-t theme-border bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={requestStoryAnalogy}
              disabled={isLoading}
              className="whitespace-nowrap px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border theme-border text-xs font-semibold text-primary hover:bg-primary/5 flex items-center gap-1 transition-all shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5" /> Explain with Story
            </button>
            <button
              onClick={() => handleSendMessage("I'm feeling a little stuck, could you give me a gentle hint?")}
              disabled={isLoading}
              className="whitespace-nowrap px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border theme-border text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 flex items-center gap-1 transition-all shadow-xs"
            >
              <Lightbulb className="w-3.5 h-3.5" /> Give a Hint
            </button>
            {profile === 'dyslexic' && (
              <button
                onClick={() => {
                  const words = (currentCardText || '').split(/\s+/).filter(w => w.length > 6);
                  if (words.length > 0) requestSoundOut(words[0]);
                  else requestSoundOut("quadratic");
                }}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border theme-border text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 flex items-center gap-1 transition-all shadow-xs"
              >
                🗣️ Sound Out
              </button>
            )}
            <button
              onClick={() => handleSendMessage("I need a quick 30-second brain recharge break!")}
              disabled={isLoading}
              className="whitespace-nowrap px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border theme-border text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20 flex items-center gap-1 transition-all shadow-xs"
            >
              <Zap className="w-3.5 h-3.5" /> Brain Break
            </button>
          </div>

          {/* Input & Voice Row */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t theme-border flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2 rounded-xl transition-all ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-500/20' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary'
              }`}
              title={isListening ? "Listening... Speak now!" : "Click to speak with Mom/Dad"}
              aria-label="Voice input toggle"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isListening ? "Listening to you..." : persona === 'mom' ? "Ask Mom anything..." : persona === 'dad' ? "Ask Dad anything..." : "Chat with Buddy..."}
              className="flex-1 bg-slate-100 dark:bg-slate-800/80 border-none rounded-xl px-3.5 py-2 text-xs theme-text focus:outline-none focus:ring-2 focus:ring-primary/40"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2 rounded-xl bg-primary text-white disabled:opacity-40 hover:opacity-90 transition-all shadow-sm"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Companion Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-primary to-indigo-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Open Parental Co-Learning Companion"
      >
        <div className="relative">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            {persona === 'mom' ? (
              <Heart className="w-4 h-4 fill-white animate-pulse" />
            ) : persona === 'dad' ? (
              <Zap className="w-4 h-4 fill-white" />
            ) : (
              <Smile className="w-4 h-4" />
            )}
          </div>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full"></span>
        </div>
        
        <span className="font-bold text-xs tracking-wide">
          {persona === 'mom' ? "Mom's Co-Learning" : persona === 'dad' ? "Dad's Adventure" : "Study Buddy"}
        </span>

        <span className="hidden group-hover:inline-block bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-semibold">
          Ask Me!
        </span>
      </button>
    </div>
  );
};
