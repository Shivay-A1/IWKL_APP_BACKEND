'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import { ArrowLeft, MessageSquare, Check, X, FileText, Download, User, Mail, Phone, MapPin, Calendar, Send } from 'lucide-react';

interface Registration {
  id: string;
  registrationNumber: string;
  fullName: string;
  fatherName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyContactRelation: string;
  status: string;
  photoPath?: string;
  aadhaarPath?: string;
  ageProofPath?: string;
  sportsCertificatePath?: string;
  medicalCertificatePath?: string;
  signaturePath?: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function RegistrationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const registrationId = params.id as string;
  
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchRegistration();
  }, [registrationId, router]);

  const fetchRegistration = async () => {
    try {
      const response = await api.get(`/player-registration/${registrationId}`);
      setRegistration(response.data);
      fetchChatMessages();
    } catch (error) {
      console.error('Failed to fetch registration:', error);
      setError('Failed to load registration details');
    } finally {
      setLoading(false);
    }
  };

  const fetchChatMessages = async () => {
    try {
      const response = await api.get(`/messages/conversation/${registration?.user.id}`);
      setChatMessages(response.data.messages || []);
    } catch (error) {
      console.error('Failed to fetch chat messages:', error);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      await api.put(`/player-registration/${registrationId}/status`, { status: newStatus });
      alert(`Registration ${newStatus} successfully`);
      fetchRegistration();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setSendingMessage(true);
    try {
      await api.post('/messages/send', {
        recipientId: registration?.user.id,
        subject: 'Regarding your registration',
        content: chatMessage,
      });
      setChatMessage('');
      fetchChatMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleDownloadDocument = (url?: string, filename?: string) => {
    if (!url) return;
    const fullUrl = url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL}${url}`;
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = filename || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-red-400 text-center">
          <p className="text-xl mb-4">{error || 'Registration not found'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-white">Registration Details</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                registration.status === 'APPROVED' ? 'bg-green-600 text-white' :
                registration.status === 'REJECTED' ? 'bg-red-600 text-white' :
                registration.status === 'PENDING' ? 'bg-yellow-600 text-white' :
                'bg-gray-600 text-white'
              }`}>
                {registration.status}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Registration Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Full Name</p>
                  <p className="text-white font-medium">{registration.fullName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Father's Name</p>
                  <p className="text-white font-medium">{registration.fatherName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Date of Birth</p>
                  <p className="text-white font-medium">{new Date(registration.dateOfBirth).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Gender</p>
                  <p className="text-white font-medium">{registration.gender}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Blood Group</p>
                  <p className="text-white font-medium">{registration.bloodGroup || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Registration Number</p>
                  <p className="text-white font-medium">{registration.registrationNumber}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-medium">{registration.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Mobile</p>
                  <p className="text-white font-medium">{registration.mobile}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-400 text-sm">Address</p>
                  <p className="text-white font-medium">{registration.address}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">City</p>
                  <p className="text-white font-medium">{registration.city}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">State</p>
                  <p className="text-white font-medium">{registration.state}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Pincode</p>
                  <p className="text-white font-medium">{registration.pincode}</p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Emergency Contact
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Contact Name</p>
                  <p className="text-white font-medium">{registration.emergencyContactName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Contact Number</p>
                  <p className="text-white font-medium">{registration.emergencyContactNumber}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Relation</p>
                  <p className="text-white font-medium">{registration.emergencyContactRelation}</p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Documents
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {registration.photoPath && (
                  <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                    <span className="text-white text-sm">Profile Photo</span>
                    <button
                      onClick={() => handleDownloadDocument(registration.photoPath, 'profile-photo.jpg')}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {registration.aadhaarPath && (
                  <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                    <span className="text-white text-sm">Aadhaar Card</span>
                    <button
                      onClick={() => handleDownloadDocument(registration.aadhaarPath, 'aadhaar.pdf')}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {registration.ageProofPath && (
                  <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                    <span className="text-white text-sm">Age Proof</span>
                    <button
                      onClick={() => handleDownloadDocument(registration.ageProofPath, 'age-proof.pdf')}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {registration.sportsCertificatePath && (
                  <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                    <span className="text-white text-sm">Sports Certificate</span>
                    <button
                      onClick={() => handleDownloadDocument(registration.sportsCertificatePath, 'sports-certificate.pdf')}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {registration.medicalCertificatePath && (
                  <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                    <span className="text-white text-sm">Medical Certificate</span>
                    <button
                      onClick={() => handleDownloadDocument(registration.medicalCertificatePath, 'medical-certificate.pdf')}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {registration.signaturePath && (
                  <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                    <span className="text-white text-sm">Signature</span>
                    <button
                      onClick={() => handleDownloadDocument(registration.signaturePath, 'signature.png')}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              {registration.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus('APPROVED')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2"
                  >
                    <Check className="w-5 h-5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('REJECTED')}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2"
                  >
                    <X className="w-5 h-5" />
                    <span>Reject</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl border border-gray-700 h-full flex flex-col">
              <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Chat with {registration.user.name}
                </h2>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No messages yet</p>
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender.id === registration.user.id ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.sender.id === registration.user.id
                            ? 'bg-gray-700 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 border-t border-gray-700">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={sendingMessage || !chatMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                  >
                    {sendingMessage ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
