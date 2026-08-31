import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer;

export const initializeSocket = (server: any) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: function(origin, callback) {
        // Allow all origins for Railway deployment
        callback(null, true);
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-match', (matchId: string) => {
      socket.join(`match-${matchId}`);
      console.log(`Socket ${socket.id} joined match-${matchId}`);
    });

    socket.on('leave-match', (matchId: string) => {
      socket.leave(`match-${matchId}`);
      console.log(`Socket ${socket.id} left match-${matchId}`);
    });

    socket.on('join-season', (seasonId: string) => {
      socket.join(`season-${seasonId}`);
      console.log(`Socket ${socket.id} joined season-${seasonId}`);
    });

    socket.on('leave-season', (seasonId: string) => {
      socket.leave(`season-${seasonId}`);
      console.log(`Socket ${socket.id} left season-${seasonId}`);
    });

    socket.on('join-ott', () => {
      socket.join('ott-live');
      console.log(`Socket ${socket.id} joined OTT live`);
    });

    socket.on('leave-ott', () => {
      socket.leave('ott-live');
      console.log(`Socket ${socket.id} left OTT live`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

// Allow setting io from external initialization (e.g., from server.ts)
export const setIO = (socketIOServer: SocketIOServer) => {
  io = socketIOServer;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

export const emitMatchUpdate = (matchId: string, data: any) => {
  const io = getIO();
  io.to(`match-${matchId}`).emit('match-update', data);
  io.emit('live-matches-update', data);
};

export const emitScoreUpdate = (matchId: string, data: any) => {
  const io = getIO();
  console.log('Emitting live-score-updated:', data);
  io.to(`match-${matchId}`).emit('live-score-updated', data);
  io.emit('live-score-updated', data);
};

export const emitMatchStatusUpdate = (matchId: string, data: any) => {
  const io = getIO();
  io.to(`match-${matchId}`).emit('status-update', data);
  io.emit('match-status-update', data);
};

export const emitPointsTableUpdate = (seasonId: string, data?: any) => {
  const io = getIO();
  io.to(`season-${seasonId}`).emit('points-table-update', data || { seasonId });
  io.emit('points-table-update', data || { seasonId });
};

// OTT-specific events
export const emitOTTScoreUpdate = (data: any) => {
  const io = getIO();
  io.to('ott-live').emit('ott-score-update', data);
  io.emit('ott-score-update', data);
};

export const emitOTTTimerUpdate = (data: any) => {
  const io = getIO();
  io.to('ott-live').emit('ott-timer-update', data);
  io.emit('ott-timer-update', data);
};

export const emitOTTMatchStatusUpdate = (data: any) => {
  const io = getIO();
  io.to('ott-live').emit('ott-status-update', data);
  io.emit('ott-status-update', data);
};
