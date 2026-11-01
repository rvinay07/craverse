import test from 'node:test';
import assert from 'node:assert';

function validateGuestDetails(name: string, phone: string): { isValid: boolean; nameError?: string; phoneError?: string } {
  let isValid = true;
  let nameError: string | undefined;
  let phoneError: string | undefined;

  const trimmedName = name.trim();
  if (!trimmedName || trimmedName.length < 2) {
    nameError = 'Full name is required (minimum 2 characters)';
    isValid = false;
  }

  const cleanDigits = phone.replace(/\D/g, '');
  if (!cleanDigits) {
    phoneError = 'Mobile number is required for order and table billing';
    isValid = false;
  } else if (cleanDigits.length !== 10) {
    phoneError = 'Please enter a valid 10-digit mobile number';
    isValid = false;
  }

  return { isValid, nameError, phoneError };
}

test('validateGuestDetails should accept valid guest name and 10-digit mobile number', () => {
  const result = validateGuestDetails('Rahul Sharma', '9876543210');
  assert.strictEqual(result.isValid, true);
  assert.strictEqual(result.nameError, undefined);
  assert.strictEqual(result.phoneError, undefined);
});

test('validateGuestDetails should format phone with spaces or hyphens properly', () => {
  const result = validateGuestDetails('Aarav Patel', '98765-43210');
  assert.strictEqual(result.isValid, true);
});

test('validateGuestDetails should reject empty or short name', () => {
  const emptyName = validateGuestDetails('', '9876543210');
  assert.strictEqual(emptyName.isValid, false);
  assert.ok(emptyName.nameError?.includes('minimum 2 characters'));

  const singleChar = validateGuestDetails('A', '9876543210');
  assert.strictEqual(singleChar.isValid, false);

  const spacesOnly = validateGuestDetails('   ', '9876543210');
  assert.strictEqual(spacesOnly.isValid, false);
});

test('validateGuestDetails should reject invalid mobile numbers', () => {
  const emptyPhone = validateGuestDetails('Priya Nair', '');
  assert.strictEqual(emptyPhone.isValid, false);
  assert.ok(emptyPhone.phoneError?.includes('required'));

  const shortPhone = validateGuestDetails('Priya Nair', '9876543');
  assert.strictEqual(shortPhone.isValid, false);
  assert.ok(shortPhone.phoneError?.includes('10-digit'));

  const longPhone = validateGuestDetails('Priya Nair', '987654321099');
  assert.strictEqual(longPhone.isValid, false);
});

