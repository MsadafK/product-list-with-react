"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { ArrowRight, BarChart2, Package, Shield, Upload, Search, Bell, Layers, SlidersHorizontal, ChevronDown, Github, ExternalLink, Sun, Moon } from "lucide-react"

function Counter({ end, suffix = "" }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return
      started.current = true
      observer.disconnect()
      let start = 0
      const step = end / 50
      const timer = setInterval(() => {
        start += step
        if (start >= end) { setCount(end); clearInterval(timer) }
        else setCount(Math.floor(start))
      }, 20)
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end])
  return <span ref={ref}>{count}{suffix}</span>
}

const MARQUEE_ITEMS = ["Next.js 16","Supabase","Clerk Auth","Cloudinary","Tailwind CSS","shadcn/ui","Recharts","TypeScript","React 19","Vercel","PostgreSQL","REST API"]

function Marquee() {
  const repeated = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div style={{overflow:"hidden",borderTop:"1px solid rgba(255,255,255,0.07)",borderBottom:"1px solid rgba(255,255,255,0.07)",padding:"14px 0"}}>
      <div style={{display:"flex",gap:"48px",whiteSpace:"nowrap",animation:"marquee 25s linear infinite"}}>
        {repeated.map((item, i) => (
          <span key={i} style={{fontSize:"11px",fontFamily:"'DM Mono',monospace",letterSpacing:"0.16em",textTransform:"uppercase",color:"rgba(240,237,232,0.28)",display:"inline-flex",alignItems:"center",gap:"10px",flexShrink:0}}>
            <span style={{width:"5px",height:"5px",borderRadius:"50%",background:"#fbbf24",opacity:0.6,display:"inline-block",flexShrink:0}}/>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

const FEATURES = [
  { icon: Package, label: "Products", title: "Full CRUD Management", desc: "Add, edit, delete products with images, pricing, and real-time stock tracking.", color: "#60a5fa" },
  { icon: BarChart2, label: "Analytics", title: "Live Charts & Insights", desc: "4 recharts visualizations — stock by category, price distribution, inventory value.", color: "#34d399" },
  { icon: Upload, label: "Uploads", title: "Cloudinary Integration", desc: "Drag-and-drop image upload with live preview and upload progress bar.", color: "#f472b6" },
  { icon: Shield, label: "Auth", title: "Clerk Authentication", desc: "Secure, production-grade auth with sign-in, sign-up, and session management.", color: "#a78bfa" },
  { icon: Search, label: "Search", title: "Smart Filtering", desc: "Debounced search, category chips, sort by name, price, or stock.", color: "#fbbf24" },
  { icon: Bell, label: "Alerts", title: "Low Stock Notifications", desc: "Auto toast alerts when any product stock drops below threshold.", color: "#fb923c" },
  { icon: Layers, label: "Bulk", title: "Bulk Actions & Export", desc: "Multi-select delete and one-click CSV export of your entire catalog.", color: "#2dd4bf" },
  { icon: SlidersHorizontal, label: "Logs", title: "Activity Audit Trail", desc: "Every create, update, delete logged with timestamps in analytics.", color: "#e879f9" },
]

const STEPS = [
  { num: "01", title: "Browse the demo", desc: "Explore the full product catalog, analytics, and features — no account needed." },
  { num: "02", title: "Create an account", desc: "Sign up with email or Google via Clerk. Secure and takes under 30 seconds." },
  { num: "03", title: "Manage your catalog", desc: "Add products, upload images, track stock, and view real-time analytics." },
]

const TECH = [
  { name: "Next.js 16", desc: "App Router, API Routes, SSR" },
  { name: "Supabase", desc: "PostgreSQL database" },
  { name: "Clerk", desc: "Authentication & sessions" },
  { name: "Cloudinary", desc: "Image storage & delivery" },
  { name: "Tailwind CSS", desc: "Utility-first styling" },
  { name: "shadcn/ui", desc: "Accessible UI components" },
  { name: "Recharts", desc: "Data visualization" },
  { name: "TypeScript", desc: "Type safety" },
  { name: "Vercel", desc: "Deployment & hosting" },
  { name: "Sonner", desc: "Toast notifications" },
]

const BrowserFrame = ({ url, children }) => (
  <div style={{borderRadius:"14px",border:"1px solid rgba(255,255,255,0.1)",overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.7),0 0 0 1px rgba(255,255,255,0.04)"}}>
    <div style={{background:"#131313",padding:"11px 14px",display:"flex",alignItems:"center",gap:"12px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
      <div style={{display:"flex",gap:"6px",flexShrink:0}}>
        <div style={{width:"11px",height:"11px",borderRadius:"50%",background:"#ff5f57",flexShrink:0}}/>
        <div style={{width:"11px",height:"11px",borderRadius:"50%",background:"#febc2e",flexShrink:0}}/>
        <div style={{width:"11px",height:"11px",borderRadius:"50%",background:"#28c840",flexShrink:0}}/>
      </div>
      <div style={{flex:1}}>
        <div style={{background:"#1c1c1c",borderRadius:"6px",padding:"5px 10px",fontFamily:"'DM Mono',monospace",fontSize:"10px",color:"rgba(255,255,255,0.25)",textAlign:"center",maxWidth:"280px",margin:"0 auto"}}>
          {url}
        </div>
      </div>
    </div>
    <div style={{overflow:"hidden",lineHeight:0,background:"#0c0c0c"}}>
      {children}
    </div>
  </div>
)

const GITHUB_URL = "https://github.com"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hoveredFeature, setHoveredFeature] = useState(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        html{scroll-behavior:smooth}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .lp{background:#080808;color:#f0ede8;min-height:100vh;font-family:'DM Sans',system-ui,sans-serif;overflow-x:hidden;position:relative}
        .lp::before{content:'';position:fixed;inset:0;z-index:1;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");opacity:0.032}

        /* Light mode overrides */
        :root:not(.dark) .lp { background: #fafafa; color: #111; }
        :root:not(.dark) .lp::before { opacity: 0.015; }
        :root:not(.dark) .hero-glow { background: radial-gradient(ellipse,rgba(251,191,36,0.1) 0%,transparent 65%); }
        :root:not(.dark) .hero-grid { background-image: linear-gradient(rgba(0,0,0,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.04) 1px,transparent 1px); }
        :root:not(.dark) .hero-title { color: #111; }
        :root:not(.dark) .hero-italic { color: rgba(0,0,0,0.3); }
        :root:not(.dark) .hero-sub { color: rgba(0,0,0,0.5); }
        :root:not(.dark) .hero-note { color: rgba(0,0,0,0.3); }
        :root:not(.dark) .nav.scrolled { background: rgba(250,250,250,0.9); border-bottom-color: rgba(0,0,0,0.08); }
        :root:not(.dark) .nav-logo-text { color: #111; }
        :root:not(.dark) .nav-logo-box { background: #111; }
        :root:not(.dark) .nav-ghost { border-color: rgba(0,0,0,0.15); color: rgba(0,0,0,0.55); }
        :root:not(.dark) .nav-ghost:hover { border-color: rgba(0,0,0,0.4); color: #111; }
        :root:not(.dark) .nav-primary { background: #111; color: #fafafa; }
        :root:not(.dark) .nav-primary:hover { background: #000; }
        :root:not(.dark) .nav-burger { border-color: rgba(0,0,0,0.15); }
        :root:not(.dark) .nav-burger span { background: #111; }
        :root:not(.dark) .mob-menu { background: rgba(250,250,250,0.97); border-bottom-color: rgba(0,0,0,0.08); }
        :root:not(.dark) .mob-menu a { border-color: rgba(0,0,0,0.08); color: rgba(0,0,0,0.65); }
        :root:not(.dark) .mob-menu a:hover { background: rgba(0,0,0,0.04); color: #111; }
        :root:not(.dark) .mob-menu a.mob-primary { background: #111; color: #fafafa; }
        :root:not(.dark) .stats-inner { border-color: rgba(0,0,0,0.08); }
        :root:not(.dark) .stat-item { background: #fafafa; }
        :root:not(.dark) .stat-item:not(:last-child)::after { background: rgba(0,0,0,0.08); }
        :root:not(.dark) .stat-num { color: #111; }
        :root:not(.dark) .stat-label { color: rgba(0,0,0,0.4); }
        :root:not(.dark) .sec-title { color: #111; }
        :root:not(.dark) .sec-sub { color: rgba(0,0,0,0.45); }
        :root:not(.dark) .features-grid { background: rgba(0,0,0,0.06); border-color: rgba(0,0,0,0.06); }
        :root:not(.dark) .feat-card { background: #fafafa; }
        :root:not(.dark) .feat-card:hover { background: #f4f4f4; }
        :root:not(.dark) .feat-icon-wrap { border-color: rgba(0,0,0,0.1); }
        :root:not(.dark) .feat-title { color: #111; }
        :root:not(.dark) .feat-desc { color: rgba(0,0,0,0.42); }
        :root:not(.dark) .hiw-grid { background: rgba(0,0,0,0.06); border-color: rgba(0,0,0,0.06); }
        :root:not(.dark) .hiw-card { background: #fafafa; }
        :root:not(.dark) .hiw-num { color: rgba(0,0,0,0.06); }
        :root:not(.dark) .hiw-title { color: #111; }
        :root:not(.dark) .hiw-desc { color: rgba(0,0,0,0.45); }
        :root:not(.dark) .tech-chip { border-color: rgba(0,0,0,0.1); background: rgba(0,0,0,0.02); }
        :root:not(.dark) .tech-chip:hover { border-color: rgba(0,0,0,0.25); background: rgba(0,0,0,0.05); }
        :root:not(.dark) .tech-name { color: rgba(0,0,0,0.8); }
        :root:not(.dark) .tech-desc { color: rgba(0,0,0,0.35); }
        :root:not(.dark) .tech-dot { background: rgba(0,0,0,0.2); }
        :root:not(.dark) .cta-inner { border-color: rgba(0,0,0,0.1); background: linear-gradient(160deg,rgba(0,0,0,0.02),rgba(0,0,0,0)); }
        :root:not(.dark) .cta-title { color: #111; }
        :root:not(.dark) .cta-sub { color: rgba(0,0,0,0.45); }
        :root:not(.dark) .cta-note { color: rgba(0,0,0,0.3); }
        :root:not(.dark) .btn-dark { background: #111; color: #fafafa; }
        :root:not(.dark) .btn-dark:hover { background: #000; }
        :root:not(.dark) .btn-glass { background: rgba(0,0,0,0.04); color: #111; border-color: rgba(0,0,0,0.15); }
        :root:not(.dark) .btn-glass:hover { background: rgba(0,0,0,0.08); border-color: rgba(0,0,0,0.3); }
        :root:not(.dark) .footer { border-top-color: rgba(0,0,0,0.08); }
        :root:not(.dark) .footer-logo-box { background: #111; }
        :root:not(.dark) .footer-logo-text { color: #111; }
        :root:not(.dark) .footer-link { color: rgba(0,0,0,0.35); }
        :root:not(.dark) .footer-link:hover { color: rgba(0,0,0,0.7); }
        :root:not(.dark) .footer-meta { color: rgba(0,0,0,0.25); }
        :root:not(.dark) .hero-scroll { color: rgba(0,0,0,0.3); }
        :root:not(.dark) .hero-badge { border-color: rgba(251,191,36,0.4); background: rgba(251,191,36,0.08); }
        .ag{position:relative;z-index:2}

        .nav{position:fixed;top:0;left:0;right:0;z-index:200;height:60px;padding:0 40px;display:flex;align-items:center;justify-content:space-between;transition:all 0.3s}
        .nav.scrolled{background:rgba(8,8,8,0.88);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,0.07)}
        .nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none;flex-shrink:0}
        .nav-logo-box{width:28px;height:28px;background:#f0ede8;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .nav-logo-text{font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:#f0ede8;letter-spacing:-0.02em}
        .nav-links{display:flex;align-items:center;gap:8px}
        .nav-ghost{background:transparent;border:1px solid rgba(255,255,255,0.13);color:rgba(240,237,232,0.55);padding:7px 16px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;transition:all 0.2s;text-decoration:none;display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
        .nav-ghost:hover{border-color:rgba(255,255,255,0.32);color:#f0ede8}
        .nav-primary{background:#f0ede8;border:none;color:#080808;padding:7px 18px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;transition:all 0.2s;text-decoration:none;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;flex-shrink:0}
        .nav-primary:hover{background:#fff;transform:translateY(-1px)}
        .nav-burger{display:none;background:transparent;border:1px solid rgba(255,255,255,0.13);border-radius:8px;padding:7px 10px;cursor:pointer;flex-direction:column;gap:4px;align-items:center;justify-content:center}
        .nav-burger span{display:block;width:18px;height:1.5px;background:#f0ede8;border-radius:2px;transition:all 0.25s}

        .mob-menu{display:none;position:fixed;top:60px;left:0;right:0;z-index:190;background:rgba(8,8,8,0.97);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,0.07);padding:20px;flex-direction:column;gap:10px}
        .mob-menu.open{display:flex}
        .mob-menu a{padding:12px 16px;border-radius:10px;text-decoration:none;color:rgba(240,237,232,0.7);font-size:14px;border:1px solid rgba(255,255,255,0.07);transition:all 0.2s;display:flex;align-items:center;gap:8px}
        .mob-menu a:hover{background:rgba(255,255,255,0.04);color:#f0ede8}
        .mob-menu a.mob-primary{background:#f0ede8;color:#080808;font-weight:500;border-color:transparent}
        .mob-menu a.mob-primary:hover{background:#fff}

        .hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:100px 24px 80px;position:relative}
        .hero-glow{position:absolute;top:15%;left:50%;transform:translateX(-50%);width:min(700px,100vw);height:min(700px,100vw);background:radial-gradient(ellipse,rgba(251,191,36,0.07) 0%,transparent 65%);pointer-events:none}
        .hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%);pointer-events:none}
        .hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border:1px solid rgba(251,191,36,0.28);border-radius:100px;background:rgba(251,191,36,0.06);margin-bottom:32px}
        .hero-badge-dot{width:6px;height:6px;border-radius:50%;background:#fbbf24;animation:pulse-dot 2s ease-in-out infinite;flex-shrink:0}
        .hero-badge-text{font-family:'DM Mono',monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(251,191,36,0.75)}
        .hero-title{font-family:'Playfair Display',serif;font-size:clamp(3rem,9vw,7.5rem);font-weight:900;line-height:0.93;letter-spacing:-0.035em;margin-bottom:28px}
        .hero-italic{font-style:italic;color:rgba(240,237,232,0.35)}
        .hero-sub{font-size:clamp(15px,2.2vw,18px);color:rgba(240,237,232,0.42);max-width:460px;line-height:1.75;margin-bottom:44px;font-weight:300}
        .hero-ctas{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-bottom:18px}
        .btn-lg{padding:13px 26px;font-size:15px;border-radius:10px;font-family:'DM Sans',sans-serif;font-weight:500;cursor:pointer;transition:all 0.2s;text-decoration:none;display:inline-flex;align-items:center;gap:8px;white-space:nowrap}
        .btn-dark{background:#f0ede8;color:#080808;border:none}
        .btn-dark:hover{background:#fff;transform:translateY(-1px);box-shadow:0 8px 24px rgba(240,237,232,0.12)}
        .btn-glass{background:rgba(255,255,255,0.04);color:#f0ede8;border:1px solid rgba(255,255,255,0.16)}
        .btn-glass:hover{background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.3)}
        .hero-note{font-family:'DM Mono',monospace;font-size:11px;color:rgba(240,237,232,0.22);letter-spacing:0.07em}
        .hero-scroll{position:absolute;bottom:28px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:5px;opacity:0.28;animation:float-y 2.5s ease-in-out infinite}
        .hero-scroll-text{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.15em;text-transform:uppercase}

        .stats-wrap{padding:80px 24px 0}
        .stats-inner{max-width:860px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);border:1px solid rgba(255,255,255,0.07);border-radius:18px;overflow:hidden}
        .stat-item{background:#080808;padding:40px 24px;text-align:center;position:relative}
        .stat-item:not(:last-child)::after{content:'';position:absolute;right:0;top:20%;bottom:20%;width:1px;background:rgba(255,255,255,0.07)}
        .stat-num{font-family:'Playfair Display',serif;font-size:clamp(2.2rem,5vw,3.8rem);font-weight:900;letter-spacing:-0.04em;color:#f0ede8;line-height:1;margin-bottom:8px}
        .stat-label{font-size:12px;color:rgba(240,237,232,0.32);letter-spacing:0.06em;font-family:'DM Mono',monospace;text-transform:uppercase}

        .sec-wrap{padding:100px 24px 0}
        .sec-label{text-align:center;margin-bottom:52px}
        .eyebrow{font-family:'DM Mono',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(251,191,36,0.65);margin-bottom:14px;display:block}
        .sec-title{font-family:'Playfair Display',serif;font-size:clamp(2rem,4.5vw,3.4rem);font-weight:700;letter-spacing:-0.03em;line-height:1.08}
        .sec-sub{font-size:15px;color:rgba(240,237,232,0.38);margin-top:14px;font-weight:300;line-height:1.6}

        .screenshot-grid{max-width:980px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .screenshot-grid+.screenshot-grid{margin-top:16px}

        .features-grid{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.06);border-radius:20px;overflow:hidden}
        .feat-card{background:#080808;padding:28px 22px;transition:background 0.25s;position:relative;overflow:hidden;cursor:default}
        .feat-card:hover{background:#0e0e0e}
        .feat-glow{position:absolute;inset:0;opacity:0;transition:opacity 0.3s;pointer-events:none}
        .feat-card:hover .feat-glow{opacity:1}
        .feat-icon-wrap{width:36px;height:36px;border-radius:9px;border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;margin-bottom:16px;transition:border-color 0.25s;flex-shrink:0}
        .feat-tag{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:7px;display:block}
        .feat-title{font-size:13.5px;font-weight:500;color:#f0ede8;margin-bottom:8px;line-height:1.3}
        .feat-desc{font-size:12px;color:rgba(240,237,232,0.33);line-height:1.68;font-weight:300}

        .hiw-grid{max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.06);border-radius:20px;overflow:hidden}
        .hiw-card{background:#080808;padding:36px 28px;position:relative}
        .hiw-num{font-family:'Playfair Display',serif;font-size:clamp(3rem,6vw,5rem);font-weight:900;color:rgba(255,255,255,0.04);line-height:1;margin-bottom:20px;letter-spacing:-0.05em}
        .hiw-title{font-size:15px;font-weight:500;color:#f0ede8;margin-bottom:10px}
        .hiw-desc{font-size:13px;color:rgba(240,237,232,0.38);line-height:1.65;font-weight:300}
        .hiw-line{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#fbbf24,transparent);opacity:0;transition:opacity 0.3s}
        .hiw-card:hover .hiw-line{opacity:1}

        .tech-grid{max-width:900px;margin:0 auto;display:flex;flex-wrap:wrap;gap:10px;justify-content:center}
        .tech-chip{display:flex;align-items:center;gap:10px;padding:10px 18px;border:1px solid rgba(255,255,255,0.08);border-radius:100px;background:rgba(255,255,255,0.02);transition:all 0.2s;cursor:default}
        .tech-chip:hover{border-color:rgba(255,255,255,0.2);background:rgba(255,255,255,0.05);transform:translateY(-1px)}
        .tech-name{font-size:13px;font-weight:500;color:rgba(240,237,232,0.8)}
        .tech-desc{font-family:'DM Mono',monospace;font-size:10px;color:rgba(240,237,232,0.28);letter-spacing:0.04em}
        .tech-dot{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,0.15);flex-shrink:0}

        .cta-wrap{padding:100px 24px 100px}
        .cta-inner{max-width:660px;margin:0 auto;border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:72px 48px;text-align:center;position:relative;overflow:hidden;background:linear-gradient(160deg,rgba(255,255,255,0.025),rgba(255,255,255,0))}
        .cta-inner::before{content:'';position:absolute;top:-1px;left:15%;right:15%;height:1px;background:linear-gradient(90deg,transparent,rgba(251,191,36,0.5),transparent)}
        .cta-inner::after{content:'';position:absolute;bottom:0;left:0;right:0;height:120px;background:radial-gradient(ellipse at 50% 120%,rgba(251,191,36,0.04),transparent 70%);pointer-events:none}
        .cta-title{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,4vw,2.8rem);font-weight:700;letter-spacing:-0.03em;margin-bottom:16px;line-height:1.1}
        .cta-sub{font-size:15px;color:rgba(240,237,232,0.38);margin-bottom:36px;font-weight:300;line-height:1.65}
        .cta-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:24px}
        .cta-note{font-family:'DM Mono',monospace;font-size:10px;color:rgba(240,237,232,0.2);letter-spacing:0.08em}

        .footer{border-top:1px solid rgba(255,255,255,0.06);padding:28px 40px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
        .footer-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
        .footer-logo-box{width:22px;height:22px;background:#f0ede8;border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .footer-logo-text{font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:#f0ede8}
        .footer-links{display:flex;align-items:center;gap:16px}
        .footer-link{font-family:'DM Mono',monospace;font-size:11px;color:rgba(240,237,232,0.25);text-decoration:none;letter-spacing:0.06em;transition:color 0.2s;display:inline-flex;align-items:center;gap:5px}
        .footer-link:hover{color:rgba(240,237,232,0.6)}
        .footer-meta{font-family:'DM Mono',monospace;font-size:11px;color:rgba(240,237,232,0.18);letter-spacing:0.04em}

        @keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.75)}}
        @keyframes float-y{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(7px)}}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-33.33%)}}
        @keyframes fade-up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fade-up 0.75s ease forwards;opacity:0}
        .d1{animation-delay:0.08s}.d2{animation-delay:0.18s}.d3{animation-delay:0.3s}.d4{animation-delay:0.44s}.d5{animation-delay:0.58s}

        @media(max-width:1024px){.features-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:768px){
          .nav{padding:0 20px}
          .nav-links{display:none}
          .nav-burger{display:flex}
          .stats-inner{grid-template-columns:1fr}
          .stat-item:not(:last-child)::after{top:auto;bottom:0;left:20%;right:20%;width:auto;height:1px}
          .hiw-grid{grid-template-columns:1fr}
          .screenshot-grid{grid-template-columns:1fr}
          .footer{flex-direction:column;align-items:center;text-align:center;padding:24px 20px}
          .footer-links{justify-content:center;flex-wrap:wrap}
          .cta-inner{padding:48px 24px}
        }
        @media(max-width:640px){
          .features-grid{grid-template-columns:1fr;border-radius:16px}
        }
        @media(max-width:480px){
          .hero{padding:90px 20px 70px}
          .hero-ctas{width:100%;max-width:320px}
          .hero-ctas .btn-lg{width:100%;justify-content:center}
          .cta-btns .btn-lg{width:100%;justify-content:center}
          .tech-desc{display:none}
          .hiw-card{padding:28px 20px}
        }
      `}</style>

      <div className="lp">
        <div className="ag">

          {/* NAV */}
          <nav className={`nav${scrolled ? " scrolled" : ""}`}>
            <Link href="/" className="nav-logo">
              <div className="nav-logo-box">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#080808" strokeWidth="2.5">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                </svg>
              </div>
              <span className="nav-logo-text">Product Catalog</span>
            </Link>
            <div className="nav-links">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="nav-ghost">
                <Github size={13}/> GitHub
              </a>
              <Link href="/dashboard" className="nav-ghost">View Demo</Link>
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="nav-ghost"
                  title="Toggle theme"
                  style={{padding:"7px 10px"}}
                >
                  {theme === "dark" ? <Sun size={14}/> : <Moon size={14}/>}
                </button>
              )}
              <Link href="/sign-in" className="nav-primary">Sign In <ArrowRight size={13}/></Link>
            </div>
            <button className="nav-burger" onClick={() => setMobileMenuOpen(o => !o)} aria-label="Toggle menu">
              <span style={{transform:mobileMenuOpen?"rotate(45deg) translate(4px,4px)":"none"}}/>
              <span style={{opacity:mobileMenuOpen?0:1}}/>
              <span style={{transform:mobileMenuOpen?"rotate(-45deg) translate(4px,-4px)":"none"}}/>
            </button>
          </nav>

          {/* MOBILE MENU */}
          <div className={`mob-menu${mobileMenuOpen?" open":""}`}>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <ExternalLink size={14}/> View Demo
            </Link>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>
              <Github size={14}/> GitHub
            </a>
            {mounted && (
              <a onClick={() => { setTheme(theme === "dark" ? "light" : "dark"); setMobileMenuOpen(false) }} style={{cursor:"pointer"}}>
                {theme === "dark" ? <Sun size={14}/> : <Moon size={14}/>}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </a>
            )}
            <Link href="/sign-up" className="mob-primary" onClick={() => setMobileMenuOpen(false)}>
              <ArrowRight size={14}/> Get Started Free
            </Link>
            <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
          </div>

          {/* HERO */}
          <section className="hero">
            <div className="hero-glow"/>
            <div className="hero-grid"/>
            {mounted && (
              <>
                <div className="hero-badge fu d1">
                  <span className="hero-badge-dot"/>
                  <span className="hero-badge-text">Full-Stack Portfolio Project</span>
                </div>
                <h1 className="hero-title fu d2">
                  Inventory,<br/>
                  <span className="hero-italic">reimagined.</span>
                </h1>
                <p className="hero-sub fu d3">
                  A production-grade product catalog dashboard. Real database, real auth, real uploads — built to impress.
                </p>
                <div className="hero-ctas fu d4">
                  <Link href="/dashboard" className="btn-lg btn-dark">
                    Explore Demo <ArrowRight size={15}/>
                  </Link>
                  <Link href="/sign-up" className="btn-lg btn-glass">
                    Get Started Free
                  </Link>
                </div>
                <p className="hero-note fu d5">No sign-up required to view demo</p>
              </>
            )}
            <div className="hero-scroll">
              <span className="hero-scroll-text">Scroll</span>
              <ChevronDown size={13}/>
            </div>
          </section>

          {/* MARQUEE */}
          <Marquee/>

          {/* STATS */}
          <div className="stats-wrap">
            <div className="stats-inner">
              <div className="stat-item">
                <div className="stat-num"><Counter end={8}/>+</div>
                <div className="stat-label">Core Features</div>
              </div>
              <div className="stat-item">
                <div className="stat-num"><Counter end={4}/></div>
                <div className="stat-label">Live Charts</div>
              </div>
              <div className="stat-item">
                <div className="stat-num"><Counter end={100}/>%</div>
                <div className="stat-label">Responsive</div>
              </div>
            </div>
          </div>

          {/* PREVIEW */}
          <div className="sec-wrap">
            <div className="sec-label">
              <span className="eyebrow">Product in action</span>
              <h2 className="sec-title">Built for real work</h2>
              <p className="sec-sub">Clean UI. Powerful backend. Ships fast.</p>
            </div>

            <div className="screenshot-grid">
              <BrowserFrame url="app/dashboard — card view">
                <img src="/product-one.png" alt="Product Dashboard Card View" style={{width:"100%",height:"auto",display:"block"}}/>
              </BrowserFrame>
              <BrowserFrame url="app/dashboard — list view">
                <img src="/product-two.png" alt="Product Dashboard List View" style={{width:"100%",height:"auto",display:"block"}}/>
              </BrowserFrame>
            </div>

            <div className="screenshot-grid" style={{marginTop:"16px"}}>
              <BrowserFrame url="app/analytics — overview">
                <img src="/analytics-one.png" alt="Analytics Dashboard" style={{width:"100%",height:"auto",display:"block"}}/>
              </BrowserFrame>
              <BrowserFrame url="app/analytics — charts">
                <img src="/analytics-two.png" alt="Analytics Charts" style={{width:"100%",height:"auto",display:"block"}}/>
              </BrowserFrame>
            </div>
          </div>

          {/* FEATURES */}
          <div className="sec-wrap">
            <div className="sec-label">
              <span className="eyebrow">What's inside</span>
              <h2 className="sec-title">Every feature, <span style={{fontStyle:"italic",color:"rgba(240,237,232,0.32)"}}>built right</span></h2>
              <p className="sec-sub">Not a tutorial project. A production-grade system.</p>
            </div>
            <div className="features-grid">
              {FEATURES.map(({icon:Icon,label,title,desc,color},i) => (
                <div
                  key={i}
                  className="feat-card"
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className="feat-glow" style={{background:`radial-gradient(ellipse at 0% 0%,${color}08,transparent 60%)`}}/>
                  <div className="feat-icon-wrap" style={{borderColor:hoveredFeature===i?`${color}40`:"rgba(255,255,255,0.1)"}}>
                    <Icon size={15} color={hoveredFeature===i?color:"rgba(240,237,232,0.45)"} style={{transition:"color 0.25s",flexShrink:0}}/>
                  </div>
                  <span className="feat-tag" style={{color:`${color}80`}}>{label}</span>
                  <div className="feat-title">{title}</div>
                  <div className="feat-desc">{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* HOW IT WORKS */}
          <div className="sec-wrap">
            <div className="sec-label">
              <span className="eyebrow">Get started</span>
              <h2 className="sec-title">Three steps, <span style={{fontStyle:"italic",color:"rgba(240,237,232,0.32)"}}>that's it</span></h2>
            </div>
            <div className="hiw-grid">
              {STEPS.map(({num,title,desc},i) => (
                <div key={i} className="hiw-card">
                  <div className="hiw-line"/>
                  <div className="hiw-num">{num}</div>
                  <div className="hiw-title">{title}</div>
                  <div className="hiw-desc">{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* TECH STACK */}
          <div className="sec-wrap">
            <div className="sec-label">
              <span className="eyebrow">Built with</span>
              <h2 className="sec-title">Production-grade <span style={{fontStyle:"italic",color:"rgba(240,237,232,0.32)"}}>tools</span></h2>
            </div>
            <div className="tech-grid">
              {TECH.map(({name,desc},i) => (
                <div key={i} className="tech-chip">
                  <div className="tech-dot"/>
                  <span className="tech-name">{name}</span>
                  <span className="tech-desc">— {desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="cta-wrap">
            <div className="cta-inner">
              <h2 className="cta-title">Ready to explore?</h2>
              <p className="cta-sub">
                Try the live demo — no account needed.<br/>
                Create an account to manage your own catalog.
              </p>
              <div className="cta-btns">
                <Link href="/dashboard" className="btn-lg btn-dark">
                  View Demo <ArrowRight size={15}/>
                </Link>
                <Link href="/sign-up" className="btn-lg btn-glass">
                  Create Account
                </Link>
              </div>
              <p className="cta-note">Free forever · No credit card required</p>
            </div>
          </div>

          {/* FOOTER */}
          <footer className="footer">
            <Link href="/" className="footer-logo">
              <div className="footer-logo-box">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#080808" strokeWidth="2.5">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                </svg>
              </div>
              <span className="footer-logo-text">Product Catalog</span>
            </Link>
            <div className="footer-links">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="footer-link">
                <Github size={12}/> GitHub
              </a>
              <Link href="/dashboard" className="footer-link">
                <ExternalLink size={12}/> Demo
              </Link>
              <Link href="/sign-up" className="footer-link">Sign Up</Link>
            </div>
            <span className="footer-meta">Next.js · Supabase · Clerk · Cloudinary</span>
          </footer>

        </div>
      </div>
    </>
  )
}