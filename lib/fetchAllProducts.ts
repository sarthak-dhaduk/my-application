import { getApiUrl } from './api';

const fetchAllProductsCache: Record<string, any> = {};

export interface FetchProductsParams {
  limit?: number;
  skip?: number;
  category?: string;
  tag?: string;
  search?: string;
  offerOnly?: boolean;
  bypassCache?: boolean;
}

export async function fetchAllProducts(params: FetchProductsParams = {}) {
  const {
    limit = 4,
    skip = 0,
    category = '',
    tag = '',
    search = '',
    offerOnly = false,
    bypassCache = false
  } = params;

  const cacheKey = JSON.stringify({ limit, skip, category, tag, search, offerOnly });

  if (!bypassCache && fetchAllProductsCache[cacheKey]) {
    return fetchAllProductsCache[cacheKey];
  }

  const queryParams = new URLSearchParams();
  queryParams.append('limit', limit.toString());
  queryParams.append('skip', skip.toString());
  if (category) queryParams.append('category', category);
  if (tag) queryParams.append('tag', tag);
  if (search) queryParams.append('search', search);
  if (offerOnly) queryParams.append('offerOnly', 'true');

  const url = getApiUrl(`/api/products?${queryParams.toString()}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const data = await response.json();
  fetchAllProductsCache[cacheKey] = data;
  return data;
}
