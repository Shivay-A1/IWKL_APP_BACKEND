'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Trophy, ArrowUp, ArrowDown, Plus, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

interface PointsTableEntry {
  id: string;
  teamId: string;
  team?: { id: string; name: string; logoUrl: string };
  position: number;
  played: number;
  won: number;
  lost: number;
  tied: number;
  points: number;
  nrr: number;
}

interface Team {
  id: string;
  name: string;
  logoUrl: string;
}

export default function PointsTablePage() {
  const router = useRouter();
  const [pointsTable, setPointsTable] = useState<PointsTableEntry[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState<PointsTableEntry | null>(null);

  useEffect(() => {
    fetchPointsTable();
    fetchTeams();
  }, []);

  const fetchPointsTable = async () => {
    try {
      const response = await api.get('/points-table');
      console.log('Points table response:', response.data);
      setPointsTable(response.data || []);
    } catch (error) {
      console.error('Failed to fetch points table:', error);
      toast.error('Failed to load points table');
      setPointsTable([]);
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

  const handleUpdatePoints = async (entryId: string, updates: Partial<PointsTableEntry>) => {
    try {
      await api.put(`/points-table/${entryId}`, updates);
      toast.success('Points table updated');
      setEditingEntry(null);
      fetchPointsTable();
    } catch (error) {
      toast.error('Failed to update points table');
    }
  };

  const handleReorder = async (entryId: string, newPosition: number) => {
    try {
      await api.patch(`/points-table/${entryId}`, { position: newPosition });
      toast.success('Position updated');
      fetchPointsTable();
    } catch (error) {
      toast.error('Failed to update position');
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
              <h1 className="text-2xl font-bold text-white">Points Table Management</h1>
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
          <h2 className="text-3xl font-bold text-white">Points Table</h2>
        </div>

        <div className="bg-card rounded-xl overflow-hidden shadow-lg">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-6 py-4 text-left text-white font-semibold">Position</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Team</th>
                <th className="px-6 py-4 text-center text-white font-semibold">Played</th>
                <th className="px-6 py-4 text-center text-white font-semibold">Won</th>
                <th className="px-6 py-4 text-center text-white font-semibold">Lost</th>
                <th className="px-6 py-4 text-center text-white font-semibold">Tied</th>
                <th className="px-6 py-4 text-center text-white font-semibold">Points</th>
                <th className="px-6 py-4 text-center text-white font-semibold">NRR</th>
                <th className="px-6 py-4 text-center text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pointsTable.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-lg">{entry.position}</span>
                      {entry.position <= 3 && (
                        <Trophy className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {entry.team && (
                        <>
                          <img
                            src={entry.team.logoUrl}
                            alt={entry.team.name}
                            className="w-8 h-8 rounded-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-team.png';
                            }}
                          />
                          <span className="text-white font-medium">{entry.team.name}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {editingEntry?.id === entry.id ? (
                      <input
                        type="number"
                        value={editingEntry.played}
                        onChange={(e) => setEditingEntry({ ...editingEntry, played: parseInt(e.target.value) })}
                        className="w-16 bg-background border border-gray-700 rounded text-white text-center"
                      />
                    ) : (
                      <span className="text-gray-300">{entry.played}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {editingEntry?.id === entry.id ? (
                      <input
                        type="number"
                        value={editingEntry.won}
                        onChange={(e) => setEditingEntry({ ...editingEntry, won: parseInt(e.target.value) })}
                        className="w-16 bg-background border border-gray-700 rounded text-white text-center"
                      />
                    ) : (
                      <span className="text-gray-300">{entry.won}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {editingEntry?.id === entry.id ? (
                      <input
                        type="number"
                        value={editingEntry.lost}
                        onChange={(e) => setEditingEntry({ ...editingEntry, lost: parseInt(e.target.value) })}
                        className="w-16 bg-background border border-gray-700 rounded text-white text-center"
                      />
                    ) : (
                      <span className="text-gray-300">{entry.lost}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {editingEntry?.id === entry.id ? (
                      <input
                        type="number"
                        value={editingEntry.tied}
                        onChange={(e) => setEditingEntry({ ...editingEntry, tied: parseInt(e.target.value) })}
                        className="w-16 bg-background border border-gray-700 rounded text-white text-center"
                      />
                    ) : (
                      <span className="text-gray-300">{entry.tied}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {editingEntry?.id === entry.id ? (
                      <input
                        type="number"
                        value={editingEntry.points}
                        onChange={(e) => setEditingEntry({ ...editingEntry, points: parseInt(e.target.value) })}
                        className="w-20 bg-background border border-gray-700 rounded text-white text-center font-bold"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">{entry.points}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {editingEntry?.id === entry.id ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editingEntry.nrr}
                        onChange={(e) => setEditingEntry({ ...editingEntry, nrr: parseFloat(e.target.value) })}
                        className="w-20 bg-background border border-gray-700 rounded text-white text-center"
                      />
                    ) : (
                      <span className="text-gray-300">{entry.nrr.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleReorder(entry.id, Math.max(1, entry.position - 1))}
                        className="text-gray-400 hover:text-white"
                        disabled={entry.position === 1}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReorder(entry.id, entry.position + 1)}
                        className="text-gray-400 hover:text-white"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      {editingEntry?.id === entry.id ? (
                        <>
                          <button
                              onClick={() => handleUpdatePoints(entry.id, editingEntry)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                            >
                              Save
                            </button>
                          <button
                              onClick={() => setEditingEntry(null)}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
                            >
                              Cancel
                            </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setEditingEntry(entry)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}