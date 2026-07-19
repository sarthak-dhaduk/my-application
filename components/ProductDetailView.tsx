import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Product, Cart } from './types';

interface ProductDetailViewProps {
  selectedProduct: Product;
  setSelectedProduct: (product: Product | null) => void;
  activeDetailImg: number;
  setActiveDetailImg: (index: number) => void;
  cart: Cart;
  updateCartQty: (id: string, delta: number, product: Product) => void;
  onPlaceOrderDirect: () => void;
  triggerLightHaptic: () => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  selectedProduct,
  setSelectedProduct,
  activeDetailImg,
  setActiveDetailImg,
  cart,
  updateCartQty,
  onPlaceOrderDirect,
  triggerLightHaptic,
}) => {
  const hasOffer = selectedProduct.badge === 'offer' || !!selectedProduct.offerPercentage;
  const finalUnitPrice = hasOffer && selectedProduct.offerPercentage
    ? selectedProduct.unitPrice * (1 - selectedProduct.offerPercentage / 100)
    : selectedProduct.unitPrice;

  const packPrice = finalUnitPrice * selectedProduct.packSize;
  const cartQty = cart[selectedProduct.id] || 0;

  return (
    <ScrollView key="detail-scroll" className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
      <View className="pb-12">
        {/* Header: Back & Category Tag */}
        <View className="flex-row justify-between items-center mb-6">
          <Pressable
            onPress={() => {
              triggerLightHaptic();
              setSelectedProduct(null);
            }}
            className="flex-row items-center bg-[#161C30] border border-white/10 px-4 py-2.5 rounded-none active:bg-white/10"
          >
            <Ionicons name="arrow-back" size={18} color="#3B82F6" />
            <Text className="text-white text-xs font-bold ml-1.5 uppercase tracking-wider">Back</Text>
          </Pressable>
          
          <View className="bg-[#3B82F6]/10 border border-[#3B82F6]/30 px-3.5 py-1.5 rounded-none">
            <Text className="text-[10px] text-[#3B82F6] font-black uppercase tracking-widest">
              {selectedProduct.subCategory}
            </Text>
          </View>
        </View>

        {/* Giant Sharp Gallery Section */}
        <View className="border border-white/5 rounded-none bg-[#121829] relative overflow-hidden mb-6">
          {/* Permanent Blue Accent Line */}
          <View 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              height: 3.5, 
              backgroundColor: '#3B82F6', 
              zIndex: 10 
            }} 
          />
          
          <View className="w-full aspect-square bg-[#161C30] items-center justify-center">
            {selectedProduct.images && selectedProduct.images[activeDetailImg] ? (
              <Image
                source={selectedProduct.images[activeDetailImg]}
                contentFit="cover"
                style={{ width: '100%', height: '100%' }}
              />
            ) : selectedProduct.image ? (
              <Image
                source={selectedProduct.image}
                contentFit="cover"
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <View className="items-center justify-center">
                <Text className="text-7xl mb-2">{selectedProduct.icon}</Text>
              </View>
            )}
          </View>
          
          {/* Permanent Blue Accent Line */}
          <View 
            style={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              height: 3.5, 
              backgroundColor: '#3B82F6', 
              zIndex: 10 
            }} 
          />
        </View>

        {/* Gallery Thumbnails (only if multiple images exist) */}
        {selectedProduct.images && selectedProduct.images.length > 1 && (
          <View className="flex-row gap-3 mb-6 justify-center">
            {selectedProduct.images.map((img, idx) => (
              <Pressable
                key={idx}
                onPress={() => {
                  triggerLightHaptic();
                  setActiveDetailImg(idx);
                }}
                className={`w-16 h-16 bg-[#121829] border ${activeDetailImg === idx ? 'border-[#3B82F6]' : 'border-white/10'} rounded-none overflow-hidden items-center justify-center p-1`}
              >
                <Image source={img} style={{ width: '100%', height: '100%' }} contentFit="contain" />
              </Pressable>
            ))}
          </View>
        )}

        {/* Product Meta details */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-2xl font-black text-white tracking-tight flex-1 mr-4">
              {selectedProduct.name}
            </Text>
            <Text className="text-amber-500 font-extrabold text-sm">★ {selectedProduct.rating}</Text>
          </View>

          {/* Tags */}
          <View className="flex-row flex-wrap gap-2 mb-4">
            {selectedProduct.tags.map((tag, i) => (
              <View key={i} className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-none">
                <Text className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">{tag}</Text>
              </View>
            ))}
          </View>

          <Text className="text-gray-400 text-xs leading-relaxed">
            {selectedProduct.description}
          </Text>
        </View>

        {/* Specifications Card */}
        <View className="bg-[#121829] border border-white/5 px-3.5 py-4 rounded-none mb-6">
          <Text className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest mb-3">
            Wholesale Specifications
          </Text>
          
          <View className="flex-row justify-between py-2.5 border-b border-white/5 items-center">
            <Text className="text-gray-400 text-[11px]" numberOfLines={1}>Standard MOQ</Text>
            <Text className="text-white text-[11px] font-bold" numberOfLines={1}>{selectedProduct.moq} Pack{selectedProduct.moq > 1 ? 's' : ''}</Text>
          </View>
          
          <View className="flex-row justify-between py-2.5 border-b border-white/5 items-center">
            <Text className="text-gray-400 text-[11px]" numberOfLines={1}>Pack Configuration</Text>
            <Text className="text-white text-[11px] font-bold" numberOfLines={1}>{selectedProduct.packSize} Units / Pack</Text>
          </View>
          
          <View className="flex-row justify-between py-2.5 border-b border-white/5 items-center">
            <Text className="text-gray-400 text-[11px]" numberOfLines={1}>Wholesale Price / Unit</Text>
            <Text className="text-emerald-400 text-[11px] font-bold" numberOfLines={1}>
              ${finalUnitPrice.toFixed(2)}
            </Text>
          </View>
          
          <View className="flex-row justify-between py-2.5 border-b border-white/5 items-center">
            <Text className="text-gray-400 text-[11px]" numberOfLines={1}>Pack Price</Text>
            <Text className="text-white text-[11px] font-bold" numberOfLines={1}>
              ${packPrice.toFixed(2)}
            </Text>
          </View>
          
          <View className="flex-row justify-between py-2.5 items-center">
            <Text className="text-gray-400 text-[11px]" numberOfLines={1}>Physical Inventory</Text>
            <Text className="text-emerald-500 text-[11px] font-bold" numberOfLines={1}>{selectedProduct.stock.toLocaleString()} Units Ready</Text>
          </View>
        </View>

        {/* Dynamic Wholesale Pricing Calculator */}
        <View className="bg-[#161C30] border border-white/5 p-4 rounded-none mb-6 items-center justify-between flex-row">
          <View>
            <Text className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Estimated Price</Text>
            <Text className="text-xl font-black text-white mt-1">
              ${(cartQty * packPrice).toFixed(2)}
            </Text>
            <Text className="text-[8px] text-slate-400 mt-0.5">
              {cartQty * selectedProduct.packSize} units in cart
            </Text>
          </View>

          {/* Stepper Inside Detail */}
          <View className="flex-row items-center bg-[#090D1A] border border-[#3B82F6]/40 rounded-none overflow-hidden h-10 px-1">
            <Pressable
              onPress={() => updateCartQty(selectedProduct.id, -1, selectedProduct)}
              className="w-10 h-10 rounded-none items-center justify-center active:bg-white/10"
            >
              <Ionicons name="remove" size={18} color={cartQty > 0 ? '#3B82F6' : '#475569'} />
            </Pressable>
            <Text className={`w-10 text-center font-bold text-sm ${cartQty > 0 ? 'text-white' : 'text-slate-500'}`}>
              {cartQty}
            </Text>
            <Pressable
              onPress={() => updateCartQty(selectedProduct.id, 1, selectedProduct)}
              className="w-10 h-10 rounded-none items-center justify-center active:bg-white/10"
            >
              <Ionicons name="add" size={18} color="#3B82F6" />
            </Pressable>
          </View>
        </View>

        {/* Place Order Direct Button */}
        <Pressable
          onPress={onPlaceOrderDirect}
          disabled={cartQty === 0}
          className={`py-4 rounded-none flex-row items-center justify-center mb-6 ${
            cartQty > 0 ? 'bg-[#10B981] active:bg-[#059669]' : 'bg-[#161C30] opacity-50'
          }`}
        >
          <Ionicons name="flash" size={14} color="white" style={{ marginRight: 6 }} />
          <Text className="text-white font-bold text-sm tracking-wider uppercase">
            Place Order Direct
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};
export default ProductDetailView;
