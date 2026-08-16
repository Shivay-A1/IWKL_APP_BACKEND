import nodemailer from 'nodemailer';
import { emailConfig, isEmailConfigured } from '../config/email.config';

// Send OTP for email verification
export const sendVerificationOTPEmail = async (email: string, otp: string, name: string) => {
  // Always log OTP to console for development
  console.log('=== EMAIL VERIFICATION OTP ===');
  console.log('Email:', email);
  console.log('OTP:', otp);
  console.log('Name:', name);
  console.log('============================');

  if (!isEmailConfigured()) {
    console.log('Email not configured. Using console log for OTP.');
    return { success: true, message: 'Registration successful. Check console for OTP.' };
  }

  // Create transporter only if email is configured
  let transporter;
  try {
    transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: emailConfig.auth,
    });
  } catch (error) {
    console.error('Error creating email transporter:', error);
    console.log('Using console log for OTP instead.');
    return { success: true, message: 'Registration successful. Check console for OTP.' };
  }

  const mailOptions = {
    from: `"${emailConfig.fromName}" <${emailConfig.from}>`,
    to: email,
    subject: 'Verify Your Email - IWKL',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #140020; color: white;">
        <div style="padding: 40px 20px;">
          <h1 style="color: #BFA253; margin: 0 0 20px 0;">Welcome to IWKL!</h1>
          <p style="color: #ccc; margin: 0 0 20px 0;">Hi ${name},</p>
          <p style="color: #ccc; margin: 0 0 20px 0;">Thank you for registering with the Indian Women's Kabaddi League. Please verify your email address to complete your registration.</p>
          <p style="color: #ccc; margin: 0 0 20px 0;">Your verification code is:</p>
          <div style="background: #4F1B78; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <span style="font-size: 32px; font-weight: bold; color: #BFA253; letter-spacing: 5px;">${otp}</span>
          </div>
          <p style="color: #ccc; margin: 0 0 20px 0;">This code will expire in 10 minutes.</p>
          <p style="color: #999; font-size: 12px; margin: 0;">This is an automated email. Please do not reply.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Verification OTP sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    console.log('Using console log for OTP instead.');
    return { success: true, message: 'Registration successful. Check console for OTP.' };
  }
};

// Send OTP for password reset
export const sendPasswordResetOTPEmail = async (email: string, otp: string) => {
  // Always log OTP to console for development
  console.log('=== PASSWORD RESET OTP ===');
  console.log('Email:', email);
  console.log('OTP:', otp);
  console.log('=========================');

  if (!isEmailConfigured()) {
    console.log('Email not configured. Using console log for OTP.');
    return { success: true, message: 'OTP sent. Check console for OTP.' };
  }

  // Create transporter only if email is configured
  let transporter;
  try {
    transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: emailConfig.auth,
    });
  } catch (error) {
    console.error('Error creating email transporter:', error);
    console.log('Using console log for OTP instead.');
    return { success: true, message: 'OTP sent. Check console for OTP.' };
  }

  const mailOptions = {
    from: `"${emailConfig.fromName}" <${emailConfig.from}>`,
    to: email,
    subject: 'Password Reset - IWKL',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #140020; color: white;">
        <div style="padding: 40px 20px;">
          <h1 style="color: #BFA253; margin: 0 0 20px 0;">Password Reset Request</h1>
          <p style="color: #ccc; margin: 0 0 20px 0;">You have requested to reset your password for your IWKL account.</p>
          <p style="color: #ccc; margin: 0 0 20px 0;">Your One-Time Password (OTP) is:</p>
          <div style="background: #4F1B78; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <span style="font-size: 32px; font-weight: bold; color: #BFA253; letter-spacing: 5px;">${otp}</span>
          </div>
          <p style="color: #ccc; margin: 0 0 20px 0;">This OTP will expire in 10 minutes.</p>
          <p style="color: #ccc; margin: 0 0 20px 0;">If you did not request this password reset, please ignore this email.</p>
          <p style="color: #999; font-size: 12px; margin: 0;">This is an automated email. Please do not reply.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Reset OTP sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    console.log('Using console log for OTP instead.');
    return { success: true, message: 'OTP sent. Check console for OTP.' };
  }
};

// Send registration confirmation email
export const sendRegistrationConfirmationEmail = async (email: string, name: string, registrationNumber: string) => {
  if (!isEmailConfigured()) {
    console.log('Email not configured. Registration confirmation for', email);
    return { success: true, message: 'Email not configured' };
  }

  // Create transporter only if email is configured
  let transporter;
  try {
    transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: emailConfig.auth,
    });
  } catch (error) {
    console.error('Error creating email transporter:', error);
    return { success: false, message: 'Failed to send email' };
  }

  const mailOptions = {
    from: `"${emailConfig.fromName}" <${emailConfig.from}>`,
    to: email,
    subject: 'Registration Submitted - IWKL',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #140020; color: white;">
        <div style="padding: 40px 20px;">
          <h1 style="color: #BFA253; margin: 0 0 20px 0;">Registration Submitted Successfully!</h1>
          <p style="color: #ccc; margin: 0 0 20px 0;">Hi ${name},</p>
          <p style="color: #ccc; margin: 0 0 20px 0;">Thank you for registering with the Indian Women's Kabaddi League. Your application has been submitted successfully.</p>
          <div style="background: #4F1B78; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <p style="color: #ccc; margin: 0 0 10px 0;">Your Registration Number:</p>
            <p style="color: #BFA253; font-size: 24px; font-weight: bold; margin: 0;">${registrationNumber}</p>
          </div>
          <p style="color: #ccc; margin: 0 0 20px 0;">Please keep this number safe for future reference.</p>
          <p style="color: #ccc; margin: 0 0 20px 0;">You can track your application status in your dashboard.</p>
          <p style="color: #999; font-size: 12px; margin: 0;">This is an automated email. Please do not reply.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Registration confirmation sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send email' };
  }
};

// Send approval email
export const sendApprovalEmail = async (email: string, name: string, registrationNumber: string, trialDate?: string, trialVenue?: string, trialTime?: string) => {
  if (!isEmailConfigured()) {
    console.log('Email not configured. Approval email for', email);
    return { success: true, message: 'Email not configured' };
  }

  // Create transporter only if email is configured
  let transporter;
  try {
    transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: emailConfig.auth,
    });
  } catch (error) {
    console.error('Error creating email transporter:', error);
    return { success: false, message: 'Failed to send email' };
  }

  const trialInfo = trialDate ? `
    <div style="background: #4F1B78; padding: 20px; margin: 20px 0; border-radius: 8px;">
      <h3 style="color: #BFA253; margin: 0 0 15px 0;">Trial Details</h3>
      <p style="color: #ccc; margin: 0 0 10px 0;"><strong>Date:</strong> ${trialDate}</p>
      <p style="color: #ccc; margin: 0 0 10px 0;"><strong>Venue:</strong> ${trialVenue || 'TBD'}</p>
      <p style="color: #ccc; margin: 0;"><strong>Reporting Time:</strong> ${trialTime || 'TBD'}</p>
    </div>
  ` : '';

  const mailOptions = {
    from: `"${emailConfig.fromName}" <${emailConfig.from}>`,
    to: email,
    subject: 'Congratulations! Your Registration is Approved - IWKL',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #140020; color: white;">
        <div style="padding: 40px 20px;">
          <h1 style="color: #BFA253; margin: 0 0 20px 0;">Congratulations! 🎉</h1>
          <p style="color: #ccc; margin: 0 0 20px 0;">Hi ${name},</p>
          <p style="color: #ccc; margin: 0 0 20px 0;">Your player registration has been <strong style="color: #4ade80;">APPROVED</strong>!</p>
          <p style="color: #ccc; margin: 0 0 20px 0;">Registration Number: <strong>${registrationNumber}</strong></p>
          ${trialInfo}
          <p style="color: #ccc; margin: 0 0 20px 0;">Please ensure you attend the trial on time. Bring your original documents for verification.</p>
          <p style="color: #999; font-size: 12px; margin: 0;">This is an automated email. Please do not reply.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Approval email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send email' };
  }
};

// Send rejection email
export const sendRejectionEmail = async (email: string, name: string, registrationNumber: string, adminRemarks?: string) => {
  if (!isEmailConfigured()) {
    console.log('Email not configured. Rejection email for', email);
    return { success: true, message: 'Email not configured' };
  }

  // Create transporter only if email is configured
  let transporter;
  try {
    transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: emailConfig.auth,
    });
  } catch (error) {
    console.error('Error creating email transporter:', error);
    return { success: false, message: 'Failed to send email' };
  }

  const remarks = adminRemarks ? `
    <div style="background: #2A003F; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ef4444;">
      <p style="color: #ccc; margin: 0 0 10px 0;"><strong>Admin Remarks:</strong></p>
      <p style="color: #ccc; margin: 0;">${adminRemarks}</p>
    </div>
  ` : '';

  const mailOptions = {
    from: `"${emailConfig.fromName}" <${emailConfig.from}>`,
    to: email,
    subject: 'Registration Update - IWKL',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #140020; color: white;">
        <div style="padding: 40px 20px;">
          <h1 style="color: #BFA253; margin: 0 0 20px 0;">Registration Update</h1>
          <p style="color: #ccc; margin: 0 0 20px 0;">Hi ${name},</p>
          <p style="color: #ccc; margin: 0 0 20px 0;">Thank you for your interest in the Indian Women's Kabaddi League.</p>
          <p style="color: #ccc; margin: 0 0 20px 0;">We regret to inform you that your application (Registration No: ${registrationNumber}) was not selected for the current season.</p>
          ${remarks}
          <p style="color: #ccc; margin: 0 0 20px 0;">We encourage you to apply again in the future. Keep practicing and improving your skills!</p>
          <p style="color: #999; font-size: 12px; margin: 0;">This is an automated email. Please do not reply.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Rejection email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send email' };
  }
};

// Send welcome email after account verification
export const sendWelcomeEmail = async (email: string, name: string) => {
  if (!isEmailConfigured()) {
    console.log('Email not configured. Welcome email for', email);
    return { success: true, message: 'Email not configured' };
  }

  // Create transporter only if email is configured
  let transporter;
  try {
    transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: emailConfig.auth,
    });
  } catch (error) {
    console.error('Error creating email transporter:', error);
    return { success: false, message: 'Failed to send email' };
  }

  const mailOptions = {
    from: `"${emailConfig.fromName}" <${emailConfig.from}>`,
    to: email,
    subject: 'Welcome to IWKL! - Indian Women\'s Kabaddi League',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #140020; color: white;">
        <div style="padding: 40px 20px;">
          <h1 style="color: #BFA253; margin: 0 0 20px 0;">Welcome to IWKL! 🏐</h1>
          <p style="color: #ccc; margin: 0 0 20px 0;">Hi ${name},</p>
          <p style="color: #ccc; margin: 0 0 20px 0;">Your account has been successfully verified! Welcome to the Indian Women's Kabaddi League community.</p>
          <p style="color: #ccc; margin: 0 0 20px 0;">You can now:</p>
          <ul style="color: #ccc; margin: 0 0 20px 20px;">
            <li>Register as a player</li>
            <li>Track your application status</li>
            <li>Get updates on matches and news</li>
            <li>Join the fan club</li>
          </ul>
          <p style="color: #ccc; margin: 0 0 20px 0;">Visit your dashboard to get started!</p>
          <p style="color: #999; font-size: 12px; margin: 0;">This is an automated email. Please do not reply.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Welcome email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send email' };
  }
};
