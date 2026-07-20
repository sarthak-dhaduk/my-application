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
    <ScrollView key="detail-scroll" className="flex-1 px-6 pt-4 bg-white" showsVerticalScrollIndicator={false}>
      <View className="pb-12">
        {/* Header: Back & Category Tag */}
        <View className="flex-row justify-between items-center mb-6">
          <Pressable
            onPress={() => {
              triggerLightHaptic();
              setSelectedProduct(null);
            }}
            className="flex-row items-center bg-gray-50 border border-gray-100 px-4 py-2 rounded-none active:bg-gray-100"
          >
            <Ionicons name="arrow-back" size={18} color="#D74A33" />
            <Text className="text-black text-xs font-bold ml-1.5 uppercase tracking-wider">Back</Text>
          </Pressable>
          
          <View className="bg-red-50 border border-red-100 px-3.5 py-1.5 rounded-none">
            <Text className="text-[10px] text-[#D74A33] font-bold uppercase tracking-wider">
              {selectedProduct.subCategory}
            </Text>
          </View>
        </View>

        {/* Giant Sharp Gallery Section */}
        <View className="border border-gray-100 rounded-none bg-white relative overflow-hidden mb-6">
          {/* Permanent Red Accent Line */}
          <View 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              height: 3.5, 
              backgroundColor: '#D74A33', 
              zIndex: 10 
            }} 
          />
          
          <View className="w-full aspect-square bg-white items-center justify-center border border-gray-100">
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
          
          {/* Permanent Red Accent Line */}
          <View 
            style={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              height: 3.5, 
              backgroundColor: '#D74A33', 
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
                className={`w-16 h-16 bg-white border ${activeDetailImg === idx ? 'border-[#D74A33]' : 'border-gray-150'} rounded-none overflow-hidden items-center justify-center p-1`}
              >
                <Image source={img} style={{ width: '100%', height: '100%' }} contentFit="contain" />
              </Pressable>
            ))}
          </View>
        )}

        {/* Product Meta details */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-2xl font-black text-black tracking-tight flex-1 mr-4">
              {selectedProduct.name}
            </Text>
            <Text className="text-amber-600 font-extrabold text-sm">★ {selectedProduct.rating}</Text>
          </View>

          {/* Tags */}
          <View className="flex-row flex-wrap gap-2 mb-4">
            {selectedProduct.tags.map((tag, i) => (
              <View key={i} className="bg-gray-50 border border-gray-100 px-2.5 py-0.5 rounded-none">
                <Text className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{tag}</Text>
              </View>
            ))}
          </View>

          <Text className="text-slate-600 text-xs leading-relaxed">
            {selectedProduct.description}
          </Text>
        </View>

        {/* Specifications Card */}
        <View className="bg-gray-50 border border-gray-100 px-4 py-4 rounded-none mb-6">
          <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">
            Wholesale Specifications
          </Text>
          
          <View className="flex-row justify-between py-2 border-b border-gray-200/50 items-center">
            <Text className="text-slate-500 text-[11px]" numberOfLines={1}>Standard MOQ</Text>
            <Text className="text-black text-[11px] font-bold" numberOfLines={1}>{selectedProduct.moq} Pack{selectedProduct.moq > 1 ? 's' : ''}</Text>
          </View>
          
          <View className="flex-row justify-between py-2 border-b border-gray-200/50 items-center">
            <Text className="text-slate-500 text-[11px]" numberOfLines={1}>Pack Configuration</Text>
            <Text className="text-black text-[11px] font-bold" numberOfLines={1}>{selectedProduct.packSize} Units / Pack</Text>
          </View>
          
          <View className="flex-row justify-between py-2 border-b border-gray-200/50 items-center">
            <Text className="text-slate-500 text-[11px]" numberOfLines={1}>Wholesale Price / Unit</Text>
            <Text className="text-[#D74A33] text-[11px] font-bold" numberOfLines={1}>
              ${finalUnitPrice.toFixed(2)}
            </Text>
          </View>
          
          <View className="flex-row justify-between py-2 border-b border-gray-200/50 items-center">
            <Text className="text-slate-500 text-[11px]" numberOfLines={1}>Pack Price</Text>
            <Text className="text-black text-[11px] font-bold" numberOfLines={1}>
              ${packPrice.toFixed(2)}
            </Text>
          </View>
          
          <View className="flex-row justify-between py-2 items-center">
            <Text className="text-slate-500 text-[11px]" numberOfLines={1}>Physical Inventory</Text>
            <Text className="text-emerald-600 text-[11px] font-bold" numberOfLines={1}>{selectedProduct.stock.toLocaleString()} Units Ready</Text>
          </View>
        </View>

        {/* Dynamic Wholesale Pricing Calculator */}
        <View className="bg-gray-50 border border-gray-100 p-4 rounded-none mb-6 items-center justify-between flex-row">
          <View>
            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimated Price</Text>
            <Text className="text-xl font-black text-black mt-1">
              ${(cartQty * packPrice).toFixed(2)}
            </Text>
            <Text className="text-[8.5px] text-slate-500 mt-0.5">
              {cartQty * selectedProduct.packSize} units in cart
            </Text>
          </View>

          {/* Stepper Inside Detail */}
          <View className="flex-row items-center bg-white border border-gray-200 rounded-none overflow-hidden h-10 px-1">
            <Pressable
              onPress={() => updateCartQty(selectedProduct.id, -1, selectedProduct)}
              className="w-10 h-10 rounded-none items-center justify-center active:bg-gray-50"
            >
              <Ionicons name="remove" size={18} color={cartQty > 0 ? '#D74A33' : '#CBD5E1'} />
            </Pressable>
            <Text className={`w-10 text-center font-bold text-sm ${cartQty > 0 ? 'text-black' : 'text-slate-400'}`}>
              {cartQty}
            </Text>
            <Pressable
              onPress={() => updateCartQty(selectedProduct.id, 1, selectedProduct)}
              className="w-10 h-10 rounded-none items-center justify-center active:bg-gray-50"
            >
              <Ionicons name="add" size={18} color="#D74A33" />
            </Pressable>
          </View>
        </View>

        {/* Place Order Direct Button */}
        <Pressable
          onPress={onPlaceOrderDirect}
          disabled={cartQty === 0}
          className={`py-4 rounded-none flex-row items-center justify-center mb-6 ${
            cartQty > 0 ? 'bg-[#D74A33] active:bg-[#C23C27]' : 'bg-gray-100 opacity-55'
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
