import cron from 'node-cron'
import { sendMatchReminders, updateLiveMatches, completeMatches } from './matchReminderJob'
import { recalculatePointsTable } from './pointsRecalculationJob'
import { cleanupOldNotifications, sendWeeklyDigest } from './notificationJob'

// Run match reminders every hour
cron.schedule('0 * * * *', () => {
  console.log('Running match reminders job...')
  sendMatchReminders()
})

// Update live matches every 5 minutes
cron.schedule('*/5 * * * *', () => {
  console.log('Updating live matches...')
  updateLiveMatches()
})

// Complete matches every hour
cron.schedule('0 * * * *', () => {
  console.log('Completing matches...')
  completeMatches()
})

// Recalculate points table every hour
cron.schedule('0 * * * *', () => {
  console.log('Recalculating points table...')
  recalculatePointsTable()
})

// Clean up old notifications daily at midnight
cron.schedule('0 0 * * *', () => {
  console.log('Cleaning up old notifications...')
  cleanupOldNotifications()
})

// Send weekly digest every Sunday at 9 AM
cron.schedule('0 9 * * 0', () => {
  console.log('Sending weekly digest...')
  sendWeeklyDigest()
})

console.log('Cron jobs scheduled successfully')
