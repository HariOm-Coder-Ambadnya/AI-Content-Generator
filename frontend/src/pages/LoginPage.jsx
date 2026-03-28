// src/pages/LoginPage.jsx
import { useEffect, useRef, useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { signInWithGoogle } from '../lib/firebase'
import { 
  Zap, ArrowRight, Sparkles, Globe, Wand2, Cpu, Shield, 
  CheckCircle, Boxes, Orbit, Rocket, Layers, 
  Database, Lock, MousePointer2, BarChart3, 
  Users, MessageSquare, Briefcase, Share2
} from 'lucide-react'
import toast from 'react-hot-toast'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import HeroAnimation from '../components/HeroAnimation'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const FEATURES = [
  { icon: Sparkles, label: 'SEO Blogs', desc: 'Craft long-form narratives that rank.' },
  { icon: Globe, label: 'Social Sync', desc: 'Platform-native copy in seconds.' },
  { icon: Wand2, label: 'Marketing', desc: 'High-conversion ad copy & emails.' },
  { icon: Cpu, label: 'Tech Docs', desc: 'Documentation for the modern era.' },
]

const PRODUCT_INFO = [
  {
    title: "AI Context Engine",
    desc: "Our engine understands your brand voice, audience, and industry nuances to deliver pitch-perfect content every time.",
    icon: Database,
    stats: "99% Brand Accuracy"
  },
  {
    title: "Global Distribution",
    desc: "Instantly publish or schedule your forged content across 20+ social and professional networks.",
    icon: Share2,
    stats: "20+ Platforms"
  },
  {
    title: "Real-time Analytics",
    desc: "Track the performance of your AI-generated content with deep-dive performance metrics.",
    icon: BarChart3,
    stats: "Live Tracking"
  }
]

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const containerRef = useRef(null)
  const heroRef = useRef(null)
  const animationContainerRef = useRef(null)
  const featuresRef = useRef(null)
  const productRef = useRef(null)
  const enterpriseRef = useRef(null)

  useGSAP(() => {
    // Page Load Animation
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } })
    
    tl.from('.nav-item', { 
      y: -20, 
      opacity: 0, 
      stagger: 0.1,
      duration: 0.8 
    })
    .from('.hero-content > *', {
      y: 40,
      opacity: 0,
      stagger: 0.2,
      delay: -0.5
    })
    .from(animationContainerRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 1.5,
      ease: 'power2.out',
    }, '-=1')

    // Scroll reveal for all sections
    const reveals = ['.feature-card', '.product-item', '.enterprise-box']
    reveals.forEach((selector) => {
      gsap.from(selector, {
        scrollTrigger: {
          trigger: selector,
          start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      })
    })

    // Smooth scroll for nav links
    const links = document.querySelectorAll('a[href^="#"]')
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        const target = document.querySelector(link.getAttribute('href'))
        if (target) {
            gsap.to(window, {
                duration: 1.2,
                scrollTo: { y: target, offsetY: 80 },
                ease: "power3.inOut"
            })
        }
      })
    })

  }, { scope: containerRef })

  const handleLogin = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      console.error('Login Error:', err)
      setLoading(false)
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-foreground font-body overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 h-20 bg-white/80 backdrop-blur-md border-b border-divider z-50 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
          <div className="flex items-center gap-2 nav-item cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-display font-black text-xl tracking-tight uppercase">Forge</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <a href="#product" className="nav-item text-sm font-semibold text-muted-foreground hover:text-black transition-colors">Product</a>
            <a href="#enterprise" className="nav-item text-sm font-semibold text-muted-foreground hover:text-black transition-colors">Enterprise</a>
            <a href="#docs" className="nav-item text-sm font-semibold text-muted-foreground hover:text-black transition-colors">Docs</a>
          </div>

          <div className="flex items-center gap-4 nav-item">
            <button 
              onClick={handleLogin}
              className="px-5 py-2 text-sm font-semibold hover:bg-muted rounded-full transition-all text-gray-900"
            >
              Sign In
            </button>
            <button 
              onClick={handleLogin}
              className="px-6 py-2 bg-black text-white rounded-full text-sm font-semibold shadow-md hover:shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-40 pb-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="hero-content text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-muted rounded-full border border-divider">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Version 2.0 Now Live</span>
            </div>
            
            <h1 className="font-display text-7xl md:text-8xl font-bold leading-[1.05] tracking-tight text-gray-900">
              Create at the <br />
              <span className="text-accent underline decoration-accent/20">speed of thought.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-xl leading-relaxed font-medium">
              Forge high-performance content, documentation, and copy with the world's most elegant AI platform. Designed for modern teams.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={handleLogin}
                disabled={loading}
                className="btn-primary group flex items-center justify-center gap-3 px-10 py-4 h-14"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Start Generating Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              <button className="btn-secondary h-14 inline-flex items-center justify-center gap-2 px-8">
                Watch Demo
              </button>
            </div>
          </div>

          <div className="relative lg:block">
            <div ref={animationContainerRef} className="relative z-10 w-full scale-110">
               <HeroAnimation />
            </div>
          </div>
        </div>
      </main>

      {/* Product Section */}
      <section id="product" ref={productRef} className="py-32 bg-gray-50/50 border-y border-divider">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div className="space-y-12">
                <div className="space-y-6">
                   <h2 className="font-display text-5xl font-bold tracking-tight text-gray-900">Intelligence forged <br />for your business.</h2>
                   <p className="text-xl text-muted-foreground leading-relaxed">
                     Forge isn't just a wrapper. It's a fine-tuned content engine that learns from your existing data to generate platform-specific results.
                   </p>
                </div>
                
                <div className="space-y-8">
                   {PRODUCT_INFO.map(item => (
                     <div key={item.title} className="product-item flex gap-6 p-6 bg-white rounded-3xl border border-divider shadow-sm hover:shadow-md transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center flex-shrink-0">
                           <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                           <div className="flex items-center gap-3 mb-1">
                             <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
                             <span className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[9px] font-black uppercase tracking-tight">{item.stats}</span>
                           </div>
                           <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="product-item relative p-12 bg-white rounded-[40px] border border-divider shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
                <div className="relative z-10 space-y-8">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                           <img src="https://api.dicebear.com/8.x/personas/svg?seed=avatar-1" alt="AI" />
                         </div>
                         <div className="text-xs">
                            <p className="font-bold text-gray-900">Forge AI Engine</p>
                            <p className="text-muted-foreground">Synthesizing context...</p>
                         </div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                   </div>
                   
                   <div className="p-6 rounded-2xl bg-muted/50 border border-divider font-mono text-xs leading-relaxed text-gray-600">
                      <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                      >
                        [CONTEXT_SYNC] Found brand guidelines v2.1 <br />
                        [ANALYSIS] Tone set to "Witty & Professional" <br />
                        [FORGE] Generating SEO-optimized blog series... <br />
                        [SUCCESS] 3 high-performance articles forged.
                      </motion.p>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-gray-50 border border-divider">
                         <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">SEO Score</p>
                         <p className="text-2xl font-black text-gray-900">98/100</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gray-50 border border-divider">
                         <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Readability</p>
                         <p className="text-2xl font-black text-gray-900">High</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section id="enterprise" ref={enterpriseRef} className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
           <div className="enterprise-box p-20 rounded-[48px] bg-black text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/20 blur-[150px] -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                 <div className="space-y-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full border border-white/10">
                       <Shield className="w-4 h-4 text-accent" />
                       <span className="text-xs font-bold uppercase tracking-widest text-accent">Enterprise Grade</span>
                    </div>
                    <h2 className="font-display text-5xl md:text-6xl font-bold leading-tight">Built for scale. <br />Trusted by giants.</h2>
                    <p className="text-lg text-white/60 max-w-lg leading-relaxed">
                       Scale your content operations without compromising on security, compliance, or brand consistency. Forge Enterprise provides the dedicated infrastructure you need.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                       {[
                         { icon: Lock, title: "Private VPC", desc: "Your data never leaves your secure cloud environment." },
                         { icon: Users, title: "SSO & IAM", desc: "Fine-grained access control with SAML/Okta integration." },
                         { icon: MessageSquare, title: "SLA Support", desc: "Dedicated account managers and 24/7 priority support." },
                         { icon: Briefcase, title: "Multi-Org", desc: "Manage 100+ brands from a single centralized dashboard." }
                       ].map(item => (
                         <div key={item.title} className="space-y-2">
                            <item.icon className="w-5 h-5 text-accent" />
                            <h4 className="font-bold text-sm tracking-tight">{item.title}</h4>
                            <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                         </div>
                       ))}
                    </div>

                    <button className="px-8 py-4 bg-accent text-white rounded-full font-bold text-sm shadow-xl shadow-accent/20 hover:scale-105 transition-all">
                       Connect with Sales
                    </button>
                 </div>

                 <div className="relative">
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-6">
                       <div className="flex items-center justify-between border-b border-white/10 pb-4">
                          <span className="text-xs font-bold opacity-60 uppercase tracking-widest">Active Infrastructure</span>
                          <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-[10px] font-bold">STABLE</span>
                       </div>
                       <div className="space-y-4">
                          {[92, 88, 96, 75].map((val, i) => (
                            <div key={i} className="space-y-1">
                               <div className="flex justify-between text-[10px] font-bold opacity-40">
                                  <span>CLUSTER_{i+1}_LOAD</span>
                                  <span>{val}%</span>
                               </div>
                               <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${val}%` }}
                                    className="h-full bg-accent shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                                  />
                               </div>
                            </div>
                          ))}
                       </div>
                       <div className="pt-4 flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex-1 text-center">
                             <p className="text-[10px] font-bold opacity-40 mb-1">UPTIME</p>
                             <p className="text-lg font-black tracking-tighter">99.99%</p>
                          </div>
                          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex-1 text-center">
                             <p className="text-[10px] font-bold opacity-40 mb-1">LATENCY</p>
                             <p className="text-lg font-black tracking-tighter">180ms</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-divider bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-display font-black text-lg tracking-tight uppercase">Forge Studio</span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © 2026 FORGE STUDIO. ALL RIGHTS RESERVED.
          </p>

          <div className="flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Github</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
