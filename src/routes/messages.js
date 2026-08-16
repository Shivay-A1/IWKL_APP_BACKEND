const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Send message (Admin only)
router.post('/send', authenticateToken, requireRole(['SUPER_ADMIN', 'LEAGUE_ADMIN']), [
  body('subject').trim().isLength({ min: 1, max: 200 }),
  body('content').trim().isLength({ min: 1 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { recipientId, subject, content, attachmentUrl, attachmentName, isBroadcast } = req.body;
    const senderId = req.user.id;

    if (!isBroadcast && !recipientId) {
      return res.status(400).json({ error: 'Either recipientId or isBroadcast must be provided' });
    }

    if (isBroadcast) {
      // Send to all users
      const users = await prisma.user.findMany({
        where: {
          role: 'USER'
        },
        select: { id: true }
      });

      const messages = await Promise.all(
        users.map(user =>
          prisma.message.create({
            data: {
              senderId,
              recipientId: user.id,
              subject,
              content,
              attachmentUrl,
              attachmentName,
              isBroadcast: true,
              status: 'SENT'
            }
          })
        )
      );

      return res.status(201).json({
        message: 'Broadcast message sent successfully',
        count: messages.length
      });
    } else {
      // Send to single user
      const recipient = await prisma.user.findUnique({
        where: { id: recipientId }
      });

      if (!recipient) {
        return res.status(404).json({ error: 'Recipient not found' });
      }

      const message = await prisma.message.create({
        data: {
          senderId,
          recipientId,
          subject,
          content,
          attachmentUrl,
          attachmentName,
          isBroadcast: false,
          status: 'SENT'
        },
        include: {
          sender: {
            select: { id: true, name: true, email: true }
          },
          recipient: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      return res.status(201).json(message);
    }
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get all messages for a user (inbox)
router.get('/inbox', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { unreadOnly } = req.query;

    const where = {
      recipientId: userId,
      ...(unreadOnly === 'true' && { isRead: false })
    };

    const messages = await prisma.message.findMany({
      where,
      include: {
        sender: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        replies: {
          include: {
            sender: {
              select: { id: true, name: true, email: true, avatar: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const unreadCount = await prisma.message.count({
      where: {
        recipientId: userId,
        isRead: false
      }
    });

    res.json({
      messages,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching inbox:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get sent messages (Admin)
router.get('/sent', authenticateToken, requireRole(['SUPER_ADMIN', 'LEAGUE_ADMIN']), async (req, res) => {
  try {
    const senderId = req.user.id;

    const messages = await prisma.message.findMany({
      where: { senderId },
      include: {
        recipient: {
          select: { id: true, name: true, email: true }
        },
        replies: {
          include: {
            sender: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching sent messages:', error);
    res.status(500).json({ error: 'Failed to fetch sent messages' });
  }
});

// Mark message as read
router.patch('/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const message = await prisma.message.findUnique({
      where: { id }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.recipientId !== userId) {
      return res.status(403).json({ error: 'You can only mark your own messages as read' });
    }

    const updatedMessage = await prisma.message.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
        status: 'READ'
      }
    });

    res.json(updatedMessage);
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

// Reply to message
router.post('/:id/reply', authenticateToken, [
  body('content').trim().isLength({ min: 1 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { content, attachmentUrl, attachmentName } = req.body;
    const userId = req.user.id;

    const originalMessage = await prisma.message.findUnique({
      where: { id }
    });

    if (!originalMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // User can reply to messages they received
    // Admin can reply to any message
    const isAdmin = req.user.role === 'SUPER_ADMIN' || req.user.role === 'LEAGUE_ADMIN';
    if (!isAdmin && originalMessage.recipientId !== userId) {
      return res.status(403).json({ error: 'You can only reply to messages sent to you' });
    }

    // Determine recipient for the reply
    const replyRecipientId = isAdmin ? originalMessage.recipientId : originalMessage.senderId;

    const reply = await prisma.message.create({
      data: {
        senderId: userId,
        recipientId: replyRecipientId,
        subject: `Re: ${originalMessage.subject}`,
        content,
        attachmentUrl,
        attachmentName,
        replyToId: id,
        status: 'SENT'
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        recipient: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(201).json(reply);
  } catch (error) {
    console.error('Error replying to message:', error);
    res.status(500).json({ error: 'Failed to reply to message' });
  }
});

// Get message by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        sender: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        recipient: {
          select: { id: true, name: true, email: true }
        },
        replies: {
          include: {
            sender: {
              select: { id: true, name: true, email: true, avatar: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Check if user has access to this message
    const isAdmin = req.user.role === 'SUPER_ADMIN' || req.user.role === 'LEAGUE_ADMIN';
    if (!isAdmin && message.senderId !== userId && message.recipientId !== userId) {
      return res.status(403).json({ error: 'You do not have access to this message' });
    }

    // Auto-mark as read if recipient is viewing
    if (message.recipientId === userId && !message.isRead) {
      await prisma.message.update({
        where: { id },
        data: {
          isRead: true,
          readAt: new Date(),
          status: 'READ'
        }
      });
      message.isRead = true;
      message.readAt = new Date();
      message.status = 'READ';
    }

    res.json(message);
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});

// Delete message
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const message = await prisma.message.findUnique({
      where: { id }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Only sender or recipient can delete
    if (message.senderId !== userId && message.recipientId !== userId) {
      return res.status(403).json({ error: 'You can only delete messages you sent or received' });
    }

    await prisma.message.delete({
      where: { id }
    });

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router;
