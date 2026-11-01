import test from 'node:test';
import assert from 'node:assert';
import { formatCurrency, formatTimeElapsed, getOrderStatusBadge } from '../utils/format.ts';

test('formatCurrency should format INR currency correctly', () => {
  assert.strictEqual(formatCurrency(0), '₹0');
  assert.strictEqual(formatCurrency(150), '₹150');
  assert.strictEqual(formatCurrency(199.5), '₹199.50');
  assert.strictEqual(formatCurrency(1250), '₹1,250');
});

test('formatTimeElapsed should calculate readable relative time', () => {
  const now = new Date().toISOString();
  assert.strictEqual(formatTimeElapsed(now), 'Just now');

  const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
  assert.strictEqual(formatTimeElapsed(oneMinuteAgo), '1 min ago');

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  assert.strictEqual(formatTimeElapsed(fiveMinutesAgo), '5 mins ago');

  const twoHoursAgo = new Date(Date.now() - 120 * 60 * 1000).toISOString();
  assert.strictEqual(formatTimeElapsed(twoHoursAgo), '2h 0m ago');
});

test('getOrderStatusBadge should return appropriate styling classes and labels', () => {
  const placed = getOrderStatusBadge('placed');
  assert.strictEqual(placed.label, 'Placed');
  assert.ok(placed.bg.includes('amber'));

  const preparing = getOrderStatusBadge('preparing');
  assert.strictEqual(preparing.label, 'Preparing');

  const ready = getOrderStatusBadge('ready');
  assert.strictEqual(ready.label, 'Ready to Serve');

  const served = getOrderStatusBadge('served');
  assert.strictEqual(served.label, 'Served');

  const cancelled = getOrderStatusBadge('cancelled');
  assert.strictEqual(cancelled.label, 'Cancelled');
  assert.ok(cancelled.bg.includes('red'));
});
