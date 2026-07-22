import { NEW_PRODUCTS } from './products';

export async function fetchSingleProduct(id: string) {
  if (!id) {
    throw new Error('Product ID is required');
  }

  const product = NEW_PRODUCTS.find(p => p.id === id);
  if (!product) {
    throw new Error(`Product not found with ID ${id}`);
  }

  // Simulate minimal layout delay so skeletons show smoothly
  await new Promise(resolve => setTimeout(resolve, 300));

  return product;
}
