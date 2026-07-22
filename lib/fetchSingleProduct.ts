import { getApiUrl } from './api';

const fetchSingleProductCache: Record<string, any> = {};

export async function fetchSingleProduct(id: string, bypassCache = false) {
  if (!id) {
    throw new Error('Product ID is required');
  }

  if (!bypassCache && fetchSingleProductCache[id]) {
    return fetchSingleProductCache[id];
  }

  const url = getApiUrl(`/api/product?id=${encodeURIComponent(id)}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch product ${id}: ${response.statusText}`);
  }

  const data = await response.json();
  fetchSingleProductCache[id] = data;
  return data;
}
