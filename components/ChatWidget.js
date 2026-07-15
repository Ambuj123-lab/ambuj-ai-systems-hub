'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const QUICK_PROMPTS = [
  "What makes Ambuj stand out as an AI Engineer?",
  "Show production systems Ambuj has deployed",
  "Explain the LangGraph architecture",
  "What scale has Ambuj handled?",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState([{ 
    role: 'ai', 
    text: "Hi 👋 I'm **Ambuj AI** — an Agentic RAG assistant.\n\nAsk me about my **production AI systems**, architecture decisions, or tech stack. I retrieve answers from my resume, architecture docs & the web.",
    showQuickPrompts: true
  }]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const sessionIdRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = Math.random().toString(36).substring(2, 10);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
      return;
    }
    
    const initialShow = setTimeout(() => setShowTooltip(true), 3000);
    const initialHide = setTimeout(() => setShowTooltip(false), 9000);
    
    const interval = setInterval(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 6000);
    }, 30000);

    return () => {
      clearTimeout(initialShow);
      clearTimeout(initialHide);
      clearInterval(interval);
    };
  }, [isOpen]);

  const sendMessage = async (overrideText) => {
    const userMsg = (overrideText || inputText).trim();
    if (!userMsg) return;

    setMessages(prev => prev.map(m => ({ ...m, showQuickPrompts: false })));
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputText("");
    setIsTyping(true);

    try {
      const sessionId = sessionIdRef.current;
      const authRes = await fetch("/api/auth/dev-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: `guest_${sessionId}@portfolio.ai`, name: "Portfolio Guest" })
      });
      const authData = await authRes.json();
      const token = authData.access_token;

      if (!token) throw new Error("No token returned");

      const chatRes = await fetch("/api/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ question: userMsg })
      });
      const chatData = await chatRes.json();
      
      let answerText = chatData.answer || chatData.final_answer || "I processed your request!";
      answerText = answerText.replace(/Hi Dev User,?\s*/i, 'Hi, ');
      
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: answerText,
        confidence: chatData.confidence,
        sources: chatData.sources
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "⚡ My backend is warming up on Render (cold start ~30s). Please try again shortly!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-widget-wrapper">
      
      {/* Tooltip Bubble */}
      <AnimatePresence>
        {!isOpen && showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            transition={{ duration: 0.4, type: "spring" }}
            style={{
              position: 'absolute',
              bottom: '80px',
              right: '0',
              background: 'rgba(5, 5, 10, 0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(0, 240, 255, 0.4)',
              padding: '10px 18px',
              borderRadius: '14px',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: '600',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 240, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              pointerEvents: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            <motion.span 
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00f0ff', boxShadow: '0 0 10px #00f0ff' }}
            />
            ASK AMBUJ AI
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              boxShadow: [
                '0 15px 50px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 240, 255, 0.25)',
                '0 15px 50px rgba(0, 0, 0, 0.9), 0 0 20px rgba(138, 43, 226, 0.25)',
                '0 15px 50px rgba(0, 0, 0, 0.9), 0 0 20px rgba(255, 0, 128, 0.25)',
                '0 15px 50px rgba(0, 0, 0, 0.9), 0 0 20px rgba(255, 40, 60, 0.25)',
                '0 15px 50px rgba(0, 0, 0, 0.9), 0 0 20px rgba(181, 0, 255, 0.25)',
                '0 15px 50px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 240, 255, 0.25)'
              ],
              borderColor: [
                'rgba(0, 240, 255, 0.5)',
                'rgba(138, 43, 226, 0.5)',
                'rgba(255, 0, 128, 0.5)',
                'rgba(255, 40, 60, 0.5)',
                'rgba(181, 0, 255, 0.5)',
                'rgba(0, 240, 255, 0.5)'
              ]
            }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ 
              duration: 0.3,
              boxShadow: { repeat: Infinity, duration: 8, ease: "linear" },
              borderColor: { repeat: Infinity, duration: 8, ease: "linear" }
            }}
            style={{
              width: '420px',
              height: '580px',
              maxWidth: '92vw',
              maxHeight: '80vh',
              backgroundColor: '#0a0a0f',
              borderWidth: '1.5px',
              borderStyle: 'solid',
              borderRadius: '20px',
              overflow: 'hidden',
              marginBottom: '1rem',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header */}
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.95), rgba(20, 10, 30, 0.95))', 
              backdropFilter: 'blur(12px)', 
              padding: '16px 20px', 
              borderBottom: '1px solid rgba(255,255,255,0.06)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '36px', height: '36px', borderRadius: '10px', 
                  background: 'linear-gradient(135deg, #b500ff, #00f0ff)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', fontWeight: '800', color: '#000'
                }}>A</div>
                <div>
                  <div style={{ color: '#fff', fontWeight: '700', fontSize: '0.9rem', letterSpacing: '-0.3px' }}>
                    Ambuj AI
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff66', boxShadow: '0 0 8px #00ff66' }}></span>
                    <span style={{ color: '#71717a', fontSize: '0.7rem', fontWeight: '500' }}>Agentic RAG · Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#71717a', cursor: 'pointer', padding: '6px', display: 'flex', borderRadius: '8px', transition: 'all 0.2s' }}
                aria-label="Close Chat"
                onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.color = '#71717a'; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.15) transparent' }}>
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.3 }}
                  style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}
                >
                  <div style={{ 
                    background: msg.role === 'user' 
                      ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(181, 0, 255, 0.1))' 
                      : 'rgba(255, 255, 255, 0.04)', 
                    color: msg.role === 'user' ? '#00f0ff' : '#e4e4e7',
                    padding: '12px 16px',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    fontSize: '0.85rem',
                    lineHeight: '1.6',
                    border: msg.role === 'user' ? '1px solid rgba(0, 240, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.06)'
                  }}>
                    {msg.role === 'user' ? msg.text : (
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({node, ...props}) => <h1 style={{ color: '#00f0ff', fontSize: '1rem', fontWeight: 700, margin: '0.5em 0 0.3em 0' }} {...props} />,
                          h2: ({node, ...props}) => <h2 style={{ color: '#00f0ff', fontSize: '0.95rem', fontWeight: 700, margin: '0.5em 0 0.3em 0' }} {...props} />,
                          h3: ({node, ...props}) => <h3 style={{ color: '#00f0ff', fontSize: '0.9rem', fontWeight: 700, margin: '0.4em 0 0.2em 0' }} {...props} />,
                          p: ({node, ...props}) => <p style={{ margin: '0 0 0.5em 0', color: '#e4e4e7' }} {...props} />,
                          strong: ({node, ...props}) => <strong style={{ color: '#ffffff', fontWeight: 700 }} {...props} />,
                          ul: ({node, ...props}) => <ul style={{ margin: '0 0 0.5em 0.5em', padding: 0, listStyle: 'none' }} {...props} />,
                          ol: ({node, ...props}) => <ol style={{ margin: '0 0 0.5em 1em', padding: 0, color: '#00f0ff' }} {...props} />,
                          li: ({node, ...props}) => <li style={{ marginBottom: '0.3em', paddingLeft: '0.8em', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: '#00ff66' }}>•</span><span style={{ color: '#e4e4e7' }} {...props} /></li>,
                          code: ({node, inline, ...props}) => inline 
                            ? <code style={{ background: 'rgba(181,0,255,0.15)', color: '#e48bff', padding: '0.1em 0.4em', borderRadius: '4px', fontSize: '0.8em' }} {...props} />
                            : <code style={{ display: 'block', background: 'rgba(0,0,0,0.4)', color: '#00f0ff', padding: '0.5em', borderRadius: '6px', fontSize: '0.8em', overflowX: 'auto', margin: '0.3em 0' }} {...props} />,
                          a: ({node, ...props}) => <a style={{ color: '#00f0ff', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer" {...props} />,
                          table: ({node, ...props}) => <table style={{ borderCollapse: 'collapse', width: '100%', margin: '0.5em 0', fontSize: '0.8em' }} {...props} />,
                          th: ({node, ...props}) => <th style={{ background: 'rgba(0,240,255,0.15)', color: '#00f0ff', padding: '0.4em 0.6em', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', fontWeight: 600 }} {...props} />,
                          td: ({node, ...props}) => <td style={{ padding: '0.4em 0.6em', border: '1px solid rgba(255,255,255,0.08)', color: '#e4e4e7' }} {...props} />
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    )}
                  </div>

                  {/* Quick Prompt Suggestions */}
                  {msg.showQuickPrompts && (
                    <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {QUICK_PROMPTS.map((prompt, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => sendMessage(prompt)}
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '10px',
                            padding: '8px 14px',
                            color: '#a1a1aa',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => { e.target.style.borderColor = 'rgba(0,240,255,0.3)'; e.target.style.color = '#00f0ff'; }}
                          onMouseLeave={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.color = '#a1a1aa'; }}
                        >
                          <span style={{ color: '#00f0ff', fontSize: '0.7rem' }}>→</span> {prompt}
                        </motion.button>
                      ))}
                    </div>
                  )}
                  
                  {/* Confidence Score */}
                  {msg.role === 'ai' && msg.confidence !== undefined && msg.confidence > 0 && (
                    <div style={{ 
                      fontSize: '0.7rem', 
                      marginTop: '0.5rem', 
                      fontWeight: 600, 
                      marginLeft: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <div style={{ 
                        width: '40px', height: '4px', borderRadius: '2px', 
                        background: 'rgba(255,255,255,0.1)', overflow: 'hidden' 
                      }}>
                        <div style={{ 
                          width: `${msg.confidence}%`, height: '100%', borderRadius: '2px',
                          background: msg.confidence < 45 ? '#ff283c' : msg.confidence < 70 ? '#ffaa00' : '#00ff66'
                        }} />
                      </div>
                      <span style={{ color: msg.confidence < 45 ? '#ff283c' : msg.confidence < 70 ? '#ffaa00' : '#00ff66' }}>
                        {msg.confidence < 45 ? '⚠️ Low Confidence' : `⚡ ${msg.confidence}% Confidence`}
                      </span>
                    </div>
                  )}
                  
                  {/* Source Citations */}
                  {msg.role === 'ai' && msg.sources && msg.sources.length > 0 && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center', marginLeft: '4px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#71717a', fontWeight: 600 }}>📎 Sources:</span>
                      {msg.sources.map((src, idx) => {
                         let link = '#';
                         if (src.toLowerCase().startsWith('http')) link = src;
                         else if (src.toLowerCase().includes('resume')) link = '/resume.pdf';
                         else if (src.toLowerCase().includes('architecture')) link = 'https://github.com/Ambuj123-lab/agentic-rag-financial-parser';
                         else if (src.toLowerCase().includes('legal') || src.toLowerCase().includes('whatsapp')) link = 'https://ambuj-rag-docs.netlify.app/';
                         return (
                           <a key={idx} href={link} target="_blank" rel="noopener noreferrer" style={{
                             fontSize: '0.68rem', padding: '0.15rem 0.5rem', 
                             background: 'rgba(181, 0, 255, 0.1)', color: '#e48bff', 
                             borderRadius: '6px', textDecoration: 'none', 
                             border: '1px solid rgba(181,0,255,0.2)', 
                             maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                             transition: 'all 0.2s'
                           }}
                           onMouseEnter={(e) => { e.target.style.background = 'rgba(181,0,255,0.25)'; e.target.style.borderColor = 'rgba(181,0,255,0.5)'; }}
                           onMouseLeave={(e) => { e.target.style.background = 'rgba(181,0,255,0.1)'; e.target.style.borderColor = 'rgba(181,0,255,0.2)'; }}
                           >
                             {src}
                           </a>
                         );
                      })}
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ alignSelf: 'flex-start', background: 'rgba(255, 255, 255, 0.04)', padding: '12px 18px', borderRadius: '18px 18px 18px 4px', border: '1px solid rgba(255, 255, 255, 0.06)' }}
                >
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'center', height: '12px' }}>
                    <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} style={{ width: '7px', height: '7px', background: '#00f0ff', borderRadius: '50%', opacity: 0.8 }} />
                    <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.15 }} style={{ width: '7px', height: '7px', background: '#b500ff', borderRadius: '50%', opacity: 0.8 }} />
                    <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.3 }} style={{ width: '7px', height: '7px', background: '#ff0080', borderRadius: '50%', opacity: 0.8 }} />
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: '0.8rem 1rem', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(5, 5, 10, 0.95)' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about AI, RAG, or my projects..."
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '14px',
                    padding: '10px 16px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.85rem',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(0,240,255,0.4)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                <motion.button 
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => sendMessage()}
                  disabled={!inputText.trim() || isTyping}
                  style={{
                    background: (!inputText.trim() || isTyping) ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #b500ff, #00f0ff)',
                    border: 'none',
                    borderRadius: '12px',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: (!inputText.trim() || isTyping) ? 'not-allowed' : 'pointer',
                    color: '#fff',
                    flexShrink: 0
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </motion.button>
              </div>
              <div style={{ textAlign: 'center', marginTop: '6px', fontSize: '0.62rem', color: '#3f3f46', letterSpacing: '0.5px' }}>
                Powered by LangGraph · Pinecone · Qwen
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* The Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            '0 8px 30px rgba(0, 0, 0, 0.9), 0 0 15px rgba(0, 240, 255, 0.6)',
            '0 8px 30px rgba(0, 0, 0, 0.9), 0 0 15px rgba(138, 43, 226, 0.6)',
            '0 8px 30px rgba(0, 0, 0, 0.9), 0 0 15px rgba(255, 0, 128, 0.6)',
            '0 8px 30px rgba(0, 0, 0, 0.9), 0 0 15px rgba(255, 40, 60, 0.6)',
            '0 8px 30px rgba(0, 0, 0, 0.9), 0 0 15px rgba(181, 0, 255, 0.6)',
            '0 8px 30px rgba(0, 0, 0, 0.9), 0 0 15px rgba(0, 240, 255, 0.6)'
          ],
          borderColor: [
            'rgba(0, 240, 255, 0.8)',
            'rgba(138, 43, 226, 0.8)',
            'rgba(255, 0, 128, 0.8)',
            'rgba(255, 40, 60, 0.8)',
            'rgba(181, 0, 255, 0.8)',
            'rgba(0, 240, 255, 0.8)'
          ]
        }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: '#000000',
          borderWidth: '1.5px',
          borderStyle: 'solid',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000
        }}
      >
        {!isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        )}
      </motion.button>
    </div>
  );
}
