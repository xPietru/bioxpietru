import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Music } from 'lucide-react';
import { LanyardData } from '../hooks/useLanyard';

export const SpotifyWidget = ({ data }: { data: LanyardData }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!data?.spotify) return;

    const interval = setInterval(() => {
      const { start, end } = data.spotify!.timestamps;
      const now = Date.now();
      const total = end - start;
      const current = now - start;
      setProgress(Math.min(100, Math.max(0, (current / total) * 100)));
    }, 1000);

    return () => clearInterval(interval);
  }, [data?.spotify]);

  if (!data?.spotify) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-lg p-3 flex items-center gap-3 sm:gap-4 hover:border-black/30 dark:hover:border-white/30 transition-colors"
    >
      <div className="relative h-14 w-14 flex-shrink-0 rounded overflow-hidden group">
        <img 
          src={data.spotify.album_art_url} 
          alt={data.spotify.album}
          className="w-full h-full object-cover transition-all duration-500"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Music className="w-5 h-5 text-white" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-mono text-green-600 dark:text-green-500 uppercase tracking-widest">Spotify</span>
          
          {/* Audio Visualizer */}
          <div className="flex items-end gap-[2px] h-3 ml-auto">
            <div className="w-[3px] bg-green-600 dark:bg-green-500 rounded-sm visualizer-bar" />
            <div className="w-[3px] bg-green-600 dark:bg-green-500 rounded-sm visualizer-bar" />
            <div className="w-[3px] bg-green-600 dark:bg-green-500 rounded-sm visualizer-bar" />
            <div className="w-[3px] bg-green-600 dark:bg-green-500 rounded-sm visualizer-bar" />
          </div>
        </div>
        <h3 className="text-slate-900 dark:text-white font-bold truncate text-sm tracking-tight">{data.spotify.song}</h3>
        <p className="text-slate-500 dark:text-white/50 text-xs truncate font-mono mt-0.5">{data.spotify.artist}</p>
        
        <div className="mt-3 h-[2px] w-full bg-black/10 dark:bg-white/10 overflow-hidden">
          <div 
            className="h-full bg-slate-900 dark:bg-white transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};
