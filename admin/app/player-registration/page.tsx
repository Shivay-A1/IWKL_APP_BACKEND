"use client"

export const dynamic = 'force-dynamic'

// ============================================================================
// ⚠️  REGISTRATION FLOW - DO NOT MODIFY WITHOUT APPROVAL ⚠️
// ============================================================================
// This file contains the critical admin registration UI that is currently working.
// Any changes to this file may break the registration system.
//
// BEFORE MAKING CHANGES:
// 1. Read REGISTRATION_FLOW_LOCK.md in project root
// 2. Test thoroughly in development environment
// 3. Get approval from project owner
// 4. Document changes in REGISTRATION_FLOW_LOCK.md
//
// LAST UPDATED: 2026-08-04
// STATUS: ✅ WORKING - LOCKED
// ============================================================================

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Download, ChevronLeft, ChevronRight, Filter, Eye, Edit, Check, X, Trash2, FileText, MessageSquare, Bell } from 'lucide-react'
import { apiService } from '@/lib/api'
import { getAllRegistrations, updateRegistrationStatus, deleteRegistration, getAdminChats } from '@/lib/registration-firebase'
import { onSnapshot, collection, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import ChatModal from '@/components/ChatModal'

export default function PlayerRegistrationManagementPage() {
  const router = useRouter()
  const [registrations, setRegistrations] = useState<any[]>([])
  const [filteredRegistrations, setFilteredRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState('all')
  const [positionFilter, setPositionFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [startDateFilter, setStartDateFilter] = useState('')
  const [endDateFilter, setEndDateFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20
  const [unreadMessageCount, setUnreadMessageCount] = useState(0)
  const [showMessagesModal, setShowMessagesModal] = useState(false)
  const [chats, setChats] = useState<any[]>([])
  const [selectedChatUser, setSelectedChatUser] = useState<any>(null)
  const [showChatModal, setShowChatModal] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [chatsSubscription, setChatsSubscription] = useState<(() => void) | null>(null)

  // Dashboard stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    today: 0,
  })

  useEffect(() => {
    fetchRegistrations()
    fetchUnreadMessages()
    
    // Subscribe to real-time chat updates
    const subscribeToChats = async () => {
      try {
        const { onSnapshot } = await import('firebase/firestore')
        const { db } = await import('@/lib/firebase')
        const { collection, query, where } = await import('firebase/firestore')
        
        const adminUid = 'admin'
        const chatsRef = collection(db, 'chats')
        const q = query(chatsRef, where('adminUid', '==', adminUid))
        
        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const chatsData: any[] = []
          snapshot.forEach((doc) => {
            chatsData.push({ id: doc.id, ...doc.data() })
          })
          
          // Sort by updatedAt (newest first)
          const sortedChats = chatsData.sort((a: any, b: any) => {
            const dateA = new Date(a.updatedAt?.toDate?.() || a.createdAt?.toDate?.() || 0).getTime()
            const dateB = new Date(b.updatedAt?.toDate?.() || b.createdAt?.toDate?.() || 0).getTime()
            return dateB - dateA
          })
          
          // Fetch user details for each chat
          const chatsWithUsers = await Promise.all(
            sortedChats.map(async (chat) => {
              try {
                const userReg = await getAllRegistrations()
                const user = userReg.find((r: any) => r.id === chat.userUid)
                return {
                  ...chat,
                  userName: user?.fullName || 'Unknown User',
                  userRegistrationId: user?.registrationId || 'N/A'
                }
              } catch (error) {
                return {
                  ...chat,
                  userName: 'Unknown User',
                  userRegistrationId: 'N/A'
                }
              }
            })
          )
          
          setChats(chatsWithUsers)
          const totalUnread = chatsData.reduce((sum, chat) => sum + (chat.unreadByAdmin || 0), 0)
          setUnreadMessageCount(totalUnread)
        })
        
        setChatsSubscription(() => unsubscribe)
      } catch (error) {
        console.error('Error subscribing to chats:', error)
      }
    }
    
    subscribeToChats()
    
    // Restore saved state
    const savedSearch = sessionStorage.getItem('registrationListSearch')
    const savedStateFilter = sessionStorage.getItem('registrationListStateFilter')
    const savedPositionFilter = sessionStorage.getItem('registrationListPositionFilter')
    const savedStatusFilter = sessionStorage.getItem('registrationListStatusFilter')
    const savedStartDateFilter = sessionStorage.getItem('registrationListStartDateFilter')
    const savedEndDateFilter = sessionStorage.getItem('registrationListEndDateFilter')
    const savedPage = sessionStorage.getItem('registrationListPage')
    const savedScroll = sessionStorage.getItem('registrationListScrollPosition')
    
    if (savedSearch) setSearch(savedSearch)
    if (savedStateFilter) setStateFilter(savedStateFilter)
    if (savedPositionFilter) setPositionFilter(savedPositionFilter)
    if (savedStatusFilter) setStatusFilter(savedStatusFilter)
    if (savedStartDateFilter) setStartDateFilter(savedStartDateFilter)
    if (savedEndDateFilter) setEndDateFilter(savedEndDateFilter)
    if (savedPage) setCurrentPage(parseInt(savedPage))
    
    // Restore scroll position after state is restored
    setTimeout(() => {
      if (savedScroll) {
        window.scrollTo(0, parseInt(savedScroll))
        sessionStorage.removeItem('registrationListScrollPosition')
      }
    }, 100)
    
    // Clear saved state
    sessionStorage.removeItem('registrationListSearch')
    sessionStorage.removeItem('registrationListStateFilter')
    sessionStorage.removeItem('registrationListPositionFilter')
    sessionStorage.removeItem('registrationListStatusFilter')
    sessionStorage.removeItem('registrationListStartDateFilter')
    sessionStorage.removeItem('registrationListEndDateFilter')
    sessionStorage.removeItem('registrationListPage')
    
    // Cleanup subscription on unmount
    return () => {
      if (chatsSubscription) {
        chatsSubscription()
      }
    }
  }, [])

  useEffect(() => {
    filterRegistrations()
  }, [registrations, search, stateFilter, positionFilter, statusFilter, startDateFilter, endDateFilter])

  const fetchRegistrations = async () => {
    try {
      // Use Firestore to get all registrations
      const registrationsData = await getAllRegistrations()
      console.log('[ADMIN] Fetched registrations from Firestore:', registrationsData.length)
      
      // Sort by registration ID (sequential order)
      const sortedRegistrations = Array.isArray(registrationsData) 
        ? registrationsData.sort((a: any, b: any) => {
            const idA = a.registrationId || ''
            const idB = b.registrationId || ''
            return idA.localeCompare(idB)
          })
        : []
      
      setRegistrations(sortedRegistrations)
      
      // Calculate stats
      const today = new Date().toDateString()
      setStats({
        total: sortedRegistrations.length,
        pending: sortedRegistrations.filter((r: any) => r.status === 'Pending').length,
        approved: sortedRegistrations.filter((r: any) => r.status === 'Approved').length,
        rejected: sortedRegistrations.filter((r: any) => r.status === 'Rejected').length,
        today: sortedRegistrations.filter((r: any) => new Date(r.createdAt).toDateString() === today).length,
      })
      
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch registrations:', error)
      setRegistrations([])
      setLoading(false)
    }
  }

  const filterRegistrations = () => {
    let filtered = [...registrations]

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter((reg) =>
        reg.fullName?.toLowerCase().includes(searchLower) ||
        reg.registrationId?.toLowerCase().includes(searchLower) ||
        reg.registrationNumber?.toLowerCase().includes(searchLower) ||
        reg.mobile?.toLowerCase().includes(searchLower) ||
        reg.email?.toLowerCase().includes(searchLower)
      )
    }

    if (stateFilter && stateFilter !== 'all') {
      filtered = filtered.filter((reg) => reg.state === stateFilter)
    }

    if (positionFilter && positionFilter !== 'all') {
      filtered = filtered.filter((reg) => reg.playingPosition === positionFilter)
    }

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter((reg) => reg.status === statusFilter)
    }

    if (startDateFilter) {
      const startDate = new Date(startDateFilter)
      filtered = filtered.filter((reg) => {
        const regDate = new Date(reg.createdAt)
        // Normalize both dates to midnight for comparison
        const normalizedStartDate = new Date(startDate)
        normalizedStartDate.setHours(0, 0, 0, 0)
        const normalizedRegDate = new Date(regDate)
        normalizedRegDate.setHours(0, 0, 0, 0)
        return normalizedRegDate >= normalizedStartDate
      })
    }

    if (endDateFilter) {
      const endDate = new Date(endDateFilter)
      filtered = filtered.filter((reg) => {
        const regDate = new Date(reg.createdAt)
        // Set end date to end of day
        const normalizedEndDate = new Date(endDate)
        normalizedEndDate.setHours(23, 59, 59, 999)
        return regDate <= normalizedEndDate
      })
    }

    // Sort by registration ID (sequential order) after filtering
    filtered.sort((a: any, b: any) => {
      const idA = a.registrationId || ''
      const idB = b.registrationId || ''
      return idA.localeCompare(idB)
    })

    setFilteredRegistrations(filtered)
    setCurrentPage(1)
  }

  // Get unique values for filters
  const uniqueStates = Array.from(new Set(registrations.map((r) => r.state).filter(Boolean))).sort()
  const uniquePositions = Array.from(new Set(registrations.map((r) => r.playingPosition).filter(Boolean))).sort()

  // Pagination
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRegistrations = filteredRegistrations.slice(startIndex, endIndex)

  const handleExport = async (type: 'excel' | 'pdf') => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/player-registration/export/${type}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(new Blob([blob], { type: type === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `player-registrations.${type === 'excel' ? 'xlsx' : 'pdf'}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export:', error)
      alert('Failed to export registrations')
    }
  }

  const handleStatusUpdate = async (id: string, status: string, adminRemarks?: string) => {
    try {
      // Use Firestore to update status
      await updateRegistrationStatus(id, status)
      fetchRegistrations()
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Failed to update status')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this registration?')) return
    
    try {
      // Use Firestore to delete registration
      await deleteRegistration(id)
      fetchRegistrations()
    } catch (error) {
      console.error('Failed to delete:', error)
      alert('Failed to delete registration')
    }
  }

  const handleRowClick = (id: string) => {
    // Save current state before navigation
    sessionStorage.setItem('registrationListSearch', search)
    sessionStorage.setItem('registrationListStateFilter', stateFilter)
    sessionStorage.setItem('registrationListPositionFilter', positionFilter)
    sessionStorage.setItem('registrationListStatusFilter', statusFilter)
    sessionStorage.setItem('registrationListStartDateFilter', startDateFilter)
    sessionStorage.setItem('registrationListEndDateFilter', endDateFilter)
    sessionStorage.setItem('registrationListPage', currentPage.toString())
    sessionStorage.setItem('registrationListScrollPosition', window.scrollY.toString())
    
    router.push(`/admin/player-registration/${id}`)
  }

  const fetchUnreadMessages = async () => {
    try {
      const adminUid = 'admin' // In production, get from admin auth
      const chatsData = await getAdminChats(adminUid)
      
      // Fetch user details for each chat
      const chatsWithUsers = await Promise.all(
        chatsData.map(async (chat) => {
          try {
            const userReg = await getAllRegistrations()
            const user = userReg.find((r: any) => r.id === chat.userUid)
            return {
              ...chat,
              userName: user?.fullName || 'Unknown User',
              userRegistrationId: user?.registrationId || 'N/A'
            }
          } catch (error) {
            return {
              ...chat,
              userName: 'Unknown User',
              userRegistrationId: 'N/A'
            }
          }
        })
      )
      
      setChats(chatsWithUsers)
      const totalUnread = chatsData.reduce((sum, chat) => sum + (chat.unreadByAdmin || 0), 0)
      setUnreadMessageCount(totalUnread)
    } catch (error) {
      console.error('Failed to fetch unread messages:', error)
    }
  }



  const getStatusBadge = (status: string) => {
    const colors = {
      Pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      Approved: 'bg-green-500/20 text-green-500 border-green-500/30',
      Rejected: 'bg-red-500/20 text-red-500 border-red-500/30',
      WAITING_LIST: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
    }
    return (
      <Badge className={colors[status as keyof typeof colors] || colors.Pending}>
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">Player Registration Management</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={() => handleExport('excel')} variant="outline" className="border-[#BFA253] text-[#BFA253] flex-1 sm:flex-none">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button onClick={() => handleExport('pdf')} variant="outline" className="border-[#BFA253] text-[#BFA253] flex-1 sm:flex-none">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-[#3A1050] border-[#BFA253]">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs sm:text-sm text-black">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold text-black">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#3A1050] border-[#BFA253]">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs sm:text-sm text-black">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-400">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#3A1050] border-[#BFA253]">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs sm:text-sm text-black">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold text-green-400">{stats.approved}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#3A1050] border-[#BFA253]">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs sm:text-sm text-black">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold text-red-400">{stats.rejected}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#3A1050] border-[#BFA253]">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs sm:text-sm text-black">Today's Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold text-[#FDB515]">{stats.today}</p>
          </CardContent>
        </Card>
        <Card 
          className="bg-[#3A1050] border-[#BFA253] cursor-pointer hover:bg-[#4A2060] transition-colors"
          onClick={() => setShowMessagesModal(true)}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-xs sm:text-sm text-black flex items-center gap-2">
              <Bell className="w-4 h-4" />
              New Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold text-[#FDB515]">{unreadMessageCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-[#3A1050] border-[#BFA253]">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-4 h-4" />
                <Input
                  placeholder="Search by name, registration no, mobile, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-[#2A003F] border-[#BFA253] text-white"
                />
              </div>
            </div>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-[#2A003F] border-[#BFA253] text-white">
                <SelectValue placeholder="Filter by State" />
              </SelectTrigger>
              <SelectContent className="bg-[#3A1050] border-[#BFA253]">
                <SelectItem value="all" className="text-white">All States</SelectItem>
                {uniqueStates.map((state) => (
                  <SelectItem key={state} value={state} className="text-white">{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-[#2A003F] border-[#BFA253] text-white">
                <SelectValue placeholder="Filter by Position" />
              </SelectTrigger>
              <SelectContent className="bg-[#3A1050] border-[#BFA253]">
                <SelectItem value="all" className="text-white">All Positions</SelectItem>
                {uniquePositions.map((position) => (
                  <SelectItem key={position} value={position} className="text-white">{position}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-[#2A003F] border-[#BFA253] text-white">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#3A1050] border-[#BFA253]">
                <SelectItem value="all" className="text-white">All Status</SelectItem>
                <SelectItem value="Pending" className="text-white">Pending</SelectItem>
                <SelectItem value="Approved" className="text-white">Approved</SelectItem>
                <SelectItem value="Rejected" className="text-white">Rejected</SelectItem>
                <SelectItem value="WAITING_LIST" className="text-white">Waiting List</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1 min-w-[150px] w-full">
              <Input
                type="date"
                placeholder="Start Date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                className="bg-[#2A003F] border-[#BFA253] text-white"
              />
            </div>
            <div className="flex-1 min-w-[150px] w-full">
              <Input
                type="date"
                placeholder="End Date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                className="bg-[#2A003F] border-[#BFA253] text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-[#3A1050] border-[#BFA253] w-full min-w-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto overflow-y-hidden w-full">
            <table className="w-full min-w-[1600px]">
              <thead className="bg-[#2A003F]">
                <tr>
                  <th className="px-2 sm:px-4 py-3 text-left text-white font-medium text-xs sm:text-sm whitespace-nowrap">Reg No</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-white font-medium text-xs sm:text-sm whitespace-nowrap">Photo</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-white font-medium text-xs sm:text-sm whitespace-nowrap">Player Name</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-white font-medium text-xs sm:text-sm whitespace-nowrap">Mobile</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-white font-medium text-xs sm:text-sm whitespace-nowrap">State</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-white font-medium text-xs sm:text-sm whitespace-nowrap">Position</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-white font-medium text-xs sm:text-sm whitespace-nowrap">Status</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-white font-medium text-xs sm:text-sm whitespace-nowrap">Applied Date</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-white font-medium text-xs sm:text-sm whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRegistrations.map((reg, index) => (
                  <tr 
                    key={reg.id} 
                    className="border-t border-[#BFA253] bg-[#3A1050] hover:bg-[#2A003F] cursor-pointer"
                    onClick={() => handleRowClick(reg.id)}
                  >
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-white text-xs sm:text-sm whitespace-nowrap">{reg.registrationId || reg.registrationNumber || 'N/A'}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                      {reg.photo && (
                        <img
                          src={reg.photo}
                          alt={reg.fullName}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                        />
                      )}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-white font-medium text-xs sm:text-sm whitespace-nowrap">{reg.fullName}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-white text-xs sm:text-sm whitespace-nowrap">{reg.mobile}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-white text-xs sm:text-sm whitespace-nowrap">{reg.state}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-white text-xs sm:text-sm whitespace-nowrap">{reg.playingPosition}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">{getStatusBadge(reg.status)}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-white text-xs sm:text-sm whitespace-nowrap">
                      {new Date(reg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                      <div className="flex gap-1 sm:gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/admin/player-registration/${reg.id}`)}
                          className="text-white hover:text-[#FDB515] p-1"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        {reg.status === 'Pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleStatusUpdate(reg.id, 'Approved')}
                              className="text-green-400 hover:text-green-300"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleStatusUpdate(reg.id, 'Rejected')}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(reg.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-[#BFA253]">
            <p className="text-white text-sm">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredRegistrations.length)} of {filteredRegistrations.length} registrations
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="border-[#BFA253] text-[#BFA253]"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-white px-3 py-1">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="border-[#BFA253] text-[#BFA253]"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages List Modal */}
      {showMessagesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-white max-w-2xl w-full h-[85vh] flex flex-col relative shadow-2xl">
            {/* Fixed Close Button - Always visible */}
            <button
              onClick={() => setShowMessagesModal(false)}
              className="absolute top-4 right-4 z-20 bg-white hover:bg-gray-100 border border-gray-300 rounded-full p-2 shadow-md transition-colors"
              aria-label="Close messages"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
            
            <CardHeader className="flex-shrink-0 p-4 sm:p-6 pt-6 border-b border-gray-200">
              <div className="flex items-center justify-between pr-10">
                <CardTitle className="text-black text-lg sm:text-xl font-semibold">Messages from Users</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6">
              {chats.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No messages yet</p>
              ) : (
                <div className="space-y-3">
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        chat.unreadByAdmin > 0 ? 'bg-[#BFA253]/20 border-[#BFA253]' : 'bg-gray-50 border-gray-200'
                      } hover:bg-[#BFA253]/30`}
                      onClick={() => {
                        setSelectedChatUser(chat)
                        setShowMessagesModal(false)
                        setShowChatModal(true)
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-black">{chat.userName}</p>
                          <p className="text-sm text-gray-600">Reg No: {chat.userRegistrationId}</p>
                          {chat.lastMessage && (
                            <p className="text-sm text-gray-500 mt-1 truncate">{chat.lastMessage}</p>
                          )}
                        </div>
                        {chat.unreadByAdmin > 0 && (
                          <Badge className="bg-red-500 text-white ml-4">
                            {chat.unreadByAdmin}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chat Modal */}
      {showChatModal && selectedChatUser && (
        <ChatModal
          isOpen={showChatModal}
          onClose={() => {
            setShowChatModal(false)
            setSelectedChatUser(null)
            setShowMessagesModal(true) // Return to chat list when closing
            fetchUnreadMessages()
          }}
          userUid={selectedChatUser.userUid}
          adminUid="admin"
          userName={selectedChatUser.userName}
          isAdmin={true}
          currentUserName="Admin"
          onUnreadCountChange={() => fetchUnreadMessages()}
        />
      )}
    </div>
  )
}
