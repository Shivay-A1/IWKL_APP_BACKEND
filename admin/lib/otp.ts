// StartMessaging OTP utility (via backend proxy to avoid CORS)
export const sendOTP = async (phoneNumber: string, otp: string): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    // Use environment variable for backend URL (includes /api suffix)
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://iwkl-backend-lg6t-production.up.railway.app/api'
    
    console.log('[DEBUG] Sending OTP via backend proxy to:', phoneNumber)
    console.log('[DEBUG] Using backend URL:', backendUrl)
    console.log('[DEBUG] Full OTP URL:', `${backendUrl}/otp/send`)
    
    const response = await fetch(`${backendUrl}/otp/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: phoneNumber,
        otp: otp,
        appName: 'IWKL'
      }),
    })

    const data = await response.json()
    
    if (response.ok) {
      console.log('[DEBUG] OTP sent successfully via backend, messageId:', data.messageId)
      return { success: true, messageId: data.messageId }
    } else {
      console.error('[DEBUG] Backend OTP send failed:', data)
      return { success: false, error: data.error || 'Failed to send OTP' }
    }
  } catch (error: any) {
    console.error('[DEBUG] Backend OTP error:', error.message)
    return { success: false, error: error.message || 'Failed to send OTP' }
  }
}

// Generate a random 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
