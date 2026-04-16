/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { EnterScreen } from './components/EnterScreen';
import { DiscordWidget } from './components/DiscordWidget';
import { SpotifyWidget } from './components/SpotifyWidget';
import { SocialLinks } from './components/SocialLinks';
import { ParticleNetwork } from './components/ParticleNetwork';
import { useLanyard } from './hooks/useLanyard';
import { siteConfig } from './config';

export default function App() {
  const [entered, setEntered] = useState(false);
  // Default to dark mode
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved !== 'light';
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  const lanyardData = useLanyard(siteConfig.discordId);

  // Mouse position for 3D tilt and parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the mouse values
  const springConfig = { damping: 25, stiffness: 120 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Card tilt transforms - reduced to 8 degrees for a very subtle, clean effect
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

  // Background parallax transforms - kept subtle
  const bgX = useTransform(springX, [-0.5, 0.5], [-20, 20]);
  const bgY = useTransform(springY, [-0.5, 0.5], [-20, 20]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX / rect.width) - 0.5;
    const yPct = (e.clientY / rect.height) - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  return (
    <div 
      className={`min-h-screen overflow-hidden relative font-sans selection:bg-purple-500/30 transition-colors duration-500 ${
        isDark ? 'dark bg-black text-white' : 'bg-slate-50 text-slate-900'
      }`}
      onMouseMove={handleMouseMove}
    >
      <ParticleNetwork isDark={isDark} />

      {/* Galaxy Background with Parallax */}
      <motion.div 
        className="fixed inset-[-5%] z-0 pointer-events-none transition-opacity duration-1000"
        style={{ x: bgX, y: bgY }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50 mix-blend-screen grayscale-[30%] transition-opacity duration-1000"
          style={{ 
            backgroundImage: `url('${isDark ? siteConfig.backgroundUrl : siteConfig.lightBackgroundUrl}')`,
            opacity: isDark ? 0.5 : 0.3,
            filter: isDark ? 'grayscale(30%)' : 'grayscale(10%) contrast(1.2)'
          }}
        />
        {/* Gradient overlay to keep it edgy / clean */}
        <div className={`absolute inset-0 bg-gradient-to-b from-transparent ${isDark ? 'via-black/80 to-black' : 'via-slate-50/80 to-slate-50'} transition-colors duration-1000`} />
      </motion.div>

      {/* Edgy Overlays */}
      <div className="scanlines" />
      <div className="fixed inset-0 z-0 pointer-events-none crt-flicker">
        <div className={`absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] ${isDark ? 'opacity-20 mix-blend-overlay' : 'opacity-[0.15] mix-blend-multiply'} transition-opacity duration-500`} />
      </div>

      <EnterScreen show={!entered} onEnter={() => setEntered(true)} />

      {/* Theme Toggle Button */}
      <button 
        onClick={() => setIsDark(!isDark)}
        className={`absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2.5 rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 ${
          isDark 
            ? 'bg-black/50 border-white/10 text-white/50 hover:bg-white/10 hover:text-white' 
            : 'bg-white/50 border-black/10 text-slate-500 hover:bg-white hover:text-slate-900 shadow-sm'
        } ${!entered ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        aria-label="Toggle Theme"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Main Content with 3D Perspective */}
      <main 
        className={`relative z-10 min-h-screen flex items-center justify-center p-4 transition-opacity duration-1000 ${entered ? 'opacity-100' : 'opacity-0'}`}
        style={{ perspective: 1000 }}
      >
        <motion.div 
          className="w-full max-w-md relative"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
          {/* Subtle purple/dark glow behind the card */}
          <div className="absolute inset-0 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" style={{ transform: "translateZ(-20px)" }} />

          {/* Sharp, dark/light card popping out in 3D */}
          <div 
            className={`border rounded-xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden group transition-colors duration-500 ${
              isDark 
                ? 'bg-black/70 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.9)]' 
                : 'bg-white/70 border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)]'
            }`}
            style={{ transform: "translateZ(40px)" }}
          >
            {/* Subtle top highlight */}
            <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent ${isDark ? 'via-white/20' : 'via-black/10'} to-transparent`} />
            
            {lanyardData ? (
              <>
                <DiscordWidget data={lanyardData} />
                
                <div className={`w-full h-px my-6 relative ${isDark ? 'bg-white/10' : 'bg-black/10'}`}>
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${isDark ? 'via-white/20' : 'via-black/20'} to-transparent`} />
                </div>
                
                <div className="space-y-6">
                  <SpotifyWidget data={lanyardData} />
                  <SocialLinks />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className={`w-8 h-8 border rounded-full animate-spin mb-4 ${isDark ? 'border-white/20 border-t-white' : 'border-black/20 border-t-black'}`} />
                <p className={`text-sm font-mono tracking-widest uppercase ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Connecting...</p>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
