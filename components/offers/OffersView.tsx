import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, ScrollView, LayoutAnimation, ActivityIndicator, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { NEW_PRODUCTS } from '../../lib/products';
import { Cart } from '../types';
import { NewProductCard } from '../ui/NewProductCard';

// ── Category config ───────────────────────────────────────────────────────────
const CATEGORY_CONFIG: {
  [key: string]: { color: string; bg: string; icon: string; iconType: string };
} = {
  'All':     { color: '#64748B', bg: '#F1F5F9', icon: 'layers-outline',        iconType: 'ionicons' },
  'Mobile':  { color: '#3B82F6', bg: '#EFF6FF', icon: 'phone-portrait-outline', iconType: 'ionicons' },
  'Console': { color: '#8B5CF6', bg: '#F5F3FF', icon: 'game-controller-outline', iconType: 'ionicons' },
  'Dress':   { color: '#EC4899', bg: '#FDF2F8', icon: 'hanger',                iconType: 'svg' },
  'Polos':   { color: '#10B981', bg: '#ECFDF5', icon: 'shirt-outline',          iconType: 'ionicons' },
  'Shoes':   { color: '#F59E0B', bg: '#FFFBEB', icon: 'shoe-sneaker',           iconType: 'material' },
  'Watches': { color: '#D74A33', bg: '#FEF2F2', icon: 'watch',                  iconType: 'material-icons' },
};

const ALL_CATEGORIES = ['All', 'Mobile', 'Console', 'Dress', 'Polos', 'Shoes', 'Watches'];

interface OffersViewProps {
  setSelectedProduct: (product: any) => void;
  cart: Cart;
  updateCartQty: (id: string, delta: number, product: any) => void;
  triggerLightHaptic: () => void;
  searchQuery?: string;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const OffersSkeleton = ({ layoutMode }: { layoutMode: 'grid' | 'list' }) => {
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

// ── Main OffersView ───────────────────────────────────────────────────────────
export const OffersView: React.FC<OffersViewProps> = ({
  setSelectedProduct,
  cart,
  updateCartQty,
  triggerLightHaptic,
  searchQuery = '',
  selectedCategory,
  setSelectedCategory,
}) => {
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('list');
  const [showDropdown, setShowDropdown] = useState(false);

  const [visibleCount, setVisibleCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const categoryScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Auto-scroll the filter bar to the selected category (deferred to allow layout)
    const catIndex = ALL_CATEGORIES.indexOf(selectedCategory);
    if (catIndex !== -1 && categoryScrollRef.current) {
      setTimeout(() => {
        categoryScrollRef.current?.scrollTo({
          x: Math.max(0, catIndex * 90 - 32),
          animated: true,
        });
      }, 150);
    }

    setIsInitialLoading(true);
    setVisibleCount(0);
    const timer = setTimeout(() => {
      setVisibleCount(6);
      setIsInitialLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, layoutMode]);

  const filteredProducts = NEW_PRODUCTS.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

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
      {/* ── Header: "Current Offers" + Layout dropdown ── */}
      <View className="flex-row justify-between items-center bg-white border-b border-slate-100/80 py-2.5 px-4 relative z-50">
        <View>
          <Text className="text-[12.5px] font-black text-slate-800 uppercase tracking-wider">
            Current Offers
          </Text>
          <Text className="text-[9px] font-semibold text-slate-400 mt-0.5">
            {filteredProducts.length} items{selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
          </Text>
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

      {/* ── Category Filter Bar ── */}
      <View className="bg-white border-b border-slate-100 py-3">
        <ScrollView 
          ref={categoryScrollRef}
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        >
          {ALL_CATEGORIES.map((cat) => {
            const cfg = CATEGORY_CONFIG[cat];
            const isActive = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => { triggerLightHaptic(); setSelectedCategory(cat); }}
                style={{ backgroundColor: isActive ? '#D74A33' : '#F1F5F9', borderRadius: 99, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, gap: 5 }}
              >
                {cfg.iconType === 'svg' ? (
                  <Svg width={13} height={13} viewBox="0 0 512 512">
                    <Path d="M437.217 419.258C440.066 428.699 434.334 435.022 425.016 433.743C397.462 429.959 370.604 433.805 344.207 441.771C326.577 447.091 310.19 455.19 294.216 464.275C276.288 474.471 256.871 479.863 236.305 481.38C195.365 484.399 157.629 473.029 121.177 455.913C107.589 449.533 94.5627 442.113 82.1446 433.659C74.6003 428.524 73.628 422.709 79.2622 415.583C105.515 382.379 130.837 348.499 153.414 312.656C170.744 285.141 186.744 256.95 198.227 226.346C205.72 206.375 205.431 187.15 196.072 167.868C191.791 159.05 188.711 149.742 187.518 139.83C186.427 130.764 187.651 122.06 191.519 114.066C198.016 100.638 197.541 87.1229 194.057 73.1968C191.873 64.4643 189.267 55.8916 186.117 47.4592C183.524 40.5155 185.845 34.8979 191.867 32.7057C197.614 30.6139 202.721 33.3059 205.453 40.1709C211.381 55.0676 215.598 70.4301 217.243 86.413C217.5 88.9117 218.276 90.2144 220.688 91.1262C233.113 95.8232 244.475 102.356 254.156 111.551C256.292 113.579 257.787 113.627 259.982 111.543C269.525 102.484 280.496 95.6473 292.945 91.3021C295.466 90.4219 296.505 89.0715 296.77 86.2857C298.293 70.2766 302.748 54.9636 308.537 40.0328C311.155 33.2814 316.938 30.673 322.873 33.1319C328.102 35.298 330.226 41.1752 327.846 47.4698C323.363 59.3305 319.786 71.4271 317.928 83.9938C316.744 92.003 316.436 100.048 320.123 107.489C330.145 127.711 327.747 147.437 318.329 167.014C312.76 178.591 309.377 190.684 310.341 203.653C311.116 214.062 314.648 223.815 318.465 233.385C332.494 268.553 352.235 300.585 373.125 331.962C392.251 360.69 412.924 388.282 434.505 415.203C435.439 416.368 436.211 417.662 437.217 419.258ZM299.285 241.113C297.636 236.4 295.973 231.692 294.339 226.973C289.623 213.35 288.265 199.442 290.681 185.18C292.507 174.398 296.508 164.374 301.1 154.55C307.956 139.878 307.512 125.652 298.596 111.751C297.993 111.892 297.336 111.976 296.733 112.201C295.643 112.607 294.559 113.045 293.518 113.562C282.926 118.826 273.841 125.912 266.411 135.21C260.479 142.633 253.659 142.434 247.567 135.267C244.767 131.973 241.871 128.709 238.667 125.819C231.738 119.568 223.934 114.699 215.389 111.57C206.488 126.069 205.931 140.356 213.094 154.979C214.192 157.22 215.13 159.541 216.125 161.833C224.835 181.891 227.143 202.283 220.74 223.621C214.182 245.474 204.491 265.88 193.592 285.758C168.201 332.065 137.596 374.873 105.207 416.461C101.553 421.154 101.567 421.537 106.791 424.6C128.583 437.374 151.435 447.761 175.833 454.458C198.01 460.545 220.483 463.042 243.485 459.829C261.512 457.311 277.451 449.862 293.169 441.174C326.319 422.851 361.728 412.203 399.865 411.62C401.208 411.599 402.886 412.304 403.976 410.376C403.037 409.076 402.107 407.716 401.105 406.41C381.022 380.217 361.75 353.448 344.122 325.531C327.204 298.739 311.261 271.415 299.285 241.113Z" fill={isActive ? '#fff' : '#64748B'} stroke={isActive ? '#fff' : '#64748B'} strokeWidth={18} strokeLinejoin="round" />
                  </Svg>
                ) : cfg.iconType === 'material' ? (
                  <MaterialCommunityIcons name={cfg.icon as any} size={13} color={isActive ? '#fff' : '#64748B'} />
                ) : cfg.iconType === 'material-icons' ? (
                  <MaterialIcons name={cfg.icon as any} size={13} color={isActive ? '#fff' : '#64748B'} />
                ) : (
                  <Ionicons name={cfg.icon as any} size={13} color={isActive ? '#fff' : '#64748B'} />
                )}
                <Text style={{ color: isActive ? '#fff' : '#64748B', fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.6 }}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Product Grid / List ── */}
      <ScrollView
        key={`offers-scroll-${layoutMode}`}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 120 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {isInitialLoading ? (
          <OffersSkeleton layoutMode={layoutMode} />
        ) : filteredProducts.length === 0 ? (
          <View className="py-16 items-center justify-center">
            <Text className="text-slate-400 text-sm">No items found.</Text>
          </View>
        ) : layoutMode === 'grid' ? (
          <View className="flex-row flex-wrap justify-between">
            {displayedProducts.map((product) => (
              <NewProductCard
                key={product.id}
                product={product}
                cartQty={cart[product.id] || 0}
                onUpdateQty={(delta) => updateCartQty(product.id, delta, product)}
                onPress={() => { triggerLightHaptic(); setSelectedProduct(product); }}
                isGrid={true}
              />
            ))}
          </View>
        ) : (
          <>
            {displayedProducts.map((product) => (
              <NewProductCard
                key={product.id}
                product={product}
                cartQty={cart[product.id] || 0}
                onUpdateQty={(delta) => updateCartQty(product.id, delta, product)}
                onPress={() => { triggerLightHaptic(); setSelectedProduct(product); }}
                isGrid={false}
              />
            ))}
          </>
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

export default OffersView;
