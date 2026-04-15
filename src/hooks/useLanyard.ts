import { useState, useEffect, useRef } from 'react';

export interface LanyardData {
  spotify: {
    track_id: string;
    timestamps: { start: number; end: number };
    song: string;
    artist: string;
    album_art_url: string;
    album: string;
  } | null;
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  discord_user: {
    username: string;
    public_flags: number;
    id: string;
    discriminator: string;
    avatar: string;
    global_name: string;
  };
  activities: any[];
  listening_to_spotify: boolean;
  custom_status?: {
    text: string;
    emoji?: {
      name: string;
      id?: string;
      animated?: boolean;
    }
  }
}

export const useLanyard = (discordId: string) => {
  const [data, setData] = useState<LanyardData | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!discordId) return;

    let heartbeatInterval: number;

    const connect = () => {
      ws.current = new WebSocket('wss://api.lanyard.rest/socket');

      ws.current.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        
        if (msg.op === 1) {
          ws.current?.send(JSON.stringify({
            op: 2,
            d: { subscribe_to_id: discordId }
          }));
          
          heartbeatInterval = window.setInterval(() => {
            ws.current?.send(JSON.stringify({ op: 3 }));
          }, msg.d.heartbeat_interval);
        } else if (msg.op === 0) {
          if (msg.t === 'INIT_STATE' || msg.t === 'PRESENCE_UPDATE') {
            setData(msg.d);
          }
        }
      };

      ws.current.onclose = () => {
        clearInterval(heartbeatInterval);
        setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      clearInterval(heartbeatInterval);
      if (ws.current) {
        ws.current.onclose = null;
        ws.current.close();
      }
    };
  }, [discordId]);

  return data;
};
