import test from 'node:test';
import assert from 'node:assert';
import type { Order } from '../types/index.ts';

function cancelOrderHelper(order: Order, reason: string): Order {
  const nowIso = new Date().toISOString();
  return {
    ...order,
    status: 'cancelled',
    notes: order.notes ? `${order.notes} | CANCELLED: ${reason}` : `CANCELLED: ${reason}`,
    updatedAt: nowIso,
    statusHistory: [
      ...order.statusHistory,
      {
        status: 'cancelled',
        timestamp: nowIso,
        note: `Cancelled: ${reason}`
      }
    ]
  };
}

test('cancelOrderHelper should transition order status to cancelled with audit trail', () => {
  const initialOrder: Order = {
    id: 'ord_test_1',
    orderNumber: '#CRV-12345',
    restaurantId: 'rest_craverse_blr',
    branchId: 'br_indiranagar',
    tableId: 'tbl_16',
    tableNumber: '16',
    customerName: 'Aarav',
    customerPhone: '9876543210',
    sessionId: 'sess_1',
    items: [],
    subtotal: 300,
    discountAmount: 0,
    cgstAmount: 0,
    sgstAmount: 0,
    serviceChargeAmount: 0,
    totalAmount: 300,
    status: 'placed',
    paymentStatus: 'pending',
    placedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedPrepTimeMinutes: 15,
    statusHistory: [{ status: 'placed', timestamp: new Date().toISOString(), note: 'Placed' }]
  };

  const cancelledOrder = cancelOrderHelper(initialOrder, 'Customer changed mind');

  assert.strictEqual(cancelledOrder.status, 'cancelled');
  assert.ok(cancelledOrder.notes?.includes('Customer changed mind'));
  assert.strictEqual(cancelledOrder.statusHistory.length, 2);
  const secondEntry = cancelledOrder.statusHistory[1];
  assert.ok(secondEntry, 'Second status history entry must exist');
  assert.strictEqual(secondEntry.status, 'cancelled');
  assert.ok(secondEntry.note?.includes('Customer changed mind'));
});
