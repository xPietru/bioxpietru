import React from 'react';
import { motion } from 'motion/react';
import { Gamepad2, Sword, Activity, Monitor, Headphones, Tv } from 'lucide-react';
import { LanyardData } from '../hooks/useLanyard';
import { siteConfig } from '../config';

const statusColors = {
  online: 'bg-green-500',
  idle: 'bg-yellow-500',
  dnd: 'bg-red-500',
  offline: 'bg-gray-500'
};

const getActivityIcon = (type: number) => {
  switch (type) {
    case 0: return <Gamepad2 className="w-6 h-6 text-white/30" />;
    case 1: return <Monitor className="w-6 h-6 text-white/30" />;
    case 2: return <Headphones className="w-6 h-6 text-white/30" />;
    case 3: return <Tv className="w-6 h-6 text-white/30" />;
    default: return <Activity className="w-6 h-6 text-white/30" />;
  }
};

const getActivityLabel = (type: number) => {
  switch (type) {
    case 0: return 'Playing';
    case 1: return 'Streaming';
    case 2: return 'Listening to';
    case 3: return 'Watching';
    case 5: return 'Competing in';
    default: return 'Doing';
  }
};

const getImageUrl = (appId?: string, assetId?: string) => {
  if (!assetId) return null;
  if (assetId.startsWith('mp:external/')) {
    return `https://media.discordapp.net/external/${assetId.replace('mp:external/', '')}`;
  }
  if (appId) {
    return `https://cdn.discordapp.com/app-assets/${appId}/${assetId}.png`;
  }
  return null;
};

export const DiscordWidget = ({ data }: { data: LanyardData }) => {
  if (!data) return null;

  const { discord_user, discord_status, custom_status, activities } = data;
  const avatarUrl = `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png?size=256`;

  // Filter out custom status (type 4) and the official Spotify integration (handled by SpotifyWidget)
  // Any other music players or local files will show up here!
  const otherActivities = activities?.filter(a => a.type !== 4 && a.id !== 'spotify:1') || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center w-full"
    >
      <div className="relative mb-5 group">
        <div className="w-24 h-24 sm:w-28 sm:h-28 p-1 bg-white dark:bg-black border border-black/10 dark:border-white/20 rounded-xl overflow-hidden transition-all duration-300 group-hover:border-black/30 dark:group-hover:border-white/40 shadow-lg dark:shadow-none">
          <img 
            src={avatarUrl} 
            alt={discord_user.username}
            className="w-full h-full object-cover rounded-lg grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        </div>
        <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-sm border-2 border-white dark:border-black ${statusColors[discord_status]} shadow-[0_0_10px_rgba(0,0,0,0.2)] dark:shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
      </div>

      <h1 
        className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight glitch-hover cursor-crosshair"
        data-text={siteConfig.cardTitle || discord_user.global_name || discord_user.username}
      >
        {siteConfig.cardTitle || discord_user.global_name || discord_user.username}
      </h1>
      <p className="text-slate-500 dark:text-white/40 font-mono text-xs mb-3">@{discord_user.username}</p>

      {/* LC Sword Badge - Redesigned to match the image */}
      <div className="flex gap-2 mb-5">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-full shadow-inner dark:shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] hover:bg-slate-200 dark:hover:bg-[#1a1a1a] transition-colors cursor-crosshair">
          <Sword className="w-3.5 h-3.5 text-[#8b5cf6] dark:text-[#a87ffb] fill-[#8b5cf6]/20 dark:fill-[#a87ffb]/20" style={{ transform: 'rotate(45deg)' }} />
          <span className="text-[13px] font-bold text-slate-700 dark:text-[#e0e0e0] tracking-wide">LC</span>
        </div>
      </div>

      {custom_status && (
        <div className="bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-md px-4 py-2 flex items-center gap-2 mb-3 w-full max-w-[280px] justify-center">
          {custom_status.emoji && (
            <span className="text-sm flex-shrink-0">
              {custom_status.emoji.id ? (
                <img 
                  src={`https://cdn.discordapp.com/emojis/${custom_status.emoji.id}.${custom_status.emoji.animated ? 'gif' : 'png'}`} 
                  alt={custom_status.emoji.name}
                  className="w-5 h-5 object-contain"
                />
              ) : (
                custom_status.emoji.name
              )}
            </span>
          )}
          {custom_status.text && (
            <span className="text-slate-700 dark:text-white/80 text-sm font-mono truncate">{custom_status.text}</span>
          )}
        </div>
      )}

      {/* All Other Activities (Games, Local Music, etc.) */}
      {otherActivities.length > 0 && (
        <div className="w-full flex flex-col gap-2 mb-2">
          {otherActivities.map((activity, idx) => {
            const imageUrl = getImageUrl(activity.application_id, activity.assets?.large_image);
            const smallImageUrl = getImageUrl(activity.application_id, activity.assets?.small_image);

            return (
              <div key={idx} className="bg-white/40 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-lg p-3 flex items-center gap-3 w-full text-left hover:border-black/20 dark:hover:border-white/20 transition-colors">
                {/* Activity Image */}
                <div className="relative w-14 h-14 rounded-md overflow-hidden bg-black/5 dark:bg-white/5 flex-shrink-0 flex items-center justify-center">
                  {imageUrl ? (
                    <img src={imageUrl} alt={activity.name} className="w-full h-full object-cover" />
                  ) : (
                    getActivityIcon(activity.type)
                  )}
                  {/* Small Image Overlay */}
                  {smallImageUrl && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-black overflow-hidden bg-white dark:bg-black">
                      <img src={smallImageUrl} alt="Details" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Activity Details */}
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider mb-0.5">
                    {getActivityLabel(activity.type)}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{activity.name}</span>
                  {activity.details && <span className="text-xs text-slate-600 dark:text-white/70 truncate font-mono">{activity.details}</span>}
                  {activity.state && <span className="text-xs text-slate-600 dark:text-white/70 truncate font-mono">{activity.state}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
