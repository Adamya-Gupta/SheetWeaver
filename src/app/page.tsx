import PortfolioFormatter from '@/components/PortfolioFormatter';
import Image from 'next/image';
import { Scale, Globe } from 'lucide-react';

const GITHUB_URL = 'https://github.com/Adamya-Gupta/SheetWeaver';
const WEBSITE_URL = ''; // "Coming soon" 
 
const INK = '#141414';
 
function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}
 
const links = [
  { label: 'GitHub', href: GITHUB_URL, icon: <GithubIcon /> },
  { label: 'License', href: `${GITHUB_URL}/blob/main/LICENSE`, icon: <Scale size={16} /> },
];
 

const platforms = [
  { name: 'Groww', supported: true },
  { name: 'Zerodha', supported: false },
  { name: 'IND Money', supported: false },
  { name: 'Paytm Money', supported: false },
  { name: 'Kuvera', supported: false },

];
 

export default function Home() {
  return (
    <main
      className="min-h-screen px-6 py-6 flex flex-col items-center"
      style={{
        background: 'radial-gradient(circle at 50% 0%, #FDFCFA 0%, #F6F5F1 45%, #F0EFE9 100%)',
      }}
    >
      <PortfolioFormatter />

      {/* Supported platforms */}
      <section className="w-full max-w-5xl mt-10">
        <h2 className="font-display font-bold text-center text-sm tracking-wide" style={{ color: INK }}>
          SUPPORTED PLATFORMS
        </h2>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {platforms.map(platform => (
            <span
              key={platform.name}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold"
              style={
                platform.supported
                  ? { border: `1.5px solid ${INK}`, color: INK }
                  : { border: '1.5px dashed #B9B9B4', color: '#A3A29C' }
              }
            >
              <span className="h-2 w-2" style={{ background: platform.supported ? '#12B76A' : '#B9B9B4' }} />
              {platform.name}
              {!platform.supported && <span className="text-[10px]">&middot; coming soon</span>}
            </span>
          ))}
        </div>
        <p className="text-center text-xs mt-3" style={{ color: '#A3A29C' }}>
          Groww exports are supported today &middot; more brokers are on the way.
        </p>
      </section>
 
      {/* Preview with vs without the trend chart */}
      <section className="w-full max-w-5xl mt-10">
        <h2 className="font-display font-bold text-center text-sm tracking-wide" style={{ color: INK }}>
          SEE IT IN ACTION
        </h2>
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white" style={{ border: `2.5px solid ${INK}` }}>
            <div className="relative w-full aspect-[16/10] bg-[#F6F5F1]">
              <Image
                src="/with-chart.png"
                alt="Formatted workbook with the trend chart column enabled"
                fill
                className="object-cover object-center"
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderTop: `2.5px solid ${INK}` }}>
              <span className="h-2 w-2" style={{ background: '#12B76A' }} />
              <span className="text-xs font-semibold" style={{ color: INK }}>With trend chart</span>
            </div>
          </div>
 
          <div className="bg-white" style={{ border: `2.5px solid ${INK}` }}>
            <div className="relative w-full aspect-[16/10] bg-[#F6F5F1]">
              <Image
                src="/without-chart.png"
                alt="Formatted workbook without the trend chart column"
                fill
                className="object-cover object-center"
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderTop: `2.5px solid ${INK}` }}>
              <span className="h-2 w-2" style={{ background: '#B9B9B4' }} />
              <span className="text-xs font-semibold" style={{ color: INK }}>Without trend chart</span>
            </div>
          </div>
        </div>
        <p className="text-center text-xs mt-3" style={{ color: '#A3A29C' }}>
         <a  href="https://www.google.com/googlefinance/disclaimer/" className='underline'>Disclaimer</a>: Quotes are not sourced from all markets and may be delayed up to 20 minutes. Information is provided 'as is' and solely for informational purposes, not for trading purposes or advice.
        </p>
      </section>
 
      {/* Footer */}
      <footer className="w-full max-w-3xl mt-10 pt-8 flex flex-col items-center gap-4" style={{ borderTop: '1.5px solid #E7E5DE' }}>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {links.map(link => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-[#F0EFE9]"
              style={{ border: `1.5px solid ${INK}`, color: INK }}
            >
              {link.icon}
              {link.label}
            </a>
          ))}
 
          {WEBSITE_URL ? (
            <a
              href={WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-[#F0EFE9]"
              style={{ border: `1.5px solid ${INK}`, color: INK }}
            >
              <Globe size={16} />
              Website
            </a>
          ) : (
            <span
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
              style={{ border: '1.5px dashed #B9B9B4', color: '#A3A29C' }}
            >
              <Globe size={16} />
              Website &middot; coming soon
            </span>
          )}
        </div>
 
        <p className="text-xs text-center" style={{ color: '#A3A29C' }}>
          Free & open source &middot; Sheet Weaver &middot; Built for Indian market portfolios.
        </p>
        
      </footer>
    </main>
  );
}