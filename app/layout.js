import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'Ambuj Kumar Tripathi | AI Engineer — Agentic RAG Systems',
  description: 'Building production-grade Agentic AI systems. 3 live RAG deployments, 31.5K+ chunks processed, 5.6K+ HuggingFace downloads. Open to AI/ML roles.',
  keywords: ['AI Engineer', 'RAG', 'LangGraph', 'Agentic AI', 'Full Stack Developer', 'Ambuj Kumar Tripathi'],
  authors: [{ name: 'Ambuj Kumar Tripathi' }],
  creator: 'Ambuj Kumar Tripathi',
  metadataBase: new URL('https://ambuj-bento.vercel.app'),
  openGraph: {
    title: 'Ambuj Kumar Tripathi | AI Engineer',
    description: 'I build AI systems that think, reason, and act. 3 production RAG systems live. Open to roles.',
    url: 'https://ambuj-bento.vercel.app',
    siteName: 'Ambuj.AI',
    images: [{ url: '/og-image.jpeg', width: 1200, height: 630, alt: 'Ambuj Kumar Tripathi — AI Engineer' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ambuj Kumar Tripathi | AI Engineer',
    description: 'I build AI systems that think, reason, and act. 3 production RAG systems live.',
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
