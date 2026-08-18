"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Download, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { apiService } from '@/lib/api'

export default function FanClubManagementPage() {
  const [registrations, setRegistrations] = useState<any[]>([])
  const [filteredRegistrations, setFilteredRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [teamFilter, setTeamFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  useEffect(() => {
    fetchRegistrations()
  }, [])

  useEffect(() => {
    filterRegistrations()
  }, [registrations, search, teamFilter])

  const fetchRegistrations = async () => {
    try {
      const response = await apiService.fanClub.getAll()
      console.log('Fan club response:', response)
      const registrationsData = response?.data || response || []
      console.log('Registrations data:', registrationsData)
      setRegistrations(Array.isArray(registrationsData) ? registrationsData : [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch registrations:', error)
      setRegistrations([])
      setLoading(false)
    }
  }

  const filterRegistrations = () => {
    let filtered = [...registrations]

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter((reg) =>
        reg.fullName?.toLowerCase().includes(searchLower) ||
        reg.email?.toLowerCase().includes(searchLower) ||
        reg.mobileNumber?.toLowerCase().includes(searchLower) ||
        reg.city?.toLowerCase().includes(searchLower)
      )
    }

    // Team filter
    if (teamFilter) {
      filtered = filtered.filter((reg) => reg.favoriteTeam?.name === teamFilter)
    }

    console.log('Filtered registrations:', filtered)
    setFilteredRegistrations(filtered)
    setCurrentPage(1)
  }

  // Get unique teams for filter dropdown
  const uniqueTeams = Array.from(
    new Set(registrations.map((reg) => reg.favoriteTeam?.name).filter(Boolean))
  ).sort()

  // Pagination
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRegistrations = filteredRegistrations.slice(startIndex, endIndex)

  const handleExport = async () => {
    try {
      console.log('Starting export...')
      const response = await apiService.fanClub.export()
      console.log('Export response:', response)

      // Handle different response structures
      const blob = response.data || response
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'text/csv' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'fan-club-registrations.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      console.log('Export completed successfully')
    } catch (error) {
      console.error('Failed to export:', error)
      alert('Failed to export registrations')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">Fan Club Registrations</h1>
        <Button onClick={handleExport} className="bg-[#7A3D92] text-white hover:bg-[#652F7A] w-full sm:w-auto">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by name, email, mobile number, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#652F7A] border-white/20 text-white placeholder:text-white/50 pl-10"
          />
        </div>
        <div className="w-full sm:w-64">
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="w-full bg-[#652F7A] border border-white/20 text-white rounded-md px-3 py-2"
          >
            <option value="" className="text-white">All Teams</option>
            {uniqueTeams.map((team) => (
              <option key={team} value={team} className="text-white">
                {team}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-[#652F7A] rounded-lg overflow-hidden w-full min-w-0">
        <div className="overflow-x-auto overflow-y-hidden w-full">
          <table className="w-full min-w-[1600px]">
            <thead className="bg-[#2B123A]">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">
                  Name
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">
                  Email
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">
                  Mobile
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">
                  City
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">
                  State
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">
                  Gender
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">
                  Age
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">
                  Favorite Team
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">
                  Document
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">
                  Registration Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {currentRegistrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-[#7A3D92]/20">
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-white text-xs sm:text-sm">{reg.fullName}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-white text-xs sm:text-sm">{reg.email}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-white text-xs sm:text-sm">{reg.mobileNumber}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-white text-xs sm:text-sm">{reg.city}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-white text-xs sm:text-sm">{reg.state}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-white text-xs sm:text-sm">{reg.gender}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-white text-xs sm:text-sm">{reg.age}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-white text-xs sm:text-sm">
                    {reg.favoriteTeam?.name || 'N/A'}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-white text-xs sm:text-sm">
                    {reg.documentSignature ? (
                      <a
                        href={reg.documentSignature}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline text-xs sm:text-sm"
                      >
                        View Document
                      </a>
                    ) : (
                      <span className="text-white/50 text-xs sm:text-sm">N/A</span>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-white text-xs sm:text-sm">
                    {new Date(reg.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currentRegistrations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/50">
              {search || teamFilter ? 'No registrations found matching your filters.' : 'No fan club registrations yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-white/50 text-sm text-center sm:text-left">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredRegistrations.length)} of {filteredRegistrations.length} registrations
          </div>
          <div className="flex items-center gap-2 justify-center sm:justify-end">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-[#652F7A] text-white hover:bg-[#7A3D92] disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-white text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-[#652F7A] text-white hover:bg-[#7A3D92] disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 text-white/50 text-sm text-center sm:text-left">
        Total registrations: {registrations.length} | Filtered: {filteredRegistrations.length}
      </div>
    </div>
  )
}