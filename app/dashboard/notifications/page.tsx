'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Send, Bell, Trash2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
  });

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/notifications/broadcast', formData);
      toast.success('Notification sent to all users successfully');
      setFormData({ title: '', message: '' });
    } catch (error) {
      console.error('Failed to send notification:', error);
      toast.error('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Notifications Management</h1>
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Send Broadcast Notification</h2>
          <p className="text-gray-400">Send notifications to all app users</p>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-lg">
          <form onSubmit={handleSendBroadcast} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notification Title
                </div>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                placeholder="Enter notification title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Notification Message
                </div>
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white min-h-[150px]"
                placeholder="Enter notification message"
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                {loading ? 'Sending...' : 'Send to All Users'}
              </button>
              <button
                type="button"
                onClick={() => setFormData({ title: '', message: '' })}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Clear
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-card rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Information
          </h3>
          <div className="space-y-3 text-gray-300">
            <p>• This notification will be sent to all app users</p>
            <p>• Users will see the notification in their notification icon</p>
            <p>• Notifications are delivered in real-time via Socket.io</p>
            <p>• Make sure the title and message are clear and concise</p>
          </div>
        </div>
      </main>
    </div>
  );
}
