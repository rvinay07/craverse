import test from 'node:test';
import assert from 'node:assert';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_RESTAURANT } from '../data/mockData.ts';

test('Craverse should be 100% Pure Vegetarian with zero non-veg or alcohol items', () => {
  assert.ok(INITIAL_PRODUCTS.length >= 15, 'Menu should contain a rich selection of pure veg items');

  const nonVegWords = ['chicken', 'mutton', 'beef', 'pork', 'fish', 'prawn', 'egg', 'bacon', 'beer', 'whiskey', 'vodka', 'rum', 'wine', 'cocktail', 'bar'];

  INITIAL_PRODUCTS.forEach((product) => {
    assert.strictEqual(product.foodType, 'veg', `${product.name} must be classified as 100% veg`);

    const lowerName = product.name.toLowerCase();
    const lowerDesc = product.description.toLowerCase();

    nonVegWords.forEach((word) => {
      // Allow words like "barrel" or "bartender" if any, but ensure no meat/alcohol
      assert.ok(
        !lowerName.split(' ').includes(word),
        `Product name "${product.name}" should not contain non-veg or alcohol term: "${word}"`
      );
      assert.ok(
        !lowerDesc.split(' ').includes(word),
        `Product description for "${product.name}" should not contain non-veg or alcohol term: "${word}"`
      );
    });
  });
});

test('Dishes and drinks pricing should be reasonable (under ₹350)', () => {
  INITIAL_PRODUCTS.forEach((p) => {
    assert.ok(p.price > 0, `${p.name} must have a positive price`);
    assert.ok(p.price <= 350, `${p.name} price (₹${p.price}) should be reasonable and affordable`);
    if (p.discountedPrice) {
      assert.ok(p.discountedPrice < p.price, `${p.name} discounted price should be less than base price`);
    }
  });
});

test('Categories should strictly cover snacks, pizza, rice, and coffees/drinks', () => {
  const allowedCategoryIds = ['cat_snacks', 'cat_pizza', 'cat_rice', 'cat_coffee', 'cat_beverages'];

  INITIAL_CATEGORIES.forEach((cat) => {
    assert.ok(allowedCategoryIds.includes(cat.id), `Category "${cat.name}" (${cat.id}) should be part of allowed Craverse menu`);
  });

  // Verify all products map to an existing active category
  INITIAL_PRODUCTS.forEach((prod) => {
    const foundCat = INITIAL_CATEGORIES.find((c) => c.id === prod.categoryId);
    assert.ok(foundCat, `Product "${prod.name}" must map to a valid category`);
  });
});

test('Restaurant branding matches Craverse and tagline', () => {
  assert.strictEqual(INITIAL_RESTAURANT.name, 'Craverse');
  assert.strictEqual(INITIAL_RESTAURANT.tagline, 'Your Universe of Flavours.');
  assert.strictEqual(INITIAL_RESTAURANT.logo, '/craverse-logo.jpg');
});
