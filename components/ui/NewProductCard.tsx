import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { NewProduct } from '../../lib/products';

interface NewProductCardProps {
  product: NewProduct;
  cartQty: number;
  onUpdateQty: (delta: number) => void;
  onPress: () => void;
  isGrid: boolean;
  onBuyNow?: () => void;
}

const TAG_BG = '#1E3A5F';
const TAG_COLOR = '#fff';
const THEME = '#D74A33';

export const NewProductCard: React.FC<NewProductCardProps> = ({
  product,
  cartQty,
  onUpdateQty,
  onPress,
  isGrid,
  onBuyNow,
}) => {
  const discountedPrice = product.offer
    ? (product.price * (1 - product.offer / 100)).toFixed(2)
    : null;

  // ── Shared sub-components ────────────────────────────────────────────────

  const ImageFrame = ({ fullWidth }: { fullWidth: boolean }) => (
    <View
      style={{ width: fullWidth ? '100%' : '100%', aspectRatio: 3 / 4 }}
      className="relative bg-slate-50"
    >
      <Image
        source={product.rootImage}
        contentFit="cover"
        style={{ width: '100%', height: '100%' }}
      />
      {product.offer && (
        <View
          className="absolute px-2 py-0.5 rounded-full"
          style={{
            top: fullWidth ? 12 : 8,
            left: fullWidth ? 12 : 8,
            backgroundColor: THEME,
          }}
        >
          <Text className="font-black text-white" style={{ fontSize: fullWidth ? 10 : 9 }}>
            {product.offer}% OFF
          </Text>
        </View>
      )}
      <View
        className="absolute px-2 py-0.5 rounded-full"
        style={{
          bottom: fullWidth ? 12 : 8,
          right: fullWidth ? 12 : 8,
          backgroundColor: TAG_BG,
        }}
      >
        <Text
          className="font-black uppercase tracking-wider"
          style={{ color: TAG_COLOR, fontSize: fullWidth ? 9 : 8 }}
        >
          {product.tag}
        </Text>
      </View>
    </View>
  );

  const QtyControl = ({ compact, fullWidth = false }: { compact: boolean; fullWidth?: boolean }) => (
    <View
      className="flex-row items-center border border-slate-200 overflow-hidden"
      style={{
        borderRadius: compact ? 8 : 12,
        ...(fullWidth ? { width: '100%' } : { height: 40 }),
      }}
    >
      <Pressable
        onPress={() => onUpdateQty(-1)}
        className="bg-slate-50 items-center justify-center"
        style={fullWidth
          ? { paddingVertical: compact ? 8 : 10, paddingHorizontal: compact ? 14 : 18 }
          : { paddingHorizontal: 14, alignSelf: 'stretch', justifyContent: 'center' }}
      >
        <Text className="font-black text-slate-700" style={{ fontSize: compact ? 14 : 15 }}>−</Text>
      </Pressable>
      <View
        className="items-center justify-center"
        style={fullWidth
          ? { flex: 1 }
          : { paddingHorizontal: 12, alignSelf: 'stretch', justifyContent: 'center' }}
      >
        <Text className="font-black text-slate-800" style={{ fontSize: compact ? 11 : 13 }}>
          {cartQty}
        </Text>
      </View>
      <Pressable
        onPress={() => onUpdateQty(1)}
        className="bg-slate-50 items-center justify-center"
        style={fullWidth
          ? { paddingVertical: compact ? 8 : 10, paddingHorizontal: compact ? 14 : 18 }
          : { paddingHorizontal: 14, alignSelf: 'stretch', justifyContent: 'center' }}
      >
        <Text className="font-black text-slate-700" style={{ fontSize: compact ? 14 : 15 }}>+</Text>
      </Pressable>
    </View>
  );

  // ── GRID layout ───────────────────────────────────────────────────────────
  if (isGrid) {
    return (
      <Pressable
        onPress={onPress}
        className="bg-white border border-slate-100 rounded-2xl overflow-hidden"
        style={{ width: '48%', marginBottom: 14 }}
      >
        <ImageFrame fullWidth={false} />

        <View className="p-2.5 gap-1">
          {/* Brand + Rating */}
          <View className="flex-row items-center justify-between">
            <Text className="text-[8px] font-black text-slate-400 uppercase tracking-widest" numberOfLines={1}>
              {product.brand}
            </Text>
            <View className="flex-row items-center gap-0.5">
              <Ionicons name="star" size={8} color="#F59E0B" />
              <Text className="text-[8px] font-black text-slate-600">{product.rating}</Text>
            </View>
          </View>

          {/* Name */}
          <Text className="text-[10.5px] font-black text-slate-800 leading-tight" numberOfLines={2}>
            {product.name}
          </Text>

          {/* Subtitle */}
          <Text className="text-[8px] text-slate-400 font-medium leading-tight" numberOfLines={2}>
            {product.subtitle}
          </Text>

          {/* Badges */}
          <View className="flex-row flex-wrap gap-1 mt-0.5">
            {product.badges.slice(0, 3).map((badge, i) => (
              <View key={i} className="bg-slate-100 px-1.5 py-0.5 rounded">
                <Text className="text-[7px] font-bold text-slate-500">{badge}</Text>
              </View>
            ))}
          </View>

          {/* Price */}
          <View className="flex-row items-center gap-1.5 mt-1">
            {discountedPrice ? (
              <>
                <Text className="text-[12px] font-black" style={{ color: THEME }}>${discountedPrice}</Text>
                <Text className="text-[9px] text-slate-400 line-through">${product.price.toFixed(2)}</Text>
              </>
            ) : (
              <Text className="text-[12px] font-black text-slate-800">${product.price.toFixed(2)}</Text>
            )}
          </View>

          {/* Add to Cart / Qty */}
          {cartQty === 0 ? (
            <Pressable
              onPress={() => onUpdateQty(1)}
              className="mt-1 bg-black rounded-lg items-center"
              style={{ paddingVertical: 9 }}
            >
              <Text className="text-[9px] font-black text-white uppercase tracking-widest">Add to Cart</Text>
            </Pressable>
          ) : (
            <View className="mt-1">
              <QtyControl compact={true} fullWidth={true} />
            </View>
          )}

          {/* Buy Now */}
          <Pressable
            onPress={() => {
              if (cartQty === 0) onUpdateQty(1);
              if (onBuyNow) onBuyNow();
            }}
            className="mt-1.5 rounded-lg items-center border"
            style={{ paddingVertical: 9, borderColor: THEME }}
          >
            <Text className="text-[9px] font-black uppercase tracking-widest" style={{ color: THEME }}>
              Buy Now
            </Text>
          </Pressable>
        </View>
      </Pressable>
    );
  }

  // ── LIST layout (full-width vertical) ─────────────────────────────────────
  return (
    <Pressable
      onPress={onPress}
      className="bg-white border border-slate-100 rounded-2xl overflow-hidden mb-4"
    >
      <ImageFrame fullWidth={true} />

      <View className="p-4 gap-2">
        {/* Brand + Rating */}
        <View className="flex-row items-center justify-between">
          <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{product.brand}</Text>
          <View className="flex-row items-center gap-1">
            <Ionicons name="star" size={10} color="#F59E0B" />
            <Text className="text-[10px] font-black text-slate-600">{product.rating}</Text>
          </View>
        </View>

        {/* Name */}
        <Text className="text-[15px] font-black text-slate-800 leading-snug">{product.name}</Text>

        {/* Subtitle */}
        <Text className="text-[11px] text-slate-500 font-medium leading-relaxed">{product.subtitle}</Text>

        {/* Badges */}
        <View className="flex-row flex-wrap gap-1.5">
          {product.badges.map((badge, i) => (
            <View key={i} className="bg-slate-100 px-2 py-1 rounded-lg">
              <Text className="text-[9px] font-bold text-slate-500">{badge}</Text>
            </View>
          ))}
        </View>

        {/* Price + Buttons */}
        <View className="flex-row items-center justify-between mt-1 pt-3 border-t border-slate-100">
          {/* Price */}
          <View>
            {discountedPrice ? (
              <View className="gap-0.5">
                <Text className="text-[18px] font-black" style={{ color: THEME }}>${discountedPrice}</Text>
                <Text className="text-[11px] text-slate-400 line-through">Was ${product.price.toFixed(2)}</Text>
              </View>
            ) : (
              <Text className="text-[18px] font-black text-slate-800">${product.price.toFixed(2)}</Text>
            )}
          </View>

          {/* Buttons right side */}
          {cartQty === 0 ? (
            <View className="flex-row items-center gap-2">
              <Pressable
                onPress={() => onUpdateQty(1)}
                className="bg-black rounded-xl"
                style={{ paddingHorizontal: 16, paddingVertical: 10 }}
              >
                <Text className="text-[10px] font-black text-white uppercase tracking-widest">Add to Cart</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  if (cartQty === 0) onUpdateQty(1);
                  if (onBuyNow) onBuyNow();
                }}
                className="rounded-xl border"
                style={{ paddingHorizontal: 16, paddingVertical: 10, borderColor: THEME }}
              >
                <Text className="text-[10px] font-black uppercase tracking-widest" style={{ color: THEME }}>Buy Now</Text>
              </Pressable>
            </View>
          ) : (
            <View className="flex-row gap-2" style={{ alignItems: 'center' }}>
              <QtyControl compact={false} fullWidth={false} />
              <Pressable
                onPress={() => {
                  if (cartQty === 0) onUpdateQty(1);
                  if (onBuyNow) onBuyNow();
                }}
                className="rounded-xl border items-center justify-center"
                style={{ height: 40, paddingHorizontal: 16, borderColor: THEME }}
              >
                <Text className="text-[10px] font-black uppercase tracking-widest" style={{ color: THEME }}>Buy Now</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default NewProductCard;
