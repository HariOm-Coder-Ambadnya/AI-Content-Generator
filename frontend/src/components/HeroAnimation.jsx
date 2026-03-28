import { motion } from 'framer-motion'

const Orbit = ({ size, duration, delay = 0, color = 'bg-accent/20' }) => (
  <motion.div
    style={{ width: size, height: size }}
    animate={{ rotate: 360 }}
    transition={{ duration, repeat: Infinity, ease: "linear", delay }}
    className={`absolute rounded-full border border-divider flex items-center justify-center pointer-events-none`}
  >
    <div className={`absolute -top-2 w-4 h-4 rounded-full ${color} blur-sm shadow-xl`} />
  </motion.div>
)

export default function HeroAnimation() {
  return (
    <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden pointer-events-none">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-accent/5 blur-[120px] rounded-full" />
      
      {/* Central Core - REFACTORED to look like a brain/atom, not a loader */}
      <motion.div 
        animate={{ 
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-20 w-56 h-56 rounded-full bg-white shadow-2xl flex items-center justify-center border border-divider"
      >
        <div className="w-52 h-52 rounded-full bg-gradient-to-br from-gray-50 to-white flex items-center justify-center overflow-hidden">
           <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-accent/5 to-transparent" />
           
           {/* Geometric Inner Core */}
           <div className="relative flex items-center justify-center w-24 h-24">
              <motion.div
                animate={{ rotate: [0, 360], borderRadius: ["20%", "50%", "20%"] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-black/5 border-2 border-black/10"
              />
              <motion.div
                animate={{ rotate: [0, -360], borderRadius: ["50%", "25%", "50%"] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border-2 border-accent/20"
              />
              
              {/* Pulse Icon / Energy Ball */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  backgroundColor: ["#111827", "#3b82f6", "#111827"]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-12 h-12 rounded-full flex items-center justify-center z-10 shadow-lg"
              >
                 <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
              </motion.div>
           </div>
        </div>

        {/* Floating Data Nodes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, (i % 2 === 0 ? -30 : 30), 0],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{ 
              duration: 3 + i, 
              repeat: Infinity, 
              delay: i * 0.3,
              ease: "easeInOut"
            }}
            className="absolute p-2 rounded-lg bg-white shadow-sm border border-divider"
            style={{ 
              left: `${15 + i * 10}%`, 
              top: `${10 + (i % 3) * 20}%` 
            }}
          >
             <div className="w-4 h-1 rounded-full bg-accent/20" />
          </motion.div>
        ))}
      </motion.div>

      {/* Rotating Rings */}
      <Orbit size={280} duration={15} color="bg-accent/40" />
      <Orbit size={420} duration={25} delay={-2} color="bg-blue-300/30" />
      <Orbit size={560} duration={40} delay={-5} color="bg-indigo-300/20" />

      {/* Modern Floating Assets */}
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 right-10 w-40 h-40 rounded-[32px] bg-white/40 backdrop-blur-xl border border-white/40 shadow-2xl flex items-center justify-center"
      >
          <div className="w-24 h-2 rounded-full bg-black/5 absolute top-10" />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-blue-600 shadow-xl shadow-accent/20" />
          <div className="w-24 h-2 rounded-full bg-black/5 absolute bottom-10" />
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, 50, 0],
          x: [0, -20, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-10 left-0 w-32 h-32 rounded-full bg-white/20 backdrop-blur-md border border-white/10 shadow-xl flex items-center justify-center"
      >
          <div className="w-12 h-12 rounded-full border-4 border-dashed border-white/20 animate-[spin_10s_linear_infinite]" />
      </motion.div>
    </div>
  )
}
