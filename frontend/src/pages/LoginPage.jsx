// src/pages/LoginPage.jsx
import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { signInWithGoogle } from '../lib/firebase'
import { Zap, ArrowRight, ShieldCheck, Cpu, Terminal, Layers, Box, Fingerprint, Activity, Workflow, ChevronRight, Binary, Database, Network } from 'lucide-react'
import ShapeGrid from '../components/ShapeGrid'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger);

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] }}
    className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
  >
    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-4">{title}</h3>
    <p className="text-white text-2xl font-light leading-relaxed">{desc}</p>
  </motion.div>
)

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const containerRef = useRef(null)
  const heroRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useGSAP(() => {
    // Scrolling text reveal similar to DatologyAI
    const words = document.querySelectorAll('.reveal-word');
    words.forEach(word => {
      gsap.from(word, {
        scrollTrigger: {
          trigger: word,
          start: 'top 85%',
          end: 'top 60%',
          scrub: true,
        },
        opacity: 0.1,
        y: 20,
        filter: 'blur(10px)',
      });
    });

    // Hero content reveal
    gsap.from('.hero-content', {
      opacity: 0,
      y: 60,
      duration: 2,
      ease: 'expo.out',
      stagger: 0.2,
      delay: 0.5
    });
  }, { scope: containerRef });

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
    <div ref={containerRef} className="relative min-h-screen w-full bg-black text-white overflow-x-hidden selection:bg-white selection:text-black">
      
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <ShapeGrid 
          borderColor="#222" 
          hoverFillColor="#333" 
          squareSize={50} 
          speed={0.4} 
          hoverTrailAmount={10}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] h-20 md:h-32 flex items-center justify-center px-6 md:px-12 pointer-events-none">
        <div className="w-full max-w-7xl flex justify-between items-center pointer-events-auto">
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
              <Zap className="w-6 h-6 text-black fill-black" />
            </div>
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.5em]">Forge_OS</span>
          </div>

          <div className="hidden md:flex items-center gap-16 font-mono text-[8px] font-black uppercase tracking-[0.4em] text-white/30">
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#neural" className="hover:text-white transition-colors">Neural_Engine</a>
            <a href="#intelligence" className="hover:text-white transition-colors">Intelligence</a>
          </div>

          <button 
            onClick={handleLogin}
            className="px-10 py-4 rounded-xl bg-white text-black font-mono text-[9px] font-black uppercase tracking-[0.5em] hover:scale-105 active:scale-95 transition-all shadow-2xl"
          >
            {loading ? 'INITIALIZING...' : 'ACCESS_SYSTEM'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 w-full">
        <section ref={heroRef} className="h-screen flex flex-col items-center justify-center text-center px-8">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl border border-white/5 bg-white/[0.02] mb-16 hero-content"
           >
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="font-mono text-[8px] font-black uppercase tracking-[0.5em] text-white/40 italic">CORE_STABLE_V3.4_DEPLOYED</span>
           </motion.div>

           <h1 className="hero-content font-serif text-6xl md:text-[11vw] lg:text-[140px] leading-[0.8] tracking-[-0.05em] mb-16 max-w-5xl">
             Engineer <br />
             <span className="text-white/20 italic">Intelligence.</span>
           </h1>

           <p className="hero-content text-white/40 text-2xl lg:text-3xl font-light max-w-2xl leading-relaxed mb-16 mx-auto">
             A sovereign neural architecture designed for high-performance context processing and content generation.
           </p>

           <button 
             onClick={handleLogin}
             className="hero-content px-16 py-8 rounded-[30px] bg-white text-black font-mono text-[10px] font-black uppercase tracking-[0.6em] hover:scale-105 transition-all shadow-[0_30px_60px_rgba(255,255,255,0.15)] flex items-center gap-6 group"
           >
             Initialize Protocol
             <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
           </button>
        </section>

        {/* Vision Section (DatologyAI Style) */}
        <section className="min-h-screen py-32 md:py-64 px-6 md:px-12 flex flex-col items-center justify-center max-w-7xl mx-auto">
           <div className="space-y-12 max-w-6xl text-center md:text-left">
              {[
                "Most AI systems are generic.",
                "They recycle outputs, lack precision,",
                "and operate within restricted bounds.",
                "Forge is designed to break that.",
                "It’s not just a generator—it’s an OS.",
                "Built to synthesize complex contexts",
                "into pure, engineered intelligence.",
                "Unrestricted. High-performance. Sovereign."
              ].map((line, i) => (
                <h2 key={i} className="reveal-word font-serif text-5xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tighter">
                  {line}
                </h2>
              ))}
           </div>
        </section>

        {/* Product Details Grid */}
        <section id="architecture" className="py-32 md:py-64 px-6 md:px-12 max-w-7xl mx-auto space-y-32">
           <div className="flex flex-col md:flex-row justify-between items-end gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-[1px] bg-white/20" />
                  <span className="font-mono text-[8px] font-black uppercase tracking-[0.6em] text-white/30">SYSTEM_COMPONENTS</span>
                </div>
                <h2 className="font-serif text-7xl md:text-9xl tracking-tighter">Neural <span className="text-white/20">Blueprints.</span></h2>
              </div>
              <p className="text-white/40 text-xl font-light max-w-md leading-relaxed">
                The underlying framework is built on localized neural sharding and real-time synaptic calibration.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={Cpu}
                title="LPU_Optimization"
                desc="Proprietary LPU (Language Processing Unit) integration for 500+ tok/s generation speed."
                delay={0.1}
              />
              <FeatureCard 
                icon={Fingerprint}
                title="Sovereign_Identity"
                desc="Quantum-encrypted authentication through isolated Firebase instances and local keys."
                delay={0.2}
              />
              <FeatureCard 
                icon={Activity}
                title="Live_Calbiration"
                desc="Real-time status tracking with zero-latency buffer synchronization across nodes."
                delay={0.3}
              />
              <FeatureCard 
                icon={Binary}
                title="Context_Synthesis"
                desc="Advanced multidimensional context analysis for higher accuracy in technical domains."
                delay={0.4}
              />
              <FeatureCard 
                icon={Database}
                title="Cloud_Memories"
                desc="Secure archiving with AES-256 sharding across high-performance regional clusters."
                delay={0.5}
              />
              <FeatureCard 
                icon={Network}
                title="Neural_Mesh"
                desc="Interconnected processing units that learn from your archetype configuration patterns."
                delay={0.6}
              />
           </div>
        </section>

        {/* Footer */}
        <footer className="py-32 px-12 border-t border-white/5 bg-white/[0.01]">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24">
              <div className="lg:col-span-6 space-y-12">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                       <Zap className="w-5 h-5 text-black fill-black" />
                    </div>
                    <span className="font-mono text-[10px] font-black uppercase tracking-[0.5em]">Forge</span>
                 </div>
                 <p className="text-white/20 text-sm font-mono max-w-sm uppercase tracking-widest leading-relaxed">
                    Designed for heavy-duty content engineering. Built on the edge of innovation. 2026.
                 </p>
              </div>

              <div className="lg:col-span-6 grid grid-cols-2 lg:grid-cols-3 gap-16 font-mono text-[8px] font-black uppercase tracking-[0.5em] text-white/30">
                 <div className="space-y-8 text-right lg:text-left">
                    <p className="text-white">Social</p>
                    <a href="#" className="block hover:text-white transition-colors">X_Protocol</a>
                    <a href="#" className="block hover:text-white transition-colors">Network</a>
                 </div>
                 <div className="space-y-8 text-right lg:text-left">
                    <p className="text-white">Security</p>
                    <a href="#" className="block hover:text-white transition-colors">Compliance</a>
                    <a href="#" className="block hover:text-white transition-colors">Legal_Doc</a>
                 </div>
                 <div className="space-y-8 text-right lg:text-left">
                    <p className="text-white">Status</p>
                    <div className="flex items-center justify-end lg:justify-start gap-3">
                       <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                       <span className="text-white">Core_Live</span>
                    </div>
                 </div>
              </div>
           </div>
        </footer>
      </main>
    </div>
  )
}
