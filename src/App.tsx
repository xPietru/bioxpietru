/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { EnterScreen } from './components/EnterScreen';
import { DiscordWidget } from './components/DiscordWidget';
import { SpotifyWidget } from './components/SpotifyWidget';
import { SocialLinks } from './components/SocialLinks';
import { ParticleNetwork } from './components/ParticleNetwork';
import { useLanyard } from './hooks/useLanyard';
import { siteConfig } from './config';

export default function App() {
  const [entered, setEntered] = useState(false);
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
      className="min-h-screen bg-black text-white overflow-hidden relative font-sans selection:bg-purple-500/30"
      onMouseMove={handleMouseMove}
    >
      <ParticleNetwork />

      {/* Galaxy Background with Parallax */}
      <motion.div 
        className="fixed inset-[-5%] z-0 pointer-events-none"
        style={{ x: bgX, y: bgY }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50 mix-blend-screen grayscale-[30%]"
          style={{ backgroundImage: `url('${siteConfig.backgroundUrl}')` }}
        />
        {/* Dark gradient overlay to keep it edgy */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black" />
      </motion.div>

      {/* Edgy Overlays */}
      <div className="scanlines" />
      <div className="fixed inset-0 z-0 pointer-events-none crt-flicker">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <EnterScreen show={!entered} onEnter={() => setEntered(true)} />

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

          {/* Sharp, dark card popping out in 3D */}
          <div 
            className="bg-black/70 border border-white/10 rounded-xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] backdrop-blur-md relative overflow-hidden group"
            style={{ transform: "translateZ(40px)" }}
          >
            {/* Subtle top highlight */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            {lanyardData ? (
              <>
                <DiscordWidget data={lanyardData} />
                
                <div className="w-full h-px bg-white/10 my-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
                
                <div className="space-y-6">
                  <SpotifyWidget data={lanyardData} />
                  <SocialLinks />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-8 h-8 border border-white/20 border-t-white rounded-full animate-spin mb-4" />
                <p className="text-white/50 text-sm font-mono tracking-widest uppercase">Connecting...</p>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
