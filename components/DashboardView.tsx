import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES, SLIDES, getCategoryIconInfo } from './constants';

import { TabType } from './types';

interface DashboardViewProps {
  setCurrentTab: (tab: TabType) => void;
  setSelectedCategoryId: (catId: string) => void;
  setActiveSubCategory: (subCat: string) => void;
  setSelectedProduct: (product: any) => void;
  triggerLightHaptic: () => void;
  startSplashAnimation: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  setCurrentTab,
  setSelectedCategoryId,
  setActiveSubCategory,
  setSelectedProduct,
  triggerLightHaptic,
  startSplashAnimation,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <View className="flex-1 px-6 pt-16 pb-24 justify-between">
      {/* 1. Header Section */}
      <View className="flex-row justify-between items-center">
        <View className="flex-1 pr-4">
          <View className="flex-row items-center mb-1">
            <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
            <Text className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest">
              Distributor Network Active
            </Text>
          </View>
          <Text className="text-3xl font-black text-white tracking-tight">
            VoltLine <Text className="text-[#3B82F6]">B2B</Text>
          </Text>
          <Text className="text-[11px] text-gray-500 font-semibold mt-0.5">
            Official Accessories Wholesaler Portal
          </Text>
        </View>
        
        <Pressable 
          onPress={() => {
            triggerLightHaptic();
            startSplashAnimation();
          }}
          className="w-12 h-12 bg-[#161C30] border border-white/10 rounded-none overflow-hidden items-center justify-center active:scale-95 shadow-lg shadow-[#3B82F6]/10"
        >
          <Image
            source={require('../assets/images/splash-logo.png')}
            contentFit="cover"
            style={{ width: '100%', height: '100%' }}
          />
        </Pressable>
      </View>

      {/* 2. Redesigned Premium Feature Slider Hero */}
      <View className="bg-gradient-to-br from-[#161C30] via-[#0F1426] to-[#0A0E1A] border border-[#3B82F6]/20 rounded-none relative h-60 justify-center overflow-hidden shadow-xl">
        {/* Decorative background glows */}
        <View className="absolute w-[200] h-[200] bg-[#3B82F6]/5 rounded-full blur-[50px] -top-10 -left-10" />
        <View className="absolute w-[200] h-[200] bg-[#8B5CF6]/5 rounded-full blur-[50px] -bottom-10 -right-10" />

        {/* Slider Content Wrapper */}
        <View className="flex-row items-center justify-between px-14 h-full relative">
          
          {/* Left Arrow Button */}
          <Pressable
            onPress={() => {
              triggerLightHaptic();
              setActiveSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
            }}
            className="absolute left-3 w-10 h-10 bg-white/5 border border-white/10 rounded-none items-center justify-center active:scale-90 active:bg-white/10 z-30"
          >
            <Ionicons name="chevron-back" size={20} color="#FFF" />
          </Pressable>

          {/* Animated Slide Content */}
          <View className="flex-1 items-center justify-center px-2 py-4">
            {SLIDES.map((slide, idx) => {
              if (idx !== activeSlide) return null;
              return (
                <View
                  key={slide.id}
                  className="items-center justify-center w-full"
                >
                  {/* Slide Icon */}
                  <View className={`w-14 h-14 ${slide.bg} border ${slide.border} rounded-none items-center justify-center mb-3 shadow-lg`}>
                    <Ionicons name={slide.icon as any} size={28} color={slide.color} />
                  </View>
                  
                  {/* Slide Title */}
                  <Text className="text-white font-extrabold text-base text-center mb-1 tracking-tight">
                    {slide.title}
                  </Text>
                  
                  {/* Slide Description */}
                  <Text className="text-gray-400 text-xs text-center leading-relaxed max-w-[230px]">
                    {slide.desc}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Right Arrow Button */}
          <Pressable
            onPress={() => {
              triggerLightHaptic();
              setActiveSlide((prev) => (prev + 1) % SLIDES.length);
            }}
            className="absolute right-3 w-10 h-10 bg-white/5 border border-white/10 rounded-none items-center justify-center active:scale-90 active:bg-white/10 z-30"
          >
            <Ionicons name="chevron-forward" size={20} color="#FFF" />
          </Pressable>
        </View>

        {/* Slider Dots Indicator */}
        <View pointerEvents="none" className="absolute bottom-4 left-0 right-0 flex-row justify-center items-center gap-1.5">
          {SLIDES.map((_, idx) => (
            <View
              key={idx}
              className={`h-1.5 rounded-none transition-all duration-200 ${
                idx === activeSlide ? 'w-4 bg-[#3B82F6]' : 'w-1.5 bg-gray-600'
              }`}
            />
          ))}
        </View>
      </View>

      {/* 3. Wholesale Categories Dashboard */}
      <View className="mb-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-base font-extrabold text-white tracking-wide">
            Wholesale Categories
          </Text>
          <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">4 Core Classes</Text>
        </View>
        
        <View className="flex-row flex-wrap justify-between">
          {CATEGORIES.map((cat) => {
            const iconInfo = getCategoryIconInfo(cat.id);
            return (
              <View
                key={cat.id}
                className="w-[48%] mb-4"
              >
                <Pressable
                  onPress={() => {
                    triggerLightHaptic();
                    setSelectedCategoryId(cat.id);
                    setActiveSubCategory('ALL');
                    setSelectedProduct(null);
                    setCurrentTab('catalog');
                  }}
                  className="p-4 rounded-none border bg-[#121829] flex-col justify-between active:scale-95 h-[130px] relative overflow-hidden"
                  style={{ borderColor: iconInfo.color + '25' }}
                >
                  {/* Top Accent Line matching category color */}
                  <View className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: iconInfo.color }} />

                  <View className="flex-row justify-between items-start mt-1">
                    <View className={`w-10 h-10 rounded-none ${iconInfo.bg} items-center justify-center`}>
                      <Ionicons name={iconInfo.icon} size={20} color={iconInfo.color} />
                    </View>
                    <Ionicons name="chevron-forward-outline" size={14} color="#475569" className="mt-1" />
                  </View>
                  <View>
                    <Text className="font-bold text-white text-sm">{cat.title}</Text>
                    <Text className="text-[10px] text-gray-500 mt-1">{cat.count}</Text>
                  </View>
                </Pressable>
              </View>
            );
          })}
        </View>
      </View>

      {/* 4. How to Order: 3 Steps Row */}
      <View className="border-t border-white/5 pt-3.5 mt-[-20px]">
        <Text className="text-[9px] text-gray-500 font-extrabold uppercase tracking-widest text-center mb-2.5">
          How to Order in 3 Steps
        </Text>
        <View className="flex-row justify-between items-center px-2">
          {/* Step 1 */}
          <View className="items-center flex-1">
            <View className="w-8 h-8 rounded-none bg-[#3B82F6]/10 border border-[#3B82F6]/20 items-center justify-center mb-1">
              <Ionicons name="grid-outline" size={14} color="#3B82F6" />
            </View>
            <Text className="text-[7.5px] text-white font-extrabold uppercase tracking-wide">1. Select Catalog</Text>
          </View>

          <Ionicons name="chevron-forward-outline" size={10} color="#475569" />

          {/* Step 2 */}
          <View className="items-center flex-1">
            <View className="w-8 h-8 rounded-none bg-[#F59E0B]/10 border border-[#F59E0B]/20 items-center justify-center mb-1">
              <Ionicons name="add-circle-outline" size={14} color="#F59E0B" />
            </View>
            <Text className="text-[7.5px] text-white font-extrabold uppercase tracking-wide">2. Set Packs</Text>
          </View>

          <Ionicons name="chevron-forward-outline" size={10} color="#475569" />

          {/* Step 3 */}
          <View className="items-center flex-1">
            <View className="w-8 h-8 rounded-none bg-[#10B981]/10 border border-[#10B981]/20 items-center justify-center mb-1">
              <Ionicons name="logo-whatsapp" size={14} color="#10B981" />
            </View>
            <Text className="text-[7.5px] text-white font-extrabold uppercase tracking-wide">3. Submit Order</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
export default DashboardView;
