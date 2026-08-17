'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Send, MessageSquare, Clock, CheckCircle, FileText, Trash2, Reply } from 'lucide-react';

interface Message {
  id: string;
  subject: string;
  content: string;
  attachmentUrl?: string;
  attachmentName?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  status: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
  recipient?: {
    id: string;
    name: string;
    email: string;
  };
  replies?: Message[];
}

export default function MessagesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'compose'>('inbox');
  const [inboxMessages, setInboxMessages] = useState<Message[]>([]);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  
  // Compose form state
  const [composeForm, setComposeForm] = useState({
    recipientId: '',
    subject: '',
    content: '',
    isBroadcast: false,
    attachmentUrl: '',
    attachmentName: ''
  });

  // Reply form state
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchMessages();
  }, [router]);

  const fetchMessages = async () => {
    try {
      const [inboxRes, sentRes] = await Promise.all([
        api.get('/messages/inbox'),
        api.get('/messages/sent')
      ]);
      
      setInboxMessages(inboxRes.data.messages);
      setUnreadCount(inboxRes.data.unreadCount);
      setSentMessages(sentRes.data.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/messages/send', composeForm);
      alert('Message sent successfully!');
      setComposeForm({
        recipientId: '',
        subject: '',
        content: '',
        isBroadcast: false,
        attachmentUrl: '',
        attachmentName: ''
      });
      setActiveTab('sent');
      fetchMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await api.patch(`/messages/${messageId}/read`);
      fetchMessages();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleReply = async (messageId: string) => {
    if (!replyContent.trim()) return;
    
    try {
      await api.post(`/messages/${messageId}/reply`, { content: replyContent });
      alert('Reply sent successfully!');
      setReplyContent('');
      fetchMessages();
      if (selectedMessage) {
        // Refresh selected message
        const res = await api.get(`/messages/${messageId}`);
        setSelectedMessage(res.data);
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
      alert('Failed to send reply');
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await api.delete(`/messages/${messageId}`);
      alert('Message deleted successfully');
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      console.error('Failed to delete message:', error);
      alert('Failed to delete message');
    }
  };

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      await handleMarkAsRead(message.id);
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
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-300 hover:text-white"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-white">Messages</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                {unreadCount} unread
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-800">
          <button
            onClick={() => { setActiveTab('inbox'); setSelectedMessage(null); }}
            className={`px-4 py-2 ${activeTab === 'inbox' ? 'text-white border-b-2 border-primary' : 'text-gray-400'}`}
          >
            Inbox ({unreadCount})
          </button>
          <button
            onClick={() => { setActiveTab('sent'); setSelectedMessage(null); }}
            className={`px-4 py-2 ${activeTab === 'sent' ? 'text-white border-b-2 border-primary' : 'text-gray-400'}`}
          >
            Sent
          </button>
          <button
            onClick={() => { setActiveTab('compose'); setSelectedMessage(null); }}
            className={`px-4 py-2 ${activeTab === 'compose' ? 'text-white border-b-2 border-primary' : 'text-gray-400'}`}
          >
            Compose
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-4 shadow-lg">
              <h3 className="text-lg font-bold text-white mb-4">
                {activeTab === 'inbox' ? 'Inbox' : activeTab === 'sent' ? 'Sent Messages' : 'Compose'}
              </h3>
              
              {activeTab === 'inbox' && (
                <div className="space-y-2">
                  {inboxMessages.length === 0 ? (
                    <p className="text-gray-400">No messages in inbox</p>
                  ) : (
                    inboxMessages.map((message) => (
                      <div
                        key={message.id}
                        onClick={() => handleViewMessage(message)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedMessage?.id === message.id ? 'bg-primary/20' : 'bg-gray-800 hover:bg-gray-700'
                        } ${!message.isRead ? 'border-l-4 border-primary' : ''}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${!message.isRead ? 'text-white' : 'text-gray-300'}`}>
                              {message.sender.name}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{message.subject}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(message.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {!message.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full ml-2"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'sent' && (
                <div className="space-y-2">
                  {sentMessages.length === 0 ? (
                    <p className="text-gray-400">No sent messages</p>
                  ) : (
                    sentMessages.map((message) => (
                      <div
                        key={message.id}
                        onClick={() => handleViewMessage(message)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedMessage?.id === message.id ? 'bg-primary/20' : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white">
                              To: {message.recipient?.name || 'Broadcast'}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{message.subject}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(message.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className={`w-2 h-2 rounded-full ml-2 ${
                            message.status === 'READ' ? 'bg-green-500' : 
                            message.status === 'DELIVERED' ? 'bg-blue-500' : 'bg-gray-500'
                          }`}></div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'compose' && (
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Recipient
                    </label>
                    <select
                      value={composeForm.recipientId}
                      onChange={(e) => setComposeForm({ ...composeForm, recipientId: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="">Select user...</option>
                      {/* You'll need to fetch users list */}
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="broadcast"
                      checked={composeForm.isBroadcast}
                      onChange={(e) => setComposeForm({ ...composeForm, isBroadcast: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="broadcast" className="text-sm text-gray-300">
                      Send to all users (Broadcast)
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={composeForm.subject}
                      onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                      placeholder="Enter subject..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      value={composeForm.content}
                      onChange={(e) => setComposeForm({ ...composeForm, content: e.target.value })}
                      required
                      rows={6}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                      placeholder="Enter your message..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-card rounded-xl p-6 shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedMessage.subject}</h2>
                    <div className="flex items-center space-x-2 mt-2 text-sm text-gray-400">
                      <span>From: {selectedMessage.sender.name}</span>
                      <span>•</span>
                      <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <p className="text-gray-300 whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>

                {selectedMessage.attachmentUrl && (
                  <div className="mb-4">
                    <a
                      href={selectedMessage.attachmentUrl}
                      download={selectedMessage.attachmentName}
                      className="flex items-center space-x-2 text-primary hover:text-primary/80"
                    >
                      <FileText className="w-5 h-5" />
                      <span>{selectedMessage.attachmentName}</span>
                    </a>
                  </div>
                )}

                {/* Replies */}
                {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                  <div className="space-y-4 mb-4">
                    <h3 className="text-lg font-bold text-white">Replies</h3>
                    {selectedMessage.replies.map((reply) => (
                      <div key={reply.id} className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-white">{reply.sender.name}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(reply.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-300">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                <div className="border-t border-gray-700 pt-4">
                  <h3 className="text-lg font-bold text-white mb-3">Reply</h3>
                  <div className="space-y-3">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                      placeholder="Type your reply..."
                    />
                    <button
                      onClick={() => handleReply(selectedMessage.id)}
                      disabled={!replyContent.trim()}
                      className="bg-primary hover:bg-primary/90 disabled:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <Reply className="w-4 h-4" />
                      <span>Send Reply</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-xl p-6 shadow-lg flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Select a message to view</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
