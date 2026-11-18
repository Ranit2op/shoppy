// services/api.js - Shoppy E-Commerce API Service

const BASE_URL = 'https://fakestoreapi.com';

// Add discounts deterministically for products
const enrichProduct = (p) => {
  if (!p) return null;
  const discountPercentages = [10, 15, 20, 25, 30, 40, 50];
  const discount = discountPercentages[p.id % discountPercentages.length];
  return {
    ...p,
    discount,
    priceInINR: Math.round(p.price * 85),
  };
};

export const fetchAllProducts = async () => {
  try {
    const res = await fetch(`${BASE_URL}/products`);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data.map(enrichProduct) : [];
  } catch (err) {
    console.error('Error fetching all products:', err);
    return [];
  }
};

export const fetchProductsByCategory = async (category) => {
  try {
    if (!category || category.toLowerCase() === 'all') {
      return await fetchAllProducts();
    }
    const url = `${BASE_URL}/products/category/${encodeURIComponent(category.toLowerCase())}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data.map(enrichProduct) : [];
  } catch (err) {
    console.error('Error fetching products by category:', err);
    return [];
  }
};

export const fetchProductById = async (id) => {
  try {
    if (!id) return null;
    const res = await fetch(`${BASE_URL}/products/${encodeURIComponent(id)}`);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const data = await res.json();
    return enrichProduct(data);
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    return null;
  }
};

export const fetchCategories = async () => {
  try {
    const res = await fetch(`${BASE_URL}/products/categories`);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const data = await res.json();
    return ['all', ...(Array.isArray(data) ? data : [])];
  } catch (err) {
    console.error('Error fetching categories:', err);
    return ['all', 'electronics', 'jewelery', "men's clothing", "women's clothing"];
  }
};
