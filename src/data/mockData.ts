import type { Restaurant, Category, Product, Table, Floor, Order, Staff, InventoryItem, Coupon } from '../types/index.ts';

export const INITIAL_RESTAURANT: Restaurant = {
  id: 'rest_craverse_blr',
  name: 'Craverse',
  slug: 'craverse',
  tagline: 'Your Universe of Flavours.',
  description: 'Welcome to Craverse. Your Universe of Flavours — 100% Pure Vegetarian artisanal pizzas, delicious snacks, comforting rice bowls, refreshing coolers, and freshly brewed specialty coffees.',
  logo: '/craverse-logo.jpg',
  coverImage: '/craverse-logo.jpg',
  address: '42, 100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
  phone: '+91 80 4123 4567',
  email: 'hello@craversecafe.com',
  fssaiNumber: '11224334000189',
  isOpen: true,
  currency: 'INR',
  currencySymbol: '₹',
  // ZERO GST & ZERO EXTRA CHARGES
  taxRates: {
    cgstPercent: 0,
    sgstPercent: 0,
    serviceChargePercent: 0
  },
  upiVpa: 'craverse.cafe@okhdfcbank',
  branches: [
    {
      id: 'br_indiranagar',
      restaurantId: 'rest_craverse_blr',
      name: 'Indiranagar Flagship',
      address: '42, 100ft Road, Indiranagar, Bengaluru',
      phone: '+91 80 4123 4567',
      isMain: true
    }
  ]
};

export const INITIAL_FLOORS: Floor[] = [
  { id: 'floor_indoor', name: 'Main Café Hall', displayOrder: 1 },
  { id: 'floor_patio', name: 'Outdoor Garden Terrace', displayOrder: 2 },
];

export const INITIAL_TABLES: Table[] = [
  { id: 'tbl_1', restaurantId: 'rest_craverse_blr', branchId: 'br_indiranagar', tableNumber: '01', qrCodeToken: 'crv_tok_01_a83f', floorId: 'floor_indoor', floorName: 'Main Café Hall', capacity: 2, status: 'vacant' },
  { id: 'tbl_2', restaurantId: 'rest_craverse_blr', branchId: 'br_indiranagar', tableNumber: '02', qrCodeToken: 'crv_tok_02_b94e', floorId: 'floor_indoor', floorName: 'Main Café Hall', capacity: 4, status: 'vacant' },
  { id: 'tbl_3', restaurantId: 'rest_craverse_blr', branchId: 'br_indiranagar', tableNumber: '03', qrCodeToken: 'crv_tok_03_c12d', floorId: 'floor_indoor', floorName: 'Main Café Hall', capacity: 4, status: 'vacant' },
  { id: 'tbl_4', restaurantId: 'rest_craverse_blr', branchId: 'br_indiranagar', tableNumber: '04', qrCodeToken: 'crv_tok_04_d34a', floorId: 'floor_indoor', floorName: 'Main Café Hall', capacity: 6, status: 'vacant' },
  { id: 'tbl_16', restaurantId: 'rest_craverse_blr', branchId: 'br_indiranagar', tableNumber: '16', qrCodeToken: 't06psez9ig_16', floorId: 'floor_patio', floorName: 'Outdoor Garden Terrace', capacity: 4, status: 'occupied', currentSessionId: 'sess_live_16', activeOrderCount: 1 },
  { id: 'tbl_17', restaurantId: 'rest_craverse_blr', branchId: 'br_indiranagar', tableNumber: '17', qrCodeToken: 'crv_tok_17_q89m', floorId: 'floor_patio', floorName: 'Outdoor Garden Terrace', capacity: 2, status: 'vacant' },
  { id: 'tbl_18', restaurantId: 'rest_craverse_blr', branchId: 'br_indiranagar', tableNumber: '18', qrCodeToken: 'crv_tok_18_r90n', floorId: 'floor_patio', floorName: 'Outdoor Garden Terrace', capacity: 4, status: 'vacant' },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_snacks', restaurantId: 'rest_craverse_blr', name: 'Snacks & Starters', description: 'Crispy finger foods, fries, nachos and cheesy bites', icon: 'Flame', displayOrder: 1, isActive: true },
  { id: 'cat_pizza', restaurantId: 'rest_craverse_blr', name: 'Artisan Pizzas', description: 'Freshly baked thin-crust and cheese burst pizzas', icon: 'Sparkles', displayOrder: 2, isActive: true },
  { id: 'cat_rice', restaurantId: 'rest_craverse_blr', name: 'Rice Bowls', description: 'Comforting aromatic veg biryani and wok-tossed fried rice', icon: 'Soup', displayOrder: 3, isActive: true },
  { id: 'cat_coffee', restaurantId: 'rest_craverse_blr', name: 'Coffees & Lattes', description: 'Artisanal hot brews, lattes, thick cold coffees and kulhad chai', icon: 'Coffee', displayOrder: 4, isActive: true },
  { id: 'cat_beverages', restaurantId: 'rest_craverse_blr', name: 'Chilled Drinks', description: 'Fresh mocktails, mojitos, iced teas and fruit coolers', icon: 'Utensils', displayOrder: 5, isActive: true },
];

export const INITIAL_PRODUCTS: Product[] = [
  // ==========================================
  // 1. SNACKS & STARTERS (Affordable & 100% Veg)
  // ==========================================
  {
    id: 'prod_crispy_corn',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_snacks',
    categoryName: 'Snacks & Starters',
    name: 'Crispy Pepper Sweet Corn',
    description: 'Golden sweet corn kernels tossed with crushed black pepper, spring greens, and special tangy chaat spices.',
    foodType: 'veg',
    price: 85,
    imageUrl: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 8,
    isBestseller: true,
    calories: 210,
    customizationGroups: [
      {
        id: 'cg_corn_spice',
        title: 'Spice Preference',
        minSelections: 1,
        maxSelections: 1,
        options: [
          { id: 'opt_mild', name: 'Mild & Buttery', priceDelta: 0, isDefault: true },
          { id: 'opt_tangy', name: 'Spicy Tangy Masala', priceDelta: 0 }
        ]
      }
    ]
  },
  {
    id: 'prod_cheese_garlic_bread',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_snacks',
    categoryName: 'Snacks & Starters',
    name: 'Cheesy Garlic Breadsticks',
    description: 'Toasted baguette slices brushed with garlic herb butter and topped with molten mozzarella cheese.',
    foodType: 'veg',
    price: 90,
    imageUrl: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 10,
    isBestseller: true,
    calories: 290,
    allergens: ['Dairy', 'Gluten'],
    variants: [
      { id: 'var_gb_4', name: '4 Pieces', price: 90, isDefault: true },
      { id: 'var_gb_6', name: '6 Pieces (Sharing)', price: 125 }
    ]
  },
  {
    id: 'prod_peri_fries',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_snacks',
    categoryName: 'Snacks & Starters',
    name: 'Loaded Peri Peri Fries',
    description: 'Crispy skin-on potato fries dusted with fiery peri-peri seasoning, served with creamy cheesy jalapeño dip.',
    foodType: 'veg',
    price: 80,
    imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 8,
    isBestseller: true,
    isSpicy: true,
    calories: 320,
    customizationGroups: [
      {
        id: 'cg_fries_dip',
        title: 'Extra Dip',
        minSelections: 0,
        maxSelections: 2,
        options: [
          { id: 'opt_cheesedip', name: 'Extra Cheese Dip', priceDelta: 20 },
          { id: 'opt_mayo', name: 'Garlic Mayo Dip', priceDelta: 15 }
        ]
      }
    ]
  },
  {
    id: 'prod_paneer_popcorn',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_snacks',
    categoryName: 'Snacks & Starters',
    name: 'Crunchy Paneer Popcorn',
    description: 'Bite-sized fresh malai paneer cubes coated in spiced cornflake crumb and fried to crispy golden perfection.',
    foodType: 'veg',
    price: 110,
    imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 10,
    isBestseller: true,
    calories: 360,
    allergens: ['Dairy']
  },
  {
    id: 'prod_spring_rolls',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_snacks',
    categoryName: 'Snacks & Starters',
    name: 'Crispy Veg Spring Rolls',
    description: 'Hand-rolled pastry sheets filled with wok-tossed cabbage, carrots, bell peppers, and scallions with sweet chilli dip.',
    foodType: 'veg',
    price: 85,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 10,
    calories: 240
  },
  {
    id: 'prod_cheesy_nachos',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_snacks',
    categoryName: 'Snacks & Starters',
    name: 'Cheesy Loaded Nachos Supreme',
    description: 'Crisp Mexican tortilla chips smothered in warm cheese sauce, fresh tomato salsa, sweet corn, and sliced jalapeños.',
    foodType: 'veg',
    price: 105,
    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 8,
    isBestseller: true,
    calories: 380,
    allergens: ['Dairy']
  },
  {
    id: 'prod_chilli_cheese_toast',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_snacks',
    categoryName: 'Snacks & Starters',
    name: 'Chilli Cheese Toast',
    description: 'Crusty bread topped with finely chopped green chillies, bell peppers, melted cheddar and mozzarella cheese blend.',
    foodType: 'veg',
    price: 85,
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 8,
    isSpicy: true,
    calories: 270,
    allergens: ['Dairy', 'Gluten']
  },
  {
    id: 'prod_potato_wedges',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_snacks',
    categoryName: 'Snacks & Starters',
    name: 'Herbed Masala Potato Wedges',
    description: 'Thick cut crispy potato wedges seasoned with rosemary, garlic, and cracked pepper. Served with tomato herb salsa.',
    foodType: 'veg',
    price: 75,
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 8,
    calories: 260
  },
  {
    id: 'prod_veg_dimsums',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_snacks',
    categoryName: 'Snacks & Starters',
    name: 'Steamed Veg Dimsums (6 pcs)',
    description: 'Delicate translucent dumplings filled with minced water chestnuts, mushrooms, and veggies. Served with spicy schezwan dip.',
    foodType: 'veg',
    price: 90,
    imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 10,
    calories: 190
  },
  {
    id: 'prod_cheese_balls',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_snacks',
    categoryName: 'Snacks & Starters',
    name: 'Crispy Corn & Cheese Balls (5 pcs)',
    description: 'Molten cheese and sweet corn stuffed crunchy croquettes with an irresistible stretchy cheese pull.',
    foodType: 'veg',
    price: 95,
    imageUrl: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 10,
    calories: 310,
    allergens: ['Dairy']
  },

  // ==========================================
  // 2. ARTISAN PIZZAS (Pocket-Friendly & 100% Veg)
  // ==========================================
  {
    id: 'prod_margherita_pizza',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_pizza',
    categoryName: 'Artisan Pizzas',
    name: 'Classic Margherita Basil Pizza',
    description: 'Traditional San Marzano herb tomato sauce, fresh buffalo mozzarella, aromatic sweet basil, and extra virgin olive oil drizzle.',
    foodType: 'veg',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 12,
    isBestseller: true,
    calories: 520,
    allergens: ['Dairy', 'Gluten'],
    variants: [
      { id: 'var_mrg_reg', name: 'Regular 7-inch', price: 150, isDefault: true },
      { id: 'var_mrg_med', name: 'Medium 9-inch', price: 195 },
      { id: 'var_mrg_lar', name: 'Large 12-inch', price: 280 }
    ],
    customizationGroups: [
      {
        id: 'cg_crust_mrg',
        title: 'Crust Choice',
        minSelections: 1,
        maxSelections: 1,
        options: [
          { id: 'crust_thin', name: 'Classic Thin Crust', priceDelta: 0, isDefault: true },
          { id: 'crust_cheese_burst', name: 'Cheese Burst Crust (+₹40)', priceDelta: 40 }
        ]
      }
    ]
  },
  {
    id: 'prod_farmhouse_pizza',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_pizza',
    categoryName: 'Artisan Pizzas',
    name: 'Farmhouse Fresh Veggie Pizza',
    description: 'Crisp bell peppers, diced red onions, juicy ripe tomatoes, button mushrooms, and sweet corn with 100% mozzarella.',
    foodType: 'veg',
    price: 175,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 14,
    isBestseller: true,
    calories: 580,
    allergens: ['Dairy', 'Gluten'],
    variants: [
      { id: 'var_farm_reg', name: 'Regular 7-inch', price: 175, isDefault: true },
      { id: 'var_farm_med', name: 'Medium 9-inch', price: 220 }
    ]
  },
  {
    id: 'prod_paneer_tikka_pizza',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_pizza',
    categoryName: 'Artisan Pizzas',
    name: 'Tandoori Paneer Tikka Pizza',
    description: 'Char-grilled cottage cheese cubes marinated in tandoori spices, crunchy capsicum, red paprika, and coriander pesto.',
    foodType: 'veg',
    price: 195,
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 15,
    isBestseller: true,
    isSpicy: true,
    calories: 640,
    allergens: ['Dairy', 'Gluten'],
    variants: [
      { id: 'var_tikka_reg', name: 'Regular 7-inch', price: 195, isDefault: true },
      { id: 'var_tikka_med', name: 'Medium 9-inch', price: 245 }
    ]
  },
  {
    id: 'prod_corn_jalapeno_pizza',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_pizza',
    categoryName: 'Artisan Pizzas',
    name: 'Sweet Corn & Jalapeño Pizza',
    description: 'Sweet golden American corn paired with zesty pickled Mexican jalapeños and extra mozzarella cheese.',
    foodType: 'veg',
    price: 165,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 12,
    isSpicy: true,
    calories: 550,
    allergens: ['Dairy', 'Gluten']
  },
  {
    id: 'prod_double_cheese_pizza',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_pizza',
    categoryName: 'Artisan Pizzas',
    name: 'Double Cheese Burst Pizza',
    description: 'A liquid cheese center with an overflowing blanket of golden melted mozzarella and aged cheddar cheese.',
    foodType: 'veg',
    price: 210,
    imageUrl: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 15,
    isBestseller: true,
    calories: 690,
    allergens: ['Dairy', 'Gluten']
  },
  {
    id: 'prod_peri_peri_pizza',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_pizza',
    categoryName: 'Artisan Pizzas',
    name: 'Spicy Peri Peri Veggie Pizza',
    description: 'Loaded with peri-peri seasoned bell peppers, sliced black olives, red paprika, and fiery peri-peri drizzle.',
    foodType: 'veg',
    price: 180,
    imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 12,
    isSpicy: true,
    calories: 560,
    allergens: ['Dairy', 'Gluten']
  },
  {
    id: 'prod_mushroom_pizza',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_pizza',
    categoryName: 'Artisan Pizzas',
    name: 'Mushroom & Herb Thin Crust',
    description: 'Sautéed button mushrooms, caramelized onions, fresh rosemary, thyme, and creamy white garlic cheese sauce.',
    foodType: 'veg',
    price: 195,
    imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 14,
    calories: 510,
    allergens: ['Dairy', 'Gluten']
  },

  // ==========================================
  // 3. RICE BOWLS (Comforting, 100% Pure Veg)
  // ==========================================
  {
    id: 'prod_subz_biryani',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_rice',
    categoryName: 'Rice Bowls',
    name: 'Shahi Subz Dum Biryani Bowl',
    description: 'Fragrant long-grain aged basmati rice slow-cooked with garden vegetables, saffron, mint, and whole aromatic spices. Served with boondi raita.',
    foodType: 'veg',
    price: 145,
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 12,
    isBestseller: true,
    calories: 460,
    allergens: ['Dairy']
  },
  {
    id: 'prod_paneer_fried_rice',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_rice',
    categoryName: 'Rice Bowls',
    name: 'Paneer Fried Rice Bowl',
    description: 'Wok-tossed basmati rice with pan-seared paneer cubes, crunchy carrots, French beans, spring onions, and light soya garlic glaze.',
    foodType: 'veg',
    price: 130,
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 10,
    isBestseller: true,
    calories: 420,
    allergens: ['Dairy', 'Soy']
  },
  {
    id: 'prod_schezwan_rice',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_rice',
    categoryName: 'Rice Bowls',
    name: 'Schezwan Veg Fried Rice',
    description: 'Fiery wok-tossed rice tossed in in-house spicy red schezwan sauce with finely shredded farm vegetables.',
    foodType: 'veg',
    price: 125,
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 10,
    isSpicy: true,
    calories: 390,
    allergens: ['Soy']
  },
  {
    id: 'prod_dal_tadka_bowl',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_rice',
    categoryName: 'Rice Bowls',
    name: 'Jeera Rice & Dal Tadka Bowl',
    description: 'Steaming yellow arhar dal tempered with pure desi ghee, cumin seeds, garlic, and dried red chillies, paired with fragrant jeera rice.',
    foodType: 'veg',
    price: 110,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 8,
    isBestseller: true,
    calories: 380,
    allergens: ['Dairy']
  },
  {
    id: 'prod_veg_pulao',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_rice',
    categoryName: 'Rice Bowls',
    name: 'Royal Veg Pulao with Raita',
    description: 'Mildly spiced aromatic basmati rice cooked with green peas, carrots, French beans, and whole spices. Served with chilled cucumber raita.',
    foodType: 'veg',
    price: 125,
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 10,
    calories: 370,
    allergens: ['Dairy']
  },
  {
    id: 'prod_burnt_garlic_rice',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_rice',
    categoryName: 'Rice Bowls',
    name: 'Burnt Garlic Fried Rice',
    description: 'Aromatic wok fried rice infused with golden toasted minced garlic, scallions, and light pepper seasoning.',
    foodType: 'veg',
    price: 125,
    imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 10,
    calories: 350
  },

  // ==========================================
  // 4. COFFEES, LATTES & CHAI (Generous & Affordable)
  // ==========================================
  {
    id: 'prod_cappuccino',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_coffee',
    categoryName: 'Coffees & Lattes',
    name: 'Artisan Hot Cappuccino',
    description: 'Double shot of freshly ground 100% Arabica espresso with velvety micro-foam milk and cinnamon dusting.',
    foodType: 'veg',
    price: 85,
    imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 5,
    isBestseller: true,
    calories: 120,
    allergens: ['Dairy'],
    customizationGroups: [
      {
        id: 'cg_cap_milk',
        title: 'Milk Option',
        minSelections: 1,
        maxSelections: 1,
        options: [
          { id: 'opt_whole_milk', name: 'Regular Fresh Milk', priceDelta: 0, isDefault: true },
          { id: 'opt_oat_milk', name: 'Oat Milk (+₹25)', priceDelta: 25 },
          { id: 'opt_almond_milk', name: 'Almond Milk (+₹25)', priceDelta: 25 }
        ]
      }
    ]
  },
  {
    id: 'prod_vanilla_latte',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_coffee',
    categoryName: 'Coffees & Lattes',
    name: 'Madagascar Vanilla Bean Latte',
    description: 'Smooth espresso and steamed milk infused with pure Madagascar vanilla extract and light foamed crown.',
    foodType: 'veg',
    price: 95,
    imageUrl: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 5,
    isBestseller: true,
    calories: 160,
    allergens: ['Dairy']
  },
  {
    id: 'prod_hazelnut_latte',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_coffee',
    categoryName: 'Coffees & Lattes',
    name: 'Hazelnut Caramel Latte',
    description: 'Rich espresso blended with toasted hazelnut syrup, steamed milk, and finished with golden caramel drizzle.',
    foodType: 'veg',
    price: 110,
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 5,
    isBestseller: true,
    calories: 190,
    allergens: ['Dairy', 'Nuts']
  },
  {
    id: 'prod_spanish_latte',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_coffee',
    categoryName: 'Coffees & Lattes',
    name: 'Iced Spanish Latte',
    description: 'Chilled Arabica espresso poured over sweetened condensed milk, fresh milk, and ice. Creamy, sweet, and uplifting.',
    foodType: 'veg',
    price: 105,
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 5,
    isBestseller: true,
    calories: 210,
    allergens: ['Dairy']
  },
  {
    id: 'prod_caffe_latte',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_coffee',
    categoryName: 'Coffees & Lattes',
    name: 'Classic Caffe Latte',
    description: 'Mild and creamy espresso drink with generous steamed milk and a thin layer of foam on top.',
    foodType: 'veg',
    price: 90,
    imageUrl: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 5,
    calories: 140,
    allergens: ['Dairy']
  },
  {
    id: 'prod_dark_mocha',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_coffee',
    categoryName: 'Coffees & Lattes',
    name: 'Dark Chocolate Mocha',
    description: 'Single-origin espresso blended with premium Belgian dark chocolate sauce and textured creamy milk.',
    foodType: 'veg',
    price: 110,
    imageUrl: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 6,
    calories: 220,
    allergens: ['Dairy']
  },
  {
    id: 'prod_americano',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_coffee',
    categoryName: 'Coffees & Lattes',
    name: 'Classic Americano (Black Coffee)',
    description: 'Double shot of rich espresso diluted with hot water. Bold, earthy, and sugar-free.',
    foodType: 'veg',
    price: 65,
    imageUrl: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 4,
    calories: 10
  },
  {
    id: 'prod_cold_coffee',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_coffee',
    categoryName: 'Coffees & Lattes',
    name: 'Thick Cold Coffee with Ice Cream',
    description: 'Blended espresso, chilled full-cream milk, dark chocolate sauce, topped with a generous scoop of vanilla bean ice cream.',
    foodType: 'veg',
    price: 95,
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 5,
    isBestseller: true,
    calories: 260,
    allergens: ['Dairy']
  },
  {
    id: 'prod_iced_caramel_macchiato',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_coffee',
    categoryName: 'Coffees & Lattes',
    name: 'Iced Caramel Macchiato',
    description: 'Chilled vanilla-infused milk marked with bold espresso shots and finished with crosshatched caramel sauce.',
    foodType: 'veg',
    price: 110,
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 5,
    calories: 200,
    allergens: ['Dairy']
  },
  {
    id: 'prod_masala_chai',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_coffee',
    categoryName: 'Coffees & Lattes',
    name: 'Desi Kulhad Masala Chai',
    description: 'Assam whole leaf black tea brewed with crushed cardamom, fresh ginger, cloves, and boiled whole milk. Served in terracotta kulhad.',
    foodType: 'veg',
    price: 40,
    imageUrl: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 5,
    isBestseller: true,
    calories: 90,
    allergens: ['Dairy']
  },
  {
    id: 'prod_kadak_chai',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_coffee',
    categoryName: 'Coffees & Lattes',
    name: 'Ginger Cardamom Kadak Chai',
    description: 'Strong hot cutting tea boiled with extra crushed ginger and fragrant green cardamom.',
    foodType: 'veg',
    price: 40,
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 5,
    calories: 85,
    allergens: ['Dairy']
  },

  // ==========================================
  // 5. CHILLED DRINKS (Non-Alcoholic, 100% Pure Veg)
  // ==========================================
  {
    id: 'prod_lemon_soda',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_beverages',
    categoryName: 'Chilled Drinks',
    name: 'Sweet & Salt Fresh Lime Soda',
    description: 'Freshly squeezed Indian lemon juice, rock salt, simple syrup and chilled fizzy club soda.',
    foodType: 'veg',
    price: 55,
    imageUrl: 'https://images.unsplash.com/photo-1523371067-1ac962c6ad91?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 3,
    isBestseller: true,
    calories: 60
  },
  {
    id: 'prod_virgin_mojito',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_beverages',
    categoryName: 'Chilled Drinks',
    name: 'Fresh Mint Virgin Mojito',
    description: 'Muddled garden mint leaves, fresh lime wedges, brown sugar syrup, topped with chilled sparkling club soda.',
    foodType: 'veg',
    price: 75,
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 4,
    isBestseller: true,
    calories: 90
  },
  {
    id: 'prod_mango_cooler',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_beverages',
    categoryName: 'Chilled Drinks',
    name: 'Alphonso Mango Cream Cooler',
    description: 'Pure Ratnagiri Alphonso mango pulp blended with chilled milk and garnished with chopped pistachios.',
    foodType: 'veg',
    price: 80,
    imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 4,
    isBestseller: true,
    calories: 210,
    allergens: ['Dairy', 'Nuts']
  },
  {
    id: 'prod_peach_iced_tea',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_beverages',
    categoryName: 'Chilled Drinks',
    name: 'Peach Infused Iced Tea',
    description: 'Slow-steeped Darjeeling black tea infused with natural peach nectar, served over ice with fresh mint.',
    foodType: 'veg',
    price: 70,
    imageUrl: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 4,
    calories: 75
  },
  {
    id: 'prod_watermelon_cooler',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_beverages',
    categoryName: 'Chilled Drinks',
    name: 'Watermelon Mint Cooler',
    description: 'Cold-pressed fresh watermelon juice with crushed mint leaves, black salt, and a splash of lime.',
    foodType: 'veg',
    price: 75,
    imageUrl: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 4,
    calories: 65
  },
  {
    id: 'prod_green_apple_fizz',
    restaurantId: 'rest_craverse_blr',
    categoryId: 'cat_beverages',
    categoryName: 'Chilled Drinks',
    name: 'Green Apple Soda Fizz',
    description: 'Crisp tart green apple syrup with fresh lime, crushed ice, and effervescent sparkling soda.',
    foodType: 'veg',
    price: 70,
    imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=600&h=400&q=80',
    isAvailable: true,
    preparationTimeMinutes: 3,
    calories: 85
  }
];

export const INITIAL_STAFF: Staff[] = [
  { id: 'stf_1', restaurantId: 'rest_craverse_blr', name: 'Vikramaditya Roy', email: 'vikram.roy@craverse.com', role: 'owner', phone: '+91 98450 11223', isActive: true },
  { id: 'stf_2', restaurantId: 'rest_craverse_blr', name: 'Priya Sharma', email: 'priya.sharma@craverse.com', role: 'manager', phone: '+91 98450 22334', isActive: true },
  { id: 'stf_3', restaurantId: 'rest_craverse_blr', name: 'Chef Sanjeev Nair', email: 'chef.sanjeev@craverse.com', role: 'kitchen', phone: '+91 98450 33445', isActive: true },
  { id: 'stf_4', restaurantId: 'rest_craverse_blr', name: 'Rohan Deshmukh', email: 'rohan.d@craverse.com', role: 'waiter', phone: '+91 98450 44556', isActive: true, assignedFloorId: 'floor_patio' },
  { id: 'stf_5', restaurantId: 'rest_craverse_blr', name: 'Ananya Verma', email: 'ananya.v@craverse.com', role: 'cashier', phone: '+91 98450 55667', isActive: true },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'inv_1', restaurantId: 'rest_craverse_blr', name: 'Amul Mozzarella Pizza Cheese', category: 'Dairy', currentStock: 25.0, minThreshold: 10, unit: 'kg', costPerUnit: 440, supplierName: 'Karnataka Milk Federation', lastUpdated: '2026-10-31' },
  { id: 'inv_2', restaurantId: 'rest_craverse_blr', name: 'Fresh Malai Paneer', category: 'Dairy', currentStock: 18.0, minThreshold: 8, unit: 'kg', costPerUnit: 340, supplierName: 'Milky Mist Distributor', lastUpdated: '2026-10-31' },
  { id: 'inv_3', restaurantId: 'rest_craverse_blr', name: 'Specialty Arabica Coffee Beans', category: 'Beverages', currentStock: 15.0, minThreshold: 5, unit: 'kg', costPerUnit: 780, supplierName: 'Chikmagalur Coffee Co.', lastUpdated: '2026-10-31' },
  { id: 'inv_4', restaurantId: 'rest_craverse_blr', name: 'Organic Sweet Corn', category: 'Produce', currentStock: 20.0, minThreshold: 8, unit: 'kg', costPerUnit: 80, supplierName: 'Mandi Fresh Produce', lastUpdated: '2026-10-31' },
  { id: 'inv_5', restaurantId: 'rest_craverse_blr', name: 'Daawat Aged Basmati Rice', category: 'Grains', currentStock: 50.0, minThreshold: 20, unit: 'kg', costPerUnit: 110, supplierName: 'Agro Foods Agency', lastUpdated: '2026-10-31' },
  { id: 'inv_6', restaurantId: 'rest_craverse_blr', name: 'Fresh Mint & Lemons', category: 'Produce', currentStock: 6.0, minThreshold: 3, unit: 'kg', costPerUnit: 70, supplierName: 'Local Market', lastUpdated: '2026-10-31' },
];

export const INITIAL_COUPONS: Coupon[] = [
  { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minOrderValue: 150, maxDiscount: 50, description: '10% off on your café order above ₹150', isActive: true },
  { code: 'PIZZA20', discountType: 'percentage', discountValue: 20, minOrderValue: 250, maxDiscount: 80, description: '20% off on pizza & snacks above ₹250', isActive: true },
  { code: 'FLAT30', discountType: 'flat', discountValue: 30, minOrderValue: 199, description: 'Flat ₹30 off on orders above ₹199', isActive: true }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_1001',
    orderNumber: '#CRV-89412',
    restaurantId: 'rest_craverse_blr',
    branchId: 'br_indiranagar',
    tableId: 'tbl_16',
    tableNumber: '16',
    customerName: 'Table Guest',
    customerPhone: '+91 98451 22334',
    sessionId: 'sess_live_16',
    items: [
      {
        id: 'oi_1',
        productId: 'prod_margherita_pizza',
        productName: 'Classic Margherita Basil Pizza',
        foodType: 'veg',
        imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&h=400&q=80',
        variantName: 'Regular 7-inch',
        customizationDetails: ['Classic Thin Crust'],
        unitPrice: 150,
        quantity: 1,
        totalPrice: 150,
        status: 'preparing'
      },
      {
        id: 'oi_2',
        productId: 'prod_cheese_garlic_bread',
        productName: 'Cheesy Garlic Breadsticks',
        foodType: 'veg',
        imageUrl: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?auto=format&fit=crop&w=600&h=400&q=80',
        variantName: '4 Pieces',
        customizationDetails: [],
        unitPrice: 90,
        quantity: 1,
        totalPrice: 90,
        status: 'accepted'
      },
      {
        id: 'oi_3',
        productId: 'prod_cold_coffee',
        productName: 'Thick Cold Coffee with Ice Cream',
        foodType: 'veg',
        imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&h=400&q=80',
        customizationDetails: [],
        unitPrice: 95,
        quantity: 2,
        totalPrice: 190,
        status: 'accepted'
      }
    ],
    // Total Subtotal = 150 + 90 + 190 = 430
    subtotal: 430,
    discountAmount: 43,
    couponCode: 'WELCOME10',
    // ZERO GST & ZERO SERVICE CHARGE
    cgstAmount: 0,
    sgstAmount: 0,
    serviceChargeAmount: 0,
    totalAmount: 387,
    status: 'preparing',
    paymentStatus: 'pending',
    notes: 'Table 16 - Please serve cold coffees together with garlic bread.',
    placedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    estimatedPrepTimeMinutes: 12,
    statusHistory: [
      { status: 'placed', timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), note: 'Order submitted from Table 16' },
      { status: 'accepted', timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(), note: 'Kitchen accepted ticket' },
      { status: 'preparing', timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(), note: 'Oven & beverage prep started' }
    ]
  }
];
