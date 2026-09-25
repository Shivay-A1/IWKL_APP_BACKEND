'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Send, Bell, Trash2, Clock, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [fetchingNotifications, setFetchingNotifications] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setFetchingNotifications(true);
      const response = await api.get('/notifications/public');
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setFetchingNotifications(false);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/notifications/broadcast', formData);
      toast.success('Notification sent to all users successfully');
      setFormData({ title: '', message: '' });
      // Refresh notifications after sending
      fetchNotifications();
    } catch (error) {
      console.error('Failed to send notification:', error);
      toast.error('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;
    try {
      await api.delete(`/notifications/${notificationId}`);
      toast.success('Notification deleted successfully');
      fetchNotifications();
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      return `${diffDays} days ago`;
    } catch (e) {
      return 'Just now';
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

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-white">Sent Notifications</h3>
            <button
              onClick={fetchNotifications}
              disabled={fetchingNotifications}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${fetchingNotifications ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="bg-card rounded-xl p-8 text-center">
              <p className="text-gray-400">No notifications sent yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="bg-card rounded-xl p-4 shadow-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-1">{notification.title}</h4>
                      <p className="text-gray-300 text-sm mb-2">{notification.message}</p>
                      <div className="flex items-center gap-4 text-gray-400 text-xs">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(notification.createdAt)}
                        </span>
                        <span className={`px-2 py-1 rounded ${notification.isRead ? 'bg-gray-600' : 'bg-green-600'}`}>
                          {notification.isRead ? 'Read' : 'Unread'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="text-red-500 hover:text-red-400 p-2"
                      title="Delete notification"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
            <p>• You can delete sent notifications from the list above</p>
          </div>
        </div>
      </main>
    </div>
  );
}
