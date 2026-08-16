/**
 * Serialize BigInt values to strings for JSON serialization
 * This helper converts all BigInt properties in an object to strings
 */
export const serializeBigInt = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'bigint') {
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(serializeBigInt);
  }

  if (typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = serializeBigInt(obj[key]);
      }
    }
    return result;
  }

  return obj;
};

/**
 * Serialize BigInt fields specifically for Social Media Partner Registration
 */
export const serializeSocialMediaPartnerBigInt = (obj: any): any => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const result = { ...obj };

  // Convert BigInt fields to strings
  const bigIntFields = [
    'instagramFollowers',
    'youtubeSubscribers',
    'facebookFollowers',
    'twitterFollowers',
    'averageMonthlyReach',
  ];

  for (const field of bigIntFields) {
    if (result[field] !== null && result[field] !== undefined) {
      result[field] = String(result[field]);
    }
  }

  return result;
};
