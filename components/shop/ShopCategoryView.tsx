import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, LayoutAnimation, ActivityIndicator, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NEW_PRODUCTS } from '../../lib/products';
import { Cart } from '../types';
import { NewProductCard } from '../ui/NewProductCard';

interface ShopCategoryViewProps {
  category: string;
  onBack: () => void;
  cart: Cart;
  updateCartQty: (id: string, delta: number, product: any) => void;
  onBuyNow?: (id: string) => void;
  setSelectedNewProduct: (product: any) => void;
  triggerLightHaptic: () => void;
}

const ShopCategorySkeleton = ({ layoutMode }: { layoutMode: 'grid' | 'list' }) => {
  const pulseAnim = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 1000, useNativeDriver: true })
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View className={layoutMode === 'grid' ? "flex-row flex-wrap justify-between" : "flex-col pb-8"}>
      {[1, 2, 3, 4, 5, 6].map((_, i) => (
        <Animated.View 
          key={i} 
          style={{ 
            opacity: pulseAnim,
            width: layoutMode === 'grid' ? '48%' : '100%',
            marginBottom: 16,
            backgroundColor: '#fff',
            borderRadius: 24,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: '#F1F5F9'
          }}
        >
          <View>
            <View style={{ height: layoutMode === 'grid' ? 160 : 220, backgroundColor: '#F1F5F9' }} />
            <View style={{ padding: layoutMode === 'grid' ? 12 : 16 }}>
              <View style={{ width: 60, height: 14, backgroundColor: '#E2E8F0', borderRadius: 4, marginBottom: 8 }} />
              <View style={{ width: '90%', height: layoutMode === 'grid' ? 16 : 22, backgroundColor: '#F1F5F9', borderRadius: 4, marginBottom: 8 }} />
              <View style={{ width: '70%', height: layoutMode === 'grid' ? 12 : 16, backgroundColor: '#E2E8F0', borderRadius: 4, marginBottom: 14 }} />
              <View style={{ width: layoutMode === 'grid' ? 80 : 120, height: layoutMode === 'grid' ? 20 : 28, backgroundColor: '#F1F5F9', borderRadius: 6 }} />
            </View>
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

export const ShopCategoryView: React.FC<ShopCategoryViewProps> = ({
  category,
  onBack,
  cart,
  updateCartQty,
  onBuyNow,
  setSelectedNewProduct,
  triggerLightHaptic,
}) => {
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [visibleCount, setVisibleCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    setIsInitialLoading(true);
    setVisibleCount(0);
    const timer = setTimeout(() => {
      setVisibleCount(6);
      setIsInitialLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [category, layoutMode]);

  const filteredProducts = NEW_PRODUCTS.filter((p) => p.category === category);
  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (isCloseToBottom && !isLoadingMore && visibleCount < filteredProducts.length) {
      setIsLoadingMore(true);
      setTimeout(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setVisibleCount((prev) => prev + 6);
        setIsLoadingMore(false);
      }, 1000);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* ── Header ── */}
      <View className="flex-row justify-between items-center bg-white border-b border-slate-100/80 py-2.5 px-4 relative z-50">
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => {
              triggerLightHaptic();
              onBack();
            }}
            className="w-8 h-8 items-center justify-center bg-slate-100 rounded-full"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Ionicons name="arrow-back" size={16} color="#0F172A" />
          </Pressable>
          <View>
            <Text className="text-[12.5px] font-black text-slate-800 uppercase tracking-wider">
              {category}
            </Text>
            <Text className="text-[9px] font-semibold text-slate-400 mt-0.5">
              {filteredProducts.length} items
            </Text>
          </View>
        </View>

        {/* Layout dropdown */}
        <View className="relative z-50">
          <Pressable
            onPress={() => {
              triggerLightHaptic();
              LayoutAnimation.configureNext({
                duration: 200,
                create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
                update: { type: LayoutAnimation.Types.easeInEaseOut },
                delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
              });
              setShowDropdown(!showDropdown);
            }}
            style={({ pressed }) => ({
              opacity: pressed ? 0.85 : 1,
              borderColor: showDropdown ? '#D74A33' : '#E2E8F0',
            })}
            className="flex-row items-center bg-slate-50 border px-3.5 py-1.5 rounded-full gap-2"
          >
            <Ionicons name={layoutMode === 'grid' ? 'grid' : 'list'} size={13} color="#D74A33" />
            <Text className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none">
              {layoutMode === 'grid' ? 'Grid View' : 'List View'}
            </Text>
            <Ionicons name={showDropdown ? 'chevron-up' : 'chevron-down'} size={11} color="#64748B" />
          </Pressable>

          {showDropdown && (
            <View
              style={{ shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 5, borderColor: '#E2E8F0' }}
              className="absolute right-0 top-11 bg-white border rounded-2xl w-44 z-50 overflow-hidden"
            >
              <Pressable
                onPress={() => { triggerLightHaptic(); setShowDropdown(false); LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setLayoutMode('grid'); }}
                style={({ pressed }) => ({ backgroundColor: pressed ? '#F8FAFC' : layoutMode === 'grid' ? '#FEF2F2' : 'transparent' })}
                className="flex-col px-4 py-3 border-b border-slate-100 rounded-t-2xl"
              >
                <View className="flex-row items-center justify-between">
                  <Text className={`text-[10.5px] font-black uppercase tracking-wider ${layoutMode === 'grid' ? 'text-[#D74A33]' : 'text-slate-700'}`}>Grid View</Text>
                  {layoutMode === 'grid' && <Ionicons name="checkmark-circle" size={13} color="#D74A33" />}
                </View>
                <Text className="text-[7.5px] text-slate-400 font-semibold tracking-wide mt-0.5">2 columns card view</Text>
              </Pressable>
              <Pressable
                onPress={() => { triggerLightHaptic(); setShowDropdown(false); LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setLayoutMode('list'); }}
                style={({ pressed }) => ({ backgroundColor: pressed ? '#F8FAFC' : layoutMode === 'list' ? '#FEF2F2' : 'transparent' })}
                className="flex-col px-4 py-3 rounded-b-2xl"
              >
                <View className="flex-row items-center justify-between">
                  <Text className={`text-[10.5px] font-black uppercase tracking-wider ${layoutMode === 'list' ? 'text-[#D74A33]' : 'text-slate-700'}`}>List View</Text>
                  {layoutMode === 'list' && <Ionicons name="checkmark-circle" size={13} color="#D74A33" />}
                </View>
                <Text className="text-[7.5px] text-slate-400 font-semibold tracking-wide mt-0.5">1 column strip view</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      {/* ── Products List ── */}
      <ScrollView 
        className="flex-1 px-4 pt-4" 
        contentContainerStyle={{ paddingBottom: 140 }} 
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {isInitialLoading ? (
          <ShopCategorySkeleton layoutMode={layoutMode} />
        ) : filteredProducts.length === 0 ? (
          <View className="py-20 items-center justify-center">
            <Ionicons name="sad-outline" size={48} color="#CBD5E1" />
            <Text className="text-slate-400 font-bold mt-4">No products found in this category.</Text>
          </View>
        ) : (
          layoutMode === 'grid' ? (
            <View className="flex-row flex-wrap justify-between">
              {displayedProducts.map((product) => (
                <NewProductCard
                  key={product.id}
                  product={product}
                  cartQty={cart[product.id] || 0}
                  onUpdateQty={(delta) => updateCartQty(product.id, delta, product as any)}
                  onPress={() => setSelectedNewProduct(product)}
                  isGrid={true}
                  onBuyNow={() => onBuyNow && onBuyNow(product.id)}
                />
              ))}
            </View>
          ) : (
            <View className="flex-col pb-8">
              {displayedProducts.map((product) => (
                <NewProductCard
                  key={product.id}
                  product={product}
                  cartQty={cart[product.id] || 0}
                  onUpdateQty={(delta) => updateCartQty(product.id, delta, product as any)}
                  onPress={() => setSelectedNewProduct(product)}
                  isGrid={false}
                  onBuyNow={() => onBuyNow && onBuyNow(product.id)}
                />
              ))}
            </View>
          )
        )}

        {/* Infinite Scroll Indicator */}
        {!isInitialLoading && filteredProducts.length > visibleCount && (
          <View className="pt-6 pb-8 items-center justify-center w-full">
            <ActivityIndicator size="small" color="#D74A33" />
          </View>
        )}
      </ScrollView>
    </View>
  );
};
