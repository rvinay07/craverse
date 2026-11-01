import QRCode from 'qrcode';

export async function generateTableQrDataUrl(tableNumber: string, qrCodeToken: string): Promise<string> {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://craverse.app';
  const url = `${origin}/?table=${tableNumber}&token=${qrCodeToken}`;
  try {
    return await QRCode.toDataURL(url, {
      width: 320,
      margin: 2,
      color: {
        dark: '#1e293b',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    });
  } catch (err) {
    console.error('Failed to generate table QR code', err);
    return '';
  }
}

export async function generateUpiQrDataUrl(
  upiVpa: string,
  payeeName: string,
  amount: number,
  orderNumber: string
): Promise<string> {
  const encodedName = encodeURIComponent(payeeName);
  const encodedNote = encodeURIComponent(`Craverse Dining ${orderNumber}`);
  const upiString = `upi://pay?pa=${upiVpa}&pn=${encodedName}&am=${amount.toFixed(2)}&tn=${encodedNote}&cu=INR`;
  try {
    return await QRCode.toDataURL(upiString, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    });
  } catch (err) {
    console.error('Failed to generate UPI QR code', err);
    return '';
  }
}

