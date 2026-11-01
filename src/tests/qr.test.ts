import test from 'node:test';
import assert from 'node:assert';
import { generateUpiQrDataUrl, generateTableQrDataUrl } from '../utils/qr.ts';

test('generateUpiQrDataUrl should create a valid base64 PNG data URL for UPI payments', async () => {
  const qrDataUrl = await generateUpiQrDataUrl(
    'craverse.cafe@okhdfcbank',
    'Craverse',
    350,
    'Table-16'
  );

  assert.ok(qrDataUrl.startsWith('data:image/png;base64,'), 'QR URL should be a PNG data URL');
  assert.ok(qrDataUrl.length > 500, 'QR URL should have valid base64 payload');
});

test('generateTableQrDataUrl should create a valid table QR code for dine-in onboarding', async () => {
  const tableQr = await generateTableQrDataUrl('16', 'token_table_16_secure');

  assert.ok(tableQr.startsWith('data:image/png;base64,'), 'Table QR should be a PNG data URL');
  assert.ok(tableQr.length > 500, 'Table QR should have valid payload');
});

