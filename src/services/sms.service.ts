import axios from 'axios';

const STARTMESSAGING_API_KEY = process.env.STARTMESSAGING_API_KEY || 'sm_live_11fa890489396ac434a05b241987237eb4539943';
const STARTMESSAGING_API_URL = 'https://www.startmessaging.in/api/v2';

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
   */
  static async sendOTP(phone: string, otp: string): Promise<SendOTPResponse> {
    try {
      // Format phone number (remove spaces, add +91 if needed)
      const formattedPhone = phone.replace(/\s/g, '');
      const countryCode = formattedPhone.startsWith('+') ? formattedPhone : `+91${formattedPhone}`;

      const message = `Your IWKL verification code is: ${otp}. Valid for 5 minutes. Do not share this code with anyone.`;

      // Log OTP for testing (in production, use actual SMS API)
      console.log(`📱 OTP for ${formattedPhone}: ${otp}`);

      // TODO: Uncomment when SMS API is verified
      // const response = await axios.post(
      //   `${STARTMESSAGING_API_URL}/send`,
      //   {
      //     route: 'q',
      //     message: message,
      //     numbers: formattedPhone,
      //     flash: 0,
      //   },
      //   {
      //     headers: {
      //       'authorization': STARTMESSAGING_API_KEY,
      //       'Content-Type': 'application/json',
      //     },
      //   }
      // );

      // Temporarily return success without SMS for testing
      return {
        success: true,
        message: 'OTP sent successfully (check console logs)',
        requestId: 'test-request-id',
      };
    } catch (error: any) {
      console.error('SMS sending error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send OTP',
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
