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
          <div className="footer-col" style={{ flex: '1 1 250px', minWidth: '250px' }}>
            <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'url(/og-image.jpeg) center/cover', border: '1px solid rgba(255,255,255,0.1)' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>AMBUJ<span style={{ color: 'var(--accent)' }}>.AI</span></h2>
            </div>
            
            {/* ═══ FOOTER SOCIAL ICONS ═══ */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '1.5rem', alignItems: 'center' }}>
              <a href="https://www.linkedin.com/in/ambuj-tripathi-042b4a118/" target="_blank" rel="noreferrer" style={{ color: '#a1a1aa', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#a1a1aa'}>
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="https://x.com/Ambuj_KTripathi" target="_blank" rel="noreferrer" style={{ color: '#a1a1aa', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#a1a1aa'}>
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://github.com/Ambuj123-lab" target="_blank" rel="noreferrer" style={{ color: '#a1a1aa', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#a1a1aa'}>
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="https://medium.com/@ambuj_tripathi" target="_blank" rel="noreferrer" style={{ color: '#a1a1aa', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#a1a1aa'}>
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M2.846 6.887c.03-.295-.083-.586-.303-.784l-2.24-2.7v-.403h6.958l5.378 11.795 4.728-11.795h6.633v.403l-1.916 1.837c-.165.126-.247.333-.213.538v13.498c-.034.204.048.411.213.537l1.871 1.837v.403h-9.412v-.403l1.939-1.882c.19-.19.19-.246.19-.537v-10.91l-5.389 13.688h-.728L4.278 6.887v10.154c-.053.495.126 1.01.492 1.365l2.76 3.32v.403h-7.53v-.403l2.76-3.32c.36-.355.54-.87.487-1.365v-10.154z"/></svg>
              </a>
              <a href="https://huggingface.co/invincibleambuj" target="_blank" rel="noreferrer" style={{ color: '#a1a1aa', transition: 'color 0.2s', filter: 'grayscale(100%)', opacity: 0.8 }} onMouseOver={e => {e.currentTarget.style.filter = 'grayscale(0%)'; e.currentTarget.style.opacity = 1}} onMouseOut={e => {e.currentTarget.style.filter = 'grayscale(100%)'; e.currentTarget.style.opacity = 0.8}}>
                <span style={{ fontSize: '22px', lineHeight: '22px' }}>🤗</span>
              </a>
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
