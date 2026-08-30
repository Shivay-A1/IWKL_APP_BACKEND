'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { RefreshCw, Plus, Clock, MapPin, Calendar, Trophy, Play, Pause, Square, Plus as PlusIcon, Minus } from 'lucide-react';
import toast from 'react-hot-toast';

interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeam?: { id: string; name: string; logoUrl: string };
  awayTeam?: { id: string; name: string; logoUrl: string };
  homeScore: number;
  awayScore: number;
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'POSTPONED' | 'CANCELLED';
  matchDate: string;
  venue?: string;
  matchType?: string;
  half?: string;
  matchTimer?: string;
  streamUrl?: string;
}

interface Team {
  id: string;
  name: string;
  logoUrl: string;
}

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Match Setup Form State
  const [formData, setFormData] = useState({
    homeTeamId: '',
    awayTeamId: '',
    matchDate: '',
    matchTime: '',
    venue: '',
    matchType: 'LEAGUE_MATCH',
    status: 'SCHEDULED' as 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'POSTPONED' | 'CANCELLED',
  });

  // Set default match date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, matchDate: today }));
  }, []);

  // Live Controls State
  const [timer, setTimer] = useState('00:00');
  const [half, setHalf] = useState('2nd Half');
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    fetchMatches();
    fetchTeams();
    
    // Timer interval
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => {
          const [min, sec] = prev.split(':').map(Number);
          const totalSeconds = min * 60 + sec + 1;
          const newMin = Math.floor(totalSeconds / 60);
          const newSec = totalSeconds % 60;
          return `${String(newMin).padStart(2, '0')}:${String(newSec).padStart(2, '0')}`;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, router]);

  const fetchMatches = async () => {
    try {
      const response = await api.get('/matches');
      console.log('Matches response:', response.data);
      setMatches(response.data || []);
    } catch (error) {
      console.error('Failed to fetch matches:', error);
      toast.error('Failed to load matches');
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await api.get('/teams');
      console.log('Teams response:', response.data);
      // Handle nested response structure
      const teamsData = response.data?.data || response.data || [];
      setTeams(Array.isArray(teamsData) ? teamsData : []);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      setTeams([]);
    }
  };

  const handleRefresh = () => {
    fetchMatches();
    fetchTeams();
    toast.success('Data refreshed');
  };

  const handleSelectMatch = (match: Match) => {
    setSelectedMatch(match);
    setIsEditing(true);
    setFormData({
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      matchDate: match.matchDate.split('T')[0],
      matchTime: match.matchDate.split('T')[1]?.substring(0, 5) || '',
      venue: match.venue || '',
      matchType: match.matchType || 'LEAGUE_MATCH',
      status: match.status,
    });
    setTimer(match.matchTimer || '00:00');
    setHalf(match.half || '2nd Half');
    setTeamAScore(match.homeScore);
    setTeamBScore(match.awayScore);
  };

  const handleCreateMatch = async () => {
    if (formData.homeTeamId === formData.awayTeamId) {
      toast.error('Team A and Team B cannot be the same');
      return;
    }

    if (!formData.homeTeamId || !formData.awayTeamId) {
      toast.error('Please select both teams');
      return;
    }

    try {
      const matchDateTime = `${formData.matchDate}T${formData.matchTime || '00:00'}:00`;
      const response = await api.post('/matches/simple', {
        ...formData,
        matchDate: matchDateTime,
        homeScore: 0,
        awayScore: 0,
        matchTimer: '00:00',
        half: '1st Half',
      });
      toast.success('Match created successfully');
      fetchMatches();
      resetForm();
    } catch (error) {
      console.error('Failed to create match:', error);
      toast.error('Failed to create match');
    }
  };

  const handleUpdateMatch = async () => {
    if (!selectedMatch) return;

    try {
      const matchDateTime = `${formData.matchDate}T${formData.matchTime || '00:00'}:00`;
      await api.patch(`/matches/${selectedMatch.id}`, {
        ...formData,
        matchDate: matchDateTime,
        homeScore: teamAScore,
        awayScore: teamBScore,
        matchTimer: timer,
        half,
      });
      toast.success('Match updated successfully');
      fetchMatches();
    } catch (error) {
      toast.error('Failed to update match');
    }
  };

  const handleDeleteMatch = async () => {
    if (!selectedMatch) return;
    if (!confirm('Are you sure you want to delete this match?')) return;

    try {
      await api.delete(`/matches/${selectedMatch.id}`);
      toast.success('Match deleted successfully');
      setSelectedMatch(null);
      setIsEditing(false);
      resetForm();
      fetchMatches();
    } catch (error) {
      toast.error('Failed to delete match');
    }
  };

  const resetForm = () => {
    setFormData({
      homeTeamId: '',
      awayTeamId: '',
      matchDate: '',
      matchTime: '',
      venue: '',
      matchType: 'LEAGUE_MATCH',
      status: 'SCHEDULED',
    });
    setTimer('00:00');
    setHalf('2nd Half');
    setTeamAScore(0);
    setTeamBScore(0);
    setIsTimerRunning(false);
  };

  const handleScoreUpdate = async (team: 'A' | 'B', action: '+1' | '+2' | 'bonus' | 'super_raid' | 'all_out') => {
    const points = action === '+1' ? 1 : action === '+2' ? 2 : action === 'bonus' ? 1 : action === 'super_raid' ? 2 : 2;
    
    if (team === 'A') {
      setTeamAScore(prev => prev + points);
    } else {
      setTeamBScore(prev => prev + points);
    }

    if (selectedMatch) {
      try {
        await api.patch(`/matches/${selectedMatch.id}/live-score`, {
          homeScore: team === 'A' ? teamAScore + points : teamAScore,
          awayScore: team === 'B' ? teamBScore + points : teamBScore,
        });
      } catch (error) {
        toast.error('Failed to update score');
      }
    }
  };

  const handleSpecialAction = async (team: 'A' | 'B', action: 'super_tackle' | 'do_or_die' | 'review') => {
    toast.success(`${action.replace('_', ' ')} recorded for Team ${team}`);
  };

  const liveMatches = Array.isArray(matches) ? matches.filter(m => m.status === 'LIVE') : [];
  const upcomingMatches = Array.isArray(matches) ? matches.filter(m => m.status === 'SCHEDULED') : [];
  const completedMatches = Array.isArray(matches) ? matches.filter(m => m.status === 'COMPLETED') : [];

  const getTeamById = (id: string) => teams.find(t => t.id === id);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* PAGE HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">OTT Live Match Controls</h1>
        <button
          onClick={handleRefresh}
          className="bg-purple-800 hover:bg-purple-900 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="space-y-6 max-w-6xl mx-auto">
        {/* SELECT MATCH CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Select Match</h2>
            <button
              onClick={() => {
                setSelectedMatch(null);
                setIsEditing(false);
                resetForm();
              }}
              className="bg-gradient-to-r from-purple-600 via-purple-500 to-yellow-500 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Create New Match
            </button>
          </div>

          {/* Live Matches */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-600 mb-3">Live Matches</h3>
            {liveMatches.length > 0 ? (
              <div className="space-y-2">
                {liveMatches.map(match => (
                  <div
                    key={match.id}
                    onClick={() => handleSelectMatch(match)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedMatch?.id === match.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {match.homeTeam && (
                          <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="w-8 h-8 rounded-full" />
                        )}
                        <span className="font-medium text-gray-800">{match.homeTeam?.name}</span>
                        <span className="text-gray-400">vs</span>
                        <span className="font-medium text-gray-800">{match.awayTeam?.name}</span>
                        {match.awayTeam && (
                          <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="w-8 h-8 rounded-full" />
                        )}
                      </div>
                      <span className="text-lg font-bold text-gray-800">{match.homeScore} - {match.awayScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No live matches</p>
            )}
          </div>

          {/* Upcoming Matches */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-600 mb-3">Upcoming Matches</h3>
            {upcomingMatches.length > 0 ? (
              <div className="space-y-2">
                {upcomingMatches.map(match => (
                  <div
                    key={match.id}
                    onClick={() => handleSelectMatch(match)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedMatch?.id === match.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {match.homeTeam && (
                          <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="w-8 h-8 rounded-full" />
                        )}
                        <span className="font-medium text-gray-800">{match.homeTeam?.name}</span>
                        <span className="text-gray-400">vs</span>
                        <span className="font-medium text-gray-800">{match.awayTeam?.name}</span>
                        {match.awayTeam && (
                          <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="w-8 h-8 rounded-full" />
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{new Date(match.matchDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No upcoming matches</p>
            )}
          </div>

          {/* Completed Matches */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-600 mb-3">Completed Matches</h3>
            {completedMatches.length > 0 ? (
              <div className="space-y-2">
                {completedMatches.map(match => (
                  <div
                    key={match.id}
                    onClick={() => handleSelectMatch(match)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedMatch?.id === match.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {match.homeTeam && (
                          <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="w-8 h-8 rounded-full" />
                        )}
                        <span className="font-medium text-gray-800">{match.homeTeam?.name}</span>
                        <span className="text-gray-400">vs</span>
                        <span className="font-medium text-gray-800">{match.awayTeam?.name}</span>
                        {match.awayTeam && (
                          <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="w-8 h-8 rounded-full" />
                        )}
                      </div>
                      <span className="text-lg font-bold text-gray-800">{match.homeScore} - {match.awayScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No completed matches</p>
            )}
          </div>

          {matches.length === 0 && (
            <p className="text-center text-gray-400 text-sm">
              No matches available. Create a new match to get started.
            </p>
          )}
        </div>

        {/* MATCH SETUP CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Match Setup</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Team A Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Team A</label>
              <select
                value={formData.homeTeamId}
                onChange={(e) => setFormData({ ...formData, homeTeamId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Team A</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>

            {/* Team B Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Team B</label>
              <select
                value={formData.awayTeamId}
                onChange={(e) => setFormData({ ...formData, awayTeamId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Team B</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* League Stage */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">League Stage</label>
              <select
                value={formData.matchType}
                onChange={(e) => setFormData({ ...formData, matchType: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="LEAGUE_MATCH">League Stage</option>
                <option value="QUARTER_FINAL">Quarter Final</option>
                <option value="SEMI_FINAL">Semi Final</option>
                <option value="FINAL">Final</option>
              </select>
            </div>

            {/* Venue */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Venue</label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="e.g., Pune"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Match Date */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Match Date</label>
              <input
                type="date"
                value={formData.matchDate}
                onChange={(e) => setFormData({ ...formData, matchDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Match Time */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Match Time</label>
              <input
                type="time"
                value={formData.matchTime}
                onChange={(e) => setFormData({ ...formData, matchTime: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Match Status */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Match Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="SCHEDULED">Upcoming</option>
                <option value="LIVE">Live</option>
                <option value="COMPLETED">Completed</option>
                <option value="POSTPONED">Postponed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Create/Update Match Button */}
          <div className="flex gap-4">
            <button
              onClick={isEditing ? handleUpdateMatch : handleCreateMatch}
              className="flex-1 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              {isEditing ? 'Update Match' : 'Create Match'}
            </button>
            {isEditing && (
              <button
                onClick={handleDeleteMatch}
                className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {/* SCORE CONTROLS CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Score Controls</h2>
            <div className="flex gap-2">
              <button className="bg-purple-800 text-white px-3 py-1 rounded-full text-xs">History</button>
              <button className="bg-purple-800 text-white px-3 py-1 rounded-full text-xs">Player Stats</button>
            </div>
          </div>

          {/* Timer Area */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Timer</p>
                <p className="text-4xl font-bold text-gray-800">{timer}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="bg-purple-800 text-white px-4 py-2 rounded-lg text-sm"
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setTimer('00:00')}
                  className="bg-purple-800 text-white px-4 py-2 rounded-lg text-sm"
                >
                  <Square className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const [min, sec] = timer.split(':').map(Number);
                    const totalSeconds = Math.max(0, min * 60 + sec + 1);
                    const newMin = Math.floor(totalSeconds / 60);
                    const newSec = totalSeconds % 60;
                    setTimer(`${String(newMin).padStart(2, '0')}:${String(newSec).padStart(2, '0')}`);
                  }}
                  className="bg-purple-800 text-white px-4 py-2 rounded-lg text-sm"
                >
                  +1s
                </button>
                <button
                  onClick={() => {
                    const [min, sec] = timer.split(':').map(Number);
                    const totalSeconds = Math.max(0, min * 60 + sec - 1);
                    const newMin = Math.floor(totalSeconds / 60);
                    const newSec = totalSeconds % 60;
                    setTimer(`${String(newMin).padStart(2, '0')}:${String(newSec).padStart(2, '0')}`);
                  }}
                  className="bg-purple-800 text-white px-4 py-2 rounded-lg text-sm"
                >
                  -1s
                </button>
              </div>
            </div>
          </div>

          {/* Half Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-3">Half</label>
            <div className="flex gap-2 flex-wrap">
              {['1st Half', 'Half Time', '2nd Half', 'Extra Time'].map(h => (
                <button
                  key={h}
                  onClick={() => setHalf(h)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    half === h
                      ? 'bg-purple-800 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* Team A Score Control */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">
                Team A ({getTeamById(formData.homeTeamId)?.name || 'Selected Team'})
              </h3>
              <span className="text-2xl font-bold text-gray-800">{teamAScore}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => handleScoreUpdate('A', '+1')} className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium">+1</button>
              <button onClick={() => handleScoreUpdate('A', '+2')} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">+2</button>
              <button onClick={() => handleScoreUpdate('A', 'bonus')} className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium">Bonus</button>
              <button onClick={() => handleScoreUpdate('A', 'super_raid')} className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium">Super Raid</button>
              <button onClick={() => handleScoreUpdate('A', 'all_out')} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium">All Out</button>
            </div>
          </div>

          {/* Team B Score Control */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">
                Team B ({getTeamById(formData.awayTeamId)?.name || 'Selected Team'})
              </h3>
              <span className="text-2xl font-bold text-gray-800">{teamBScore}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => handleScoreUpdate('B', '+1')} className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium">+1</button>
              <button onClick={() => handleScoreUpdate('B', '+2')} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">+2</button>
              <button onClick={() => handleScoreUpdate('B', 'bonus')} className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium">Bonus</button>
              <button onClick={() => handleScoreUpdate('B', 'super_raid')} className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium">Super Raid</button>
              <button onClick={() => handleScoreUpdate('B', 'all_out')} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium">All Out</button>
            </div>
          </div>

          {/* Special Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Team A Special Actions</h4>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => handleSpecialAction('A', 'super_tackle')} className="bg-orange-500 text-white px-3 py-2 rounded-lg text-xs">Super Tackle</button>
                <button onClick={() => handleSpecialAction('A', 'do_or_die')} className="bg-pink-500 text-white px-3 py-2 rounded-lg text-xs">Do or Die</button>
                <button onClick={() => handleSpecialAction('A', 'review')} className="bg-gray-500 text-white px-3 py-2 rounded-lg text-xs">Review</button>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Team B Special Actions</h4>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => handleSpecialAction('B', 'super_tackle')} className="bg-orange-500 text-white px-3 py-2 rounded-lg text-xs">Super Tackle</button>
                <button onClick={() => handleSpecialAction('B', 'do_or_die')} className="bg-pink-500 text-white px-3 py-2 rounded-lg text-xs">Do or Die</button>
                <button onClick={() => handleSpecialAction('B', 'review')} className="bg-gray-500 text-white px-3 py-2 rounded-lg text-xs">Review</button>
              </div>
            </div>
          </div>
        </div>

        {/* LIVE PREVIEW CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Live Preview</h2>

          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-6">
            <div className="flex items-center justify-between">
              {/* Left Side - Team A */}
              <div className="flex items-center gap-4">
                {getTeamById(formData.homeTeamId) ? (
                  <>
                    <img
                      src={getTeamById(formData.homeTeamId)?.logoUrl}
                      alt={getTeamById(formData.homeTeamId)?.name}
                      className="w-16 h-16 rounded-full border-2 border-white object-cover"
                    />
                    <div className="text-white">
                      <p className="font-semibold text-lg">{getTeamById(formData.homeTeamId)?.name}</p>
                      <p className="text-3xl font-bold">{teamAScore}</p>
                    </div>
                  </>
                ) : (
                  <div className="text-white">
                    <p className="font-semibold text-lg">Team A</p>
                    <p className="text-3xl font-bold">{teamAScore}</p>
                  </div>
                )}
              </div>

              {/* Center - LIVE Badge */}
              <div className="text-center text-white">
                <div className="inline-block bg-red-600 px-3 py-1 rounded-full text-xs font-bold mb-2">LIVE</div>
                <p className="text-sm font-medium">{half}</p>
                <p className="text-2xl font-bold">{timer}</p>
              </div>

              {/* Right Side - Team B */}
              <div className="flex items-center gap-4">
                {getTeamById(formData.awayTeamId) ? (
                  <>
                    <div className="text-white text-right">
                      <p className="font-semibold text-lg">{getTeamById(formData.awayTeamId)?.name}</p>
                      <p className="text-3xl font-bold">{teamBScore}</p>
                    </div>
                    <img
                      src={getTeamById(formData.awayTeamId)?.logoUrl}
                      alt={getTeamById(formData.awayTeamId)?.name}
                      className="w-16 h-16 rounded-full border-2 border-white object-cover"
                    />
                  </>
                ) : (
                  <div className="text-white text-right">
                    <p className="font-semibold text-lg">Team B</p>
                    <p className="text-3xl font-bold">{teamBScore}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}