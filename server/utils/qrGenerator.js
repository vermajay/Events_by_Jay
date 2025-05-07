import QRCode from 'qrcode';

/**
 * Generates a QR code as a data URL from a JWT token
 * 
 * @param {string} token - JWT token containing user and event data
 * @returns {Promise<string>} - QR code as a data URL (base64 encoded)
 */
export const generateQR = async (token) => {
  try {
    // Generate QR code as data URL (base64 encoded)
    const qrCodeDataURL = await QRCode.toDataURL(token, {
      errorCorrectionLevel: 'H', // High error correction for better scanning
      margin: 2,
      width: 300,
      color: {
        dark: '#000000',  // QR code color
        light: '#FFFFFF'  // Background color
      }
    });
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};