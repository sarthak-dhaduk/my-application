import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, LayoutAnimation, PanResponder, Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { NEW_PRODUCTS, NewProduct } from '../../lib/products';
import { Cart, Product, TabType } from '../types';
import { NewProductCard } from '../ui/NewProductCard';
import { ShopCategoryView } from './ShopCategoryView';

// Helper function to map lib/products structure into components/types Product interface
const convertToProduct = (p: NewProduct): Product => {
  return {
    id: p.id,
    name: p.name,
    description: p.specification.paragraph,
    unitPrice: p.price,
    packSize: 1,
    moq: 1,
    stock: 100,
    rating: p.rating,
    icon: '📦',
    category: p.category.toLowerCase(),
    subCategory: p.brand.toUpperCase(),
    tags: p.badges,
    image: p.rootImage,
    images: p.images,
    badge: p.tag === 'Best Seller' ? 'best-seller' : p.tag === 'New Stock' ? 'new-collection' : null,
    offerPercentage: p.offer,
  };
};

interface ShopViewProps {
  setCurrentTab: (tab: TabType) => void;
  activeShopCategory: string | null;
  setActiveShopCategory: (cat: string | null) => void;
  setSelectedCategoryId: (catId: string) => void;
  setActiveSubCategory: (subCat: string) => void;
  setSelectedProduct: (product: any) => void;
  triggerLightHaptic: () => void;
  startSplashAnimation: () => void;
  cart: Cart;
  updateCartQty: (productId: string, delta: number, product: Product) => void;
  onBuyNow?: (productId: string) => void;
  onOfferPress?: (category: string) => void;
}

const OFFERS = [
  { id: 1, title: 'Flagship Smartphones', image: require('../../assets/offers-mockup/phone-mockup.png') },
  { id: 2, title: 'AeroSpace Sports Kicks', image: require('../../assets/offers-mockup/shoes-mockup.png') },
  { id: 3, title: 'Classic Fitted Men Polos', image: require('../../assets/offers-mockup/polo-mockup.png') },
  { id: 4, title: 'Luxurious Silk Dresses', image: require('../../assets/offers-mockup/Dresses-mockup.png') },
  { id: 5, title: 'Chronograph Watches', image: require('../../assets/offers-mockup/watch-mockup.png') },
  { id: 6, title: 'PlayStation 5 Console', image: require('../../assets/offers-mockup/ps-mockup.png') },
];

const SLIDING_CATEGORIES = [
  { id: 1, title: 'Phone', count: '120+ Items', icon: 'phone-portrait-outline' as const, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.10)', category: 'Mobile', iconType: 'ionicons' },
  { id: 2, title: 'Shoes', count: '85+ Pairs', icon: 'shoe-sneaker' as const, color: '#D74A33', bg: 'rgba(215, 74, 51, 0.10)', category: 'Shoes', iconType: 'material' },
  { id: 3, title: "Men's Polos", count: '45+ Styles', icon: 'shirt-outline' as const, color: '#1A2332', bg: 'rgba(26, 35, 50, 0.10)', category: 'Polos', iconType: 'ionicons' },
  { id: 4, title: "Women's Dress", count: '90+ Models', icon: 'dress' as const, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.10)', category: 'Dress', iconType: 'svg' },
  { id: 5, title: 'Watches', count: '60+ Pieces', icon: 'watch' as const, color: '#2C1D11', bg: 'rgba(44, 29, 17, 0.10)', category: 'Watches', iconType: 'material-icons' },
  { id: 6, title: 'Console', count: '15+ Specs', icon: 'game-controller-outline' as const, color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.10)', category: 'Console', iconType: 'ionicons' },
];

const { width: screenWidth } = Dimensions.get('window');
const containerWidth = screenWidth - 48; // px-6 left and right
// Calculate size to display exactly 2.6 items so cards are wider and scrollable
const itemWidth = (containerWidth - (2 * 12)) / 2.6;

const CATEGORY_ICONS: { [key: string]: { icon: string; type: 'ionicons' | 'material' | 'material-icons' | 'svg' } } = {
  'Mobile': { icon: 'phone-portrait-outline', type: 'ionicons' },
  'Console': { icon: 'game-controller-outline', type: 'ionicons' },
  'Dress': { icon: 'dress', type: 'svg' },
  'Polos': { icon: 'shirt-outline', type: 'ionicons' },
  'Shoes': { icon: 'shoe-sneaker', type: 'material' },
  'Watches': { icon: 'watch', type: 'material-icons' },
};

// Skeleton Placeholder Card for smooth loading
const SkeletonCard = ({ isGrid }: { isGrid: boolean }) => {
  if (isGrid) {
    return (
      <View style={{ width: '48%', aspectRatio: 3 / 4 }} className="bg-slate-50 border border-slate-200/50 rounded-none mb-4 items-center justify-center p-3 relative overflow-hidden">
        <View className="w-16 h-16 rounded-full bg-slate-200/40 opacity-70" />
        <View className="w-20 h-3 bg-slate-200/40 rounded mt-3 opacity-60" />
        <View className="w-12 h-3 bg-slate-200/30 rounded mt-1.5 opacity-50" />
      </View>
    );
  }
  return (
    <View className="w-full h-32 bg-slate-50 border border-slate-200/50 rounded-none mb-5 flex-row p-3 items-center gap-3 relative overflow-hidden">
      <View className="w-24 h-24 bg-slate-200/40 rounded-none opacity-70" />
      <View className="flex-1 gap-2">
        <View className="w-2/3 h-4 bg-slate-200/40 rounded opacity-60" />
        <View className="w-1/2 h-3 bg-slate-200/30 rounded opacity-50" />
        <View className="w-1/3 h-5 bg-slate-200/30 rounded mt-2 opacity-50" />
      </View>
    </View>
  );
};

// Skeleton Placeholder for Categories Row
const CategoriesSkeleton = () => (
  <View className="mb-8">
    <View className="flex-row justify-between items-center mb-3">
      <View className="w-40 h-5 bg-slate-200/50 rounded" />
      <View className="w-24 h-3 bg-slate-200/40 rounded" />
    </View>
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={{ marginHorizontal: -24 }}
      contentContainerStyle={{ paddingHorizontal: 24 }}
    >
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={{ width: itemWidth, height: itemWidth, marginRight: i === 4 ? 0 : 12 }} className="p-0 rounded-3xl border border-slate-100 bg-slate-50 items-center justify-center relative overflow-hidden">
          {/* Accent top band line */}
          <View className="absolute top-0 left-0 right-0 h-[3px] bg-slate-200/60 rounded-t-3xl" />
          {/* Icon bubble */}
          <View className="w-14 h-14 rounded-full bg-slate-200/50 opacity-70 mb-1" />
          {/* Title line */}
          <View className="w-14 h-2.5 bg-slate-200/40 rounded opacity-60" />
          {/* Sub line */}
          <View className="w-10 h-2 bg-slate-200/30 rounded mt-1 opacity-50" />
        </View>
      ))}
    </ScrollView>
  </View>
);


// Skeleton Placeholder for Offers card deck stack
const OffersSkeleton = () => (
  <View className="h-52 mb-8 justify-center items-center relative w-full pr-8">
    <View style={{ width: '92%', height: 160, position: 'absolute', top: 20, zIndex: 1 }} className="bg-slate-50 border border-slate-100 rounded-3xl" />
    <View style={{ width: '96%', height: 170, position: 'absolute', top: 10, zIndex: 2 }} className="bg-slate-100/80 border border-slate-200/40 rounded-3xl" />
    <View style={{ width: '100%', height: 180, position: 'absolute', top: 0, zIndex: 3, padding: 20 }} className="bg-slate-100 border border-slate-200/50 rounded-3xl flex-row justify-between items-center">
      <View className="flex-1 gap-3">
        <View className="w-16 h-5 bg-slate-200/40 rounded opacity-70" />
        <View className="w-2/3 h-5 bg-slate-200/40 rounded opacity-60" />
        <View className="w-20 h-8 bg-slate-200/40 rounded-xl opacity-60" />
      </View>
      <View className="w-24 h-24 bg-slate-200/40 rounded-2xl opacity-60" />
    </View>
  </View>
);

// Skeleton Placeholder for the main For You feed sections
const ForYouSkeleton = () => (
  <View className="z-50 mt-4 mb-0 bg-slate-50 border-t border-slate-100 pt-6 pb-28 px-4" style={{ marginHorizontal: -24 }}>
    <View className="flex-row justify-between items-center bg-white border border-slate-200/50 py-2.5 px-4 rounded-2xl mb-6 relative z-50 shadow-sm shadow-slate-100/40">
      <View className="w-16 h-5 bg-slate-200/40 rounded opacity-70" />
      <View className="w-20 h-6 bg-slate-200/30 rounded-xl opacity-60" />
    </View>
    <View className="bg-white border border-slate-200/50 rounded-3xl p-4 mb-4">
      <View className="flex-row justify-between items-center border-b border-slate-100 pb-2.5 mb-4 mt-1">
        <View className="gap-1.5">
          <View className="w-24 h-4 bg-slate-200/40 rounded opacity-70" />
          <View className="w-32 h-2.5 bg-slate-200/30 rounded opacity-60" />
        </View>
        <View className="w-12 h-4 bg-slate-200/30 rounded opacity-50" />
      </View>
      <View className="flex-row flex-wrap justify-between">
        <SkeletonCard isGrid={true} />
        <SkeletonCard isGrid={true} />
      </View>
    </View>
  </View>
);

export const ShopView: React.FC<ShopViewProps> = ({
  setCurrentTab,
  setSelectedCategoryId,
  setActiveSubCategory,
  setSelectedProduct,
  triggerLightHaptic,
  cart,
  updateCartQty,
  onBuyNow,
  onOfferPress,
  activeShopCategory,
  setActiveShopCategory,
}) => {

  // Index of the top card (0 to 5)
  const [activeIndex, setActiveIndex] = useState(0);

  // Layout mode for the "New Items" section
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [showDropdown, setShowDropdown] = useState(false);

  // Lazy Loading / Pagination states
  const [visibleCount, setVisibleCount] = useState(4);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSwitchingLayout, setIsSwitchingLayout] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Defer rendering of heavy sections to allow smooth, lag-free screen navigation transitions
  useEffect(() => {
    setVisibleCount(4);
    setIsReady(false);
    const timer = setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsReady(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Track dragging state in a ref to prevent massive re-renders on touch
  const isDraggingRef = useRef(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Decoupled local animated values for each offer card to prevent cross-card translation glitches
  const panValues = useRef<{ [key: number]: Animated.ValueXY }>({
    1: new Animated.ValueXY(),
    2: new Animated.ValueXY(),
    3: new Animated.ValueXY(),
    4: new Animated.ValueXY(),
    5: new Animated.ValueXY(),
    6: new Animated.ValueXY(),
  }).current;

  // Track active offer ID in a ref to avoid closures catching stale state inside panResponder callbacks
  const activeOfferId = OFFERS[activeIndex].id;
  const activeOfferIdRef = useRef(activeOfferId);
  activeOfferIdRef.current = activeOfferId;

  // Fast and snappy LayoutAnimation config
  const customLayoutAnimation = {
    duration: 150,
    create: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
  };

  // Auto change card every 4 seconds, pausing if the user is currently holding/dragging a card
  useEffect(() => {
    const timer = setInterval(() => {
      if (isDraggingRef.current) return;

      const curActiveId = activeOfferIdRef.current;
      const curPan = panValues[curActiveId];

      // Animate card flying off-screen to the left to show auto-cycling transition
      Animated.timing(curPan, {
        toValue: { x: -450, y: 0 },
        duration: 400,
        useNativeDriver: false,
      }).start(() => {
        LayoutAnimation.configureNext(customLayoutAnimation);
        cycleCardForward();
        setTimeout(() => {
          curPan.setValue({ x: 0, y: 0 });
        }, 500);
      });
    }, 4000); // 4-second delay

    return () => clearInterval(timer);
  }, [activeIndex]);

  const cycleCardForward = () => {
    triggerLightHaptic();
    setActiveIndex((prev) => (prev + 1) % OFFERS.length);
  };

  const cycleCardBackward = () => {
    triggerLightHaptic();
    setActiveIndex((prev) => (prev - 1 + OFFERS.length) % OFFERS.length);
  };

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (isCloseToBottom && !isLoadingMore) {
      const totalItems = sectionsConfig.reduce((total, section) => {
        return total + Object.values(section.data).flat().length;
      }, 0);

      const hasMore = totalItems > visibleCount;

      if (hasMore) {
        setIsLoadingMore(true);
        setTimeout(() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setVisibleCount((prev) => prev + 4);
          setIsLoadingMore(false);
        }, 2000);
      }
    }
  };

  // Configure PanResponder for dragging (Horizontal swiping only)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true, // Eagerly capture ALL touches immediately!
      onStartShouldSetPanResponderCapture: () => true, // Force capture to guarantee ScrollView is blocked
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false, // Refuse to give up the gesture once captured
      onShouldBlockNativeResponder: () => true, // Block native ScrollView from scrolling
      onPanResponderGrant: () => {
        isDraggingRef.current = true;
        scrollViewRef.current?.setNativeProps({ scrollEnabled: false });
        panValues[activeOfferIdRef.current].setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, gestureState) => {
        panValues[activeOfferIdRef.current].setValue({ x: gestureState.dx, y: 0 });
      },
      onPanResponderRelease: (_, gestureState) => {
        isDraggingRef.current = false;
        scrollViewRef.current?.setNativeProps({ scrollEnabled: true }); // Immediately restore normal scrolling capabilities

        // If it was just a tap (no drag movement), handle the click natively here!
        if (Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5) {
          const categories = ['Mobile', 'Shoes', 'Polos', 'Dress', 'Watches', 'Console'];
          // Use activeOfferIdRef (1-indexed) because activeIndex is stale in this closure
          const currentIndex = activeOfferIdRef.current - 1;
          onOfferPress?.(categories[currentIndex]);
          return;
        }

        const swipeThreshold = 90;
        const curActiveId = activeOfferIdRef.current;
        const curPan = panValues[curActiveId];

        if (gestureState.dx < -swipeThreshold) {
          // Swipe LEFT -> Fly card left and cycle FORWARD (next card)
          Animated.timing(curPan, {
            toValue: { x: -450, y: 0 },
            duration: 350,
            useNativeDriver: false,
          }).start(() => {
            LayoutAnimation.configureNext(customLayoutAnimation);
            cycleCardForward();
            setTimeout(() => {
              curPan.setValue({ x: 0, y: 0 });
            }, 500);
          });
        } else if (gestureState.dx > swipeThreshold) {
          // Swipe RIGHT -> Fly card right and cycle BACKWARD (previous card)
          Animated.timing(curPan, {
            toValue: { x: 450, y: 0 },
            duration: 350,
            useNativeDriver: false,
          }).start(() => {
            LayoutAnimation.configureNext(customLayoutAnimation);
            cycleCardBackward();
            setTimeout(() => {
              curPan.setValue({ x: 0, y: 0 });
            }, 500);
          });
        } else {
          // Spring back to home center (smoother & slower damping)
          Animated.spring(curPan, {
            toValue: { x: 0, y: 0 },
            friction: 7,
            tension: 25,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  // Calculates dynamic card styles based on drag progress of the active card
  const getCardStyle = (position: number, cardId: number) => {
    const isActive = position === 0;
    const activePan = panValues[activeOfferIdRef.current];
    const cardPan = panValues[cardId];
    
    let scale: any;
    let translateY: any;
    let translateX: any;
    let opacity: any;

    if (isActive) {
      scale = 1;
      translateY = 0;
      translateX = cardPan.x;
      opacity = 1;
    } else {
      // Swiping LEFT (x < 0) -> background cards move FORWARD (position - 1)
      // Swiping RIGHT (x > 0) -> background cards recede BACKWARD (position + 1)
      const startScale = Math.max(0.75, 1 - position * 0.08);
      const forwardScale = Math.max(0.75, 1 - (position - 1) * 0.08);
      const backwardScale = Math.max(0.75, 1 - (position + 1) * 0.08);
      
      scale = activePan.x.interpolate({
        inputRange: [-250, 0, 250],
        outputRange: [forwardScale, startScale, backwardScale],
        extrapolate: 'clamp'
      });

      const startTrans = Math.min(80, position * 16);
      const forwardTrans = Math.min(80, (position - 1) * 16);
      const backwardTrans = Math.min(80, (position + 1) * 16);
      
      translateY = activePan.x.interpolate({
        inputRange: [-250, 0, 250],
        outputRange: [forwardTrans, startTrans, backwardTrans],
        extrapolate: 'clamp'
      });
      translateX = activePan.x.interpolate({
        inputRange: [-250, 0, 250],
        outputRange: [forwardTrans, startTrans, backwardTrans],
        extrapolate: 'clamp'
      });

      const startOp = position === 1 ? 0.95 : position === 2 ? 0.6 : 0;
      const forwardOp = (position - 1) === 0 ? 1 : (position - 1) === 1 ? 0.95 : (position - 1) === 2 ? 0.6 : 0;
      const backwardOp = (position + 1) === 1 ? 0.95 : (position + 1) === 2 ? 0.6 : 0;
      
      opacity = activePan.x.interpolate({
        inputRange: [-250, 0, 250],
        outputRange: [forwardOp, startOp, backwardOp],
        extrapolate: 'clamp'
      });
    }

    const zIndex = 60 - position * 10;
    const cardRotate = isActive
      ? cardPan.x.interpolate({
        inputRange: [-200, 0, 200],
        outputRange: ['-12deg', '0deg', '12deg'],
      })
      : '0deg';

    return {
      position: 'absolute' as const,
      left: 0,
      right: 36,
      height: 180,
      zIndex,
      opacity,
      transform: [
        { translateX },
        { translateY },
        { scale },
        { rotate: cardRotate },
      ],
    };
  };

  // Memoize grouped products data (caching it on mount to prevent expensive grouping on every render)
  const sectionsConfig = useMemo(() => {
    const newStockGrouped = NEW_PRODUCTS.filter(p => p.tag === 'New Stock').reduce((acc, p) => {
      if (!acc[p.category]) acc[p.category] = [];
      acc[p.category].push(p);
      return acc;
    }, {} as { [key: string]: NewProduct[] });

    const bestSellerGrouped = NEW_PRODUCTS.filter(p => p.tag === 'Best Seller').reduce((acc, p) => {
      if (!acc[p.category]) acc[p.category] = [];
      acc[p.category].push(p);
      return acc;
    }, {} as { [key: string]: NewProduct[] });

    return [
      { title: 'New Stock', data: newStockGrouped, icon: 'sparkles' as const, color: '#D74A33' },
      { title: 'Best Seller', data: bestSellerGrouped, icon: 'trophy' as const, color: '#F59E0B' },
    ];
  }, []);

  if (activeShopCategory) {
    return (
      <ShopCategoryView
        category={activeShopCategory}
        onBack={() => setActiveShopCategory(null)}
        cart={cart}
        updateCartQty={updateCartQty}
        onBuyNow={onBuyNow}
        setSelectedProduct={setSelectedProduct}
        triggerLightHaptic={triggerLightHaptic}
      />
    );
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 0 }}
      showsVerticalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      {/* 1. Premium Horizontal Categories Carousel (6 categories with 3.5 items visible layout) */}
      {!isReady ? (
        <CategoriesSkeleton />
      ) : (
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-[12.5px] font-black text-slate-800 uppercase tracking-wider">
              Categories
            </Text>
            <Text className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Swipe Categories</Text>
          </View>

          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -24 }}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          >
            {SLIDING_CATEGORIES.map((cat, index) => {
              const isLast = index === SLIDING_CATEGORIES.length - 1;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => {
                    triggerLightHaptic();
                    setActiveShopCategory(cat.category);
                  }}
                  style={{ width: itemWidth, height: itemWidth, marginRight: isLast ? 0 : 12, backgroundColor: cat.color }}
                  className="p-0 rounded-3xl flex-col items-center justify-center active:scale-95 shadow-md shadow-black/10 relative overflow-hidden"
                >
                  {/* Top glowing accent */}
                  <View className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />

                  {/* Round Icon */}
                  <View className="w-14 h-14 rounded-full items-center justify-center mb-1" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                    {cat.iconType === 'material' ? (
                      <MaterialCommunityIcons name={cat.icon as any} size={30} color="#fff" />
                    ) : cat.iconType === 'material-icons' ? (
                      <MaterialIcons name={cat.icon as any} size={30} color="#fff" />
                    ) : cat.iconType === 'svg' ? (
                      <Svg width={26} height={26} viewBox="0 0 512 512">
                        <Path d="M437.217 419.258C440.066 428.699 434.334 435.022 425.016 433.743C397.462 429.959 370.604 433.805 344.207 441.771C326.577 447.091 310.19 455.19 294.216 464.275C276.288 474.471 256.871 479.863 236.305 481.38C195.365 484.399 157.629 473.029 121.177 455.913C107.589 449.533 94.5627 442.113 82.1446 433.659C74.6003 428.524 73.628 422.709 79.2622 415.583C105.515 382.379 130.837 348.499 153.414 312.656C170.744 285.141 186.744 256.95 198.227 226.346C205.72 206.375 205.431 187.15 196.072 167.868C191.791 159.05 188.711 149.742 187.518 139.83C186.427 130.764 187.651 122.06 191.519 114.066C198.016 100.638 197.541 87.1229 194.057 73.1968C191.873 64.4643 189.267 55.8916 186.117 47.4592C183.524 40.5155 185.845 34.8979 191.867 32.7057C197.614 30.6139 202.721 33.3059 205.453 40.1709C211.381 55.0676 215.598 70.4301 217.243 86.413C217.5 88.9117 218.276 90.2144 220.688 91.1262C233.113 95.8232 244.475 102.356 254.156 111.551C256.292 113.579 257.787 113.627 259.982 111.543C269.525 102.484 280.496 95.6473 292.945 91.3021C295.466 90.4219 296.505 89.0715 296.77 86.2857C298.293 70.2766 302.748 54.9636 308.537 40.0328C311.155 33.2814 316.938 30.673 322.873 33.1319C328.102 35.298 330.226 41.1752 327.846 47.4698C323.363 59.3305 319.786 71.4271 317.928 83.9938C316.744 92.003 316.436 100.048 320.123 107.489C330.145 127.711 327.747 147.437 318.329 167.014C312.76 178.591 309.377 190.684 310.341 203.653C311.116 214.062 314.648 223.815 318.465 233.385C332.494 268.553 352.235 300.585 373.125 331.962C392.251 360.69 412.924 388.282 434.505 415.203C435.439 416.368 436.211 417.662 437.217 419.258ZM299.285 241.113C297.636 236.4 295.973 231.692 294.339 226.973C289.623 213.35 288.265 199.442 290.681 185.18C292.507 174.398 296.508 164.374 301.1 154.55C307.956 139.878 307.512 125.652 298.596 111.751C297.993 111.892 297.336 111.976 296.733 112.201C295.643 112.607 294.559 113.045 293.518 113.562C282.926 118.826 273.841 125.912 266.411 135.21C260.479 142.633 253.659 142.434 247.567 135.267C244.767 131.973 241.871 128.709 238.667 125.819C231.738 119.568 223.934 114.699 215.389 111.57C206.488 126.069 205.931 140.356 213.094 154.979C214.192 157.22 215.13 159.541 216.125 161.833C224.835 181.891 227.143 202.283 220.74 223.621C214.182 245.474 204.491 265.88 193.592 285.758C168.201 332.065 137.596 374.873 105.207 416.461C101.553 421.154 101.567 421.537 106.791 424.6C128.583 437.374 151.435 447.761 175.833 454.458C198.01 460.545 220.483 463.042 243.485 459.829C261.512 457.311 277.451 449.862 293.169 441.174C326.319 422.851 361.728 412.203 399.865 411.62C401.208 411.599 402.886 412.304 403.976 410.376C403.037 409.076 402.107 407.716 401.105 406.41C381.022 380.217 361.75 353.448 344.122 325.531C327.204 298.739 311.261 271.415 299.285 241.113Z" fill="#fff" stroke="#fff" strokeWidth={18} strokeLinejoin="round" />
                      </Svg>
                    ) : (
                      <Ionicons name={cat.icon as any} size={30} color="#fff" />
                    )}
                  </View>

                  {/* Title */}
                  <Text className="font-extrabold text-white text-[12px] text-center tracking-tight leading-tight" numberOfLines={1}>
                    {cat.title}
                  </Text>
                  {/* Count */}
                  <Text className="text-[9px] text-white/80 mt-0.5 text-center font-bold">
                    {cat.count}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Divider (breaking container padding to stretch full screen width) */}
      <View className="h-[1px] bg-slate-100 mb-6" style={{ marginHorizontal: -24 }} />

      {/* 2. Next-Level Drag Card Deck Carousel */}
      {!isReady ? (
        <OffersSkeleton />
      ) : (
        <View className="h-52 relative justify-center items-center select-none mb-8">

          {/* Card 1: Flagship Smartphones */}
          <Animated.View
            {...(((0 - activeIndex + 6) % 6) === 0 ? panResponder.panHandlers : {})}
            style={[
              getCardStyle(((0 - activeIndex + 6) % 6), 1),
              { backgroundColor: '#171412' }
            ]}
            pointerEvents={((0 - activeIndex + 6) % 6) === 0 ? 'auto' : 'none'}
            className="rounded-3xl shadow-lg border border-white/10 overflow-hidden"
          >
            <View className="p-5 flex-row justify-between items-center w-full h-full">
            <View className="absolute right-[-20] top-[-20] w-40 h-40 rounded-full" style={{ backgroundColor: 'rgba(212, 175, 55, 0.18)' }} />
            <View className="absolute left-[-20] bottom-[-20] w-28 h-28 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
            <View className="flex-1 justify-center pr-2 z-10">
              <View className="flex-row items-center border border-red-500/35 bg-red-600/95 px-3 py-1 rounded-xl self-start mb-3 gap-2">
                <View className="flex-col justify-center">
                  <Text className="text-red-200 font-extrabold text-[8px] uppercase tracking-widest leading-none">OFF</Text>
                  <Text className="text-white font-black text-[16px] leading-none mt-0.5">15%</Text>
                </View>
                <MaterialIcons name="local-offer" size={18} color="#FFF" />
              </View>
              <Text className="text-white text-[17px] font-black tracking-tight mb-1 leading-tight">Flagship Smartphones</Text>
              <Text className="text-slate-300 text-[10.5px] font-semibold leading-relaxed">Next-gen 55G mobile devices</Text>
              <View className="flex-row items-center mt-3.5 opacity-60">
                <Ionicons name="cart-outline" size={11} color="#94A3B8" style={{ marginRight: 4 }} />
                <Text className="text-slate-400 text-[8px] font-extrabold uppercase tracking-widest">Shop now</Text>
              </View>
            </View>
            <View className="w-28 h-28 items-center justify-center relative z-10">
              <Image source={require('../../assets/offers-mockup/phone-mockup.png')} style={{ width: '100%', height: '100%' }} contentFit="contain" priority="high" />
            </View>
            </View>
          </Animated.View>

          {/* Card 2: AeroSpace Sports Kicks */}
          <Animated.View
            {...(((1 - activeIndex + 6) % 6) === 0 ? panResponder.panHandlers : {})}
            style={[
              getCardStyle(((1 - activeIndex + 6) % 6), 2),
              { backgroundColor: '#25080C' }
            ]}
            pointerEvents={((1 - activeIndex + 6) % 6) === 0 ? 'auto' : 'none'}
            className="rounded-3xl shadow-lg border border-white/10 overflow-hidden"
          >
            <View className="p-5 flex-row justify-between items-center w-full h-full">
            <View className="absolute right-[-20] top-[-20] w-40 h-40 rounded-full" style={{ backgroundColor: 'rgba(220, 38, 38, 0.18)' }} />
            <View className="absolute left-[-20] bottom-[-20] w-28 h-28 rounded-full" style={{ backgroundColor: 'rgba(139, 92, 246, 0.08)' }} />
            <View className="flex-1 justify-center pr-2 z-10">
              <View className="flex-row items-center border border-red-500/35 bg-red-600/95 px-3 py-1 rounded-xl self-start mb-3 gap-2">
                <View className="flex-col justify-center">
                  <Text className="text-red-200 font-extrabold text-[8px] uppercase tracking-widest leading-none">OFF</Text>
                  <Text className="text-white font-black text-[16px] leading-none mt-0.5">30%</Text>
                </View>
                <MaterialIcons name="local-offer" size={18} color="#FFF" />
              </View>
              <Text className="text-white text-[17px] font-black tracking-tight mb-1 leading-tight">AeroSpace Sports Kicks</Text>
              <Text className="text-slate-300 text-[10.5px] font-semibold leading-relaxed">High-performance running sneakers</Text>
              <View className="flex-row items-center mt-3.5 opacity-60">
                <Ionicons name="cart-outline" size={11} color="#94A3B8" style={{ marginRight: 4 }} />
                <Text className="text-slate-400 text-[8px] font-extrabold uppercase tracking-widest">Shop now</Text>
              </View>
            </View>
            <View className="w-28 h-28 items-center justify-center relative z-10">
              <Image source={require('../../assets/offers-mockup/shoes-mockup.png')} style={{ width: '100%', height: '100%' }} contentFit="contain" priority="high" />
            </View>
            </View>
          </Animated.View>

          {/* Card 3: Classic Fitted Men Polos */}
          <Animated.View
            {...(((2 - activeIndex + 6) % 6) === 0 ? panResponder.panHandlers : {})}
            style={[
              getCardStyle(((2 - activeIndex + 6) % 6), 3),
              { backgroundColor: '#1A2332' }
            ]}
            pointerEvents={((2 - activeIndex + 6) % 6) === 0 ? 'auto' : 'none'}
            className="rounded-3xl shadow-lg border border-white/10 overflow-hidden"
          >
            <View className="p-5 flex-row justify-between items-center w-full h-full">
            <View className="absolute right-[-20] top-[-20] w-40 h-40 rounded-full" style={{ backgroundColor: 'rgba(59, 130, 246, 0.18)' }} />
            <View className="absolute left-[-20] bottom-[-20] w-28 h-28 rounded-full" style={{ backgroundColor: 'rgba(14, 165, 233, 0.08)' }} />
            <View className="flex-1 justify-center pr-2 z-10">
              <View className="flex-row items-center border border-red-500/35 bg-red-600/95 px-3 py-1 rounded-xl self-start mb-3 gap-2">
                <View className="flex-col justify-center">
                  <Text className="text-red-200 font-extrabold text-[8px] uppercase tracking-widest leading-none">OFF</Text>
                  <Text className="text-white font-black text-[16px] leading-none mt-0.5">25%</Text>
                </View>
                <MaterialIcons name="local-offer" size={18} color="#FFF" />
              </View>
              <Text className="text-white text-[17px] font-black tracking-tight mb-1 leading-tight">Classic Fitted Men Polos</Text>
              <Text className="text-slate-300 text-[10.5px] font-semibold leading-relaxed">Premium combed organic cotton pique</Text>
              <View className="flex-row items-center mt-3.5 opacity-60">
                <Ionicons name="cart-outline" size={11} color="#94A3B8" style={{ marginRight: 4 }} />
                <Text className="text-slate-400 text-[8px] font-extrabold uppercase tracking-widest">Shop now</Text>
              </View>
            </View>
            <View className="w-28 h-28 items-center justify-center relative z-10">
              <Image source={require('../../assets/offers-mockup/polo-mockup.png')} style={{ width: '100%', height: '100%' }} contentFit="contain" priority="high" />
            </View>
            </View>
          </Animated.View>

          {/* Card 4: Luxurious Silk Dresses */}
          <Animated.View
            {...(((3 - activeIndex + 6) % 6) === 0 ? panResponder.panHandlers : {})}
            style={[
              getCardStyle(((3 - activeIndex + 6) % 6), 4),
              { backgroundColor: '#1A0B2E' }
            ]}
            pointerEvents={((3 - activeIndex + 6) % 6) === 0 ? 'auto' : 'none'}
            className="rounded-3xl shadow-lg border border-white/10 overflow-hidden"
          >
            <View className="p-5 flex-row justify-between items-center w-full h-full">
            <View className="absolute right-[-20] top-[-20] w-40 h-40 rounded-full" style={{ backgroundColor: 'rgba(168, 85, 247, 0.18)' }} />
            <View className="absolute left-[-20] bottom-[-20] w-28 h-28 rounded-full" style={{ backgroundColor: 'rgba(236, 72, 153, 0.08)' }} />
            <View className="flex-1 justify-center pr-2 z-10">
              <View className="flex-row items-center border border-red-500/35 bg-red-600/95 px-3 py-1 rounded-xl self-start mb-3 gap-2">
                <View className="flex-col justify-center">
                  <Text className="text-red-200 font-extrabold text-[8px] uppercase tracking-widest opacity-80 leading-none">OFF</Text>
                  <Text className="text-white font-black text-[16px] leading-none mt-0.5">10%</Text>
                </View>
                <MaterialIcons name="local-offer" size={18} color="#FFF" />
              </View>
              <Text className="text-white text-[17px] font-black tracking-tight mb-1 leading-tight">Luxurious Silk Dresses</Text>
              <Text className="text-slate-300 text-[10.5px] font-semibold leading-relaxed">Elegantly tailored evening wear</Text>
              <View className="flex-row items-center mt-3.5 opacity-60">
                <Ionicons name="cart-outline" size={11} color="#94A3B8" style={{ marginRight: 4 }} />
                <Text className="text-slate-400 text-[8px] font-extrabold uppercase tracking-widest">Shop now</Text>
              </View>
            </View>
            <View className="w-28 h-28 items-center justify-center relative z-10">
              <Image source={require('../../assets/offers-mockup/Dresses-mockup.png')} style={{ width: '100%', height: '100%' }} contentFit="contain" priority="high" />
            </View>
            </View>
          </Animated.View>

          {/* Card 5: Chronograph Watches */}
          <Animated.View
            {...(((4 - activeIndex + 6) % 6) === 0 ? panResponder.panHandlers : {})}
            style={[
              getCardStyle(((4 - activeIndex + 6) % 6), 5),
              { backgroundColor: '#2C1D11' }
            ]}
            pointerEvents={((4 - activeIndex + 6) % 6) === 0 ? 'auto' : 'none'}
            className="rounded-3xl shadow-lg border border-white/10 overflow-hidden"
          >
            <View className="p-5 flex-row justify-between items-center w-full h-full">
            <View className="absolute right-[-20] top-[-20] w-40 h-40 rounded-full" style={{ backgroundColor: 'rgba(249, 115, 22, 0.18)' }} />
            <View className="absolute left-[-20] bottom-[-20] w-28 h-28 rounded-full" style={{ backgroundColor: 'rgba(234, 179, 8, 0.08)' }} />
            <View className="flex-1 justify-center pr-2 z-10">
              <View className="flex-row items-center border border-red-500/35 bg-red-600/95 px-3 py-1 rounded-xl self-start mb-3 gap-2">
                <View className="flex-col justify-center">
                  <Text className="text-red-200 font-extrabold text-[8px] uppercase tracking-widest leading-none">OFF</Text>
                  <Text className="text-white font-black text-[16px] leading-none mt-0.5">20%</Text>
                </View>
                <MaterialIcons name="local-offer" size={18} color="#FFF" />
              </View>
              <Text className="text-white text-[17px] font-black tracking-tight mb-1 leading-tight">Chronograph Watches</Text>
              <Text className="text-slate-300 text-[10.5px] font-semibold leading-relaxed">Automatic mechanical timepieces</Text>
              <View className="flex-row items-center mt-3.5 opacity-60">
                <Ionicons name="cart-outline" size={11} color="#94A3B8" style={{ marginRight: 4 }} />
                <Text className="text-slate-400 text-[8px] font-extrabold uppercase tracking-widest">Shop now</Text>
              </View>
            </View>
            <View className="w-28 h-28 items-center justify-center relative z-10">
              <Image source={require('../../assets/offers-mockup/watch-mockup.png')} style={{ width: '100%', height: '100%' }} contentFit="contain" priority="high" />
            </View>
            </View>
          </Animated.View>

          {/* Card 6: PlayStation 5 Console */}
          <Animated.View
            {...(((5 - activeIndex + 6) % 6) === 0 ? panResponder.panHandlers : {})}
            style={[
              getCardStyle(((5 - activeIndex + 6) % 6), 6),
              { backgroundColor: '#0A0F24' }
            ]}
            pointerEvents={((5 - activeIndex + 6) % 6) === 0 ? 'auto' : 'none'}
            className="rounded-3xl shadow-lg border border-white/10 overflow-hidden"
          >
            <View className="p-5 flex-row justify-between items-center w-full h-full">
            <View className="absolute right-[-20] top-[-20] w-40 h-40 rounded-full" style={{ backgroundColor: 'rgba(59, 130, 246, 0.18)' }} />
            <View className="absolute left-[-20] bottom-[-20] w-28 h-28 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
            <View className="flex-1 justify-center pr-2 z-10">
              <View className="flex-row items-center border border-red-500/35 bg-red-600/95 px-3 py-1 rounded-xl self-start mb-3 gap-2">
                <View className="flex-col justify-center">
                  <Text className="text-red-200 font-extrabold text-[8px] uppercase tracking-widest leading-none">OFF</Text>
                  <Text className="text-white font-black text-[16px] leading-none mt-0.5">20%</Text>
                </View>
                <MaterialIcons name="local-offer" size={18} color="#FFF" />
              </View>
              <Text className="text-white text-[17px] font-black tracking-tight mb-1 leading-tight">PlayStation 5 Console</Text>
              <Text className="text-slate-300 text-[10.5px] font-semibold leading-relaxed">Next-gen gaming & 4K HDR entertainment</Text>
              <View className="flex-row items-center mt-3.5 opacity-60">
                <Ionicons name="cart-outline" size={11} color="#94A3B8" style={{ marginRight: 4 }} />
                <Text className="text-slate-400 text-[8px] font-extrabold uppercase tracking-widest">Shop now</Text>
              </View>
            </View>
            <View className="w-28 h-28 items-center justify-center relative z-10">
              <Image source={require('../../assets/offers-mockup/ps-mockup.png')} style={{ width: '100%', height: '100%' }} contentFit="contain" priority="high" />
            </View>
            </View>
          </Animated.View>

          {/* Vertical Stack Indicators on the Right Side */}
          <View className="absolute right-0 top-0 bottom-0 justify-center items-center w-6 gap-2">
            {OFFERS.map((_, idx) => {
              const isCurrent = activeIndex === idx;
              return (
                <View
                  key={idx}
                  className={`w-[5px] rounded-full transition-all duration-300 ${isCurrent ? 'h-5 bg-[#D74A33]' : 'h-1.5 bg-gray-200'
                    }`}
                />
              );
            })}
          </View>
        </View>
      )}

      {/* 3. "For You" Section (New Stock, Best Seller, Offers, grouped by category) */}
      {!isReady ? (
        <ForYouSkeleton />
      ) : (
        <View className="z-50 mt-4 mb-0 bg-slate-50 border-t border-slate-100 pt-6 pb-28 px-4" style={{ marginHorizontal: -24 }}>
          <View className="flex-row justify-between items-center bg-white border border-slate-200/50 py-2.5 px-4 rounded-2xl mb-6 relative z-50 shadow-sm shadow-slate-100/40">
            <View className="flex-row items-center gap-2">
              <Text className="text-[12.5px] font-black text-slate-800 uppercase tracking-wider">
                For You
              </Text>
            </View>

            {/* Custom Dropdown Selector */}
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
                  borderColor: showDropdown ? '#D74A33' : '#E2E8F0'
                })}
                className="flex-row items-center bg-slate-50 border px-3.5 py-1.5 rounded-full gap-2 shadow-sm shadow-black/[0.01]"
              >
                <Ionicons name={layoutMode === 'grid' ? "grid" : "list"} size={13} color="#D74A33" />
                <Text className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none">
                  {layoutMode === 'grid' ? 'Grid View' : 'List View'}
                </Text>
                <Ionicons name={showDropdown ? "chevron-up" : "chevron-down"} size={11} color="#64748B" />
              </Pressable>

              {showDropdown && (
                <View
                  style={{
                    shadowColor: '#0F172A',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                    elevation: 5,
                    borderColor: '#E2E8F0',
                  }}
                  className="absolute right-0 top-11 bg-white border rounded-2xl w-44 z-50 overflow-hidden"
                >
                  {/* Grid Option */}
                  <Pressable
                    onPress={() => {
                      triggerLightHaptic();
                      setShowDropdown(false);
                      if (layoutMode !== 'grid') {
                        setIsSwitchingLayout(true);
                        setTimeout(() => {
                          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                          setLayoutMode('grid');
                          setVisibleCount(4);
                          setIsSwitchingLayout(false);
                        }, 400);
                      }
                    }}
                    style={({ pressed }) => ({
                      backgroundColor: pressed ? '#F8FAFC' : (layoutMode === 'grid' ? '#FEF2F2' : 'transparent'),
                    })}
                    className="flex-col px-4 py-3 border-b border-slate-100"
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className={`text-[10.5px] font-black uppercase tracking-wider ${layoutMode === 'grid' ? 'text-[#D74A33]' : 'text-slate-700'}`}>
                        Grid View
                      </Text>
                      {layoutMode === 'grid' && (
                        <Ionicons name="checkmark-circle" size={13} color="#D74A33" />
                      )}
                    </View>
                    <Text className="text-[7.5px] text-slate-400 font-semibold tracking-wide mt-0.5">
                      2 columns card view
                    </Text>
                  </Pressable>

                  {/* List Option */}
                  <Pressable
                    onPress={() => {
                      triggerLightHaptic();
                      setShowDropdown(false);
                      if (layoutMode !== 'list') {
                        setIsSwitchingLayout(true);
                        setTimeout(() => {
                          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                          setLayoutMode('list');
                          setVisibleCount(4);
                          setIsSwitchingLayout(false);
                        }, 400);
                      }
                    }}
                    style={({ pressed }) => ({
                      backgroundColor: pressed ? '#F8FAFC' : (layoutMode === 'list' ? '#FEF2F2' : 'transparent'),
                    })}
                    className="flex-col px-4 py-3"
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className={`text-[10.5px] font-black uppercase tracking-wider ${layoutMode === 'list' ? 'text-[#D74A33]' : 'text-slate-700'}`}>
                        List View
                      </Text>
                      {layoutMode === 'list' && (
                        <Ionicons name="checkmark-circle" size={13} color="#D74A33" />
                      )}
                    </View>
                    <Text className="text-[7.5px] text-slate-400 font-semibold tracking-wide mt-0.5">
                      1 column strip view
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>

          {/* Sections: New Stock, Best Seller, Offers */}
          {isSwitchingLayout ? (
            <View className="py-16 items-center justify-center bg-white border border-slate-200/50 rounded-3xl mb-4 h-60">
              <ActivityIndicator size="small" color="#D74A33" />
              <Text className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-3">Loading Catalog...</Text>
            </View>
          ) : (
            (() => {
              let globalRenderCount = 0;
              return sectionsConfig.map((section, idx) => {
                const categories = Object.keys(section.data);
                if (categories.length === 0) return null;

                // Pre-process categories to strictly limit global card counts to visibleCount
                const filteredCategoriesData: { [key: string]: NewProduct[] } = {};
                for (const category of categories) {
                  const prods = section.data[category] || [];
                  const allowedProds = [];
                  for (const p of prods) {
                    if (globalRenderCount < visibleCount) {
                      allowedProds.push(p);
                      globalRenderCount++;
                    }
                  }
                  if (allowedProds.length > 0) {
                    filteredCategoriesData[category] = allowedProds;
                  }
                }

                const visibleCategories = Object.keys(filteredCategoriesData);
                if (visibleCategories.length === 0) return null;

                const isLast = idx === sectionsConfig.length - 1;
                return (
                  <View
                    key={section.title}
                    style={{
                      borderColor: '#E2E8F0',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.03,
                      shadowRadius: 2,
                      elevation: 1
                    }}
                    className={`bg-white border rounded-3xl p-4 ${isLast ? "" : "mb-4"
                      }`}
                  >
                    {/* Section Header Banner */}
                    <View className="flex-row items-center justify-between border-b border-slate-100 pb-2.5 mb-4 mt-1">
                      <View className="flex-row items-center gap-2">
                        <View>
                          <Text className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
                            {section.title}
                          </Text>
                          <Text className="text-[8px] text-slate-400 font-semibold tracking-wide">
                            {section.title === 'New Stock' ? 'Fresh arrivals just landed' : 'Most popular picks'}
                          </Text>
                        </View>
                      </View>
                      {/* Visual badge showing total item count in section */}
                      <View className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100/80">
                        <Text className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest">
                          {Object.values(section.data).flat().length} items
                        </Text>
                      </View>
                    </View>

                    {/* Category Sub-sections */}
                    {visibleCategories.map((category) => {
                      const prods = filteredCategoriesData[category];
                      return (
                        <View key={category} className="mb-5">
                          {/* Category Label Pill Badge */}
                          <View className="flex-row items-center bg-gray-50 border border-gray-100/60 px-3 py-1.5 rounded-full mb-3.5 gap-1.5 self-start shadow-sm shadow-black/[0.01]">
                            <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: section.color }} />
                            {CATEGORY_ICONS[category] && (
                              CATEGORY_ICONS[category].type === 'svg' ? (
                                <Svg width={11} height={11} viewBox="0 0 512 512">
                                  <Path d="M437.217 419.258C440.066 428.699 434.334 435.022 425.016 433.743C397.462 429.959 370.604 433.805 344.207 441.771C326.577 447.091 310.19 455.19 294.216 464.275C276.288 474.471 256.871 479.863 236.305 481.38C195.365 484.399 157.629 473.029 121.177 455.913C107.589 449.533 94.5627 442.113 82.1446 433.659C74.6003 428.524 73.628 422.709 79.2622 415.583C105.515 382.379 130.837 348.499 153.414 312.656C170.744 285.141 186.744 256.95 198.227 226.346C205.72 206.375 205.431 187.15 196.072 167.868C191.791 159.05 188.711 149.742 187.518 139.83C186.427 130.764 187.651 122.06 191.519 114.066C198.016 100.638 197.541 87.1229 194.057 73.1968C191.873 64.4643 189.267 55.8916 186.117 47.4592C183.524 40.5155 185.845 34.8979 191.867 32.7057C197.614 30.6139 202.721 33.3059 205.453 40.1709C211.381 55.0676 215.598 70.4301 217.243 86.413C217.5 88.9117 218.276 90.2144 220.688 91.1262C233.113 95.8232 244.475 102.356 254.156 111.551C256.292 113.579 257.787 113.627 259.982 111.543C269.525 102.484 280.496 95.6473 292.945 91.3021C295.466 90.4219 296.505 89.0715 296.77 86.2857C298.293 70.2766 302.748 54.9636 308.537 40.0328C311.155 33.2814 316.938 30.673 322.873 33.1319C328.102 35.298 330.226 41.1752 327.846 47.4698C323.363 59.3305 319.786 71.4271 317.928 83.9938C316.744 92.003 316.436 100.048 320.123 107.489C330.145 127.711 327.747 147.437 318.329 167.014C312.76 178.591 309.377 190.684 310.341 203.653C311.116 214.062 314.648 223.815 318.465 233.385C332.494 268.553 352.235 300.585 373.125 331.962C392.251 360.69 412.924 388.282 434.505 415.203C435.439 416.368 436.211 417.662 437.217 419.258ZM299.285 241.113C297.636 236.4 295.973 231.692 294.339 226.973C289.623 213.35 288.265 199.442 290.681 185.18C292.507 174.398 296.508 164.374 301.1 154.55C307.956 139.878 307.512 125.652 298.596 111.751C297.993 111.892 297.336 111.976 296.733 112.201C295.643 112.607 294.559 113.045 293.518 113.562C282.926 118.826 273.841 125.912 266.411 135.21C260.479 142.633 253.659 142.434 247.567 135.267C244.767 131.973 241.871 128.709 238.667 125.819C231.738 119.568 223.934 114.699 215.389 111.57C206.488 126.069 205.931 140.356 213.094 154.979C214.192 157.22 215.13 159.541 216.125 161.833C224.835 181.891 227.143 202.283 220.74 223.621C214.182 245.474 204.491 265.88 193.592 285.758C168.201 332.065 137.596 374.873 105.207 416.461C101.553 421.154 101.567 421.537 106.791 424.6C128.583 437.374 151.435 447.761 175.833 454.458C198.01 460.545 220.483 463.042 243.485 459.829C261.512 457.311 277.451 449.862 293.169 441.174C326.319 422.851 361.728 412.203 399.865 411.62C401.208 411.599 402.886 412.304 403.976 410.376C403.037 409.076 402.107 407.716 401.105 406.41C381.022 380.217 361.75 353.448 344.122 325.531C327.204 298.739 311.261 271.415 299.285 241.113Z" fill={section.color} stroke={section.color} strokeWidth={18} strokeLinejoin="round" />
                                </Svg>
                              ) : CATEGORY_ICONS[category].type === 'material' ? (
                                <MaterialCommunityIcons name={CATEGORY_ICONS[category].icon as any} size={11} color={section.color} />
                              ) : CATEGORY_ICONS[category].type === 'material-icons' ? (
                                <MaterialIcons name={CATEGORY_ICONS[category].icon as any} size={11} color={section.color} />
                              ) : (
                                <Ionicons name={CATEGORY_ICONS[category].icon as any} size={11} color={section.color} />
                              )
                            )}
                            <Text className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">
                              {category}
                            </Text>
                          </View>

                          {/* Products Grid or List */}
                          {layoutMode === 'grid' ? (
                            <View className="flex-row flex-wrap justify-between">
                              {prods.map((product) => (
                                <NewProductCard
                                  key={product.id}
                                  product={product}
                                  cartQty={cart[product.id] || 0}
                                  onUpdateQty={(delta) => updateCartQty(product.id, delta, product as any)}
                                  onPress={() => setSelectedProduct(product)}
                                  isGrid={true}
                                  onBuyNow={() => onBuyNow && onBuyNow(product.id)}
                                />
                              ))}
                            </View>
                          ) : (
                            <View className="flex-col">
                              {prods.map((product) => (
                                <NewProductCard
                                  key={product.id}
                                  product={product}
                                  cartQty={cart[product.id] || 0}
                                  onUpdateQty={(delta) => updateCartQty(product.id, delta, product as any)}
                                  onPress={() => setSelectedProduct(product)}
                                  isGrid={false}
                                  onBuyNow={() => onBuyNow && onBuyNow(product.id)}
                                />
                              ))}
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                );
              });
            })()
          )}

          {/* Global Infinite Scroll Loading Indicator */}
          {(() => {
            const totalItems = sectionsConfig.reduce((total, section) => {
              return total + Object.values(section.data).flat().length;
            }, 0);
            const hasMore = totalItems > visibleCount;

            return hasMore ? (
              <View className="pt-4 pb-20 items-center justify-center">
                <ActivityIndicator size="small" color="#D74A33" />
              </View>
            ) : null;
          })()}
        </View>
      )}

      {/* Hidden pre-load container to immediately decode and cache all offer images on mount */}
      <View style={{ width: 0, height: 0, opacity: 0 }} pointerEvents="none">
        <Image source={require('../../assets/offers-mockup/phone-mockup.png')} style={{ width: 1, height: 1 }} priority="high" />
        <Image source={require('../../assets/offers-mockup/shoes-mockup.png')} style={{ width: 1, height: 1 }} priority="high" />
        <Image source={require('../../assets/offers-mockup/polo-mockup.png')} style={{ width: 1, height: 1 }} priority="high" />
        <Image source={require('../../assets/offers-mockup/Dresses-mockup.png')} style={{ width: 1, height: 1 }} priority="high" />
        <Image source={require('../../assets/offers-mockup/watch-mockup.png')} style={{ width: 1, height: 1 }} priority="high" />
        <Image source={require('../../assets/offers-mockup/ps-mockup.png')} style={{ width: 1, height: 1 }} priority="high" />
      </View>
    </ScrollView>
  );
};

export default ShopView;
