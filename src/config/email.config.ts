export const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASSWORD || '',
  },
  from: process.env.EMAIL_FROM || 'noreply@iwkl.com',
  fromName: process.env.EMAIL_FROM_NAME || 'IWKL - Indian Women\'s Kabaddi League',
};

export const isEmailConfigured = () => {
  return !!(
    emailConfig.auth.user &&
    emailConfig.auth.pass
  );
};
