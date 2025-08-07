export const isWhatsAppNumber = (phone: string): boolean => {
  if (!phone) return false;
  
  // Remove all non-numeric characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Brazilian mobile numbers that are likely WhatsApp
  // Format: +55 (11) 9xxxx-xxxx or similar patterns
  const brazilianMobile = /^55\d{2}9\d{8}$|^\d{2}9\d{8}$|^9\d{8}$/;
  
  // International mobile patterns (common WhatsApp patterns)
  const internationalMobile = /^[\d]{10,15}$/;
  
  // Check if it's a Brazilian mobile number (most likely WhatsApp)
  if (brazilianMobile.test(cleanPhone)) {
    return true;
  }
  
  // For other patterns, assume it could be WhatsApp if it's a mobile-length number
  if (internationalMobile.test(cleanPhone) && cleanPhone.length >= 10) {
    return true;
  }
  
  return false;
};

export const formatWhatsAppNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // If it starts with 55 (Brazil country code), keep it
  if (cleanPhone.startsWith('55')) {
    return cleanPhone;
  }
  
  // If it's a Brazilian number without country code, add 55
  if (cleanPhone.length === 11 && cleanPhone.startsWith('11')) {
    return '55' + cleanPhone;
  }
  
  // If it's a 9-digit mobile number, assume it's São Paulo (11)
  if (cleanPhone.length === 9 && cleanPhone.startsWith('9')) {
    return '5511' + cleanPhone;
  }
  
  // If it's a 10 or 11 digit number, add Brazil code
  if (cleanPhone.length >= 10 && cleanPhone.length <= 11) {
    return '55' + cleanPhone;
  }
  
  return cleanPhone;
};

export const getWhatsAppUrl = (phone: string, message?: string): string => {
  const formattedPhone = formatWhatsAppNumber(phone);
  const encodedMessage = message ? encodeURIComponent(message) : '';
  
  return `https://wa.me/${formattedPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
};