import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Product } from './types';

interface ProductCardProps {
  product: Product;
  cartQty: number;
  onUpdateQty: (delta: number) => void;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cartQty,
  onUpdateQty,
  onPress,
}) => {
  const [activeImg, setActiveImg] = useState(0);
  const gallery = product.images ?? [product.image];

  const hasOffer = product.badge === 'offer' || !!product.offerPercentage;
  const isBestSeller = product.badge === 'best-seller' || product.rating >= 4.8;
  const isNew = product.badge === 'new-collection';

  const finalUnitPrice = hasOffer && product.offerPercentage
    ? product.unitPrice * (1 - product.offerPercentage / 100)
    : product.unitPrice;

  const packPrice = finalUnitPrice * product.packSize;

  const triggerLightHaptic = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
  };

  return (
    <View className="bg-[#121829] border border-white/5 rounded-none p-4 mb-5 shadow-lg relative overflow-hidden">
      {/* Top Accent Line */}
      <View 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: '#3B82F6',
        }}
      />

      <Pressable onPress={onPress} className="active:opacity-95">
        {/* Image Container */}
        <View className="relative w-full aspect-[4/3] rounded-none overflow-hidden bg-[#161C30] mb-4">
          {/* Render Image (local asset or fallback icon container) */}
          {gallery[activeImg] ? (
            <Image
              source={gallery[activeImg]}
              contentFit="cover"
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <View className="absolute inset-0 items-center justify-center">
              <Text className="text-5xl">{product.icon}</Text>
            </View>
          )}

          {/* Left-side Dot Indicators for Gallery (Only if multiple images exist) */}
          {gallery.length > 1 && (
            <View className="absolute left-3 top-1/2 -translate-y-1/2 flex-col gap-2.5 z-10 bg-black/40 backdrop-blur-md px-2 py-3 rounded-none">
              {gallery.map((_, i) => (
                <Pressable
                  key={i}
                  onPress={() => {
                    triggerLightHaptic();
                    setActiveImg(i);
                  }}
                  className="w-5 h-5 items-center justify-center"
                >
                  <View
                    className={`rounded-none transition-all duration-200 ${
                      activeImg === i
                        ? 'w-3 h-3 bg-[#3B82F6]'
                        : 'w-2 h-2 bg-neutral-600 border border-white/30'
                    }`}
                  />
                </Pressable>
              ))}
            </View>
          )}

          {/* Badge Stack (top-left) */}
          <View className="absolute top-3 left-3 flex-col gap-1.5">
            {isBestSeller && (
              <View className="bg-[#1e3a5f] border border-[#3b82f6]/30 px-2.5 py-1 rounded-none shadow-sm">
                <Text className="text-[8px] font-black uppercase tracking-[0.15em] text-white">Best Seller</Text>
              </View>
            )}
            {hasOffer && product.offerPercentage && (
              <View className="bg-rose-600 px-2.5 py-1 rounded-none shadow-md flex-row items-baseline">
                <Text className="text-[12px] font-black text-white">{product.offerPercentage}%</Text>
                <Text className="text-[8px] font-bold uppercase tracking-[0.1em] text-white ml-0.5 opacity-90">Off</Text>
              </View>
            )}
            {isNew && (
              <View className="bg-indigo-600 px-2.5 py-1 rounded-none shadow-sm">
                <Text className="text-[8px] font-black uppercase tracking-[0.15em] text-white">New Collection</Text>
              </View>
            )}
          </View>

          {/* Unit Price Badge (top-right) */}
          <View className="absolute top-3 right-3 bg-black/45 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-none shadow-lg items-end">
            {hasOffer ? (
              <View className="items-end leading-none">
                <Text className="text-[9px] text-white/50 line-through">${product.unitPrice.toFixed(2)}</Text>
                <Text className="text-white text-xs font-bold">${finalUnitPrice.toFixed(2)}/u</Text>
              </View>
            ) : (
              <Text className="text-white text-xs font-bold">${product.unitPrice.toFixed(2)}/u</Text>
            )}
            <Text className="text-gray-400 text-[8px] mt-0.5">Pack of {product.packSize}</Text>
          </View>
        </View>

        {/* Info Section */}
        <View className="px-1">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-[10px] text-[#3B82F6] font-bold uppercase tracking-wider">{product.subCategory}</Text>
            <Text className="text-[10px] text-gray-500 font-semibold">★ {product.rating}</Text>
          </View>
          <Text className="text-lg font-bold text-white mb-1.5">{product.name}</Text>
          <Text className="text-gray-400 text-xs leading-relaxed mb-4" numberOfLines={2}>
            {product.description}
          </Text>
        </View>
      </Pressable>

      <View className="px-1">
        <View className="h-[1px] bg-white/5 mb-4" />

        {/* B2B Wholesale Info & Stepper Controls */}
        <View className="flex-row justify-between items-center">
          <View className="flex-1 pr-2">
            <Text className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Pack wholesale price</Text>
            <Text className="text-lg font-extrabold text-white mt-0.5">${packPrice.toFixed(2)}</Text>
            <Text className="text-[9px] text-amber-500 font-semibold mt-0.5">Min. Order: {product.moq} Pack{product.moq > 1 ? 's' : ''}</Text>
          </View>

          {/* Quantity Selector Stepper */}
          <View className="items-end">
            <View className="flex-row items-center bg-[#161C30] border border-white/10 rounded-none overflow-hidden h-9 px-1">
              <Pressable
                onPress={() => onUpdateQty(-1)}
                className="w-8 h-8 rounded-none items-center justify-center active:bg-white/10"
              >
                <Ionicons name="remove" size={16} color={cartQty > 0 ? '#3B82F6' : '#475569'} />
              </Pressable>
              <Text className={`w-8 text-center font-bold text-xs ${cartQty > 0 ? 'text-white' : 'text-slate-500'}`}>
                {cartQty}
              </Text>
              <Pressable
                onPress={() => onUpdateQty(1)}
                className="w-8 h-8 rounded-none items-center justify-center active:bg-white/10"
              >
                <Ionicons name="add" size={16} color="#3B82F6" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Accent Line */}
      <View 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: '#3B82F6',
        }}
      />
    </View>
  );
};
export default ProductCard;
