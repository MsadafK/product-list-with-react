"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, BarChart2, Package, Shield, Upload, Search, Bell, Layers, SlidersHorizontal, ChevronDown } from "lucide-react"

// ── Utility ──────────────────────────────────────────────────────────────────
function cn(...classes) { return classes.filter(Boolean).join(" ") }

// ── Animated counter ─────────────────────────────────────────────────────────
function Counter({ end, suffix = "" }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      let start = 0
      const step = end / 60
      const timer = setInterval(() => {
        start += step
        if (start >= end) { setCount(end); clearInterval(timer) }
        else setCount(Math.floor(start))
      }, 16)
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end])
  return <span ref={ref}>{count}{suffix}</span>
}

// ── Marquee strip ─────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = ["Next.js 16", "Supabase", "Clerk Auth", "Cloudinary", "Tailwind CSS", "shadcn/ui", "Recharts", "TypeScript", "React 19", "Vercel"]

function Marquee() {
  return (
    <div className="marquee-track overflow-hidden border-y border-white/10 py-3 my-0">
      <div className="marquee-inner flex gap-12 whitespace-nowrap" style={{ animation: "marquee 20s linear infinite" }}>
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span key={i} className="text-xs font-mono tracking-[0.2em] uppercase text-white/30 flex items-center gap-3">
            <span className="w-1 h-1 rounded-full bg-amber-400/60 inline-block" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Feature card ──────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Package, label: "Products", title: "Full CRUD Management", desc: "Add, edit, delete products with images, pricing, and real-time stock tracking." },
  { icon: BarChart2, label: "Analytics", title: "Live Charts & Insights", desc: "4 recharts visualizations — stock by category, price distribution, inventory value." },
  { icon: Upload, label: "Uploads", title: "Cloudinary Integration", desc: "Drag-and-drop image upload with live preview and upload progress bar." },
  { icon: Shield, label: "Auth", title: "Clerk Authentication", desc: "Secure, production-grade auth with sign-in, sign-up, and session management." },
  { icon: Search, label: "Search", title: "Smart Filtering", desc: "Debounced search, category chips, sort by name, price, or stock." },
  { icon: Bell, label: "Alerts", title: "Low Stock Notifications", desc: "Auto toast alerts when any product's stock drops below threshold." },
  { icon: Layers, label: "Bulk", title: "Bulk Actions & Export", desc: "Multi-select delete and one-click CSV export of your entire catalog." },
  { icon: SlidersHorizontal, label: "Logs", title: "Activity Audit Trail", desc: "Every create, update, and delete logged with timestamps in analytics." },
]

// ── Main ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [hoveredFeature, setHoveredFeature] = useState(null)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .landing { background: #080808; color: #f0ede8; min-height: 100vh; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }

        /* Grain overlay */
        .landing::before {
          content: '';
          position: fixed; inset: 0; z-index: 1; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.035;
        }

        .above-grain { position: relative; z-index: 2; }

        /* Navbar */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 0 2rem; height: 60px;
          display: flex; align-items: center; justify-content: space-between;
          transition: background 0.3s, border-color 0.3s;
        }
        .nav.scrolled { background: rgba(8,8,8,0.85); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255,255,255,0.06); }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logo-box { width: 28px; height: 28px; background: #f0ede8; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
        .nav-logo-box svg { color: #080808; }
        .nav-logo-text { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700; color: #f0ede8; letter-spacing: -0.02em; }
        .nav-actions { display: flex; align-items: center; gap: 12px; }
        .btn-ghost { background: transparent; border: 1px solid rgba(255,255,255,0.15); color: rgba(240,237,232,0.6); padding: 8px 16px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.35); color: #f0ede8; }
        .btn-primary { background: #f0ede8; border: none; color: #080808; padding: 8px 20px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
        .btn-primary:hover { background: #fff; transform: translateY(-1px); }
        .btn-primary-lg { padding: 14px 28px; font-size: 15px; border-radius: 10px; }
        .btn-outline-lg { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #f0ede8; padding: 14px 28px; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 15px; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
        .btn-outline-lg:hover { border-color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.04); }

        /* Hero */
        .hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 80px 24px 60px; position: relative; }
        .hero-glow { position: absolute; top: 20%; left: 50%; transform: translateX(-50%); width: 600px; height: 600px; background: radial-gradient(ellipse, rgba(251,191,36,0.06) 0%, transparent 70%); pointer-events: none; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border: 1px solid rgba(251,191,36,0.3); border-radius: 100px; background: rgba(251,191,36,0.05); margin-bottom: 36px; }
        .hero-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #fbbf24; animation: pulse-dot 2s ease-in-out infinite; }
        .hero-badge-text { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(251,191,36,0.8); }
        .hero-title { font-family: 'Playfair Display', serif; font-size: clamp(3rem, 8vw, 7rem); font-weight: 900; line-height: 0.95; letter-spacing: -0.03em; margin-bottom: 28px; }
        .hero-title-italic { font-style: italic; color: rgba(240,237,232,0.4); }
        .hero-sub { font-size: clamp(15px, 2vw, 18px); color: rgba(240,237,232,0.45); max-width: 480px; line-height: 1.7; margin-bottom: 44px; font-weight: 300; }
        .hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-bottom: 20px; }
        .hero-note { font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(240,237,232,0.25); letter-spacing: 0.06em; }
        .hero-scroll { position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 6px; opacity: 0.3; animation: float-y 2s ease-in-out infinite; }
        .hero-scroll-text { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; }

        /* Stats */
        .stats-section { padding: 80px 24px; }
        .stats-inner { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; overflow: hidden; }
        .stat-item { background: #080808; padding: 40px 32px; text-align: center; }
        .stat-number { font-family: 'Playfair Display', serif; font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 900; line-height: 1; letter-spacing: -0.04em; color: #f0ede8; margin-bottom: 8px; }
        .stat-label { font-size: 13px; color: rgba(240,237,232,0.35); letter-spacing: 0.04em; }

        /* Marquee */
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-33.33%) } }

        /* Preview */
        .preview-section { padding: 0 24px 100px; }
        .preview-label { text-align: center; margin-bottom: 48px; }
        .section-eyebrow { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(251,191,36,0.7); margin-bottom: 12px; display: block; }
        .section-title { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 700; letter-spacing: -0.03em; line-height: 1.1; }
        .section-sub { font-size: 15px; color: rgba(240,237,232,0.4); margin-top: 12px; font-weight: 300; }
        .browser-frame { max-width: 1000px; margin: 0 auto; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; box-shadow: 0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04); }
        .browser-bar { background: #141414; padding: 12px 16px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .browser-dots { display: flex; gap: 6px; }
        .browser-dot { width: 12px; height: 12px; border-radius: 50%; }
        .browser-url { flex: 1; background: #1e1e1e; border-radius: 6px; padding: 6px 12px; font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(255,255,255,0.3); text-align: center; max-width: 320px; margin: 0 auto; }
        .browser-content { background: #0f0f0f; padding: 24px; }
        .mock-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .mock-title { width: 120px; height: 28px; background: rgba(255,255,255,0.08); border-radius: 6px; }
        .mock-btns { display: flex; gap: 8px; }
        .mock-btn-sm { height: 32px; border-radius: 6px; background: rgba(255,255,255,0.06); }
        .mock-btn-primary { height: 32px; width: 120px; border-radius: 6px; background: rgba(240,237,232,0.15); }
        .mock-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden; margin-bottom: 20px; }
        .mock-stat { background: rgba(255,255,255,0.02); padding: 16px; }
        .mock-stat:not(:last-child) { border-right: 1px solid rgba(255,255,255,0.08); }
        .mock-stat-label { width: 60px; height: 8px; background: rgba(255,255,255,0.06); border-radius: 4px; margin-bottom: 10px; }
        .mock-stat-val { width: 40px; height: 20px; background: rgba(255,255,255,0.12); border-radius: 4px; }
        .mock-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .mock-card { border-radius: 10px; border: 1px solid rgba(255,255,255,0.06); overflow: hidden; background: rgba(255,255,255,0.02); }
        .mock-card-img { aspect-ratio: 1; background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)); }
        .mock-card-body { padding: 12px; }
        .mock-card-tag { width: 40px; height: 6px; background: rgba(251,191,36,0.2); border-radius: 3px; margin-bottom: 8px; }
        .mock-card-title { width: 80%; height: 10px; background: rgba(255,255,255,0.1); border-radius: 4px; margin-bottom: 12px; }
        .mock-card-footer { display: flex; justify-content: space-between; }
        .mock-price { width: 36px; height: 14px; background: rgba(255,255,255,0.12); border-radius: 4px; }
        .mock-badge { width: 48px; height: 14px; background: rgba(52,211,153,0.2); border-radius: 20px; }

        /* Features */
        .features-section { padding: 0 24px 100px; }
        .features-grid { max-width: 1100px; margin: 48px auto 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; overflow: hidden; }
        .feature-card { background: #080808; padding: 28px 24px; cursor: default; transition: background 0.2s; position: relative; overflow: hidden; }
        .feature-card::after { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 0%, rgba(251,191,36,0.05), transparent 70%); opacity: 0; transition: opacity 0.3s; }
        .feature-card:hover { background: #0d0d0d; }
        .feature-card:hover::after { opacity: 1; }
        .feature-icon-wrap { width: 36px; height: 36px; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; transition: border-color 0.2s; }
        .feature-card:hover .feature-icon-wrap { border-color: rgba(251,191,36,0.3); }
        .feature-tag { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(251,191,36,0.5); margin-bottom: 8px; display: block; }
        .feature-title { font-size: 14px; font-weight: 500; color: #f0ede8; margin-bottom: 8px; line-height: 1.3; }
        .feature-desc { font-size: 12px; color: rgba(240,237,232,0.35); line-height: 1.65; font-weight: 300; }

        /* CTA */
        .cta-section { padding: 0 24px 120px; }
        .cta-inner { max-width: 700px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 80px 48px; text-align: center; position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0)); }
        .cta-inner::before { content: ''; position: absolute; top: -1px; left: 20%; right: 20%; height: 1px; background: linear-gradient(90deg, transparent, rgba(251,191,36,0.4), transparent); }
        .cta-title { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; letter-spacing: -0.03em; margin-bottom: 16px; }
        .cta-sub { font-size: 15px; color: rgba(240,237,232,0.4); margin-bottom: 36px; font-weight: 300; }
        .cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

        /* Footer */
        .footer { border-top: 1px solid rgba(255,255,255,0.06); padding: 28px 40px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
        .footer-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .footer-logo-box { width: 22px; height: 22px; background: #f0ede8; border-radius: 4px; display: flex; align-items: center; justify-content: center; }
        .footer-logo-text { font-family: 'Playfair Display', serif; font-size: 14px; font-weight: 700; color: #f0ede8; }
        .footer-meta { font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(240,237,232,0.2); letter-spacing: 0.06em; }

        /* Animations */
        @keyframes pulse-dot { 0%,100% { opacity:1; transform:scale(1) } 50% { opacity:0.5; transform:scale(0.8) } }
        @keyframes float-y { 0%,100% { transform:translateX(-50%) translateY(0) } 50% { transform:translateX(-50%) translateY(6px) } }
        @keyframes fade-up { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
        .fade-up { animation: fade-up 0.8s ease forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.35s; }
        .delay-4 { animation-delay: 0.5s; }
        .delay-5 { animation-delay: 0.65s; }

        /* Responsive */
        @media (max-width: 768px) {
          .nav { padding: 0 20px; }
          .stats-inner { grid-template-columns: 1fr; gap: 1px; }
          .mock-grid { grid-template-columns: repeat(2, 1fr); }
          .features-grid { grid-template-columns: repeat(2, 1fr); }
          .cta-inner { padding: 48px 24px; }
          .footer { flex-direction: column; align-items: center; text-align: center; }
          .btn-ghost { display: none; }
        }
        @media (max-width: 480px) {
          .features-grid { grid-template-columns: 1fr; }
          .mock-grid { grid-template-columns: repeat(2, 1fr); }
          .hero-ctas { flex-direction: column; align-items: center; }
          .btn-primary-lg, .btn-outline-lg { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="landing">
        <div className="above-grain">

          {/* ── Navbar ── */}
          <nav className={cn("nav above-grain", scrollY > 20 && "scrolled")}>
            <Link href="/" className="nav-logo">
              <div className="nav-logo-box">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              </div>
              <span className="nav-logo-text">Product Catalog</span>
            </Link>
            <div className="nav-actions">
              <Link href="/dashboard" className="btn-ghost">
                View Demo
              </Link>
              <Link href="/sign-in" className="btn-primary">
                Sign In <ArrowRight size={13} />
              </Link>
            </div>
          </nav>

          {/* ── Hero ── */}
          <section className="hero">
            <div className="hero-glow" />

            {mounted && (
              <>
                <div className="hero-badge fade-up delay-1">
                  <span className="hero-badge-dot" />
                  <span className="hero-badge-text">Full-Stack Portfolio Project</span>
                </div>

                <h1 className="hero-title fade-up delay-2">
                  Inventory,<br />
                  <span className="hero-title-italic">reimagined.</span>
                </h1>

                <p className="hero-sub fade-up delay-3">
                  A production-grade product catalog dashboard. Real database, real auth, real uploads — built to impress.
                </p>

                <div className="hero-ctas fade-up delay-4">
                  <Link href="/dashboard" className="btn-primary btn-primary-lg">
                    Explore Demo <ArrowRight size={15} />
                  </Link>
                  <Link href="/sign-up" className="btn-outline-lg">
                    Get Started Free
                  </Link>
                </div>

                <p className="hero-note fade-up delay-5">No sign-up required to view demo</p>
              </>
            )}

            <div className="hero-scroll">
              <span className="hero-scroll-text">Scroll</span>
              <ChevronDown size={14} />
            </div>
          </section>

          {/* ── Marquee ── */}
          <Marquee />

          {/* ── Stats ── */}
          <section className="stats-section">
            <div className="stats-inner">
              <div className="stat-item">
                <div className="stat-number"><Counter end={8} />+</div>
                <div className="stat-label">Core Features</div>
              </div>
              <div className="stat-item" style={{ borderLeft: "1px solid rgba(255,255,255,0.06)", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="stat-number"><Counter end={4} /></div>
                <div className="stat-label">Live Charts</div>
              </div>
              <div className="stat-item">
                <div className="stat-number"><Counter end={100} />%</div>
                <div className="stat-label">Responsive</div>
              </div>
            </div>
          </section>

          {/* ── Dashboard Preview ── */}
          <section className="preview-section">
            <div className="preview-label">
              <span className="section-eyebrow">Product in action</span>
              <h2 className="section-title">Built for real work</h2>
              <p className="section-sub">Clean UI. Powerful backend. Ships fast.</p>
            </div>

            <div className="browser-frame">
              <div className="browser-bar">
                <div className="browser-dots">
                  <div className="browser-dot" style={{ background: "#ff5f57" }} />
                  <div className="browser-dot" style={{ background: "#febc2e" }} />
                  <div className="browser-dot" style={{ background: "#28c840" }} />
                </div>
                <div className="browser-url">product-catalog.vercel.app/dashboard</div>
              </div>
              <div className="browser-content">
                <div className="mock-header">
                  <div className="mock-title" />
                  <div className="mock-btns">
                    <div className="mock-btn-sm" style={{ width: 72 }} />
                    <div className="mock-btn-sm" style={{ width: 80 }} />
                    <div className="mock-btn-primary" />
                  </div>
                </div>
                <div className="mock-stats">
                  {[0,1,2].map(i => (
                    <div key={i} className="mock-stat">
                      <div className="mock-stat-label" />
                      <div className="mock-stat-val" />
                    </div>
                  ))}
                </div>
                <div className="mock-grid">
                  {[0,1,2,3,4,5].map(i => (
                    <div key={i} className="mock-card">
                      <div className="mock-card-img" style={{ background: `linear-gradient(135deg, rgba(255,255,255,${0.03 + i * 0.01}), rgba(255,255,255,0.01))` }} />
                      <div className="mock-card-body">
                        <div className="mock-card-tag" />
                        <div className="mock-card-title" />
                        <div className="mock-card-footer">
                          <div className="mock-price" />
                          <div className="mock-badge" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Features ── */}
          <section className="features-section">
            <div style={{ textAlign: "center" }}>
              <span className="section-eyebrow">What's inside</span>
              <h2 className="section-title">Every feature, <span style={{ fontStyle: "italic", color: "rgba(240,237,232,0.4)" }}>built right</span></h2>
              <p className="section-sub">Not a tutorial project. A production-grade system.</p>
            </div>

            <div className="features-grid">
              {FEATURES.map(({ icon: Icon, label, title, desc }, i) => (
                <div
                  key={i}
                  className="feature-card"
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className="feature-icon-wrap">
                    <Icon size={15} color={hoveredFeature === i ? "#fbbf24" : "rgba(240,237,232,0.5)"} style={{ transition: "color 0.2s" }} />
                  </div>
                  <span className="feature-tag">{label}</span>
                  <div className="feature-title">{title}</div>
                  <div className="feature-desc">{desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="cta-section">
            <div className="cta-inner">
              <h2 className="cta-title">Ready to explore?</h2>
              <p className="cta-sub">
                Browse the live demo — no account needed.<br />
                Create an account to manage your own catalog.
              </p>
              <div className="cta-btns">
                <Link href="/dashboard" className="btn-primary btn-primary-lg">
                  View Demo <ArrowRight size={15} />
                </Link>
                <Link href="/sign-up" className="btn-outline-lg">
                  Create Account
                </Link>
              </div>
            </div>
          </section>

          {/* ── Footer ── */}
          <footer className="footer">
            <Link href="/" className="footer-logo">
              <div className="footer-logo-box">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#080808" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              </div>
              <span className="footer-logo-text">Product Catalog</span>
            </Link>
            <span className="footer-meta">Built with Next.js · Supabase · Clerk · Cloudinary · Vercel</span>
          </footer>

        </div>
      </div>
    </>
  )
}
