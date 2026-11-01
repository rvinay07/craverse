import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Role,
  Restaurant,
  Category,
  Product,
  ProductVariant,
  SelectedCustomization,
  CartItem,
  Order,
  OrderItem,
  OrderStatus,
  Table,
  Floor,
  ServiceRequest,
  Staff,
  InventoryItem,
  Coupon,
  PaymentMethod
} from '../types';
import {
  INITIAL_RESTAURANT,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_TABLES,
  INITIAL_FLOORS,
  INITIAL_ORDERS,
  INITIAL_STAFF,
  INITIAL_INVENTORY,
  INITIAL_COUPONS
} from '../data/mockData';
import { playSound } from '../utils/audio';

interface CartTotals {
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  serviceChargeAmount: number;
  totalAmount: number;
}

interface AppContextType {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Navigation & Role
  currentRole: Role;
  setCurrentRole: (role: Role) => void;

  // Restaurant & Tenant
  restaurant: Restaurant;
  updateRestaurant: (updated: Partial<Restaurant>) => void;
  allRestaurants: Restaurant[];
  createNewRestaurant: (newRest: Restaurant) => void;
  switchRestaurant: (restaurantId: string) => void;

  // Tables & QR
  tables: Table[];
  floors: Floor[];
  currentTable: Table | null;
  setCurrentTableByNumber: (tableNumber: string) => boolean;
  setCurrentTableByToken: (token: string) => boolean;
  updateTable: (id: string, updates: Partial<Table>) => void;
  addTable: (table: Omit<Table, 'id'>) => void;
  deleteTable: (id: string) => void;

  // Service Requests (Waiter Call / Bill Request)
  serviceRequests: ServiceRequest[];
  createServiceRequest: (type: ServiceRequest['type'], details?: string) => void;
  resolveServiceRequest: (id: string) => void;

  // Menu & Catalogue
  categories: Category[];
  products: Product[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductAvailability: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product,
    selectedVariant: ProductVariant | undefined,
    selectedCustomizations: SelectedCustomization[],
    quantity: number,
    specialInstructions?: string
  ) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartTotals: CartTotals;

  // Orders
  orders: Order[];
  placeOrder: (customerName?: string, customerPhone?: string, notes?: string) => Order | null;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  settleTableBill: (tableId: string, paymentMethod: PaymentMethod, reference?: string) => void;
  getTableOrders: (tableId: string) => Order[];
  getActiveTableBill: (tableId: string) => {
    orders: Order[];
    subtotal: number;
    discount: number;
    cgst: number;
    sgst: number;
    serviceCharge: number;
    total: number;
  };

  // Staff & Inventory
  staff: Staff[];
  addStaffMember: (member: Omit<Staff, 'id'>) => void;
  updateStaffMember: (id: string, updates: Partial<Staff>) => void;
  inventory: InventoryItem[];
  updateInventoryStock: (id: string, newStock: number) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;

  // System
  resetToDefaultData: () => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  RESTAURANT: 'craverse_v6_restaurant',
  CATEGORIES: 'craverse_v6_categories',
  PRODUCTS: 'craverse_v6_products',
  TABLES: 'craverse_v6_tables',
  ORDERS: 'craverse_v6_orders',
  STAFF: 'craverse_v6_staff',
  INVENTORY: 'craverse_v6_inventory',
  REQUESTS: 'craverse_v6_service_requests',
  TENANTS: 'craverse_v6_all_restaurants'
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state: dark / light
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const savedTheme = localStorage.getItem('craverse_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      const root = document.documentElement;
      const body = document.body;
      if (theme === 'dark') {
        root.classList.add('dark');
        body?.classList.add('dark');
      } else {
        root.classList.remove('dark');
        body?.classList.remove('dark');
      }
      localStorage.setItem('craverse_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Navigation Role: default is 'customer' for Dine-in
  const [currentRole, setCurrentRole] = useState<Role>('customer');

  // Restaurant profile
  const [restaurant, setRestaurant] = useState<Restaurant>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESTAURANT);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.logo || parsed.logo.includes('unsplash')) {
          parsed.logo = '/craverse-logo.jpg';
        }
        if (!parsed.coverImage || parsed.coverImage.includes('unsplash')) {
          parsed.coverImage = '/craverse-logo.jpg';
        }
        return parsed;
      }
      return INITIAL_RESTAURANT;
    } catch {
      return INITIAL_RESTAURANT;
    }
  });

  // All restaurants for multi-tenancy
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TENANTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((r: Restaurant) => {
          if (r.id === 'rest_craverse_blr' || !r.logo || r.logo.includes('unsplash')) {
            return { ...r, logo: '/craverse-logo.jpg', coverImage: '/craverse-logo.jpg' };
          }
          return r;
        });
      }
      return [INITIAL_RESTAURANT];
    } catch {
      return [INITIAL_RESTAURANT];
    }
  });

  // Tables & Floors
  const [tables, setTables] = useState<Table[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TABLES);
      return saved ? JSON.parse(saved) : INITIAL_TABLES;
    } catch {
      return INITIAL_TABLES;
    }
  });
  const [floors] = useState<Floor[]>(INITIAL_FLOORS);

  // Active Table (defaults to Table 16 matching Petpooja reference experience)
  const [currentTable, setCurrentTable] = useState<Table | null>(() => {
    return tables.find((t) => t.tableNumber === '16') || tables[0] || null;
  });

  // Menu: Categories & Products
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Service Requests
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Staff & Inventory
  const [staff, setStaff] = useState<Staff[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
      return saved ? JSON.parse(saved) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    } catch {
      return INITIAL_INVENTORY;
    }
  });

  // Customer Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(() => {
    // Return sample order for table 16 if available
    return orders.find(o => o.tableNumber === '16' && o.status !== 'completed' && o.status !== 'cancelled') || null;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESTAURANT, JSON.stringify(restaurant));
  }, [restaurant]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(allRestaurants));
  }, [allRestaurants]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(serviceRequests));
  }, [serviceRequests]);

  // URL query parameter check for QR scanning (?table=16 or ?token=xyz)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tableParam = params.get('table');
      const tokenParam = params.get('token');

      if (tokenParam) {
        const found = tables.find((t) => t.qrCodeToken === tokenParam);
        if (found) setCurrentTable(found);
      } else if (tableParam) {
        const found = tables.find((t) => t.tableNumber === tableParam);
        if (found) setCurrentTable(found);
      }
    }
  }, [tables]);

  // Table Switchers
  const setCurrentTableByNumber = (tableNumber: string): boolean => {
    const table = tables.find((t) => t.tableNumber === tableNumber);
    if (table) {
      setCurrentTable(table);
      return true;
    }
    return false;
  };

  const setCurrentTableByToken = (token: string): boolean => {
    const table = tables.find((t) => t.qrCodeToken === token);
    if (table) {
      setCurrentTable(table);
      return true;
    }
    return false;
  };

  const updateTable = (id: string, updates: Partial<Table>) => {
    setTables((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    if (currentTable && currentTable.id === id) {
      setCurrentTable((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const addTable = (tableData: Omit<Table, 'id'>) => {
    const newId = `tbl_${Date.now()}`;
    const newTable: Table = {
      ...tableData,
      id: newId
    };
    setTables((prev) => [...prev, newTable]);
  };

  const deleteTable = (id: string) => {
    setTables((prev) => prev.filter((t) => t.id !== id));
  };

  // Service Requests (Call Waiter, Request Bill, Water, etc.)
  const createServiceRequest = (type: ServiceRequest['type'], details?: string) => {
    if (!currentTable) return;
    const newReq: ServiceRequest = {
      id: `req_${Date.now()}`,
      restaurantId: restaurant.id,
      tableId: currentTable.id,
      tableNumber: currentTable.tableNumber,
      type,
      details,
      status: 'pending',
      requestedAt: new Date().toISOString()
    };
    setServiceRequests((prev) => [newReq, ...prev]);

    // Update table flags
    if (type === 'call_waiter' || type === 'water' || type === 'cutlery') {
      updateTable(currentTable.id, { waiterCallActive: true });
    }
    if (type === 'request_bill') {
      updateTable(currentTable.id, { billRequested: true });
    }

    playSound('waiter_bell');
  };

  const resolveServiceRequest = (id: string) => {
    setServiceRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'completed', completedAt: new Date().toISOString() } : req))
    );
  };

  // Restaurant & Tenant
  const updateRestaurant = (updated: Partial<Restaurant>) => {
    setRestaurant((prev) => ({ ...prev, ...updated }));
  };

  const createNewRestaurant = (newRest: Restaurant) => {
    setAllRestaurants((prev) => [...prev, newRest]);
    setRestaurant(newRest);
  };

  const switchRestaurant = (restId: string) => {
    const target = allRestaurants.find((r) => r.id === restId);
    if (target) {
      setRestaurant(target);
    }
  };

  // Menu CRUD
  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: `cat_${Date.now()}`
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}`
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, ...updates } : prod))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== id));
  };

  const toggleProductAvailability = (id: string) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, isAvailable: !prod.isAvailable } : prod))
    );
  };

  // Cart operations
  const addToCart = (
    product: Product,
    selectedVariant: ProductVariant | undefined,
    selectedCustomizations: SelectedCustomization[],
    quantity: number,
    specialInstructions?: string
  ) => {
    const basePrice = selectedVariant?.price ?? product.discountedPrice ?? product.price;
    const customizationsTotal = selectedCustomizations.reduce((acc, c) => acc + c.priceDelta, 0);
    const unitPrice = basePrice + customizationsTotal;

    // Unique key identifying identical item configuration
    const customKey = selectedCustomizations
      .map((c) => c.optionId)
      .sort()
      .join('-');
    const cartItemId = `${product.id}_${selectedVariant?.id || 'base'}_${customKey}_${specialInstructions || ''}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            productId: product.id,
            product,
            selectedVariant,
            selectedCustomizations,
            unitPrice,
            quantity,
            specialInstructions
          }
        ];
      }
    });

    playSound('success');
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const found = INITIAL_COUPONS.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive
    );
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }
    const currentSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    if (currentSubtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Requires minimum order of ₹${found.minOrderValue}. Add more delicious items!`
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Cart Totals Calculation
  const cartTotals: CartTotals = useMemo(() => {
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

    let discountAmount = 0;
    if (appliedCoupon && subtotal >= appliedCoupon.minOrderValue) {
      if (appliedCoupon.discountType === 'percentage') {
        const calculated = (subtotal * appliedCoupon.discountValue) / 100;
        discountAmount = appliedCoupon.maxDiscount ? Math.min(calculated, appliedCoupon.maxDiscount) : calculated;
      } else {
        discountAmount = appliedCoupon.discountValue;
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const cgstAmount = (discountedSubtotal * restaurant.taxRates.cgstPercent) / 100;
    const sgstAmount = (discountedSubtotal * restaurant.taxRates.sgstPercent) / 100;
    const serviceChargeAmount = (discountedSubtotal * restaurant.taxRates.serviceChargePercent) / 100;
    const totalAmount = Math.round(discountedSubtotal + cgstAmount + sgstAmount + serviceChargeAmount);

    return {
      itemCount,
      subtotal,
      discountAmount,
      cgstAmount: Number(cgstAmount.toFixed(2)),
      sgstAmount: Number(sgstAmount.toFixed(2)),
      serviceChargeAmount: Number(serviceChargeAmount.toFixed(2)),
      totalAmount
    };
  }, [cart, appliedCoupon, restaurant.taxRates]);

  // Order Placement
  const placeOrder = (customerName?: string, customerPhone?: string, notes?: string): Order | null => {
    if (!currentTable || cart.length === 0) return null;

    const orderNumber = `#CRV-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowIso = new Date().toISOString();

    const orderItems: OrderItem[] = cart.map((item, idx) => ({
      id: `oi_${Date.now()}_${idx}`,
      productId: item.productId,
      productName: item.product.name,
      foodType: item.product.foodType,
      imageUrl: item.product.imageUrl,
      variantName: item.selectedVariant?.name,
      customizationDetails: item.selectedCustomizations.map((c) =>
        c.priceDelta > 0 ? `${c.optionName} (+₹${c.priceDelta})` : c.optionName
      ),
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      totalPrice: item.unitPrice * item.quantity,
      specialInstructions: item.specialInstructions,
      status: 'placed'
    }));

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      restaurantId: restaurant.id,
      branchId: currentTable.branchId || restaurant.branches[0].id,
      tableId: currentTable.id,
      tableNumber: currentTable.tableNumber,
      customerName: customerName?.trim() ? customerName.trim() : (currentTable.currentSessionId ? 'Dine-in Guest' : 'Table Guest'),
      customerPhone: customerPhone?.trim() || undefined,
      sessionId: currentTable.currentSessionId || `sess_${currentTable.tableNumber}_${Date.now()}`,
      items: orderItems,
      subtotal: cartTotals.subtotal,
      discountAmount: cartTotals.discountAmount,
      couponCode: appliedCoupon?.code,
      cgstAmount: cartTotals.cgstAmount,
      sgstAmount: cartTotals.sgstAmount,
      serviceChargeAmount: cartTotals.serviceChargeAmount,
      totalAmount: cartTotals.totalAmount,
      status: 'placed',
      paymentStatus: 'pending',
      notes,
      placedAt: nowIso,
      updatedAt: nowIso,
      estimatedPrepTimeMinutes: 20,
      statusHistory: [
        {
          status: 'placed',
          timestamp: nowIso,
          note: `Order submitted from Table ${currentTable.tableNumber}`
        }
      ]
    };

    // Update table status to occupied
    updateTable(currentTable.id, {
      status: 'occupied',
      currentSessionId: newOrder.sessionId,
      activeOrderCount: (currentTable.activeOrderCount || 0) + 1
    });

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    clearCart();

    playSound('order_placed');
    return newOrder;
  };

  // Order status update
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    const nowIso = new Date().toISOString();
    let tableIdToSync: string | undefined;

    setOrders((prev) => {
      const target = prev.find((o) => o.id === orderId);
      if (target) {
        tableIdToSync = target.tableId;
      }
      return prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedHistory = [
            ...ord.statusHistory,
            { status: newStatus, timestamp: nowIso, note: note || `Status changed to ${newStatus}` }
          ];

          if (newStatus === 'ready') {
            playSound('status_ready');
          } else if (newStatus === 'accepted') {
            playSound('kitchen_new');
          } else if (newStatus === 'cancelled') {
            playSound('cancel');
          }

          return {
            ...ord,
            status: newStatus,
            updatedAt: nowIso,
            statusHistory: updatedHistory,
            items: ord.items.map((item) => ({ ...item, status: newStatus }))
          };
        }
        return ord;
      });
    });

    // If order was cancelled, immediately sync table state
    if (newStatus === 'cancelled' && tableIdToSync) {
      setTimeout(() => {
        setOrders((currentOrders) => {
          const remainingActive = currentOrders.filter(
            (o) => o.tableId === tableIdToSync && o.id !== orderId && o.status !== 'completed' && o.status !== 'cancelled'
          );
          if (remainingActive.length === 0) {
            updateTable(tableIdToSync!, {
              status: 'vacant',
              currentSessionId: undefined,
              activeOrderCount: 0,
              billRequested: false,
              waiterCallActive: false
            });
          } else {
            updateTable(tableIdToSync!, {
              activeOrderCount: remainingActive.length
            });
          }
          return currentOrders;
        });
      }, 50);
    }
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    updateOrderStatus(orderId, 'cancelled', reason || 'Order cancelled');
  };

  // Settle Table Bill
  const settleTableBill = (tableId: string, paymentMethod: PaymentMethod, _reference?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.tableId === tableId && ord.paymentStatus !== 'completed') {
          return {
            ...ord,
            status: 'completed',
            paymentStatus: 'completed',
            paymentMethod,
            updatedAt: new Date().toISOString(),
            statusHistory: [
              ...ord.statusHistory,
              { status: 'completed', timestamp: new Date().toISOString(), note: `Settled via ${paymentMethod}` }
            ]
          };
        }
        return ord;
      })
    );

    // Free the table
    updateTable(tableId, {
      status: 'vacant',
      currentSessionId: undefined,
      activeOrderCount: 0,
      billRequested: false,
      waiterCallActive: false
    });

    playSound('success');
  };

  const getTableOrders = (tableId: string): Order[] => {
    return orders.filter((o) => o.tableId === tableId && o.status !== 'completed' && o.status !== 'cancelled');
  };

  const getActiveTableBill = (tableId: string) => {
    const activeOrders = getTableOrders(tableId);
    const subtotal = activeOrders.reduce((sum, o) => sum + o.subtotal, 0);
    const discount = activeOrders.reduce((sum, o) => sum + o.discountAmount, 0);
    const cgst = activeOrders.reduce((sum, o) => sum + o.cgstAmount, 0);
    const sgst = activeOrders.reduce((sum, o) => sum + o.sgstAmount, 0);
    const serviceCharge = activeOrders.reduce((sum, o) => sum + o.serviceChargeAmount, 0);
    const total = activeOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      orders: activeOrders,
      subtotal,
      discount,
      cgst,
      sgst,
      serviceCharge,
      total
    };
  };

  // Staff & Inventory operations
  const addStaffMember = (member: Omit<Staff, 'id'>) => {
    const newStaff: Staff = {
      ...member,
      id: `stf_${Date.now()}`
    };
    setStaff((prev) => [...prev, newStaff]);
  };

  const updateStaffMember = (id: string, updates: Partial<Staff>) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const updateInventoryStock = (id: string, newStock: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, currentStock: Math.max(0, newStock), lastUpdated: new Date().toISOString().split('T')[0] }
          : item
      )
    );
  };

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv_${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setInventory((prev) => [...prev, newItem]);
  };

  // Reset demo data helper
  const resetToDefaultData = () => {
    localStorage.clear();
    setRestaurant(INITIAL_RESTAURANT);
    setAllRestaurants([INITIAL_RESTAURANT]);
    setTables(INITIAL_TABLES);
    setCategories(INITIAL_CATEGORIES);
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setStaff(INITIAL_STAFF);
    setInventory(INITIAL_INVENTORY);
    setServiceRequests([]);
    setCart([]);
    setAppliedCoupon(null);
    setCurrentTable(INITIAL_TABLES.find((t) => t.tableNumber === '16') || INITIAL_TABLES[0]);
    playSound('success');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentRole,
        setCurrentRole,
        restaurant,
        updateRestaurant,
        allRestaurants,
        createNewRestaurant,
        switchRestaurant,
        tables,
        floors,
        currentTable,
        setCurrentTableByNumber,
        setCurrentTableByToken,
        updateTable,
        addTable,
        deleteTable,
        serviceRequests,
        createServiceRequest,
        resolveServiceRequest,
        categories,
        products,
        addCategory,
        updateCategory,
        deleteCategory,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartTotals,
        orders,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        settleTableBill,
        getTableOrders,
        getActiveTableBill,
        staff,
        addStaffMember,
        updateStaffMember,
        inventory,
        updateInventoryStock,
        addInventoryItem,
        resetToDefaultData,
        lastPlacedOrder,
        setLastPlacedOrder
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

