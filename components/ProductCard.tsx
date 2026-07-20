import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Product } from './types';

interface ProductCardProps {
  product: Product;
  cartQty: number;
  onUpdateQty: (delta: number) => void;
  onPress: () => void;
  isGrid?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cartQty,
  onUpdateQty,
  onPress,
  isGrid = false,
}) => {
  const [activeImg, setActiveImg] = useState(0);
  const gallery = product.images ?? [product.image];

  const hasOffer = product.badge === 'offer' || !!product.offerPercentage;
  const isNew = product.badge === 'new-collection';
  const isBestSeller = (product.badge === 'best-seller' || product.rating >= 4.8) && !isNew;

  const finalUnitPrice = hasOffer && product.offerPercentage
    ? product.unitPrice * (1 - product.offerPercentage / 100)
    : product.unitPrice;

  const packPrice = finalUnitPrice * product.packSize;

  const triggerLightHaptic = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) { }
  };

  return (
    <View
      className={`bg-gray-50 border border-gray-100 rounded-none shadow-sm relative overflow-hidden ${isGrid ? 'p-2.5 mb-4' : 'p-4 mb-5'
        }`}
    >
      {/* Top Accent Line */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: '#D74A33',
        }}
      />

      <Pressable onPress={onPress} className="active:opacity-95">
        {/* Image Container (aspect 3:4 matching category images) */}
        <View
          className={`relative w-full rounded-none overflow-hidden bg-white border border-gray-100 ${isGrid ? 'aspect-[3/4] mb-2.5' : 'aspect-[3/4] mb-4'
            }`}
        >
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

          {/* Left-side Dot Indicators for Gallery (Only shown in list layout to prevent grid clutter) */}
          {gallery.length > 1 && !isGrid && (
            <View className="absolute left-2 top-1/2 -translate-y-1/2 flex-col gap-2 z-10 bg-black/50 px-1 py-2">
              {gallery.map((_, i) => (
                <Pressable
                  key={i}
                  onPress={() => {
                    triggerLightHaptic();
                    setActiveImg(i);
                  }}
                  className="w-4 h-4 items-center justify-center"
                >
                  <View
                    className={`rounded-none transition-all duration-200 ${activeImg === i
                        ? 'w-2.5 h-2.5 bg-[#D74A33]'
                        : 'w-1.5 h-1.5 bg-neutral-400 border border-white/20'
                      }`}
                  />
                </Pressable>
              ))}
            </View>
          )}

          {/* Badge Stack (top-left) */}
          <View className="absolute top-2 left-2 flex-col gap-1 z-10">
            {isBestSeller && (
              <View className="bg-black border border-black/10 px-1.5 py-0.5 rounded-none shadow-sm">
                <Text className="text-[7px] font-black uppercase tracking-[0.1em] text-white">Best Seller</Text>
              </View>
            )}
            {hasOffer && product.offerPercentage && (
              <View className="bg-[#D74A33] px-1.5 py-0.5 rounded-none shadow-sm flex-row items-baseline">
                <Text className="text-[9.5px] font-black text-white">{product.offerPercentage}%</Text>
                <Text className="text-[6.5px] font-bold uppercase tracking-[0.05em] text-white ml-0.5 opacity-90">Off</Text>
              </View>
            )}
            {isNew && (
              <View className="bg-neutral-800 px-1.5 py-0.5 rounded-none shadow-sm">
                <Text className="text-[7px] font-black uppercase tracking-[0.1em] text-white">New</Text>
              </View>
            )}
          </View>

          {/* Unit Price Badge (top-right, only shown in list layout to avoid overlaps on narrow grids) */}
          {!isGrid && (
            <View className="absolute top-3 right-3 bg-black px-2.5 py-1 rounded-none shadow-sm items-end z-10">
              {hasOffer ? (
                <View className="items-end leading-none">
                  <Text className="text-[9px] text-white/50 line-through">${product.unitPrice.toFixed(2)}</Text>
                  <Text className="text-white text-xs font-bold">${finalUnitPrice.toFixed(2)}/u</Text>
                </View>
              ) : (
                <Text className="text-white text-xs font-bold">${product.unitPrice.toFixed(2)}/u</Text>
              )}
              <Text className="text-neutral-300 text-[8px] mt-0.5">Pack of {product.packSize}</Text>
            </View>
          )}
        </View>

        {/* Info Section */}
        <View className="px-0.5">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-[9px] text-[#D74A33] font-bold uppercase tracking-wider">{product.subCategory}</Text>
            <Text className="text-[9px] text-slate-500 font-semibold">★ {product.rating}</Text>
          </View>

          <Text
            className={`font-extrabold text-black mb-1.5 ${isGrid ? 'text-[12.5px] leading-tight' : 'text-base'
              }`}
            numberOfLines={isGrid ? 1 : 2}
          >
            {product.name}
          </Text>

          {/* Description (Displayed in both layouts) */}
          <Text className="text-slate-600 text-xs leading-relaxed mb-4" numberOfLines={2}>
            {product.description}
          </Text>
        </View>
      </Pressable>

      <View className="px-0.5">
        <View className="h-[1px] bg-gray-200 mb-3" />

        {/* Price & Stepper Controls (Stacked in Grid, Side-by-Side in List) */}
        {isGrid ? (
          <View className="flex-col">
            <View className="mb-2">
              <Text className="text-[8.5px] text-slate-400 uppercase font-bold tracking-wider">Price</Text>
              <View className="flex-row items-baseline gap-1 mt-0.5">
                {hasOffer && (
                  <Text className="text-[9.5px] text-slate-400 line-through">${product.unitPrice.toFixed(2)}</Text>
                )}
                <Text className="text-sm font-black text-black">${finalUnitPrice.toFixed(2)}</Text>
              </View>
            </View>

            {/* Add to Cart and Buy Buttons Stacked Vertically */}
            <View className="flex-col gap-1.5 mt-2 w-full">
              <Pressable
                onPress={() => onUpdateQty(1)}
                className="w-full border border-[#D74A33] rounded-none py-2.5 items-center justify-center active:bg-red-50/50"
              >
                <Text className="text-[9.5px] font-black text-[#D74A33] uppercase tracking-wider">
                  {cartQty > 0 ? `In Cart (${cartQty})` : 'Add to Cart'}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  if (cartQty === 0) {
                    onUpdateQty(1);
                  }
                  onPress();
                }}
                className="w-full bg-[#D74A33] rounded-none py-2.5 items-center justify-center active:bg-[#C23C27]"
              >
                <Text className="text-[9.5px] font-black text-white uppercase tracking-wider">
                  Buy
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View className="flex-row justify-between items-center">
            <View className="flex-1 pr-2">
              <Text className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Price</Text>
              <View className="flex-row items-baseline gap-1 mt-0.5">
                {hasOffer && (
                  <Text className="text-[10.5px] text-slate-400 line-through">${product.unitPrice.toFixed(2)}</Text>
                )}
                <Text className="text-base font-black text-black">${finalUnitPrice.toFixed(2)}</Text>
              </View>
            </View>

            {/* Quantity Selector Stepper */}
            <View className="items-end">
              <View className="flex-row items-center bg-white border border-gray-200 rounded-none overflow-hidden h-9 px-1">
                <Pressable
                  onPress={() => onUpdateQty(-1)}
                  className="w-8 h-8 rounded-none items-center justify-center active:bg-gray-50"
                >
                  <Ionicons name="remove" size={16} color={cartQty > 0 ? '#D74A33' : '#CBD5E1'} />
                </Pressable>
                <Text className={`w-8 text-center font-bold text-xs ${cartQty > 0 ? 'text-black' : 'text-slate-400'}`}>
                  {cartQty}
                </Text>
                <Pressable
                  onPress={() => onUpdateQty(1)}
                  className="w-8 h-8 rounded-none items-center justify-center active:bg-gray-50"
                >
                  <Ionicons name="add" size={16} color="#D74A33" />
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Bottom Accent Line */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: '#D74A33',
        }}
      />
    </View>
  );
};

export default ProductCard;
