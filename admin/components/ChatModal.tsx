"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Send } from 'lucide-react'
import { getOrCreateChat, sendMessage, subscribeToMessages, markMessagesAsRead, subscribeToChat } from '@/lib/registration-firebase'

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  userUid: string
  adminUid: string
  userName: string
  isAdmin: boolean
  currentUserName: string
  onUnreadCountChange?: (count: number) => void
}

export default function ChatModal({ isOpen, onClose, userUid, adminUid, userName, isAdmin, currentUserName, onUnreadCountChange }: ChatModalProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [chatId, setChatId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const initializeChat = async () => {
      try {
        setLoading(true)
        const id = await getOrCreateChat(userUid, adminUid)
        setChatId(id)
        
        // Mark messages as read when opening chat
        await markMessagesAsRead(id, isAdmin)
      } catch (error) {
        console.error('Error initializing chat:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeChat()
  }, [isOpen, userUid, adminUid, isAdmin])

  useEffect(() => {
    if (!chatId) return

    const unsubscribe = subscribeToMessages(chatId, (msgs) => {
      setMessages(msgs)
      // Scroll to bottom when new messages arrive
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    })

    return () => unsubscribe()
  }, [chatId])

  // Subscribe to chat for unread count updates
  useEffect(() => {
    if (!isOpen) return

    const unsubscribe = subscribeToChat(userUid, adminUid, (chat) => {
      if (chat && onUnreadCountChange) {
        const unreadCount = isAdmin ? chat.unreadByAdmin || 0 : chat.unreadByUser || 0
        onUnreadCountChange(unreadCount)
      }
    })

    return () => unsubscribe()
  }, [isOpen, userUid, adminUid, isAdmin, onUnreadCountChange])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatId) return

    try {
      const userData = localStorage.getItem('user')
      const senderId = userData ? JSON.parse(userData).id : adminUid
      
      await sendMessage(chatId, senderId, currentUserName, newMessage, isAdmin)
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white max-w-2xl w-full h-[85vh] flex flex-col mx-auto relative shadow-2xl">
        {/* Fixed Close Button - Always visible */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white hover:bg-gray-100 border border-gray-300 rounded-full p-2 shadow-md transition-colors"
          aria-label="Close chat"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </button>
        
        <CardHeader className="flex-shrink-0 p-4 sm:p-6 pt-6 sm:pt-6 border-b border-gray-200">
          <div className="flex items-center justify-between pr-10">
            <CardTitle className="text-gray-900 text-lg sm:text-xl font-semibold">
              {isAdmin ? `Chat with ${userName}` : 'Chat with Admin'}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Loading chat...</p>
            </div>
          ) : (
            <>
              <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isAdmin === isAdmin ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] sm:max-w-[70%] rounded-lg p-3 ${
                            msg.isAdmin === isAdmin
                              ? 'bg-[#4B0F6B] text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-xs font-medium mb-1 opacity-75">
                            {msg.isAdmin ? 'Admin' : msg.senderName}
                          </p>
                          <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                          <p className="text-xs mt-1 opacity-50">
                            {msg.timestamp?.toDate 
                              ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : 'Sending...'
                            }
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B0F6B]"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-[#4B0F6B] hover:bg-[#6B1F7B] px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
