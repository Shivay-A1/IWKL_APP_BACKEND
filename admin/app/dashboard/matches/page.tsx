'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Play, Pause, Plus, Edit, Trash2, Clock, MapPin, Calendar, Trophy } from 'lucide-react';
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [formData, setFormData] = useState({
    homeTeamId: '',
    awayTeamId: '',
    matchDate: '',
    venue: '',
    matchType: 'LEAGUE_MATCH',
    streamUrl: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchMatches();
    fetchTeams();
  }, [router]);

  const fetchMatches = async () => {
    try {
      const response = await api.get('/matches');
      setMatches(response.data);
    } catch (error) {
      console.error('Failed to fetch matches');
      toast.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await api.get('/teams');
      setTeams(response.data);
    } catch (error) {
      console.error('Failed to fetch teams');
    }
  };

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/matches', formData);
      toast.success('Match created successfully');
      setShowCreateModal(false);
      setFormData({
        homeTeamId: '',
        awayTeamId: '',
        matchDate: '',
        venue: '',
        matchType: 'LEAGUE_MATCH',
        streamUrl: '',
      });
      fetchMatches();
    } catch (error) {
      toast.error('Failed to create match');
    }
  };

  const handleUpdateMatchStatus = async (matchId: string, status: string) => {
    try {
      await api.patch(`/matches/${matchId}/status`, { status });
      toast.success('Match status updated');
      fetchMatches();
    } catch (error) {
      toast.error('Failed to update match status');
    }
  };

  const handleUpdateScore = async (matchId: string, homeScore: number, awayScore: number) => {
    try {
      await api.patch(`/matches/${matchId}/live-score`, { homeScore, awayScore });
      toast.success('Score updated');
      fetchMatches();
    } catch (error) {
      toast.error('Failed to update score');
    }
  };

  const handleStartMatch = async (matchId: string) => {
    try {
      await api.post(`/matches/${matchId}/start`);
      toast.success('Match started');
      fetchMatches();
    } catch (error) {
      toast.error('Failed to start match');
    }
  };

  const handleEndMatch = async (matchId: string) => {
    try {
      await api.post(`/matches/${matchId}/end`);
      toast.success('Match ended');
      fetchMatches();
    } catch (error) {
      toast.error('Failed to end match');
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    if (!confirm('Are you sure you want to delete this match?')) return;
    try {
      await api.delete(`/matches/${matchId}`);
      toast.success('Match deleted successfully');
      fetchMatches();
    } catch (error) {
      toast.error('Failed to delete match');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Matches Management</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-300 hover:text-white px-4 py-2"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Matches</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Match
          </button>
        </div>

        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match.id} className="bg-card rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  {match.homeTeam && (
                    <img
                      src={match.homeTeam.logoUrl}
                      alt={match.homeTeam.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-team.png';
                      }}
                    />
                  )}
                  <div>
                    <p className="text-white font-semibold">{match.homeTeam?.name || 'TBD'}</p>
                    <p className="text-gray-400 text-sm">vs</p>
                    <p className="text-white font-semibold">{match.awayTeam?.name || 'TBD'}</p>
                  </div>
                  {match.awayTeam && (
                    <img
                      src={match.awayTeam.logoUrl}
                      alt={match.awayTeam.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-team.png';
                      }}
                    />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    match.status === 'LIVE' ? 'bg-red-600 text-white' :
                    match.status === 'COMPLETED' ? 'bg-green-600 text-white' :
                    match.status === 'SCHEDULED' ? 'bg-blue-600 text-white' :
                    'bg-gray-600 text-white'
                  }`}>
                    {match.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(match.matchDate).toLocaleDateString()}</span>
                </div>
                {match.venue && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-4 h-4" />
                    <span>{match.venue}</span>
                  </div>
                )}
                {match.matchType && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Trophy className="w-4 h-4" />
                    <span>{match.matchType}</span>
                  </div>
                )}
              </div>

              {match.status === 'LIVE' && (
                <div className="bg-background rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl font-bold text-white">
                      {match.homeScore} - {match.awayScore}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span>{match.matchTimer || '00:00'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateScore(match.id, match.homeScore + 1, match.awayScore)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                      +1 Home
                    </button>
                    <button
                      onClick={() => handleUpdateScore(match.id, match.homeScore, match.awayScore + 1)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      +1 Away
                    </button>
                    <button
                      onClick={() => handleUpdateScore(match.id, match.homeScore + 2, match.awayScore)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
                    >
                      +2 Home
                    </button>
                    <button
                      onClick={() => handleUpdateScore(match.id, match.homeScore, match.awayScore + 2)}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
                    >
                      +2 Away
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {match.status === 'SCHEDULED' && (
                  <button
                    onClick={() => handleStartMatch(match.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Start
                  </button>
                )}
                {match.status === 'LIVE' && (
                  <button
                    onClick={() => handleEndMatch(match.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2"
                  >
                    <Pause className="w-4 h-4" />
                    End
                  </button>
                )}
                <button
                  onClick={() => handleUpdateMatchStatus(match.id, match.status === 'SCHEDULED' ? 'LIVE' : 'COMPLETED')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  {match.status === 'SCHEDULED' ? 'Set Live' : 'Complete'}
                </button>
                <button
                  onClick={() => handleDeleteMatch(match.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-6">Create Match</h3>
            <form onSubmit={handleCreateMatch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Home Team</label>
                <select
                  value={formData.homeTeamId}
                  onChange={(e) => setFormData({ ...formData, homeTeamId: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                  required
                >
                  <option value="">Select Team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Away Team</label>
                <select
                  value={formData.awayTeamId}
                  onChange={(e) => setFormData({ ...formData, awayTeamId: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                  required
                >
                  <option value="">Select Team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Match Date</label>
                <input
                  type="datetime-local"
                  value={formData.matchDate}
                  onChange={(e) => setFormData({ ...formData, matchDate: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Venue</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Stream URL</label>
                <input
                  type="url"
                  value={formData.streamUrl}
                  onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg"
                >
                  Create Match
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}