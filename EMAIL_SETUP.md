# Email Service Setup Guide

## Problem
OTP emails are not being sent because email service is not configured in backend `.env` file.

## Solution

### Step 1: Configure Backend Environment Variables

Add the following to your backend `.env` file:

```bash
# Email Service (Nodemailer)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="noreply@iwkl.com"
EMAIL_FROM_NAME="IWKL - Indian Women's Kabaddi League"
```

### Step 2: Get Gmail App Password

1. Go to https://myaccount.google.com/security
2. Enable 2-Factor Authentication if not already enabled
3. Go to "App passwords" section
4. Create a new app password for "Mail"
5. Copy the generated password (16 characters)
6. Use this password in `EMAIL_PASSWORD` field

### Step 3: Update Backend .env

Edit `iwkl-platform/backend/.env` and add the email configuration:

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=noreply@iwkl.com
EMAIL_FROM_NAME="IWKL - Indian Women's Kabaddi League"
```

### Step 4: Restart Backend Server

After updating `.env`, restart the backend server:

```bash
cd iwkl-platform/backend
npm run dev
```

### Step 5: Test OTP Functionality

1. Try registering a new account
2. Check console logs for OTP (if email fails, OTP will be logged)
3. Check your email inbox for OTP

## Alternative: Use Console Logs (Development Only)

If you don't want to configure email service yet, the system will log OTPs to console when email is not configured. You can check the backend console logs to see the OTP during development.

## Current Email Features

- Email verification OTP (6-digit, 10 min expiry)
- Password reset OTP
- Registration confirmation email
- Approval email with trial details
- Rejection email with admin remarks
- Welcome email after verification

## Troubleshooting

### OTP not received
- Check backend console logs for OTP (if email not configured)
- Verify email credentials in `.env`
- Check if Gmail app password is correct
- Ensure backend server is running

### Email sending fails
- Check backend logs for error messages
- Verify EMAIL_HOST and EMAIL_PORT are correct
- Ensure email account allows less secure apps or use app password
- Check if firewall is blocking SMTP connections

## Production Deployment

For production, consider using:
- SendGrid (recommended for production)
- AWS SES
- Mailgun
- Postmark

Update email configuration accordingly in `.env` file.
