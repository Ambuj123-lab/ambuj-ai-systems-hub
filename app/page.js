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

const UPTIME_API_KEY = 'ur3293690-5a09e92504e29189fadf3be2';

const TECH_STACK = [
  'Gemini', 'Claude', 'Qwen', 'DeepSeek', 'LangGraph', 'LangFuse',
  'Redis', 'FastAPI', 'Docker', 'Render', 'Pinecone', 'Qdrant',
  'OpenRouter', 'Google Cloud', 'Supabase', 'React', 'Next.js', 'MongoDB'
];

export default function Home() {
  const [uptimeData, setUptimeData] = useState(null);

  // Fetch UptimeRobot Data
  useEffect(() => {
    const fetchUptime = async () => {
      try {
        const res = await fetch('https://api.uptimerobot.com/v2/getMonitors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `api_key=${UPTIME_API_KEY}&format=json&response_times=1&custom_uptime_ratios=30`
        });
        const data = await res.json();
        if (data.stat === 'ok' && data.monitors) {
          const formatted = {};
          let totalUptime = 0;
          let validMonitors = 0;
          
          data.monitors.forEach(m => {
            let key = m.friendly_name;
            if (key.includes('financial-parser')) key = 'Financial Parser';
            else if (key.includes('indian-legal')) key = 'Legal AI';
            else if (key.includes('citizen-safety')) key = 'Citizen Safety';
            else if (key.includes('ambuj-portfolio-v2')) key = 'Portfolio';
            
            const uptimeVal = parseFloat(m.custom_uptime_ratio);
            if (!isNaN(uptimeVal)) {
              totalUptime += uptimeVal;
              validMonitors++;
            }
            
            formatted[key] = {
              status: m.status === 2 ? 'Up' : 'Down',
              uptime: uptimeVal.toFixed(2),
              latency: m.response_times?.[0]?.value || '--'
            };
          });
          
          const avgUptime = validMonitors > 0 ? (totalUptime / validMonitors) : 99.7;
          setUptimeData({ services: formatted, average: avgUptime });
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
          <img src="/og-image.jpeg" alt="Ambuj Kumar Tripathi" className="hero-photo" />
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
        </motion.div>

        {/* ═══ PROJECT 1: Financial Parser ═══ */}
        <motion.div variants={itemVariants} className="bento-card card-project1">
          <div className="project-tag tag-financial">💰 Live System</div>
          <h2 className="project-impact"><span className="gradient-text">Adaptive ReAct</span> Omnichannel RAG Platform</h2>
          <p className="project-desc">A 9-Node LangGraph Agent with dual-path web search, Pinecone hybrid search, and Meta WhatsApp Cloud API integration.</p>
          <div className="project-techs">
            <span>LangGraph</span><span>FastAPI</span><span>Pinecone</span><span>Qwen</span><span>WhatsApp</span>
          </div>
          <a href="https://agentic-rag-financial-parser.onrender.com/" target="_blank" rel="noreferrer" className="project-link">Live Demo →</a>
        </motion.div>

        {/* ═══ PROJECT 2: Legal AI ═══ */}
        <motion.div variants={itemVariants} className="bento-card card-project2">
          <div className="project-tag tag-legal">⚖️ Live System</div>
          <h2 className="project-impact"><span className="gradient-text">Agentic Legal AI</span> (Confidence-Gated HITL & Intent Routing)</h2>
          <p className="project-desc">Processed 31,500+ chunks across 20+ legal acts with Parent-Child Chunking. Secure OAuth 2.0 multi-tenant vector search on Qdrant. 5.6K+ HuggingFace downloads.</p>
          <div className="project-techs">
            <span>Qdrant</span><span>Supabase</span><span>OAuth 2.0</span><span>React</span><span>HuggingFace</span>
          </div>
          <a href="https://indian-legal-ai-expert.onrender.com/" target="_blank" rel="noreferrer" className="project-link">Live Demo →</a>
        </motion.div>

        {/* ═══ PROJECT 3: Citizen Safety ═══ */}
        <motion.div variants={itemVariants} className="bento-card card-project3">
          <div className="project-tag tag-safety">🚨 Live System</div>
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

        {/* ═══ SYSTEM STATUS ═══ */}
        <motion.div variants={itemVariants} className="bento-card card-status">
          <div className="card-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-dot" />
            System Status — Live
          </div>
          <div className="status-grid">
            {services.length > 0 ? services.map(([name, data]) => (
              <a key={name} href="https://stats.uptimerobot.com/4tYmSQnuBE" target="_blank" rel="noreferrer" className="status-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="status-name">{name}</div>
                <div className="status-value" style={{ color: data.status === 'Up' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                  <span className={`status-dot ${data.status === 'Up' ? 'up' : 'down'}`} />
                  {data.status === 'Up' ? 'Online' : 'Offline'}
                </div>
                <div className="status-uptime">{data.uptime}% · {data.latency}ms</div>
              </a>
            )) : (
              <>
                {['Financial Parser', 'Legal AI', 'Citizen Safety', 'Portfolio'].map(name => (
                  <div key={name} className="status-item">
                    <div className="status-name">{name}</div>
                    <div className="status-value" style={{ color: 'var(--text-muted)' }}>--</div>
                    <div className="status-uptime">Loading...</div>
                  </div>
                ))}
              </>
            )}
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
        <motion.div variants={itemVariants} className="card-footer">
          
          {/* Column 1: Brand & Description */}
          <div className="footer-col">
            <div className="footer-brand">AMBUJ<span>.AI</span></div>
            <div className="footer-desc">
              Building production-ready Agentic AI applications and specialized Legal/Financial LLMs.
            </div>
            {/* Keeping the QR code but styled for this column */}
            <a href="https://ambuj-ai-portfolio.vercel.app" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '6px', borderRadius: '8px', textDecoration: 'none', width: 'fit-content', marginTop: '4px' }}>
              <img src="/qr-code.png" alt="QR Code" style={{ width: '36px', height: '36px', borderRadius: '4px', background: '#fff', padding: '2px' }} />
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Scan to explore<br/><strong style={{ color: 'var(--accent-cyan)' }}>Full AI Portfolio</strong>
              </div>
            </a>
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
          <div className="footer-bottom">
            <span>Designed & Engineered by © Ambuj Kumar Tripathi</span>
            <a href="https://stats.uptimerobot.com/4tYmSQnuBE" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'var(--accent-green)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
              All systems operational 🟢
            </a>
          </div>

        </motion.div>

        {/* ═══ Chat Widget ═══ */}
        <ChatWidget />

      </motion.div>
    </div>
    </>
  );
}
