"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Search, Download, ChevronLeft, ChevronRight, Filter, Eye, Edit, Check, X, Trash2, FileText, MessageSquare, Share2, Calendar, MapPin, Clock } from 'lucide-react'
import { apiService } from '@/lib/api'

export default function SocialMediaPartnersManagementPage() {
  const router = useRouter()
  const [registrations, setRegistrations] = useState<any[]>([])
  const [filteredRegistrations, setFilteredRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [showRemarksDialog, setShowRemarksDialog] = useState(false)
  const [showInterviewDialog, setShowInterviewDialog] = useState(false)

  // Dashboard stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    shortlisted: 0,
  })

  // Status update form
  const [statusForm, setStatusForm] = useState({
    status: '',
    adminRemarks: '',
    notifyPartner: true,
  })

  // Remarks form
  const [remarksForm, setRemarksForm] = useState({
    adminRemarks: '',
  })

  // Interview form
  const [interviewForm, setInterviewForm] = useState({
    interviewDate: '',
    interviewVenue: '',
    interviewTime: '',
  })

  useEffect(() => {
    fetchRegistrations()
  }, [])

  useEffect(() => {
    filterRegistrations()
  }, [registrations, search, stateFilter, statusFilter])

  const fetchRegistrations = async () => {
    try {
      const response: any = await apiService.socialMediaPartner.getAll()
      const registrationsData = response.registrations || response.data?.registrations || response.data || response || []
      
      setRegistrations(Array.isArray(registrationsData) ? registrationsData : [])
      
      // Calculate stats
      const dataArray = Array.isArray(registrationsData) ? registrationsData : []
      setStats({
        total: dataArray.length,
        pending: dataArray.filter((r: any) => r.status === 'PENDING').length,
        approved: dataArray.filter((r: any) => r.status === 'APPROVED').length,
        rejected: dataArray.filter((r: any) => r.status === 'REJECTED').length,
        shortlisted: dataArray.filter((r: any) => r.status === 'SELECTED').length,
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
        reg.registrationNumber?.toLowerCase().includes(searchLower) ||
        reg.mobile?.toLowerCase().includes(searchLower) ||
        reg.email?.toLowerCase().includes(searchLower)
      )
    }

    if (stateFilter && stateFilter !== 'all') {
      filtered = filtered.filter((reg) => reg.state === stateFilter)
    }

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter((reg) => reg.status === statusFilter)
    }

    setFilteredRegistrations(filtered)
    setCurrentPage(1)
  }

  const handleView = (registration: any) => {
    setSelectedRegistration(registration)
    setShowViewDialog(true)
  }

  const handleStatusUpdate = async () => {
    try {
      await apiService.socialMediaPartner.updateStatus(selectedRegistration.id, statusForm)
      setShowStatusDialog(false)
      fetchRegistrations()
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const handleRemarksUpdate = async () => {
    try {
      await apiService.socialMediaPartner.update(selectedRegistration.id, { adminRemarks: remarksForm.adminRemarks })
      setShowRemarksDialog(false)
      fetchRegistrations()
    } catch (error) {
      console.error('Failed to update remarks:', error)
    }
  }

  const handleInterviewUpdate = async () => {
    try {
      await apiService.socialMediaPartner.update(selectedRegistration.id, interviewForm)
      setShowInterviewDialog(false)
      fetchRegistrations()
    } catch (error) {
      console.error('Failed to update interview details:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      try {
        await apiService.socialMediaPartner.delete(id)
        fetchRegistrations()
      } catch (error) {
        console.error('Failed to delete registration:', error)
      }
    }
  }

  const handleExportExcel = async () => {
    try {
      const response: any = await apiService.socialMediaPartner.exportExcel()
      const blob = response.data || response
      const url = window.URL.createObjectURL(new Blob([blob]))
      const a = document.createElement('a')
      a.href = url
      a.download = 'social-media-partners.xlsx'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to export Excel:', error)
    }
  }

  const handleExportPDF = async () => {
    try {
      const response: any = await apiService.socialMediaPartner.exportPDF()
      const blob = response.data || response
      const url = window.URL.createObjectURL(new Blob([blob]))
      const a = document.createElement('a')
      a.href = url
      a.download = 'social-media-partners.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to export PDF:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'UNDER_VERIFICATION':
        return 'bg-blue-100 text-blue-800'
      case 'UNDER_REVIEW':
        return 'bg-purple-100 text-purple-800'
      case 'WAITING_LIST':
        return 'bg-orange-100 text-orange-800'
      case 'SELECTED':
        return 'bg-emerald-100 text-emerald-800'
      case 'SUSPENDED':
        return 'bg-gray-100 text-gray-800'
      case 'INFO_REQUESTED':
        return 'bg-amber-100 text-amber-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const paginatedRegistrations = filteredRegistrations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading registrations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Social Media Partners</h1>
        <p className="text-gray-600 text-sm sm:text-base">Manage social media partner registrations</p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6 sm:mb-8">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs sm:text-sm text-gray-500">Total Applications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-xs sm:text-sm text-gray-500">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-xs sm:text-sm text-gray-500">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-xs sm:text-sm text-gray-500">Rejected</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-emerald-600">{stats.shortlisted}</div>
            <div className="text-xs sm:text-sm text-gray-500">Shortlisted</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, registration ID, mobile, or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <SelectValue placeholder="Filter by state" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800">
                <SelectItem value="all" className="text-gray-900 dark:text-white">All States</SelectItem>
                {[...new Set(registrations.map(r => r.state))].map(state => (
                  <SelectItem key={state} value={state} className="text-gray-900 dark:text-white">{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800">
                <SelectItem value="all" className="text-gray-900 dark:text-white">All Status</SelectItem>
                <SelectItem value="PENDING" className="text-gray-900 dark:text-white">Pending</SelectItem>
                <SelectItem value="APPROVED" className="text-gray-900 dark:text-white">Approved</SelectItem>
                <SelectItem value="REJECTED" className="text-gray-900 dark:text-white">Rejected</SelectItem>
                <SelectItem value="UNDER_VERIFICATION" className="text-gray-900 dark:text-white">Under Verification</SelectItem>
                <SelectItem value="UNDER_REVIEW" className="text-gray-900 dark:text-white">Under Review</SelectItem>
                <SelectItem value="SELECTED" className="text-gray-900 dark:text-white">Selected</SelectItem>
                <SelectItem value="WAITING_LIST" className="text-gray-900 dark:text-white">Waiting List</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExportExcel} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
            <Button onClick={handleExportPDF} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="w-full min-w-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto overflow-y-hidden w-full">
            <table className="w-full min-w-[1600px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Reg ID</th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Name</th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Mobile</th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Email</th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Instagram</th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Followers</th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">YouTube</th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Applied Date</th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedRegistrations.map((registration) => (
                  <tr key={registration.id} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                      {registration.registrationNumber}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {registration.fullName}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {registration.mobile}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {registration.email}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {registration.instagramUsername || '-'}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {registration.instagramFollowers || '-'}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {registration.youtubeChannel || '-'}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(registration.status)}>
                        {typeof registration.status === 'string' ? registration.status.replace(/_/g, ' ') : registration.status || 'Unknown'}
                      </Badge>
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {new Date(registration.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleView(registration)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => { setSelectedRegistration(registration); setShowStatusDialog(true) }}>
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => { setSelectedRegistration(registration); setShowRemarksDialog(true) }}>
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => { setSelectedRegistration(registration); setShowInterviewDialog(true) }}>
                          <Calendar className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(registration.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredRegistrations.length > itemsPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t gap-4">
              <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredRegistrations.length)} of {filteredRegistrations.length} results
              </div>
              <div className="flex gap-2 justify-center sm:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage * itemsPerPage >= filteredRegistrations.length}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registration Details</DialogTitle>
          </DialogHeader>
          {selectedRegistration && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Registration Number</Label>
                  <p className="font-semibold">{selectedRegistration.registrationNumber}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedRegistration.status)}>
                    {typeof selectedRegistration.status === 'string' ? selectedRegistration.status.replace(/_/g, ' ') : selectedRegistration.status || 'Unknown'}
                  </Badge>
                </div>
                <div>
                  <Label>Full Name</Label>
                  <p className="font-semibold">{selectedRegistration.fullName}</p>
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <p>{new Date(selectedRegistration.dob).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label>Mobile</Label>
                  <p>{selectedRegistration.mobile}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p>{selectedRegistration.email}</p>
                </div>
                <div>
                  <Label>City</Label>
                  <p>{selectedRegistration.city}</p>
                </div>
                <div>
                  <Label>State</Label>
                  <p>{selectedRegistration.state}</p>
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold">Social Media Information</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label>Instagram</Label>
                    <p>{selectedRegistration.instagramUsername || 'N/A'} ({selectedRegistration.instagramFollowers || 0} followers)</p>
                  </div>
                  <div>
                    <Label>YouTube</Label>
                    <p>{selectedRegistration.youtubeChannel || 'N/A'} ({selectedRegistration.youtubeSubscribers || 0} subscribers)</p>
                  </div>
                  <div>
                    <Label>Facebook</Label>
                    <p>{selectedRegistration.facebookUsername || 'N/A'} ({selectedRegistration.facebookFollowers || 0} followers)</p>
                  </div>
                  <div>
                    <Label>X (Twitter)</Label>
                    <p>{selectedRegistration.twitterUsername || 'N/A'} ({selectedRegistration.twitterFollowers || 0} followers)</p>
                  </div>
                  <div className="col-span-2">
                    <Label>LinkedIn</Label>
                    <p>{selectedRegistration.linkedin || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold">Content & Audience</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label>Content Category</Label>
                    <p>{selectedRegistration.contentCategory || 'N/A'}</p>
                  </div>
                  <div>
                    <Label>Primary Audience Location</Label>
                    <p>{selectedRegistration.primaryAudienceLocation || 'N/A'}</p>
                  </div>
                  <div>
                    <Label>Average Monthly Reach</Label>
                    <p>{selectedRegistration.averageMonthlyReach ? selectedRegistration.averageMonthlyReach.toLocaleString() : 'N/A'}</p>
                  </div>
                  <div>
                    <Label>Engagement Rate</Label>
                    <p>{selectedRegistration.averageEngagementRate ? `${selectedRegistration.averageEngagementRate}%` : 'N/A'}</p>
                  </div>
                </div>
              </div>

              {selectedRegistration.previousSportsExperience && (
                <div>
                  <Label>Previous Sports Event Experience</Label>
                  <p className="mt-1">{selectedRegistration.previousSportsExperience}</p>
                </div>
              )}

              {selectedRegistration.reasonToJoin && (
                <div>
                  <Label>Reason to Join IWKL</Label>
                  <p className="mt-1">{selectedRegistration.reasonToJoin}</p>
                </div>
              )}

              {selectedRegistration.adminRemarks && (
                <div>
                  <Label>Admin Remarks</Label>
                  <p className="mt-1">{selectedRegistration.adminRemarks}</p>
                </div>
              )}

              {(selectedRegistration.interviewDate || selectedRegistration.interviewVenue || selectedRegistration.interviewTime) && (
                <div>
                  <Label className="text-base font-semibold">Interview Details</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {selectedRegistration.interviewDate && (
                      <p><strong>Date:</strong> {new Date(selectedRegistration.interviewDate).toLocaleDateString()}</p>
                    )}
                    {selectedRegistration.interviewTime && (
                      <p><strong>Time:</strong> {selectedRegistration.interviewTime}</p>
                    )}
                    {selectedRegistration.interviewVenue && (
                      <p><strong>Venue:</strong> {selectedRegistration.interviewVenue}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Status</Label>
              <Select value={statusForm.status} onValueChange={(value) => setStatusForm(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="UNDER_VERIFICATION">Under Verification</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="SELECTED">Selected</SelectItem>
                  <SelectItem value="WAITING_LIST">Waiting List</SelectItem>
                  <SelectItem value="INFO_REQUESTED">Info Requested</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Admin Remarks</Label>
              <Textarea
                value={statusForm.adminRemarks}
                onChange={(e) => setStatusForm(prev => ({ ...prev, adminRemarks: e.target.value }))}
                placeholder="Add remarks for this status change..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="notifyPartner"
                checked={statusForm.notifyPartner}
                onChange={(e) => setStatusForm(prev => ({ ...prev, notifyPartner: e.target.checked }))}
              />
              <Label htmlFor="notifyPartner">Notify partner via email</Label>
            </div>
            <Button onClick={handleStatusUpdate} className="w-full">
              Update Status
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remarks Dialog */}
      <Dialog open={showRemarksDialog} onOpenChange={setShowRemarksDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Remarks</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Admin Remarks</Label>
              <Textarea
                value={remarksForm.adminRemarks}
                onChange={(e) => setRemarksForm(prev => ({ ...prev, adminRemarks: e.target.value }))}
                placeholder="Add remarks..."
                rows={4}
              />
            </div>
            <Button onClick={handleRemarksUpdate} className="w-full">
              Save Remarks
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Interview Dialog */}
      <Dialog open={showInterviewDialog} onOpenChange={setShowInterviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Interview Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Interview Date</Label>
              <Input
                type="date"
                value={interviewForm.interviewDate}
                onChange={(e) => setInterviewForm(prev => ({ ...prev, interviewDate: e.target.value }))}
              />
            </div>
            <div>
              <Label>Interview Time</Label>
              <Input
                type="time"
                value={interviewForm.interviewTime}
                onChange={(e) => setInterviewForm(prev => ({ ...prev, interviewTime: e.target.value }))}
              />
            </div>
            <div>
              <Label>Interview Venue</Label>
              <Input
                value={interviewForm.interviewVenue}
                onChange={(e) => setInterviewForm(prev => ({ ...prev, interviewVenue: e.target.value }))}
                placeholder="Enter venue address"
              />
            </div>
            <Button onClick={handleInterviewUpdate} className="w-full">
              Assign Interview
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
