"use client"

import React, { useState, useMemo, useCallback, memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface PointsTableProps {
  pointsTable: any[]
  expandedTeamId: string | null
  onExpandToggle: (teamId: string) => void
}

const LazyPointsTable = memo(function LazyPointsTable({ pointsTable, expandedTeamId, onExpandToggle }: PointsTableProps) {
  return (
    <section className="py-10 bg-gray-50 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">IWKL League Standings</h2>
          <p className="text-sm md:text-base text-gray-600">Season 1 - Current Rankings</p>
        </div>

        {/* Professional Points Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-blue-600">
                <th className="px-4 py-3 text-left text-white font-bold uppercase tracking-wider text-xs w-10"></th>
                <th className="px-4 py-3 text-left text-white font-bold uppercase tracking-wider text-xs">Pos</th>
                <th className="px-4 py-3 text-left text-white font-bold uppercase tracking-wider text-xs">Team</th>
                <th className="px-4 py-3 text-center text-white font-bold uppercase tracking-wider text-xs">M</th>
                <th className="px-4 py-3 text-center text-white font-bold uppercase tracking-wider text-xs">W</th>
                <th className="px-4 py-3 text-center text-white font-bold uppercase tracking-wider text-xs">L</th>
                <th className="px-4 py-3 text-center text-white font-bold uppercase tracking-wider text-xs">HS</th>
                <th className="px-4 py-3 text-center text-white font-bold uppercase tracking-wider text-xs">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pointsTable.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500 text-sm">
                    No standings data available
                  </td>
                </tr>
              ) : (
                pointsTable.map((entry: any, index: number) => (
                  <React.Fragment key={entry.id}>
                    <tr 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => onExpandToggle(entry.id)}
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onExpandToggle(entry.id)
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <ChevronDown 
                            className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
                              expandedTeamId === entry.id ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white font-bold text-sm">
                          {entry.position || index + 1}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            <Image
                              src={entry.team?.logo || entry.logo || '/placeholder-logo.png'}
                              alt={entry.team?.name || entry.name}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{entry.team?.name || entry.name}</p>
                            <p className="text-xs text-gray-500">{entry.team?.shortName || entry.shortName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700 font-medium text-sm">{entry.matchesPlayed || 0}</td>
                      <td className="px-4 py-3 text-center text-green-600 font-bold text-sm">{entry.wins || 0}</td>
                      <td className="px-4 py-3 text-center text-red-600 font-bold text-sm">{entry.losses || 0}</td>
                      <td className="px-4 py-3 text-center text-gray-700 font-medium text-sm">{entry.highestScore || 0}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold text-base">
                          {entry.points || 0}
                        </span>
                      </td>
                    </tr>
                    {expandedTeamId === entry.id && (
                      <tr key={`expanded-${entry.id}`}>
                        <td colSpan={8} className="p-0">
                          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-t border-gray-200 animate-slide-down">
                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Left: Team Information */}
                              <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                  <div className="w-16 h-16 rounded-xl bg-white shadow-md flex items-center justify-center overflow-hidden">
                                    <Image
                                      src={entry.team?.logo || entry.logo || '/placeholder-logo.png'}
                                      alt={entry.team?.name || entry.name}
                                      width={64}
                                      height={64}
                                      className="object-cover"
                                    />
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-gray-900 text-base">{entry.team?.name || entry.name}</h3>
                                    <p className="text-xs text-gray-600">{entry.team?.shortName || entry.shortName}</p>
                                  </div>
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                  <p className="text-xs text-gray-500 mb-1">Description</p>
                                  <p className="text-sm text-gray-700 line-clamp-3">
                                    {entry.team?.description || entry.description || 'Team description coming soon.'}
                                  </p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className="bg-white rounded-lg p-3 shadow-sm">
                                    <p className="text-gray-500">Coach</p>
                                    <p className="font-semibold text-gray-900">{entry.team?.coach || entry.coach || 'TBA'}</p>
                                  </div>
                                  <div className="bg-white rounded-lg p-3 shadow-sm">
                                    <p className="text-gray-500">Captain</p>
                                    <p className="font-semibold text-gray-900">{entry.team?.captain || entry.captain || 'TBA'}</p>
                                  </div>
                                  <div className="bg-white rounded-lg p-3 shadow-sm">
                                    <p className="text-gray-500">Home Ground</p>
                                    <p className="font-semibold text-gray-900">{entry.team?.homeGround || entry.homeGround || 'TBA'}</p>
                                  </div>
                                  <div className="bg-white rounded-lg p-3 shadow-sm">
                                    <p className="text-gray-500">Founded</p>
                                    <p className="font-semibold text-gray-900">{entry.team?.foundedYear || entry.founded || '2024'}</p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Center: Season Statistics */}
                              <div className="space-y-4">
                                <h4 className="font-bold text-gray-900 text-sm mb-3">Season Statistics</h4>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                                    <p className="text-2xl font-bold text-purple-600">{entry.matchesPlayed || 0}</p>
                                    <p className="text-xs text-gray-500">Matches</p>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                                    <p className="text-2xl font-bold text-green-600">{entry.wins || 0}</p>
                                    <p className="text-xs text-gray-500">Wins</p>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                                    <p className="text-2xl font-bold text-red-600">{entry.losses || 0}</p>
                                    <p className="text-xs text-gray-500">Losses</p>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                                    <p className="text-2xl font-bold text-yellow-600">{entry.points || 0}</p>
                                    <p className="text-xs text-gray-500">Points</p>
                                  </div>
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Score Difference</span>
                                    <span className="text-lg font-bold text-gray-900">{entry.scoreDifference || 0}</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Link
                                    href={`/teams/${entry.team?.slug || entry.slug || entry.team?.name?.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="block w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center rounded-lg font-semibold text-sm hover:from-purple-700 hover:to-blue-700 transition-all"
                                  >
                                    View Team Profile
                                  </Link>
                                  <Link
                                    href={`/teams/${entry.team?.slug || entry.slug || entry.team?.name?.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="block w-full py-2 px-4 bg-white border-2 border-purple-600 text-purple-600 text-center rounded-lg font-semibold text-sm hover:bg-purple-50 transition-all"
                                  >
                                    Team Details →️
                                  </Link>
                                </div>
                              </div>
                              
                              {/* Right: Recent Match Card */}
                              <div className="space-y-4">
                                <h4 className="font-bold text-gray-900 text-sm mb-3">Recent Match</h4>
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                  <div className="text-center py-6">
                                    <p className="text-xs text-gray-500 mb-2">No recent matches</p>
                                    <p className="text-sm text-gray-700">Season hasn't started yet</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
})

export default LazyPointsTable
