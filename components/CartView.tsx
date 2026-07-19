import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product, Cart, TabType } from './types';
import { PRODUCTS } from './constants';

interface CartViewProps {
  cart: Cart;
  setSelectedProduct: (product: Product | null) => void;
  setCurrentTab: (tab: TabType) => void;
  updateCartQty: (id: string, delta: number, product: Product) => void;
  handlePlaceOrderDirect: () => void;
  triggerLightHaptic: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cart,
  setSelectedProduct,
  setCurrentTab,
  updateCartQty,
  handlePlaceOrderDirect,
  triggerLightHaptic,
}) => {
  // Calculate order metrics locally
  const getCartTotals = () => {
    let totalItems = 0;
    let totalPrice = 0;
    Object.keys(cart).forEach((id) => {
      const product = PRODUCTS.find((p) => p.id === id);
      if (product) {
        const packs = cart[id];
        const units = packs * product.packSize;
        totalItems += units;
        
        const hasOffer = product.badge === 'offer' || !!product.offerPercentage;
        const finalUnitPrice = hasOffer && product.offerPercentage
          ? product.unitPrice * (1 - product.offerPercentage / 100)
          : product.unitPrice;

        totalPrice += units * finalUnitPrice;
      }
    });
    return { totalItems, totalPrice };
  };

  const { totalItems, totalPrice } = getCartTotals();
  const totalPacks = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <View className="flex-1 mb-20">
      {/* Header Section */}
      <View className="px-6 pt-16 pb-4 bg-[#0E1325] border-b border-white/5">
        <Text className="text-xs text-[#3B82F6] font-extrabold uppercase tracking-widest">
          Review Wholesale Items
        </Text>
        <Text className="text-2xl font-bold text-white mt-1">
          Wholesale Cart
        </Text>
      </View>

      {Object.keys(cart).length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-full py-12 items-center justify-center bg-[#121829] border border-white/5 rounded-none px-6">
            <Ionicons name="cart-outline" size={56} color="#475569" />
            <Text className="text-gray-400 text-sm mt-5 font-bold uppercase tracking-wider text-center">
              Your cart is empty
            </Text>
            <Text className="text-gray-500 text-xs text-center px-6 mt-3 leading-relaxed">
              Browse the catalog and add quantities to start building your bulk wholesale order.
            </Text>
            <Pressable
              onPress={() => {
                triggerLightHaptic();
                setSelectedProduct(null);
                setCurrentTab('catalog');
              }}
              className="mt-8 bg-[#3B82F6] px-8 py-3.5 rounded-none active:bg-blue-600 w-full items-center"
            >
              <Text className="text-white text-xs font-bold uppercase tracking-wider text-center">Browse Catalog</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
          {/* Cart Items List */}
          <View className="mb-6">
            {Object.keys(cart).map((id) => {
              const product = PRODUCTS.find((p) => p.id === id);
              if (!product) return null;
              const packs = cart[id];
              const units = packs * product.packSize;
              
              const hasOffer = product.badge === 'offer' || !!product.offerPercentage;
              const finalUnitPrice = hasOffer && product.offerPercentage
                ? product.unitPrice * (1 - product.offerPercentage / 100)
                : product.unitPrice;

              const packPrice = units * finalUnitPrice;

              return (
                <View key={id} className="bg-[#121829] border border-white/5 p-4 rounded-none mb-3 flex-row justify-between items-center">
                  <View className="flex-1 pr-3">
                    <Text className="text-white font-bold text-sm">
                      {product.name} {product.icon}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-0.5">
                      {packs} Packs ({units} units @ ${finalUnitPrice.toFixed(2)}/unit)
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-white font-bold text-sm">
                      ${packPrice.toFixed(2)}
                    </Text>
                    <Pressable 
                      onPress={() => updateCartQty(id, -packs, product)}
                      className="mt-1"
                    >
                      <Text className="text-red-500 text-[10px] font-bold">Remove</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Order Summary Details */}
          <View className="bg-gradient-to-r from-[#161C30] to-[#0E1325] border border-[#3B82F6]/20 p-5 rounded-none mb-8">
            <View className="flex-row justify-between mb-2">
              <Text className="text-xs text-gray-400">Total Units Selected</Text>
              <Text className="text-xs text-white font-bold">{totalItems} units</Text>
            </View>
            <View className="flex-row justify-between mb-4">
              <Text className="text-xs text-gray-400">Total Bulk Packs</Text>
              <Text className="text-xs text-white font-bold">
                {totalPacks} packs
              </Text>
            </View>
            <View className="h-[1px] bg-white/10 mb-4" />
            <View className="flex-row justify-between items-end">
              <Text className="text-sm font-bold text-white">Estimated Order Total</Text>
              <Text className="text-xl font-black text-[#3B82F6]">
                ${totalPrice.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Submit Order Action Button */}
          <Pressable
            onPress={handlePlaceOrderDirect}
            className="py-4 bg-[#10B981] active:bg-[#059669] rounded-none flex-row items-center justify-center mb-12"
          >
            <Ionicons name="flash" size={14} color="white" style={{ marginRight: 6 }} />
            <Text className="text-white font-bold text-sm tracking-wider uppercase">
              Place Order Direct
            </Text>
          </Pressable>
        </ScrollView>
      )}
    </View>
  );
};
export default CartView;
