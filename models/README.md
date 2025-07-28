# Product API & Model Guide

## Product Model (with Discriminants)
- `models/Product.js`: Base product schema with category-based discriminants (e.g., Electronics).
- To add a new category, create a new file in `models/` (see `Clothing.js` for example).
- Existing data is not disturbed by new categories.

## API Route
- `app/api/products/route.js`:
  - `GET`: Fetch products with pagination (`?page=1&limit=10`).
  - `POST`: Create product (handles discriminants by `category`).

## Adding a New Category
1. Create a new file in `models/` (e.g., `models/Clothing.js`).
2. Define the schema and export the discriminator.
3. Use the `category` field in POST requests to create products of that type.

## Example POST Body
```json
{
  "name": "T-Shirt",
  "price": 19.99,
  "category": "Clothing",
  "size": "L",
  "material": "Cotton"
}
```

## Pagination
- Use `GET /api/products?page=2&limit=5` to fetch paginated products.

---

# Product Model Structure

- `Product.base.js`: Contains the base Product schema and model.
- `Sale.js`: Contains the embedded Sale schema used in Product.
- `TShirt.js`: Contains the TShirt discriminator schema and model, extending Product.
- `Product.js`: Exports the main Product and TShirt models for use in the application.

## Usage

Import from `Product.js` to access both Product and TShirt models:

```js
import { Product, TShirt } from './Product.js';
```

Each schema is separated for clarity and maintainability.

---

# Monthly Sales Tracking

- `MonthlySales.js`: Tracks monthly sales data with automatic cleanup after 1 year.

## Features
- Automatic order tracking by month and year
- Product-wise sales breakdown
- Daily sales within each month
- TTL index for automatic data cleanup after 1 year
- Built-in utility functions for easy data access

## Usage

```js
import MonthlySales from './MonthlySales.js';

// Track an order
await MonthlySales.trackOrder({
  items: [
    {
      productId: "product_id",
      productName: "Product Name",
      quantity: 2,
      finalPrice: 29.99,
      totalPrice: 59.98
    }
  ],
  totalAmount: 59.98,
  orderDate: new Date()
});

// Get current month stats
const currentMonth = await MonthlySales.getCurrentMonthStats();

// Get yearly stats
const yearData = await MonthlySales.getYearlyStats(2024);
```

This setup automatically manages data lifecycle and provides comprehensive sales analytics.
