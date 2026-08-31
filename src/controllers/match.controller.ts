import { Response } from 'express';
import { AuthRequest } from '../types/express';
import * as matchService from '../services/match.service';

export const createMatch = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const match = await matchService.createMatch(req.body, req.user?.id);
    res.status(201).json(match);
  } catch (error) {
    next(error);
  }
};

export const createMatchSimple = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const match = await matchService.createMatchSimple(req.body);
    res.status(201).json(match);
  } catch (error) {
    next(error);
  }
};

export const getMatches = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const matches = await matchService.getMatches(req.query);
    res.json(matches);
  } catch (error) {
    next(error);
  }
};

export const getMatchById = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const match = await matchService.getMatchById(req.params.id);
    res.json(match);
  } catch (error) {
    next(error);
  }
};

export const updateMatch = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const match = await matchService.updateMatch(req.params.id, req.body, req.user?.id);
    
    // Emit socket event for real-time update
    if (global.io) {
      global.io.emit('match-updated', match);
      global.io.emit('matches-updated', match);
      global.io.to(`match-${match.id}`).emit('match-updated', match);
    }
    
    res.json(match);
  } catch (error) {
    next(error);
  }
};

export const deleteMatch = async (req: AuthRequest, res: Response, next: any) => {
  try {
    await matchService.deleteMatch(req.params.id, req.user?.id);
    
    // Emit socket event for real-time update
    if (global.io) {
      global.io.emit('match-deleted', { id: req.params.id });
      global.io.emit('matches-updated', { id: req.params.id });
    }
    
    res.json({ message: 'Match deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const duplicateMatch = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const match = await matchService.duplicateMatch(req.params.id);
    res.status(201).json(match);
  } catch (error) {
    next(error);
  }
};

export const publishMatch = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const match = await matchService.publishMatch(req.params.id, req.body);
    res.json(match);
  } catch (error) {
    next(error);
  }
};

export const updateMatchScore = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await matchService.updateMatchScore(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getUpcomingMatches = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const matches = await matchService.getUpcomingMatches(req.query);
    res.json(matches);
  } catch (error) {
    next(error);
  }
};

export const getLiveMatches = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const matches = await matchService.getLiveMatches();
    res.json(matches);
  } catch (error) {
    next(error);
  }
};

export const getCompletedMatches = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const matches = await matchService.getCompletedMatches(req.query);
    res.json(matches);
  } catch (error) {
    next(error);
  }
};

export const updateLiveScore = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await matchService.updateLiveScore(req.params.id, req.body);

    console.log('Emitting live-score-updated event:', result);

    // Emit socket event for real-time score update
    if (global.io) {
      global.io.emit('live-score-updated', result);
      global.io.to(`match-${req.params.id}`).emit('live-score-updated', result);
      console.log('Socket event emitted successfully');
    } else {
      console.log('global.io is not available');
    }

    res.json(result);
  } catch (error) {
    console.error('Error in updateLiveScore:', error);
    next(error);
  }
};

export const updateMatchStatus = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const match = await matchService.updateMatchStatus(req.params.id, req.body);
    
    // Emit socket event for real-time status update
    if (global.io) {
      global.io.emit('match-status-updated', match);
      global.io.to(`match-${match.id}`).emit('match-status-updated', match);
    }
    
    res.json(match);
  } catch (error) {
    next(error);
  }
};

export const startMatch = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const match = await matchService.startMatch(req.params.id, req.user?.id);
    res.json(match);
  } catch (error) {
    next(error);
  }
};

export const pauseMatch = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const match = await matchService.pauseMatch(req.params.id, req.user?.id);
    res.json(match);
  } catch (error) {
    next(error);
  }
};

export const resumeMatch = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const match = await matchService.resumeMatch(req.params.id, req.user?.id);
    res.json(match);
  } catch (error) {
    next(error);
  }
};

export const endMatch = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await matchService.endMatch(req.params.id, req.body, req.user?.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getMatchHistory = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const history = await matchService.getMatchHistory(req.params.id);
    res.json(history);
  } catch (error) {
    next(error);
  }
};

export const rollbackMatch = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const match = await matchService.rollbackMatch(req.params.id, req.params.historyId, req.user?.id);
    res.json(match);
  } catch (error) {
    next(error);
  }
};

export const getMatchLogs = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const logs = await matchService.getMatchLogs(req.params.id);
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

export const logMatchEvent = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await matchService.logMatchEvent(req.params.id, req.body, req.user?.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getMatchRaids = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const raids = await matchService.getMatchRaids(req.params.id);
    res.json(raids);
  } catch (error) {
    next(error);
  }
};

export const createRaid = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const raid = await matchService.createRaid(req.params.id, req.body, req.user?.id);
    res.status(201).json(raid);
  } catch (error) {
    next(error);
  }
};

export const recordSpecialAction = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { team, action } = req.body;
    const match = await matchService.recordSpecialAction(req.params.id, team, action);

    // Emit socket event for real-time update
    if (global.io) {
      global.io.emit('match-updated', match);
      global.io.emit('matches-updated', match);
      global.io.to(`match-${match.id}`).emit('match-updated', match);
    }

    res.json(match);
  } catch (error) {
    next(error);
  }
};
