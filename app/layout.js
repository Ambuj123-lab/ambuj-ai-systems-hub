import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: "Ambuj's AI Systems Hub | Live Agentic RAG",
  description: "Explore my top 3 production AI systems. Talk to my live LangGraph Agent directly to know about my architecture, stack, and resume.",
  keywords: ['AI Engineer', 'RAG', 'LangGraph', 'Agentic AI', 'Full Stack Developer', 'Ambuj Kumar Tripathi'],
  authors: [{ name: 'Ambuj Kumar Tripathi' }],
  creator: 'Ambuj Kumar Tripathi',
  metadataBase: new URL('https://ambuj-ai-systems-hub.vercel.app'),
  openGraph: {
    title: "Ambuj's AI Systems Hub | Live Agentic RAG",
    description: "Explore my top 3 production AI systems. Talk to my live LangGraph Agent directly to know about my architecture, stack, and resume.",
    url: 'https://ambuj-ai-systems-hub.vercel.app',
    siteName: 'Ambuj.AI',
    images: [{ url: '/og-image.jpeg', width: 1200, height: 630, alt: 'Ambuj AI Systems Hub' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ambuj's AI Systems Hub | Live Agentic RAG",
    description: "Explore my top 3 production AI systems. Talk to my live LangGraph Agent directly to know about my architecture, stack, and resume.",
    creator: '@Ambuj_KTripathi',
    images: ['/og-image.jpeg'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Ambuj Kumar Tripathi",
              "jobTitle": "AI Engineer & RAG Systems Architect",
              "url": "https://ambuj-bento.vercel.app",
              "sameAs": [
                "https://www.linkedin.com/in/ambuj-tripathi-042b4a118/",
                "https://github.com/Ambuj123-lab",
                "https://x.com/Ambuj_KTripathi",
                "https://medium.com/@ambuj_tripathi"
              ],
              "knowsAbout": ["Agentic AI", "RAG Systems", "LangGraph", "Fine-Tuning", "LLMOps"]
            })
          }}
        />
      </head>
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RZPS5NW5XT"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RZPS5NW5XT');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
