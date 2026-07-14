<div align="center">
  <h1>🚀 Ambuj AI Systems Hub</h1>
  <p><strong>An Executive Portal & Interactive Launchpad for Production RAG Systems</strong></p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-F05032?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
  [![LangGraph Backend](https://img.shields.io/badge/LangGraph_Backend-Connected-00ff66?style=for-the-badge)](https://github.com/Ambuj123-lab/agentic-rag-financial-parser)
  [![Live Portfolio](https://img.shields.io/badge/View_Full_Portfolio-00f0ff?style=for-the-badge)](https://ambuj-ai-portfolio.vercel.app)
</div>

<br />

## 📖 Overview

Traditional long-form portfolios are often too time-consuming for technical recruiters and engineering managers to parse. 

**Ambuj AI Systems Hub** solves this by acting as a high-impact, interactive routing portal. Instead of scrolling through walls of text, visitors can view a sleek Bento-grid summary of my 3 live production AI systems and immediately interact with a **Live Agentic RAG Assistant** directly on the page to ask questions about my architecture, resume, and deployments.

## ✨ Key Features

- **Interactive Agentic RAG Widget:** A native React chat interface with streaming markdown and clickable source citations. It securely proxies queries to my live FastAPI/LangGraph backend via dedicated Next.js API routes, completely bypassing the need for user authentication.
- **Enterprise UI/UX:** Built with a pitch-black stealth theme, glassmorphism (`backdrop-filter`), and dynamic RGB neon borders (Cyan to Electric Purple).
- **Executive Routing:** A responsive Bento Grid layout designed to quickly route traffic to my deployed web apps and deep-dive architectural repositories.
- **Responsive Animations:** Powered by Framer Motion for levitating badges, fluid chat window expansion, and non-intrusive smart tooltips.

---

## 🏗️ Production Systems Showcased

This hub acts as a gateway to my three core deployments:

### 1. Adaptive ReAct Omnichannel RAG Platform
A 9-Node LangGraph Agent featuring dual-path routing (Web Search vs. Vector Retrieval). 
- **Stack:** LangGraph, FastAPI, Pinecone, Qwen, Meta WhatsApp Cloud API.
- **Highlight:** Intelligent multi-agent routing based on intent, with live WhatsApp integration.

### 2. Secure Linear RAG & PII Anonymization
A robust pipeline designed for safety and data privacy.
- **Stack:** Llama 70B, ChromaDB, spaCy, Trilingual processing.
- **Highlight:** Deployed spaCy-driven intent routing with intelligent 112/100 emergency fallback signaling and strict PII redaction.

### 3. Agentic Financial Parser
A precision-focused financial data extraction and conversation engine.
- **Stack:** LangChain, Vector DB, High-Accuracy Retrieval.
- **Highlight:** Employs advanced chunking and metadata filtering for strict, hallucination-free answers from financial documents.

---

## 🛠️ Tech Stack (Frontend Hub)

- **Framework:** Next.js (App Router)
- **Styling:** Pure CSS (CSS Modules & Global Variables) with a custom design system.
- **Animations:** Framer Motion
- **Markdown Parsing:** `react-markdown` + `remark-gfm`
- **Analytics:** Google Analytics (GA4) integrated via Next.js `<Script>`

## 🧠 Architecture (Chat Integration)

The embedded chat widget does not contain local LLM logic. It acts as a highly optimized thin client:
1. **Client (`ChatWidget.js`):** Captures user input and handles UI states (typing indicators, markdown parsing, RGB glow).
2. **Next.js Proxy (`/api/auth/dev-login` & `/api/chat`):** Automatically generates a guest session and securely forwards requests to the live Render backend, bypassing CORS and exposing internal architecture securely.
3. **LangGraph Backend:** Processes the query, retrieves chunks from Pinecone/Web, and returns the response with confidence scores and source citations.

---

## 🔗 Links

- **Full Detailed Portfolio:** [ambuj-ai-portfolio.vercel.app](https://ambuj-ai-portfolio.vercel.app)
- **LinkedIn:** [Ambuj Kumar Tripathi](https://www.linkedin.com/in/ambuj-tripathi-042b4a118/)
- **Hugging Face:** [invincibleambuj](https://huggingface.co/invincibleambuj)

<div align="center">
  <p><i>Designed & Developed by Ambuj Kumar Tripathi</i></p>
</div>
