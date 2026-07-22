import { NEW_PRODUCTS } from './products';

export interface FetchProductsParams {
  limit?: number;
  skip?: number;
  category?: string;
  tag?: string;
  search?: string;
  offerOnly?: boolean;
}

export async function fetchAllProducts(params: FetchProductsParams = {}) {
  const {
    limit = 4,
    skip = 0,
    category = '',
    tag = '',
    search = '',
    offerOnly = false
  } = params;

  let filtered = [...NEW_PRODUCTS];

  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (tag) {
    filtered = filtered.filter(p => p.tag.toLowerCase() === tag.toLowerCase());
  }
  if (offerOnly) {
    filtered = filtered.filter(p => p.offer !== undefined && p.offer !== null && p.offer > 0);
  }
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(s) ||
      p.brand.toLowerCase().includes(s) ||
      p.category.toLowerCase().includes(s)
    );
  }

  const total = filtered.length;
  const products = filtered.slice(skip, skip + limit);
  const hasMore = skip + products.length < total;

  // Simulate minimal layout delay so skeletons show smoothly
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    products,
    total,
    hasMore
  };
}
