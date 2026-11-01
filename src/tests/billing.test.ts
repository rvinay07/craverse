import test from 'node:test';
import assert from 'node:assert';
import { INITIAL_RESTAURANT, INITIAL_COUPONS } from '../data/mockData.ts';

test('Craverse Tax Rates must be 0% GST and 0% Service Charge', () => {
  assert.strictEqual(INITIAL_RESTAURANT.taxRates.cgstPercent, 0, 'CGST must be 0%');
  assert.strictEqual(INITIAL_RESTAURANT.taxRates.sgstPercent, 0, 'SGST must be 0%');
  assert.strictEqual(INITIAL_RESTAURANT.taxRates.serviceChargePercent, 0, 'Service charge must be 0%');
});

test('Billing calculations: Net Payable must equal Subtotal minus Discount with zero tax', () => {
  const subtotal = 450;
  const discount = 45; // 10%

  const cgst = (subtotal - discount) * (INITIAL_RESTAURANT.taxRates.cgstPercent / 100);
  const sgst = (subtotal - discount) * (INITIAL_RESTAURANT.taxRates.sgstPercent / 100);
  const serviceCharge = (subtotal - discount) * (INITIAL_RESTAURANT.taxRates.serviceChargePercent / 100);

  const totalAmount = Math.round(subtotal - discount + cgst + sgst + serviceCharge);

  assert.strictEqual(cgst, 0);
  assert.strictEqual(sgst, 0);
  assert.strictEqual(serviceCharge, 0);
  assert.strictEqual(totalAmount, 405);
  assert.strictEqual(totalAmount, subtotal - discount);
});

test('Coupons validation: correctly calculate percentage vs flat discounts', () => {
  // Test WELCOME10 (10% off min 150, max 50)
  const welcomeCoupon = INITIAL_COUPONS.find((c) => c.code === 'WELCOME10')!;
  assert.ok(welcomeCoupon);
  const subtotal1 = 200;
  assert.ok(subtotal1 >= welcomeCoupon.minOrderValue);
  const discount1 = Math.min((subtotal1 * welcomeCoupon.discountValue) / 100, welcomeCoupon.maxDiscount || Infinity);
  assert.strictEqual(discount1, 20);

  // Test FLAT30 (Flat 30 off min 199)
  const flatCoupon = INITIAL_COUPONS.find((c) => c.code === 'FLAT30')!;
  assert.ok(flatCoupon);
  const subtotal2 = 250;
  assert.ok(subtotal2 >= flatCoupon.minOrderValue);
  assert.strictEqual(flatCoupon.discountValue, 30);
});

