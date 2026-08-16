import express from 'express';
import { Router } from 'express';

const router = Router();

// StartMessaging API configuration
const STARTMESSAGING_API_KEY = process.env.STARTMESSAGING_API_KEY || 'sm_live_c03a';
const STARTMESSAGING_API_URL = 'https://api.startmessaging.com/otp/send';

/**
 * @route   POST /api/otp/send
 * @desc    Send OTP via StartMessaging API (proxy to avoid CORS)
 * @access  Public
 */
router.post('/send', async (req, res) => {
  try {
    const { phoneNumber, otp, appName } = req.body;

    console.log('[DEBUG] OTP Request received:', { phoneNumber, otp, appName });
    console.log('[DEBUG] StartMessaging API Key:', STARTMESSAGING_API_KEY ? 'Present' : 'Missing');
    console.log('[DEBUG] StartMessaging API URL:', STARTMESSAGING_API_URL);

    if (!phoneNumber || !otp) {
      console.log('[DEBUG] Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Phone number and OTP are required'
      });
    }

    console.log('[DEBUG] Sending OTP via StartMessaging to:', phoneNumber);

    const response = await fetch(STARTMESSAGING_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': STARTMESSAGING_API_KEY,
      },
      body: JSON.stringify({
        phoneNumber: phoneNumber,
        variables: { 
          otp: otp,
          appName: appName || 'IWKL'
        },
      }),
    });

    console.log('[DEBUG] StartMessaging response status:', response.status);
    const responseText = await response.text();
    console.log('[DEBUG] StartMessaging response body:', responseText);

    const data: any = JSON.parse(responseText);
    
    if (response.ok) {
      console.log('[DEBUG] OTP sent successfully via StartMessaging, messageId:', data.messageId);
      return res.json({
        success: true,
        messageId: data.messageId
      });
    } else {
      console.error('[DEBUG] StartMessaging OTP send failed:', data);
      return res.status(500).json({
        success: false,
        error: data.message || data.error || 'Failed to send OTP'
      });
    }
  } catch (error: any) {
    console.error('[DEBUG] StartMessaging OTP error:', error.message);
    console.error('[DEBUG] Full error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send OTP'
    });
  }
});

export default router;
