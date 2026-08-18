"use client"

export const dynamic = 'force-dynamic'

// ============================================================================
// ⚠️  REGISTRATION FLOW - DO NOT MODIFY WITHOUT APPROVAL ⚠️
// ============================================================================
// This file contains the critical registration details UI that is currently working.
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
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Download, Eye, Check, X, FileText, Printer, Shield, AlertCircle, Clock, Ban, UserCheck, RefreshCw, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react'
import { checkRegistrationByUID, updateRegistrationStatus, getNextRegistration, getPreviousRegistration } from '@/lib/registration-firebase'
import ChatModal from '@/components/ChatModal'

export default function PlayerRegistrationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [registration, setRegistration] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [adminRemarks, setAdminRemarks] = useState('')
  const [updating, setUpdating] = useState(false)
  const [notifyPlayer, setNotifyPlayer] = useState(true)
  const [trialDate, setTrialDate] = useState('')
  const [trialVenue, setTrialVenue] = useState('')
  const [trialTime, setTrialTime] = useState('')
  const [previewFile, setPreviewFile] = useState<{ url: string, type: string, blobUrl?: string } | null>(null)
  const [showChatModal, setShowChatModal] = useState(false)
  const [adminUid] = useState('admin') // In production, get from admin auth
  const [nextId, setNextId] = useState<string | null>(null)
  const [previousId, setPreviousId] = useState<string | null>(null)
  const [loadingNavigation, setLoadingNavigation] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  useEffect(() => {
    fetchRegistration()
    fetchNavigation()
  }, [params.id])

  const fetchRegistration = async () => {
    try {
      // Use Firestore to get registration by UID
      const data = await checkRegistrationByUID(params.id as string)
      console.log('[ADMIN DETAIL] Fetched registration from Firestore:', data)
      console.log('[ADMIN DETAIL] Document URLs:', {
        photo: data?.photo,
        aadhaarCard: data?.aadhaarCard,
        ageProof: data?.ageProof,
        sportsCertificate: data?.sportsCertificate,
        medicalCertificate: data?.medicalCertificate,
        stateAssociationCertificate: data?.stateAssociationCertificate,
        signature: data?.signature
      })

      if (data) {
        setRegistration(data)
        setAdminRemarks(data.adminRemarks || '')
      } else {
        setRegistration(null)
      }

      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch registration:', error)
      setLoading(false)
    }
  }

  const fetchNavigation = async () => {
    try {
      // Get saved filters from sessionStorage
      const filters = {
        search: sessionStorage.getItem('registrationListSearch') || '',
        state: sessionStorage.getItem('registrationListStateFilter') || 'all',
        position: sessionStorage.getItem('registrationListPositionFilter') || 'all',
        status: sessionStorage.getItem('registrationListStatusFilter') || 'all',
        startDate: sessionStorage.getItem('registrationListStartDateFilter') || '',
        endDate: sessionStorage.getItem('registrationListEndDateFilter') || '',
      }
      
      const [next, previous] = await Promise.all([
        getNextRegistration(params.id as string, filters),
        getPreviousRegistration(params.id as string, filters)
      ])
      
      setNextId(next)
      setPreviousId(previous)
    } catch (error) {
      console.error('Failed to fetch navigation:', error)
    }
  }

  const handleStatusUpdate = async (status: string) => {
    setUpdating(true)
    try {
      // Use Firestore to update status with trial details if approved
      const trialDetails = status === 'Approved' && (trialDate || trialVenue || trialTime) ? {
        trialDate,
        trialVenue,
        trialTime
      } : undefined
      
      await updateRegistrationStatus(params.id as string, status, trialDetails)
      fetchRegistration()
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const handleNext = async () => {
    if (!nextId || loadingNavigation) return
    
    setLoadingNavigation(true)
    try {
      router.push(`/admin/player-registration/${nextId}`)
    } catch (error) {
      console.error('Failed to navigate to next:', error)
      setLoadingNavigation(false)
    }
  }

  const handlePrevious = async () => {
    if (!previousId || loadingNavigation) return
    
    setLoadingNavigation(true)
    try {
      router.push(`/admin/player-registration/${previousId}`)
    } catch (error) {
      console.error('Failed to navigate to previous:', error)
      setLoadingNavigation(false)
    }
  }

  // Swipe gesture handlers
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isLeftSwipe && nextId) {
      handleNext()
    } else if (isRightSwipe && previousId) {
      handlePrevious()
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleDownloadDocument = (url: string, filename: string) => {
    const fullUrl = (() => {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      if (url.startsWith('/api/files/') || url.startsWith('/files/')) {
        return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
      }
      if (url.startsWith('/')) {
        return `https://iwkl-backend-lg6t-production.up.railway.app${url}`;
      }
      return `https://${url}`;
    })()
    const link = document.createElement('a')
    link.href = fullUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const handlePreviewFile = async (url: string, type: string) => {
    const fullUrl = (() => {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      if (url.startsWith('/api/files/') || url.startsWith('/files/')) {
        return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
      }
      if (url.startsWith('/')) {
        return `https://iwkl-backend-lg6t-production.up.railway.app${url}`;
      }
      return `https://${url}`;
    })()
    console.log('[PREVIEW] Opening file:', fullUrl, 'Type:', type)

    try {
      // Fetch file as blob to avoid CORS issues
      const response = await fetch(fullUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`)
      }
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)

      setPreviewFile({ url: fullUrl, type, blobUrl })
    } catch (error) {
      console.error('[PREVIEW] Failed to fetch file:', error)
      alert('Failed to load file for preview')
    }
  }

  const handleClosePreview = () => {
    if (previewFile?.blobUrl) {
      URL.revokeObjectURL(previewFile.blobUrl)
    }
    setPreviewFile(null)
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

  if (!registration) {
    return (
      <div className="p-8">
        <div className="text-white">Registration not found</div>
      </div>
    )
  }

  return (
    <div 
      className="p-4 sm:p-8 space-y-6 pb-24 sm:pb-6"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-black hover:text-[#BFA253] p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl sm:text-3xl font-bold text-black">Player Registration Details</h1>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="border-[#BFA253] text-[#BFA253] flex-1 sm:flex-none text-xs sm:text-sm"
            onClick={() => setShowChatModal(true)}
          >
            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Chat with Player</span>
            <span className="sm:hidden">Chat</span>
          </Button>
          <Button
            variant="outline"
            className="border-[#BFA253] text-[#BFA253] flex-1 sm:flex-none text-xs sm:text-sm"
            onClick={() => window.print()}
          >
            <Printer className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Print</span>
            <span className="sm:hidden">Print</span>
          </Button>
        </div>
      </div>

      {/* Registration Info Card */}
      <Card className="bg-white border-[#BFA253]/30">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-black text-xl sm:text-2xl">{registration.fullName}</CardTitle>
              <p className="text-gray-600 mt-1 text-sm">Registration No: {registration.registrationId}</p>
            </div>
            {getStatusBadge(registration.status)}
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Photo */}
            <div className="space-y-2">
              <p className="text-gray-600 text-sm">Photo</p>
              {registration.photo && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={(() => {
                      const url = registration.photo;
                      if (url.startsWith('http://') || url.startsWith('https://')) {
                        return url;
                      }
                      if (url.startsWith('/')) {
                        return `https://iwkl-backend-lg6t-production.up.railway.app${url}`;
                      }
                      return `https://${url}`;
                    })()}
                    alt="Player Photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="space-y-3 md:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Father's Name</p>
                  <p className="text-black">{registration.fatherName}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Mother's Name</p>
                  <p className="text-black">{registration.motherName}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Date of Birth</p>
                  <p className="text-black">{new Date(registration.dob).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Age</p>
                  <p className="text-black">{registration.age} years</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Gender</p>
                  <p className="text-black">{registration.gender}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Blood Group</p>
                  <p className="text-black">{registration.bloodGroup || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Aadhaar Number</p>
                  <p className="text-black">{registration.aadhaar}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Mobile</p>
                  <p className="text-black">{registration.mobile}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">WhatsApp</p>
                  <p className="text-black">{registration.whatsapp}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Email</p>
                  <p className="text-black">{registration.email}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Card */}
      <Card className="bg-white border-[#BFA253]/30">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-black text-lg sm:text-xl">Address</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <p className="text-gray-600 text-sm">Address</p>
              <p className="text-black">{registration.address}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">City</p>
              <p className="text-black">{registration.city}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">District</p>
              <p className="text-black">{registration.district || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">State</p>
              <p className="text-black">{registration.state}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Country</p>
              <p className="text-black">{registration.country || 'N/A'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-600 text-sm">PIN Code</p>
              <p className="text-black">{registration.pinCode}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kabaddi Information Card */}
      <Card className="bg-white border-[#BFA253]/30">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-black text-lg sm:text-xl">Kabaddi Information</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <p className="text-gray-600 text-sm">Playing Position</p>
              <p className="text-black">{Array.isArray(registration.playingPosition) ? registration.playingPosition.join(', ') : registration.playingPosition || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Strong Hand</p>
              <p className="text-black">{registration.strongHand || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Strong Leg</p>
              <p className="text-black">{registration.strongLeg || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Height</p>
              <p className="text-black">{registration.height || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Weight</p>
              <p className="text-black">{registration.weight || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Playing Experience Card */}
      <Card className="bg-white border-[#BFA253]/30">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-black text-lg sm:text-xl">Playing Experience</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">State Team:</span>
              <span className="text-black">{registration.stateTeam ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">National Team:</span>
              <span className="text-black">{registration.nationalTeam ? 'Yes' : 'No'}</span>
            </div>
            <div>
              <p className="text-gray-600 text-sm">University / School</p>
              <p className="text-black">{registration.university || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Club</p>
              <p className="text-black">{registration.club || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Years of Experience</p>
              <p className="text-black">{registration.experience || 0}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Coach</p>
              <p className="text-black">{registration.coach || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Current Academy</p>
              <p className="text-black">{registration.currentAcademy || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Playing Since</p>
              <p className="text-black">{registration.playingSince ? new Date(registration.playingSince).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Card */}
      <Card className="bg-white border-[#BFA253]/30">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-black text-lg sm:text-xl">Achievements</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <p className="text-black whitespace-pre-wrap">{registration.achievements || 'No achievements listed'}</p>
        </CardContent>
      </Card>

      {/* Emergency Contact Card */}
      <Card className="bg-white border-[#BFA253]/30">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-black text-lg sm:text-xl">Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Name</p>
              <p className="text-black">{registration.emergencyName}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Relation</p>
              <p className="text-black">{registration.emergencyRelation}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Mobile</p>
              <p className="text-black">{registration.emergencyMobile}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-600 text-sm">Address</p>
              <p className="text-black">{registration.emergencyAddress || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Card */}
      <Card className="bg-white border-[#BFA253]/30">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-black text-lg sm:text-xl">Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {registration.photo && (
              <div className="p-3 sm:p-4 bg-gray-100 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-black font-medium text-sm">Passport Photo</p>
                  <div className="flex gap-1 sm:gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePreviewFile(registration.photo, 'image')}
                      className="text-[#BFA253] p-1"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownloadDocument(registration.photo, 'passport-photo.jpg')}
                      className="text-[#BFA253] p-1"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
                <img
                  src={(() => {
                    const url = registration.photo;
                    if (url.startsWith('http://') || url.startsWith('https://')) {
                      return url;
                    }
                    if (url.startsWith('/')) {
                      return `https://iwkl-backend-lg6t-production.up.railway.app${url}`;
                    }
                    return `https://${url}`;
                  })()}
                  alt="Passport Photo"
                  className="w-full h-24 sm:h-32 object-cover rounded mt-2"
                />
              </div>
            )}
            {registration.aadhaarCard && (
              <div className="p-3 sm:p-4 bg-gray-100 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-black font-medium text-sm">Aadhaar Card</p>
                  <div className="flex gap-1 sm:gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePreviewFile(registration.aadhaarCard, 'pdf')}
                      className="text-[#BFA253] p-1"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownloadDocument(registration.aadhaarCard, 'aadhaar.pdf')}
                      className="text-[#BFA253] p-1"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2">PDF Document</p>
              </div>
            )}
            {registration.ageProof && (
              <div className="p-3 sm:p-4 bg-gray-100 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-black font-medium text-sm">Age Proof</p>
                  <div className="flex gap-1 sm:gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePreviewFile(registration.ageProof, 'pdf')}
                      className="text-[#BFA253] p-1"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownloadDocument(registration.ageProof, 'age-proof.pdf')}
                      className="text-[#BFA253] p-1"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2">PDF Document</p>
              </div>
            )}
            {registration.sportsCertificate && (
              <div className="p-3 sm:p-4 bg-gray-100 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-black font-medium text-sm">Sports Certificate</p>
                  <div className="flex gap-1 sm:gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePreviewFile(registration.sportsCertificate, 'pdf')}
                      className="text-[#BFA253] p-1"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownloadDocument(registration.sportsCertificate, 'sports-certificate.pdf')}
                      className="text-[#BFA253] p-1"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2">PDF Document</p>
              </div>
            )}
            {registration.medicalCertificate && (
              <div className="p-3 sm:p-4 bg-gray-100 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-black font-medium text-sm">Medical Certificate</p>
                  <div className="flex gap-1 sm:gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePreviewFile(registration.medicalCertificate, 'pdf')}
                      className="text-[#BFA253] p-1"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownloadDocument(registration.medicalCertificate, 'medical-certificate.pdf')}
                      className="text-[#BFA253] p-1"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2">PDF Document</p>
              </div>
            )}
            {registration.stateAssociationCertificate && (
              <div className="p-3 sm:p-4 bg-gray-100 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-black font-medium text-sm">State Association Certificate</p>
                  <div className="flex gap-1 sm:gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePreviewFile(registration.stateAssociationCertificate, 'pdf')}
                      className="text-[#BFA253] p-1"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownloadDocument(registration.stateAssociationCertificate, 'state-association-certificate.pdf')}
                      className="text-[#BFA253] p-1"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2">PDF Document</p>
              </div>
            )}
            {registration.additionalCertificate && (
              <div className="p-3 sm:p-4 bg-gray-100 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-black font-medium text-sm">Additional Certificate</p>
                  <div className="flex gap-1 sm:gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePreviewFile(registration.additionalCertificate, 'pdf')}
                      className="text-[#BFA253] p-1"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownloadDocument(registration.additionalCertificate.startsWith('http') ? registration.additionalCertificate : `${process.env.NEXT_PUBLIC_API_URL}${registration.additionalCertificate}`, 'additional-certificate.pdf')}
                      className="text-[#BFA253] p-1"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2">PDF Document</p>
              </div>
            )}
            {registration.videoHighlights && (
              <div className="p-3 sm:p-4 bg-gray-100 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-black font-medium text-sm">Video Highlights</p>
                  <div className="flex gap-1 sm:gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePreviewFile(registration.videoHighlights, 'video')}
                      className="text-[#BFA253] p-1"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownloadDocument(registration.videoHighlights.startsWith('http') ? registration.videoHighlights : `${process.env.NEXT_PUBLIC_API_URL}${registration.videoHighlights}`, 'video-highlights.mp4')}
                      className="text-[#BFA253] p-1"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2">Video File</p>
              </div>
            )}
            {registration.signature && (
              <div className="p-3 sm:p-4 bg-gray-100 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-black font-medium text-sm">Signature</p>
                  <div className="flex gap-1 sm:gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePreviewFile(registration.signature, 'image')}
                      className="text-[#BFA253] p-1"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownloadDocument(registration.signature, 'signature.png')}
                      className="text-[#BFA253] p-1"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">Click to download</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Signature Card */}
      {registration.signature && (
        <Card className="bg-white border-[#BFA253]/30">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-black text-lg sm:text-xl">Digital Signature</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <img
              src={(() => {
                const url = registration.signature;
                if (url.startsWith('http://') || url.startsWith('https://')) {
                  return url;
                }
                if (url.startsWith('/')) {
                  return `https://iwkl-backend-lg6t-production.up.railway.app${url}`;
                }
                return `https://${url}`;
              })()}
              alt="Signature"
              className="max-h-32 bg-white rounded p-2"
            />
          </CardContent>
        </Card>
      )}

      {/* Admin Actions Card */}
      <Card className="bg-white border-[#BFA253]/30">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-black text-lg sm:text-xl">Admin Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-gray-600 text-sm mb-2 block">Admin Remarks</label>
            <Textarea
              value={adminRemarks}
              onChange={(e) => setAdminRemarks(e.target.value)}
              placeholder="Add remarks for this registration..."
              rows={3}
              className="bg-gray-100 border-[#BFA253]/30 text-black"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="notifyPlayer"
              checked={notifyPlayer}
              onChange={(e) => setNotifyPlayer(e.target.checked)}
              className="w-4 h-4 accent-[#BFA253]"
            />
            <label htmlFor="notifyPlayer" className="text-black text-sm">
              Notify player via email
            </label>
          </div>

          {(registration.status === 'Pending' || registration.status === 'UNDER_REVIEW') && (
            <div className="space-y-3 pt-3 border-t border-[#BFA253]/30">
              <p className="text-[#BFA253] text-sm font-medium">Trial Details (if approved)</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-600 text-xs mb-1 block">Trial Date</label>
                  <Input
                    type="date"
                    value={trialDate}
                    onChange={(e) => setTrialDate(e.target.value)}
                    className="bg-gray-100 border-[#BFA253]/30 text-black"
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-xs mb-1 block">Venue</label>
                  <Input
                    value={trialVenue}
                    onChange={(e) => setTrialVenue(e.target.value)}
                    placeholder="Trial venue"
                    className="bg-gray-100 border-[#BFA253]/30 text-black"
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-xs mb-1 block">Reporting Time</label>
                  <Input
                    value={trialTime}
                    onChange={(e) => setTrialTime(e.target.value)}
                    placeholder="e.g., 9:00 AM"
                    className="bg-gray-100 border-[#BFA253]/30 text-black"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {registration.status === 'Pending' && (
              <>
                <Button
                  onClick={() => handleStatusUpdate('Approved')}
                  disabled={updating}
                  className="bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm"
                >
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleStatusUpdate('Rejected')}
                  disabled={updating}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleStatusUpdate('WAITING_LIST')}
                  disabled={updating}
                  variant="outline"
                  className="border-orange-500 text-orange-500 hover:bg-orange-500/10 text-xs sm:text-sm"
                >
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Waiting List</span>
                  <span className="sm:hidden">Waitlist</span>
                </Button>
              </>
            )}
            {registration.status === 'WAITING_LIST' && (
              <>
                <Button
                  onClick={() => handleStatusUpdate('Approved')}
                  disabled={updating}
                  className="bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm"
                >
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleStatusUpdate('Pending')}
                  disabled={updating}
                  variant="outline"
                  className="border-[#BFA253] text-[#BFA253] text-xs sm:text-sm"
                >
                  <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Reset to Pending</span>
                  <span className="sm:hidden">Reset</span>
                </Button>
              </>
            )}
            {registration.status === 'Approved' && (
              <>
                <Button
                  onClick={() => handleStatusUpdate('Pending')}
                  disabled={updating}
                  variant="outline"
                  className="border-[#BFA253] text-[#BFA253] text-xs sm:text-sm"
                >
                  <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Reset to Pending</span>
                  <span className="sm:hidden">Reset</span>
                </Button>
              </>
            )}
            {registration.status === 'Rejected' && (
              <>
                <Button
                  onClick={() => handleStatusUpdate('Pending')}
                  disabled={updating}
                  variant="outline"
                  className="border-[#BFA253] text-[#BFA253] text-xs sm:text-sm"
                >
                  <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Reset to Pending</span>
                  <span className="sm:hidden">Reset</span>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Applied Date */}
      <div className="text-center text-gray-600 text-sm">
        Applied on: {new Date(registration.createdAt).toLocaleString()}
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#BFA253]/30 p-4 sm:static sm:bg-transparent sm:border-0 sm:p-0 flex items-center justify-between gap-2 sm:gap-4 z-10">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={!previousId || loadingNavigation}
          className="border-[#BFA253] text-[#BFA253] flex-1 text-xs sm:text-sm"
        >
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </Button>
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={!nextId || loadingNavigation}
          className="border-[#BFA253] text-[#BFA253] flex-1 text-xs sm:text-sm"
        >
          <span className="hidden sm:inline">Next</span>
          <span className="sm:hidden">Next</span>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
        </Button>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-black">File Preview</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClosePreview}
                className="text-black"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
              <p className="text-gray-600 text-sm mb-2">URL: {previewFile.url}</p>
              {previewFile.type === 'image' && (
                <img
                  src={previewFile.blobUrl || previewFile.url}
                  alt="Preview"
                  className="max-w-full h-auto mx-auto"
                  onError={(e) => {
                    console.error('[PREVIEW] Image load error:', e)
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
              {previewFile.type === 'pdf' && (
                <iframe
                  src={previewFile.blobUrl || previewFile.url}
                  className="w-full h-[70vh]"
                  title="PDF Preview"
                  onError={(e) => {
                    console.error('[PREVIEW] PDF load error:', e)
                  }}
                />
              )}
              {previewFile.type === 'video' && (
                <video
                  src={previewFile.blobUrl || previewFile.url}
                  controls
                  className="max-w-full h-auto mx-auto"
                  onError={(e) => {
                    console.error('[PREVIEW] Video load error:', e)
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      <ChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        userUid={params.id as string}
        adminUid={adminUid}
        userName={registration?.fullName || 'Player'}
        isAdmin={true}
        currentUserName="Admin"
      />
    </div>
  )
}
