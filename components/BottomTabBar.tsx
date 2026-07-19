import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Cart, TabType } from './types';

interface BottomTabBarProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  setSelectedProduct: (product: any) => void;
  cart: Cart;
  triggerLightHaptic: () => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentTab,
  setCurrentTab,
  setSelectedProduct,
  cart,
  triggerLightHaptic,
}) => {
  return (
    <View className="absolute bottom-0 left-0 right-0 h-20 bg-[#0B0E17] border-t border-white/10 flex-row justify-around items-center px-4 pb-2">
      {/* Tab Items */}
      <Pressable
        onPress={() => {
          triggerLightHaptic();
          setSelectedProduct(null);
          setCurrentTab('home');
        }}
        className="items-center justify-center h-full w-1/3 relative"
      >
        {currentTab === 'home' && (
          <View className="absolute top-0 left-0 right-0 h-[3px] bg-[#3B82F6] shadow-md shadow-[#3B82F6]" />
        )}
        <Ionicons
          name={currentTab === 'home' ? 'home' : 'home-outline'}
          size={21}
          color={currentTab === 'home' ? '#3B82F6' : '#64748B'}
        />
        <Text className={`text-[10px] font-extrabold tracking-wider mt-1 uppercase ${currentTab === 'home' ? 'text-white' : 'text-slate-500'}`}>
          Home
        </Text>
      </Pressable>

      <Pressable
        onPress={() => {
          triggerLightHaptic();
          setSelectedProduct(null);
          setCurrentTab('cart');
        }}
        className="items-center justify-center h-full w-1/3 relative"
      >
        {currentTab === 'cart' && (
          <View className="absolute top-0 left-0 right-0 h-[3px] bg-[#3B82F6] shadow-md shadow-[#3B82F6]" />
        )}
        <View className="relative">
          <Ionicons
            name={currentTab === 'cart' ? 'cart' : 'cart-outline'}
            size={21}
            color={currentTab === 'cart' ? '#3B82F6' : '#64748B'}
          />
          {Object.keys(cart).length > 0 && (
            <View className="absolute -top-1.5 -right-3 bg-[#F59E0B] rounded-none px-1 h-3.5 min-w-[14px] items-center justify-center border border-[#0A0D16]">
              <Text className="text-[8px] text-[#090D1A] font-black">
                {Object.values(cart).reduce((a, b) => a + b, 0)}
              </Text>
            </View>
          )}
        </View>
        <Text className={`text-[10px] font-extrabold tracking-wider mt-1 uppercase ${currentTab === 'cart' ? 'text-white' : 'text-slate-500'}`}>
          Cart
        </Text>
      </Pressable>

      <Pressable
        onPress={() => {
          triggerLightHaptic();
          setSelectedProduct(null);
          setCurrentTab('contact');
        }}
        className="items-center justify-center h-full w-1/3 relative"
      >
        {currentTab === 'contact' && (
          <View className="absolute top-0 left-0 right-0 h-[3px] bg-[#3B82F6] shadow-md shadow-[#3B82F6]" />
        )}
        <Ionicons
          name={currentTab === 'contact' ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'}
          size={21}
          color={currentTab === 'contact' ? '#3B82F6' : '#64748B'}
        />
        <Text className={`text-[10px] font-extrabold tracking-wider mt-1 uppercase ${currentTab === 'contact' ? 'text-white' : 'text-slate-500'}`}>
          Contact
        </Text>
      </Pressable>
    </View>
  );
};
export default BottomTabBar;
