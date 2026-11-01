export type Role = 'super_admin' | 'owner' | 'manager' | 'cashier' | 'waiter' | 'kitchen' | 'customer';

export type FoodType = 'veg' | 'non_veg' | 'egg';

export type OrderStatus = 'placed' | 'accepted' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';

export type PaymentMethod = 'cash' | 'upi' | 'card' | 'gateway_sandbox';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type ServiceRequestType = 'call_waiter' | 'request_bill' | 'water' | 'cutlery' | 'clean_table' | 'custom';
export type ServiceRequestStatus = 'pending' | 'acknowledged' | 'completed';

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo: string;
  coverImage: string;
  address: string;
  phone: string;
  email: string;
  fssaiNumber: string;
  isOpen: boolean;
  currency: string;
  currencySymbol: string;
  taxRates: {
    cgstPercent: number;
    sgstPercent: number;
    serviceChargePercent: number;
  };
  upiVpa: string;
  branches: Branch[];
}

export interface Branch {
  id: string;
  restaurantId: string;
  name: string;
  address: string;
  phone: string;
  isMain: boolean;
}

export interface Floor {
  id: string;
  name: string;
  displayOrder: number;
}

export interface Table {
  id: string;
  restaurantId: string;
  branchId: string;
  tableNumber: string;
  qrCodeToken: string;
  floorId: string;
  floorName: string;
  capacity: number;
  status: 'vacant' | 'occupied' | 'reserved' | 'cleaning';
  currentSessionId?: string;
  activeOrderCount?: number;
  waiterCallActive?: boolean;
  billRequested?: boolean;
}

export interface Category {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  icon?: string;
  displayOrder: number;
  isActive: boolean;
  itemCount?: number;
}

export interface CustomizationOption {
  id: string;
  name: string;
  priceDelta: number;
  isDefault?: boolean;
}

export interface CustomizationGroup {
  id: string;
  title: string;
  minSelections: number; // 0 for optional, 1 for required single/multi
  maxSelections: number; // 1 for radio, >1 for checkboxes
  options: CustomizationOption[];
}

export interface ProductVariant {
  id: string;
  name: string; // e.g., "Regular", "Large", "Half", "Full"
  price: number;
  discountedPrice?: number;
  isDefault?: boolean;
}

export interface Product {
  id: string;
  restaurantId: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  foodType: FoodType;
  price: number;
  discountedPrice?: number;
  imageUrl: string;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  isBestseller?: boolean;
  isChefSpecial?: boolean;
  isSpicy?: boolean;
  spiceLevel?: 1 | 2 | 3; // 1: Mild, 2: Medium, 3: Hot
  calories?: number;
  allergens?: string[];
  variants?: ProductVariant[];
  customizationGroups?: CustomizationGroup[];
  ingredientsRecipe?: { ingredientId: string; quantity: number }[];
}

export interface SelectedCustomization {
  groupId: string;
  groupTitle: string;
  optionId: string;
  optionName: string;
  priceDelta: number;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  product: Product;
  selectedVariant?: ProductVariant;
  selectedCustomizations: SelectedCustomization[];
  unitPrice: number; // Base variant price + customization deltas
  quantity: number;
  specialInstructions?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  foodType: FoodType;
  imageUrl: string;
  variantName?: string;
  customizationDetails: string[];
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  specialInstructions?: string;
  status: OrderStatus;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. #CRV-1024
  restaurantId: string;
  branchId: string;
  tableId: string;
  tableNumber: string;
  customerName?: string;
  customerPhone?: string;
  sessionId: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  cgstAmount: number;
  sgstAmount: number;
  serviceChargeAmount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
  placedAt: string;
  updatedAt: string;
  estimatedPrepTimeMinutes: number;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface TableSession {
  id: string;
  restaurantId: string;
  tableId: string;
  tableNumber: string;
  customerName?: string;
  customerPhone?: string;
  startedAt: string;
  closedAt?: string;
  isActive: boolean;
  orderIds: string[];
  totalBill: number;
  paymentStatus: PaymentStatus;
}

export interface ServiceRequest {
  id: string;
  restaurantId: string;
  tableId: string;
  tableNumber: string;
  type: ServiceRequestType;
  details?: string;
  status: ServiceRequestStatus;
  requestedAt: string;
  acknowledgedAt?: string;
  completedAt?: string;
}

export interface Staff {
  id: string;
  restaurantId: string;
  name: string;
  email: string;
  role: Role;
  phone: string;
  isActive: boolean;
  assignedFloorId?: string;
}

export interface InventoryItem {
  id: string;
  restaurantId: string;
  name: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  unit: string; // 'kg', 'ltr', 'gms', 'pcs', 'packets'
  costPerUnit: number;
  supplierName: string;
  lastUpdated: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
  isActive: boolean;
}

