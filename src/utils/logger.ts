/**
 * Simple logger utility for Social Media Partner module
 * Provides structured logging with different levels
 */

enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] [${this.context}] ${message}${metaStr}`;
  }

  debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(this.formatMessage(LogLevel.DEBUG, message, meta));
    }
  }

  info(message: string, meta?: any): void {
    console.log(this.formatMessage(LogLevel.INFO, message, meta));
  }

  warn(message: string, meta?: any): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, meta));
  }

  error(message: string, error?: any, meta?: any): void {
    const errorMeta = {
      ...meta,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
    };
    console.error(this.formatMessage(LogLevel.ERROR, message, errorMeta));
  }
}

/**
 * Create a logger instance for a specific context
 */
export const createLogger = (context: string): Logger => {
  return new Logger(context);
};

// Pre-configured loggers for different modules
export const socialMediaPartnerLogger = createLogger('SocialMediaPartner');
export const authLogger = createLogger('Auth');
export const databaseLogger = createLogger('Database');
