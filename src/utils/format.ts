import type { OrderStatus, FoodType } from '../types/index.ts';

export function formatCurrency(amount: number, symbol: string = '₹'): string {
  return `${symbol}${amount.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2
  })}`;
}

export function formatTimeElapsed(dateIso: string): string {
  const diffMs = Date.now() - new Date(dateIso).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return 'Just now';
  if (diffMins === 1) return '1 min ago';
  if (diffMins < 60) return `${diffMins} mins ago`;
  const diffHours = Math.floor(diffMins / 60);
  return `${diffHours}h ${diffMins % 60}m ago`;
}

export function getOrderStatusBadge(status: OrderStatus): { label: string; bg: string; text: string; border: string } {
  switch (status) {
    case 'placed':
      return { label: 'Placed', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'accepted':
      return { label: 'Confirmed', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case 'preparing':
      return { label: 'Preparing', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
    case 'ready':
      return { label: 'Ready to Serve', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'served':
      return { label: 'Served', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' };
    case 'completed':
      return { label: 'Completed', bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };
    case 'cancelled':
      return { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
    default:
      return { label: status, bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' };
  }
}

export function getFoodTypeBadge(type: FoodType) {
  switch (type) {
    case 'veg':
      return {
        label: 'Pure Veg',
        borderClass: 'border-emerald-600',
        dotClass: 'bg-emerald-600',
        bgLight: 'bg-emerald-50 text-emerald-800'
      };
    case 'non_veg':
      return {
        label: 'Non-Veg',
        borderClass: 'border-rose-600',
        dotClass: 'bg-rose-600',
        bgLight: 'bg-rose-50 text-rose-800'
      };
    case 'egg':
      return {
        label: 'Contains Egg',
        borderClass: 'border-amber-600',
        dotClass: 'bg-amber-600',
        bgLight: 'bg-amber-50 text-amber-800'
      };
  }
}

