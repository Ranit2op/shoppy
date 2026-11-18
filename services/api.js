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
    priceInINR: p.priceInINR || Math.round((p.price || 15) * 85),
  };
};

export const FALLBACK_PRODUCTS = [
  {
    id: 1,
    title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    price: 109.95,
    priceInINR: 2499,
    description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
    rating: { rate: 4.5, count: 180 },
    discount: 25,
  },
  {
    id: 2,
    title: "Mens Casual Premium Slim Fit T-Shirt",
    price: 22.3,
    priceInINR: 699,
    description: "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, lightweight & soft fabric.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png",
    rating: { rate: 4.1, count: 259 },
    discount: 30,
  },
  {
    id: 3,
    title: "Mens Cotton Classic Bomber Jacket",
    price: 55.99,
    priceInINR: 1999,
    description: "Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions such as working, hiking, and travel.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png",
    rating: { rate: 4.7, count: 500 },
    discount: 40,
  },
  {
    id: 5,
    title: "John Hardy Women's Naga Dragon Silver Bracelet",
    price: 695,
    priceInINR: 4999,
    description: "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl.",
    category: "jewelery",
    image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png",
    rating: { rate: 4.6, count: 400 },
    discount: 15,
  },
  {
    id: 6,
    title: "Solid Gold Petite Diamond Band Ring",
    price: 168,
    priceInINR: 2999,
    description: "Satisfaction Guaranteed. Return or exchange any order within 30 days. Handcrafted elegance.",
    category: "jewelery",
    image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_t.png",
    rating: { rate: 4.3, count: 120 },
    discount: 20,
  },
  {
    id: 9,
    title: "WD 2TB Elements Portable External Hard Drive - USB 3.0",
    price: 64,
    priceInINR: 3499,
    description: "USB 3.0 and USB 2.0 Compatibility. Fast data transfers. High capacity storage for PC and Mac.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_t.png",
    rating: { rate: 4.6, count: 450 },
    discount: 35,
  },
  {
    id: 10,
    title: "SanDisk SSD PLUS 1TB Internal Solid State Drive",
    price: 109,
    priceInINR: 4299,
    description: "Easy upgrade for faster boot-up, shutdown, application load and response. Sequential read speeds up to 535MB/s.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_t.png",
    rating: { rate: 4.8, count: 512 },
    discount: 50,
  },
  {
    id: 14,
    title: "Samsung 49-Inch Curved Gaming QLED Monitor",
    price: 999.99,
    priceInINR: 34999,
    description: "49-inch super ultrawide 32:9 curved gaming monitor with dual 27-inch screen side-by-side, 144Hz refresh rate.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_t.png",
    rating: { rate: 4.9, count: 320 },
    discount: 20,
  },
  {
    id: 17,
    title: "Rain Jacket Women Windbreaker Striped Climbing Coat",
    price: 39.99,
    priceInINR: 1299,
    description: "Lightweight perfect for casual or travel wear. Long sleeve with hooded, adjustable drawstring waist design.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2t.png",
    rating: { rate: 4.2, count: 210 },
    discount: 30,
  },
  {
    id: 18,
    title: "MBJ Women's Solid Short Sleeve Boat Neck Top",
    price: 9.85,
    priceInINR: 499,
    description: "Lightweight fabric with great stretch for comfort. Ribbed on sleeves and neckline with double stitching on bottom hem.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png",
    rating: { rate: 4.5, count: 180 },
    discount: 50,
  },
];

const fetchWithTimeout = async (url, options = {}, timeoutMs = 6000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export const fetchAllProducts = async () => {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/products`);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.map(enrichProduct);
    }
    return FALLBACK_PRODUCTS.map(enrichProduct);
  } catch (err) {
    console.warn('Network request failed, using fallback catalog:', err.message);
    return FALLBACK_PRODUCTS.map(enrichProduct);
  }
};

export const fetchProductsByCategory = async (category) => {
  try {
    if (!category || category.toLowerCase() === 'all') {
      return await fetchAllProducts();
    }
    const url = `${BASE_URL}/products/category/${encodeURIComponent(category.toLowerCase())}`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.map(enrichProduct);
    }
    // Filter fallback
    const filtered = FALLBACK_PRODUCTS.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
    return (filtered.length > 0 ? filtered : FALLBACK_PRODUCTS).map(enrichProduct);
  } catch (err) {
    console.warn('Network request failed for category, using fallback:', err.message);
    const filtered = FALLBACK_PRODUCTS.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
    return (filtered.length > 0 ? filtered : FALLBACK_PRODUCTS).map(enrichProduct);
  }
};

export const fetchProductById = async (id) => {
  try {
    if (!id) return null;
    const res = await fetchWithTimeout(`${BASE_URL}/products/${encodeURIComponent(id)}`);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const data = await res.json();
    return enrichProduct(data);
  } catch (err) {
    console.warn('Network request failed for product id, searching fallback:', err.message);
    const found = FALLBACK_PRODUCTS.find((p) => String(p.id) === String(id));
    return found ? enrichProduct(found) : enrichProduct(FALLBACK_PRODUCTS[0]);
  }
};

export const fetchCategories = async () => {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/products/categories`);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const data = await res.json();
    return ['all', ...(Array.isArray(data) ? data : [])];
  } catch (err) {
    return ['all', 'electronics', 'jewelery', "men's clothing", "women's clothing"];
  }
};
