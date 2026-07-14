'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import ChatWidget from '../components/ChatWidget';

function AnimatedCounter({ from = 0, to, duration = 2.5, decimals = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  const count = useMotionValue(from);
  
  const rounded = useTransform(count, (latest) => {
    return parseFloat(latest).toFixed(decimals);
  });
  
  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, { duration, ease: "easeOut" });
      return controls.stop;
    }
  }, [count, to, duration, isInView]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  show: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};

const TECH_STACK = [
  'Gemini', 'Claude', 'Qwen', 'DeepSeek', 'LangGraph', 'LangFuse',
  'Redis', 'FastAPI', 'Docker', 'Render', 'Pinecone', 'Qdrant',
  'OpenRouter', 'Google Cloud', 'Supabase', 'React', 'Next.js', 'MongoDB'
];

export default function Home() {
  const [uptimeData, setUptimeData] = useState(null);

  // Fetch UptimeRobot Data via server-side proxy (bypasses CORS)
  useEffect(() => {
    const fetchUptime = async () => {
      try {
        const res = await fetch('/api/uptime');
        if (res.ok) {
          const data = await res.json();
          setUptimeData(data);
        }
      } catch (e) {
        console.error('Uptime fetch failed:', e);
      }
    };
    fetchUptime();
    const interval = setInterval(fetchUptime, 60000);
    return () => clearInterval(interval);
  }, []);

  const services = uptimeData?.services ? Object.entries(uptimeData.services) : [];
  const avgUptime = uptimeData?.average || 99.7;

  return (
    <>
      <div className="bg-noise"></div>
      
      <div className="portfolio-container">

      {/* Header */}
      <header className="header">
        <div className="header-logo">AMBUJ<span>.AI</span></div>
        <div className="header-badge">
          <span className="badge-dot" />
          Open to Roles
        </div>
      </header>

      {/* Bento Grid */}
      <motion.div 
        className="bento-grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >

        {/* ═══ HERO CARD ═══ */}
        <motion.div variants={itemVariants} className="bento-card card-hero">
          <div className="hero-photo-wrapper">
            <img src="/og-image.jpeg" alt="Ambuj Kumar Tripathi" className="hero-photo" />
          </div>
          <h1 className="hero-name">Ambuj Kumar<br/>Tripathi</h1>
          <p className="hero-title" style={{ marginBottom: '8px' }}>AI Engineer & RAG Systems Architect</p>
          <p className="hero-typewriter" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', maxWidth: '90%' }}>
            GenAI Engineer | Conversational AI | Agentic RAG Systems | LLM Fine-Tuning | LLMOps
          </p>
          <div className="hero-socials">
            <a href="https://www.linkedin.com/in/ambuj-tripathi-042b4a118/" target="_blank" rel="noreferrer" title="LinkedIn">in</a>
            <a href="https://github.com/Ambuj123-lab" target="_blank" rel="noreferrer" title="GitHub">GH</a>
            <a href="https://x.com/Ambuj_KTripathi" target="_blank" rel="noreferrer" title="X / Twitter">𝕏</a>
            <a href="https://medium.com/@ambuj_tripathi" target="_blank" rel="noreferrer" title="Medium">M</a>
            <a href="https://huggingface.co/invincibleambuj" target="_blank" rel="noreferrer" title="HuggingFace">🤗</a>
          </div>
          <div className="hero-actions">
            <a href="/resume.pdf" target="_blank" className="btn-resume">📄 Resume</a>
            <a href="https://ambuj-rag-docs.netlify.app/" target="_blank" rel="noreferrer" className="btn-docs">📚 Docs</a>
            <a href="https://ambuj-ai-portfolio.vercel.app" target="_blank" rel="noreferrer" className="btn-docs">🌐 Full Portfolio</a>
          </div>
          
          {/* ═══ PORTFOLIO LIVE UPTIME (AUTO-FLIP) ═══ */}
          <div style={{ marginTop: '1.5rem' }}>
            {services.length > 0 && services.find(s => s[0] === 'Portfolio') ? (() => {
              const [name, data] = services.find(s => s[0] === 'Portfolio');
              return (
                <a href="https://stats.uptimerobot.com/4tYmSQnuBE" target="_blank" rel="noreferrer" className="status-badge-container" style={{ textDecoration: 'none', color: 'inherit', perspective: '1000px', width: '165px', height: '36px', display: 'block' }}>
                  <div className="status-badge-inner auto-flip" style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', borderRadius: '40px', background: 'rgba(0, 0, 0, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)', cursor: 'pointer' }}>
                    {/* FRONT */}
                    <div className="status-badge-front" style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: data.status === 'Down' ? '#ff3366' : '#ff3366' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff3366', boxShadow: '0 0 16px #ff3366, 0 0 24px rgba(255, 51, 102, 0.8)', animation: 'heartbeat 1.5s ease-in-out infinite' }} />
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#e4e4e7', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Portfolio Live</div>
                    </div>
                    {/* BACK */}
                    <div className="status-badge-back" style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateX(180deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'rgba(10, 10, 15, 0.95)', borderRadius: '40px', border: '1px solid rgba(0, 240, 255, 0.4)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00f0ff' }}>{data.uptime}%</div>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa' }}>{data.latency}ms</div>
                    </div>
                  </div>
                </a>
              );
            })() : (
              <div className="status-badge-container" style={{ width: '165px', height: '36px' }}>
                <div className="status-badge-inner" style={{ width: '100%', height: '100%', borderRadius: '40px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ width: '6px', height: '6px', border: '1px solid #71717a', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  <div style={{ fontSize: '0.7rem', color: '#71717a', fontWeight: 500 }}>Portfolio</div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* ═══ PROJECT 1: Financial Parser ═══ */}
        <motion.div variants={itemVariants} className="bento-card card-project1">
          {services.length > 0 && services.find(s => s[0] === 'Financial Parser') ? (
            (() => {
              const data = services.find(s => s[0] === 'Financial Parser')[1];
              return (
                <a href="https://stats.uptimerobot.com/4tYmSQnuBE" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.6)', width: 'fit-content', padding: '6px 14px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff3366', boxShadow: '0 0 16px #ff3366, 0 0 24px rgba(255,51,102,0.8)', animation: 'heartbeat 1.5s ease-in-out infinite' }} />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff3366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00f0ff', marginLeft: '4px' }}>{data.uptime}% <span style={{color: '#a1a1aa', fontWeight: 600}}>• {data.latency}ms</span></span>
                </a>
              );
            })()
          ) : (
            <div className="project-tag tag-financial">💰 Live System</div>
          )}
          <h2 className="project-impact"><span className="gradient-text">Adaptive ReAct</span> Omnichannel RAG Platform</h2>
          <p className="project-desc">A 9-Node LangGraph Agent with dual-path web search, Pinecone hybrid search, and Meta WhatsApp Cloud API integration.</p>
          <div className="project-techs">
            <span>LangGraph</span><span>FastAPI</span><span>Pinecone</span><span>Qwen</span><span>WhatsApp</span>
          </div>
          <a href="https://agentic-rag-financial-parser.onrender.com/" target="_blank" rel="noreferrer" className="project-link">Live Demo →</a>
        </motion.div>

        {/* ═══ PROJECT 2: Legal AI ═══ */}
        <motion.div variants={itemVariants} className="bento-card card-project2">
          {services.length > 0 && services.find(s => s[0] === 'Legal AI') ? (
            (() => {
              const data = services.find(s => s[0] === 'Legal AI')[1];
              return (
                <a href="https://stats.uptimerobot.com/4tYmSQnuBE" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.6)', width: 'fit-content', padding: '6px 14px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff3366', boxShadow: '0 0 16px #ff3366, 0 0 24px rgba(255,51,102,0.8)', animation: 'heartbeat 1.5s ease-in-out infinite' }} />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff3366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00f0ff', marginLeft: '4px' }}>{data.uptime}% <span style={{color: '#a1a1aa', fontWeight: 600}}>• {data.latency}ms</span></span>
                </a>
              );
            })()
          ) : (
            <div className="project-tag tag-legal">⚖️ Live System</div>
          )}
          <h2 className="project-impact"><span className="gradient-text">Agentic Legal AI</span> (Confidence-Gated HITL & Intent Routing)</h2>
          <p className="project-desc">Processed 31,500+ chunks across 20+ legal acts with Parent-Child Chunking. Secure OAuth 2.0 multi-tenant vector search on Qdrant. 5.6K+ HuggingFace downloads.</p>
          <div className="project-techs">
            <span>Qdrant</span><span>Supabase</span><span>OAuth 2.0</span><span>React</span><span>HuggingFace</span>
          </div>
          <a href="https://huggingface.co/spaces/invincibleambuj/Agentic-AI-Legal-Assistant" target="_blank" rel="noreferrer" className="project-link">Live Demo →</a>
        </motion.div>

        {/* ═══ PROJECT 3: Citizen Safety ═══ */}
        <motion.div variants={itemVariants} className="bento-card card-project3">
          {services.length > 0 && services.find(s => s[0] === 'Citizen Safety') ? (
            (() => {
              const data = services.find(s => s[0] === 'Citizen Safety')[1];
              return (
                <a href="https://stats.uptimerobot.com/4tYmSQnuBE" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.6)', width: 'fit-content', padding: '6px 14px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff3366', boxShadow: '0 0 16px #ff3366, 0 0 24px rgba(255,51,102,0.8)', animation: 'heartbeat 1.5s ease-in-out infinite' }} />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff3366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00f0ff', marginLeft: '4px' }}>{data.uptime}% <span style={{color: '#a1a1aa', fontWeight: 600}}>• {data.latency}ms</span></span>
                </a>
              );
            })()
          ) : (
            <div className="project-tag tag-safety">🚨 Live System</div>
          )}
          <h2 className="project-impact"><span className="gradient-text">Secure Linear RAG</span> & PII Anonymization</h2>
          <p className="project-desc">Deployed spaCy-driven trilingual routing with intelligent 112/100 emergency fallback signaling and PII anonymization.</p>
          <div className="project-techs">
            <span>Llama 70B</span><span>ChromaDB</span><span>spaCy</span><span>Trilingual</span>
          </div>
          <a href="https://citizen-safety-ai-assistant.vercel.app/" target="_blank" rel="noreferrer" className="project-link">Live Demo →</a>
        </motion.div>

        {/* ═══ TECH STACK ═══ */}
        <motion.div variants={itemVariants} className="bento-card card-tech">
          <div className="card-label">⚡ Engineering Stack</div>
          <div className="tech-marquee-wrapper">
            <div className="tech-marquee">
              {[...TECH_STACK, ...TECH_STACK, ...TECH_STACK].map((t, i) => (
                <span key={i}>{t}</span>
              ))}
            </div>
          </div>
        </motion.div>


        {/* ═══ AGGREGATED METRICS ═══ */}
        <motion.div variants={itemVariants} className="bento-card card-metrics">
          <div className="card-label">📈 Global Impact Metrics</div>
          <div className="metrics-strip">
            <div className="metric-item">
              <div className="metric-value">
                <AnimatedCounter to={3} />
              </div>
              <div className="metric-label">Live RAG Systems</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">
                <AnimatedCounter to={31.5} decimals={1} /><span className="metric-suffix">K+</span>
              </div>
              <div className="metric-label">Chunks Indexed</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">
                <AnimatedCounter to={3} />
              </div>
              <div className="metric-label">Fine-Tuned LLMs</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">
                <AnimatedCounter to={5.6} decimals={1} /><span className="metric-suffix">K+</span>
              </div>
              <div className="metric-label">HF Downloads</div>
            </div>
            <div className="metric-item" style={{ transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
              <a href="https://stats.uptimerobot.com/4tYmSQnuBE" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="metric-value">
                  <AnimatedCounter to={avgUptime} decimals={2} /><span className="metric-suffix">%</span>
                </div>
                <div className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Live Uptime
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                </div>
              </a>
            </div>
          </div>
        </motion.div>

        {/* ═══ SAAS FOOTER ═══ */}
        <motion.div variants={itemVariants} className="card-footer" style={{ padding: '3rem 2rem 1rem' }}>
          
          {/* Column 1: Brand & Connect Box (like reference image) */}
          <div className="footer-col" style={{ gap: '1.5rem' }}>
            <div>
              <div className="footer-brand">AMBUJ<span>.AI</span></div>
              <div className="footer-desc" style={{ marginTop: '0.5rem' }}>
                Building production-ready Agentic AI applications and specialized Legal/Financial LLMs.
              </div>
            </div>
            
            {/* Connect with the Architect Box */}
            <div style={{ background: 'rgba(20,20,25,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px', width: 'fit-content' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '12px', color: '#fff' }}>Connect with the Architect</div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {/* QR Code Placeholder (Uses a standard generated QR or fallback to a crisp white box with logo) */}
                <div style={{ width: '70px', height: '70px', background: '#fff', borderRadius: '8px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <img src="/qr-code.png" alt="QR" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display='none'; e.target.parentNode.innerHTML='<div style="width:100%;height:100%;background:#000;display:flex;align-items:center;justify-content:center;border-radius:4px;"><span style="color:#fff;font-weight:bold;font-size:10px;">QR</span></div>' }} />
                </div>
                <div style={{ fontSize: '0.8rem', color: '#a1a1aa', lineHeight: '1.5' }}>
                  Scan or click to view my<br/>
                  <a href="https://ambuj-ai-portfolio.vercel.app" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-amber)', fontWeight: 700, textDecoration: 'none' }}>Micro-Portfolio</a> & Resume.
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Live Systems */}
          <div className="footer-col">
            <div className="footer-col-title">Live Systems</div>
            <a href="https://agentic-rag-financial-parser.onrender.com/" target="_blank" rel="noreferrer" className="footer-col-link">Financial Parser</a>
            <a href="https://indian-legal-ai-expert.onrender.com/" target="_blank" rel="noreferrer" className="footer-col-link">Agentic Legal AI</a>
            <a href="https://citizen-safety-ai-assistant.vercel.app/" target="_blank" rel="noreferrer" className="footer-col-link">Citizen Safety AI</a>
          </div>

          {/* Column 3: Connect */}
          <div className="footer-col">
            <div className="footer-col-title">Connect</div>
            <a href="https://www.linkedin.com/in/ambuj-tripathi-042b4a118/" target="_blank" rel="noreferrer" className="footer-col-link">LinkedIn</a>
            <a href="https://github.com/Ambuj123-lab" target="_blank" rel="noreferrer" className="footer-col-link">GitHub</a>
            <a href="https://x.com/Ambuj_KTripathi" target="_blank" rel="noreferrer" className="footer-col-link">X / Twitter</a>
            <a href="mailto:ambuj.tripathi@outlook.com" className="footer-col-link">Email</a>
          </div>

          {/* Column 4: Resources */}
          <div className="footer-col">
            <div className="footer-col-title">Resources</div>
            <a href="https://ambuj-rag-docs.netlify.app/" target="_blank" rel="noreferrer" className="footer-col-link">Documentation</a>
            <a href="/resume.pdf" target="_blank" className="footer-col-link">Resume (PDF)</a>
            <a href="https://huggingface.co/invincibleambuj" target="_blank" rel="noreferrer" className="footer-col-link">Hugging Face Models</a>
          </div>

          {/* Bottom Copyright Row */}
          <div className="footer-bottom" style={{ flexDirection: 'column', gap: '24px', alignItems: 'center', marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
            
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <span>Designed & Engineered by © Ambuj Kumar Tripathi</span>
              <a href="https://stats.uptimerobot.com/4tYmSQnuBE" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff66', boxShadow: '0 0 8px #00ff66' }} />
                UptimeRobot Live Monitoring
              </a>
            </div>
          </div>

        </motion.div>

        {/* ═══ Chat Widget ═══ */}
        <ChatWidget />

      </motion.div>
    </div>
    </>
  );
}
