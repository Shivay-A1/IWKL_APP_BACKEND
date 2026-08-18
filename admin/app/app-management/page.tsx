'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, Edit, Trash2, Send, Clock, Check, X, 
  Bell, Settings, Image as ImageIcon, FileImage, Play 
} from 'lucide-react';

interface Story {
  id: string;
  title: string;
  mediaUrl: string;
  type: 'IMAGE' | 'VIDEO';
  status: 'ACTIVE' | 'INACTIVE';
  expiresAt: string;
  createdAt: string;
  displayOrder?: number;
}

interface PushNotification {
  id: string;
  title: string;
  body: string;
  type: 'MATCH' | 'NEWS' | 'GENERAL';
  scheduledFor?: string;
  sentAt?: string;
  status: 'PENDING' | 'SENT' | 'SCHEDULED';
  createdAt: string;
}

interface AppSetting {
  id: string;
  key: string;
  value: string;
  description: string;
  category: string;
}

interface MobileBanner {
  id: string;
  title: string;
  imageUrl: string;
  targetScreen: string;
  actionUrl?: string;
  status: 'ACTIVE' | 'INACTIVE';
  order: number;
  createdAt: string;
}

export default function AppManagementPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [settings, setSettings] = useState<AppSetting[]>([]);
  const [banners, setBanners] = useState<MobileBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stories');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const [storiesRes, notificationsRes, settingsRes, bannersRes] = await Promise.all([
        fetch('https://iwkl.in/api/stories', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('https://iwkl.in/api/push-notifications', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('https://iwkl.in/api/app-settings', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('https://iwkl.in/api/mobile-banners', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (storiesRes.ok) setStories(await storiesRes.json());
      if (notificationsRes.ok) setNotifications(await notificationsRes.json());
      if (settingsRes.ok) setSettings(await settingsRes.json());
      if (bannersRes.ok) setBanners(await bannersRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">App Management</h1>
        <p className="text-muted-foreground">Manage mobile app content and settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stories">
            <FileImage className="mr-2 h-4 w-4" />
            Stories
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="banners">
            <ImageIcon className="mr-2 h-4 w-4" />
            Banners
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stories" className="space-y-4">
          <StoriesManagement stories={stories} onRefresh={fetchData} />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <NotificationsManagement notifications={notifications} onRefresh={fetchData} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <SettingsManagement settings={settings} onRefresh={fetchData} />
        </TabsContent>

        <TabsContent value="banners" className="space-y-4">
          <BannersManagement banners={banners} onRefresh={fetchData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StoriesManagement({ stories, onRefresh }: { stories: Story[], onRefresh: () => void }) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [newStory, setNewStory] = useState({
    title: '',
    mediaUrl: '',
    mediaType: 'image' as 'image' | 'video',
    thumbnailUrl: '',
    linkUrl: '',
    description: '',
    displayOrder: 0,
    expiryDate: '',
    scheduledAt: '',
    isActive: true,
  });

  const handleAddStory = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch('https://iwkl.in/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newStory),
      });
      onRefresh();
      setShowAddDialog(false);
      setNewStory({
        title: '',
        mediaUrl: '',
        mediaType: 'image',
        thumbnailUrl: '',
        linkUrl: '',
        description: '',
        displayOrder: 0,
        expiryDate: '',
        scheduledAt: '',
        isActive: true,
      });
    } catch (error) {
      console.error('Error adding story:', error);
    }
  };

  const handleUpdateStory = async (story: Story) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`https://iwkl.in/api/stories/${story.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newStory),
      });
      onRefresh();
      setEditingStory(null);
    } catch (error) {
      console.error('Error updating story:', error);
    }
  };

  const handleDeleteStory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`https://iwkl.in/api/stories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      onRefresh();
    } catch (error) {
      console.error('Error deleting story:', error);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`https://iwkl.in/api/stories/${id}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      onRefresh();
    } catch (error) {
      console.error('Error toggling story status:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>App Stories</CardTitle>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Story
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stories.map((story) => (
            <div key={story.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-100 rounded flex items-center justify-center overflow-hidden">
                  {story.type === 'VIDEO' ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={(story as any).thumbnailUrl || story.mediaUrl} 
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={story.mediaUrl} 
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{story.title}</h3>
                  <p className="text-sm text-muted-foreground">{story.type}</p>
                  <p className="text-xs text-muted-foreground">
                    Order: {story.displayOrder}
                  </p>
                  {story.expiresAt && (
                    <p className="text-xs text-muted-foreground">
                      Expires: {new Date(story.expiresAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={story.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {story.status}
                </Badge>
                <Switch 
                  checked={story.status === 'ACTIVE'}
                  onCheckedChange={() => handleToggleStatus(story.id)}
                />
                <Button variant="ghost" size="icon" onClick={() => {
                  setEditingStory(story);
                  setNewStory({
                    title: story.title,
                    mediaUrl: story.mediaUrl,
                    mediaType: story.type.toLowerCase() as 'image' | 'video',
                    thumbnailUrl: '',
                    linkUrl: '',
                    description: '',
                    displayOrder: 0,
                    expiryDate: story.expiresAt ? story.expiresAt.split('T')[0] : '',
                    scheduledAt: '',
                    isActive: story.status === 'ACTIVE',
                  });
                }}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteStory(story.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {stories.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No stories found</p>
          )}
        </div>
      </CardContent>

      {/* Add/Edit Story Dialog */}
      {(showAddDialog || editingStory) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingStory ? 'Edit Story' : 'Add New Story'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={newStory.title}
                  onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                  placeholder="Story title"
                />
              </div>
              <div>
                <Label>Media Type</Label>
                <Select
                  value={newStory.mediaType}
                  onValueChange={(value: any) => setNewStory({ ...newStory, mediaType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Media URL</Label>
                <Input
                  value={newStory.mediaUrl}
                  onChange={(e) => setNewStory({ ...newStory, mediaUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              {newStory.mediaType === 'video' && (
                <div>
                  <Label>Thumbnail URL</Label>
                  <Input
                    value={newStory.thumbnailUrl}
                    onChange={(e) => setNewStory({ ...newStory, thumbnailUrl: e.target.value })}
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>
              )}
              <div>
                <Label>Link URL (Optional)</Label>
                <Input
                  value={newStory.linkUrl}
                  onChange={(e) => setNewStory({ ...newStory, linkUrl: e.target.value })}
                  placeholder="https://example.com/target"
                />
              </div>
              <div>
                <Label>Description (Optional)</Label>
                <Textarea
                  value={newStory.description}
                  onChange={(e) => setNewStory({ ...newStory, description: e.target.value })}
                  placeholder="Story description"
                />
              </div>
              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={newStory.displayOrder}
                  onChange={(e) => setNewStory({ ...newStory, displayOrder: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Expiry Date (Optional)</Label>
                <Input
                  type="date"
                  value={newStory.expiryDate}
                  onChange={(e) => setNewStory({ ...newStory, expiryDate: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={newStory.isActive}
                  onCheckedChange={(checked) => setNewStory({ ...newStory, isActive: checked })}
                />
                <Label>Active</Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={editingStory ? () => handleUpdateStory(editingStory) : handleAddStory} className="flex-1">
                  {editingStory ? 'Update' : 'Add'} Story
                </Button>
                <Button variant="outline" onClick={() => {
                  setShowAddDialog(false);
                  setEditingStory(null);
                }} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  );
}

function NotificationsManagement({ notifications, onRefresh }: { notifications: PushNotification[], onRefresh: () => void }) {
  const [newNotification, setNewNotification] = useState({
    title: '',
    body: '',
    type: 'GENERAL' as const,
    scheduledFor: '',
  });

  const handleSend = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch('https://iwkl.in/api/push-notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newNotification.title,
          message: newNotification.body,
          type: newNotification.type,
          scheduledFor: newNotification.scheduledFor,
        }),
      });
      onRefresh();
      setNewNotification({ title: '', body: '', type: 'GENERAL', scheduledFor: '' });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Notification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={newNotification.title}
              onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
              placeholder="Notification title"
            />
          </div>
          <div>
            <Label>Body</Label>
            <Textarea
              value={newNotification.body}
              onChange={(e) => setNewNotification({ ...newNotification, body: e.target.value })}
              placeholder="Notification body"
            />
          </div>
          <div>
            <Label>Type</Label>
            <Select
              value={newNotification.type}
              onValueChange={(value: any) => setNewNotification({ ...newNotification, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MATCH">Match Update</SelectItem>
                <SelectItem value="NEWS">News</SelectItem>
                <SelectItem value="GENERAL">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Schedule (Optional)</Label>
            <Input
              type="datetime-local"
              value={newNotification.scheduledFor}
              onChange={(e) => setNewNotification({ ...newNotification, scheduledFor: e.target.value })}
            />
          </div>
          <Button onClick={handleSend}>
            <Send className="mr-2 h-4 w-4" />
            {newNotification.scheduledFor ? 'Schedule' : 'Send Now'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{notification.title}</h3>
                  <p className="text-sm text-muted-foreground">{notification.body}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{notification.type}</Badge>
                    <Badge variant={notification.status === 'SENT' ? 'default' : 'secondary'}>
                      {notification.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {notification.status === 'PENDING' && (
                    <>
                      <Button variant="ghost" size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No notifications found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsManagement({ settings, onRefresh }: { settings: AppSetting[], onRefresh: () => void }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>App Settings</CardTitle>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Setting
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">{setting.key}</h3>
                <p className="text-sm text-muted-foreground">{setting.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{setting.value}</p>
                <Badge variant="outline" className="mt-2">{setting.category}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {settings.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No settings found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function BannersManagement({ banners, onRefresh }: { banners: MobileBanner[], onRefresh: () => void }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Mobile Banners</CardTitle>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Banner
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {banners.map((banner) => (
            <div key={banner.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <img 
                  src={banner.imageUrl} 
                  alt={banner.title}
                  className="w-32 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{banner.title}</h3>
                  <p className="text-sm text-muted-foreground">Screen: {banner.targetScreen}</p>
                  <p className="text-xs text-muted-foreground">Order: {banner.order}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={banner.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {banner.status}
                </Badge>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {banners.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No banners found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
