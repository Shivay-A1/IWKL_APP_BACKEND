import axios from 'axios';

const STARTMESSAGING_API_KEY = process.env.STARTMESSAGING_API_KEY || 'sm_live_11fa890489396ac434a05b241987237eb4539943';
const STARTMESSAGING_API_URL = 'https://api.startmessaging.com';

interface SendOTPResponse {
  success: boolean;
  message: string;
  requestId?: string;
}

export class SMSService {
  /**
   * Generate a 6-digit OTP
   */
  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send OTP to phone number using StartMessaging API
   * Temporarily disabled - OTP logged to console
   */
  static async sendOTP(phone: string, otp: string): Promise<SendOTPResponse> {
    try {
      // Format phone number (remove spaces, add +91 if needed)
      const formattedPhone = phone.replace(/\s/g, '');
      const countryCode = formattedPhone.startsWith('+') ? formattedPhone : `+91${formattedPhone}`;

      // Log OTP for testing
      console.log(`📱 OTP for ${formattedPhone}: ${otp}`);

      // TODO: Uncomment when SMS is needed
      // const response = await axios.post(
      //   `${STARTMESSAGING_API_URL}/otp/send`,
      //   {
      //     phoneNumber: countryCode,
      //     templateId: 'YOUR_TEMPLATE_ID',
      //     variables: {
      //       otp: otp,
      //       appName: 'IWKL'
      //     }
      //   },
      //   {
      //     headers: {
      //       'X-API-Key': STARTMESSAGING_API_KEY,
      //       'Content-Type': 'application/json',
      //     },
      //   }
      // );

      // if (response.data && response.data.success) {
      //   return {
      //     success: true,
      //     message: 'OTP sent successfully',
      //     requestId: response.data.requestId,
      //   };
      // }

      // Temporarily return success without SMS
      return {
        success: true,
        message: 'OTP sent successfully (check console logs)',
        requestId: 'test-request-id',
      };
    } catch (error: any) {
      console.error('SMS sending error:', error);
      // If SMS fails, log it but return success for testing
      console.log(`⚠️ SMS API failed, but OTP was generated: ${otp}`);
      return {
        success: true,
        message: 'OTP generated (check console if SMS failed)',
        requestId: 'test-request-id',
      };
    }
  }

  /**
   * Verify OTP (check if it matches and is not expired)
   */
  static verifyOTP(storedOTP: string, providedOTP: string, expiryTime: Date): boolean {
    const now = new Date();
    const expiry = new Date(expiryTime);

    // Check if OTP matches and is not expired
    return storedOTP === providedOTP && now <= expiry;
  }

  /**
   * Calculate OTP expiry time (5 minutes from now)
   */
  static getOTPExpiry(): Date {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 5);
    return expiry;
  }
}

export default SMSService;
