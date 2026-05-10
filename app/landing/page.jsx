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
    <div className="marquee-wrap">
      <div className="marquee-track">
        {repeated.map((item, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-dot"/>
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
  <div className="browser-frame">
    <div className="browser-frame-bar">
      <div className="browser-dots">
        <div className="browser-dot red"/>
        <div className="browser-dot yellow"/>
        <div className="browser-dot green"/>
      </div>

      <div className="browser-address-wrap">
        <div className="browser-address">
          {url}
        </div>
      </div>
    </div>

    <div className="browser-frame-image">
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
      <div className="lp">
        <div className="ag">

          {/* NAV */}
          <nav className={`nav${scrolled ? " scrolled" : ""}`}>
            <Link href="/" className="nav-logo">
              <div className="nav-logo-box">
                <svg className="nav-logo-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
              <h2 className="sec-title">Every feature, <span className="sec-title-italic">built right</span></h2>
              <p className="sec-sub">Not a tutorial project. A production-grade system.</p>
            </div>
            <div className="features-grid">
              {FEATURES.map(({icon:Icon,label,title,desc,color},i) => (
                <div
                  key={i}
                  className="feat-card"
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  style={{"--feature-color": color}}
                >
                  <div className="feat-glow" style={{background:`radial-gradient(ellipse at 0% 0%,${color}08,transparent 60%)`}}/>
                  <div className={`feat-icon-wrap${hoveredFeature===i ? " active" : ""}`}>
                    <Icon size={15} className="feat-icon"/>
                  </div>
                  <span className="feat-tag">{label}</span>
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
              <h2 className="sec-title">Three steps, <span className="sec-title-italic">that's it</span></h2>
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
              <h2 className="sec-title">Production-grade <span className="sec-title-italic">tools</span></h2>
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
                <svg className="footer-logo-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
