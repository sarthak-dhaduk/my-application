import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { CATEGORIES, PRODUCTS } from './constants';
import { Product, Cart } from './types';
import { ProductCard } from './ProductCard';

interface CatalogViewProps {
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  activeSubCategory: string;
  setActiveSubCategory: (subCat: string) => void;
  setSelectedProduct: (product: Product | null) => void;
  cart: Cart;
  updateCartQty: (id: string, delta: number, product: Product) => void;
  triggerLightHaptic: () => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  selectedCategoryId,
  setSelectedCategoryId,
  activeSubCategory,
  setActiveSubCategory,
  setSelectedProduct,
  cart,
  updateCartQty,
  triggerLightHaptic,
}) => {
  const activeCategoryObj = CATEGORIES.find((c) => c.id === selectedCategoryId) || CATEGORIES[0];

  const filteredProducts = PRODUCTS.filter((p) => {
    if (p.category !== selectedCategoryId) return false;
    if (activeSubCategory === 'ALL') return true;
    return p.subCategory === activeSubCategory;
  });

  const subCategories = [
    'ALL',
    ...Array.from(
      new Set(
        PRODUCTS.filter((p) => p.category === selectedCategoryId).map((p) => p.subCategory)
      )
    ),
  ];

  return (
    <ScrollView key="catalog-scroll" className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Category Detail Hero Section */}
      <View className="bg-gradient-to-br from-[#161C30] via-[#0E1325] to-[#0A0F1D] border-b border-white/10 px-6 py-8 relative overflow-hidden">
        {activeCategoryObj.heroBg ? (
          <Image
            source={activeCategoryObj.heroBg}
            contentFit="cover"
            style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, opacity: 0.3 }}
          />
        ) : (
          <View className="absolute right-0 top-0 w-48 h-48 bg-[#3B82F6]/5 rounded-none blur-[60px]" />
        )}
        <Text className="text-xs text-[#3B82F6] font-extrabold uppercase tracking-widest mb-1.5">
          VoltLine B2B Catalog
        </Text>
        <Text className="text-3xl font-extrabold text-white">
          {activeCategoryObj.title}
        </Text>
        <Text className="text-sm font-bold text-amber-500 mt-1 italic">
          {activeCategoryObj.tagline}
        </Text>
        <Text className="text-gray-400 text-xs mt-3 leading-relaxed">
          {activeCategoryObj.desc}
        </Text>
        
        {/* Feature Tags Pill List */}
        <View className="flex-row flex-wrap mt-4">
          {activeCategoryObj.tags.map((tag, idx) => (
            <View key={idx} className="bg-white/5 border border-white/10 px-3 py-1 rounded-none mr-2 mb-2">
              <Text className="text-[10px] text-gray-300 font-semibold">{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Subcategories Horizontal Scroll Filter */}
      <View className="py-4 bg-[#090D1A]">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6">
          {subCategories.map((sub, idx) => (
            <Pressable
              key={idx}
              onPress={() => {
                triggerLightHaptic();
                setActiveSubCategory(sub);
              }}
              className={`px-4 py-2 rounded-none mr-2.5 border ${
                activeSubCategory === sub
                  ? 'bg-white border-white'
                  : 'bg-[#121829] border-white/5'
              }`}
            >
              <Text className={`text-xs font-bold ${activeSubCategory === sub ? 'text-[#090D1A]' : 'text-gray-400'}`}>
                {sub}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Product Cards Grid List */}
      <View className="px-6 pb-12">
        {filteredProducts.length === 0 ? (
          <View className="py-12 items-center justify-center">
            <Text className="text-gray-500 text-sm">No items in this category yet.</Text>
          </View>
        ) : (
          filteredProducts.map((product) => {
            const cartQty = cart[product.id] || 0;
            return (
              <ProductCard
                key={product.id}
                product={product}
                cartQty={cartQty}
                onUpdateQty={(delta) => updateCartQty(product.id, delta, product)}
                onPress={() => {
                  triggerLightHaptic();
                  setSelectedProduct(product);
                }}
              />
            );
          })
        )}
      </View>
    </ScrollView>
  );
};
export default CatalogView;
