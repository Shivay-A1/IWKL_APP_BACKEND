// Keep-alive utility to prevent Render app from sleeping
// This pings the backend server every 14 minutes to keep it awake

const KEEP_ALIVE_INTERVAL = 14 * 60 * 1000; // 14 minutes
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://iwkl-backend-lg6t-production.up.railway.app';

let keepAliveInterval: NodeJS.Timeout | null = null;

export function startKeepAlive() {
  // Only run in browser
  if (typeof window === 'undefined') return;

  // Clear any existing interval
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
  }

  // Function to ping the server
  const pingServer = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/keep-alive`, {
        method: 'GET',
        cache: 'no-cache',
      });
      console.log('[Keep-Alive] Server ping successful:', await response.json());
    } catch (error) {
      console.error('[Keep-Alive] Server ping failed:', error);
    }
  };

  // Ping immediately on start
  pingServer();

  // Set up interval
  keepAliveInterval = setInterval(pingServer, KEEP_ALIVE_INTERVAL);
  
  console.log('[Keep-Alive] Started - pinging server every 14 minutes');
}

export function stopKeepAlive() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
    console.log('[Keep-Alive] Stopped');
  }
}
