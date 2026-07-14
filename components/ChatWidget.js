'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState([{ role: 'ai', text: "Hi 👋 I'm Ambuj AI. Ask me about my Agentic RAG Systems, Projects, or Architecture." }]);
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
    
    // Initial tooltip popup
    const initialShow = setTimeout(() => setShowTooltip(true), 3000);
    const initialHide = setTimeout(() => setShowTooltip(false), 9000);
    
    // Every 30 seconds
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

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputText("");
    setIsTyping(true);

    try {
      // 1. Get Dev Token (Guest) - Using persistent session ID for multi-turn chat (Current Session Memory)
      const sessionId = sessionIdRef.current;
      const authRes = await fetch("/api/auth/dev-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: `guest_${sessionId}@portfolio.ai`, name: "Portfolio Guest" })
      });
      const authData = await authRes.json();
      const token = authData.access_token;

      if (!token) throw new Error("No token returned");

      // 2. Call Chat API
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
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, my backend is currently sleeping on Render (cold start). Try again in 30 seconds!" }]);
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
              background: 'rgba(5, 5, 10, 0.85)',
              backdropFilter: 'blur(10px)',
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
              width: '400px',
              height: '550px',
              maxWidth: '90vw',
              maxHeight: '80vh',
              backgroundColor: '#000000',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderRadius: '20px',
              overflow: 'hidden',
              marginBottom: '1rem',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header */}
            <div style={{ background: 'rgba(10, 10, 15, 0.8)', backdropFilter: 'blur(10px)', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff66', boxShadow: '0 0 10px #00ff66' }}></span>
                Agentic Financial Parser
              </span>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: '4px', display: 'flex' }}
                aria-label="Close Chat"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                  <div style={{ 
                    background: msg.role === 'user' ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)', 
                    color: msg.role === 'user' ? '#00f0ff' : '#e4e4e7',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    border: msg.role === 'user' ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)'
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
                  
                  {msg.role === 'ai' && msg.confidence !== undefined && msg.confidence > 0 && (
                    <div style={{fontSize: '0.7rem', color: msg.confidence < 45 ? '#ff283c' : '#b500ff', marginTop: '0.5rem', fontWeight: 600, marginLeft: '4px'}}>
                      {msg.confidence < 45 ? '⚠️ LOW CONFIDENCE ALERT' : '⚡ CONFIDENCE: ' + msg.confidence + '%'}
                    </div>
                  )}
                  
                  {msg.role === 'ai' && msg.sources && msg.sources.length > 0 && (
                    <div style={{marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center', marginLeft: '4px'}}>
                      <span style={{fontSize: '0.7rem', color: '#a1a1aa', fontWeight: 600}}>Sources:</span>
                      {msg.sources.map((src, idx) => {
                         let link = '#';
                         if (src.toLowerCase().startsWith('http')) link = src;
                         else if (src.toLowerCase().includes('resume')) link = '/resume.pdf';
                         else if (src.toLowerCase().includes('architecture')) link = 'https://github.com/Ambuj123-lab/agentic-rag-financial-parser';
                         else if (src.toLowerCase().includes('legal') || src.toLowerCase().includes('whatsapp')) link = 'https://ambuj-rag-docs.netlify.app/';
                         return (
                           <a key={idx} href={link} target="_blank" rel="noopener noreferrer" style={{fontSize: '0.7rem', padding: '0.1rem 0.4rem', background: 'rgba(181, 0, 255, 0.15)', color: '#e48bff', borderRadius: '4px', textDecoration: 'none', border: '1px solid rgba(181,0,255,0.3)', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                             {src}
                           </a>
                         );
                      })}
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div style={{ alignSelf: 'flex-start', background: 'rgba(255, 255, 255, 0.05)', padding: '10px 14px', borderRadius: '16px 16px 16px 0', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '10px' }}>
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} style={{ width: '6px', height: '6px', background: '#00f0ff', borderRadius: '50%' }} />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} style={{ width: '6px', height: '6px', background: '#00f0ff', borderRadius: '50%' }} />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} style={{ width: '6px', height: '6px', background: '#00f0ff', borderRadius: '50%' }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(10, 10, 15, 0.95)' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about AI, RAG, or my projects..."
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.85rem'
                  }}
                />
                <button 
                  onClick={sendMessage}
                  disabled={!inputText.trim() || isTyping}
                  style={{
                    background: (!inputText.trim() || isTyping) ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #b500ff, #00f0ff)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: (!inputText.trim() || isTyping) ? 'not-allowed' : 'pointer',
                    color: '#fff'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
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
          borderWidth: '1px',
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
