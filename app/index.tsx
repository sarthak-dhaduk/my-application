import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, BackHandler } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';

import { Product, Cart } from '../components/types';
import { PRODUCTS, CATEGORIES } from '../components/constants';
import { DashboardView } from '../components/DashboardView';
import { CatalogView } from '../components/CatalogView';
import { ProductDetailView } from '../components/ProductDetailView';
import { CartView } from '../components/CartView';
import { ContactView } from '../components/ContactView';
import { SuccessModal } from '../components/SuccessModal';
import { BottomTabBar } from '../components/BottomTabBar';

export default function Index() {
  const [animationCompleted, setAnimationCompleted] = useState(false);
  
  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<'home' | 'catalog' | 'cart' | 'contact'>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('cables');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('ALL');

  // Product Detail State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeDetailImg, setActiveDetailImg] = useState(0);

  // Order Cart State: { [productId]: packQuantity }
  const [cart, setCart] = useState<Cart>({});
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  // Intercept system/gesture back buttons (Android/iOS swipe)
  useEffect(() => {
    const onBackPress = () => {
      if (selectedProduct) {
        setSelectedProduct(null);
        return true; // prevent default exit app
      }
      if (currentTab !== 'home') {
        setCurrentTab('home');
        return true; // redirect to home
      }
      return false; // perform default exit app action
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [selectedProduct, currentTab]);

  // Reanimated values for splash screen
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const logoRotate = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const mainPortalOpacity = useSharedValue(0);

  const startSplashAnimation = () => {
    logoScale.value = 0.3;
    logoOpacity.value = 0;
    logoRotate.value = 0;
    progressWidth.value = 0;
    mainPortalOpacity.value = 0;
    setAnimationCompleted(false);

    logoScale.value = withSpring(1, { damping: 14, stiffness: 80 });
    logoOpacity.value = withTiming(1, { duration: 900 });
    logoRotate.value = withTiming(360, { duration: 1100 });

    progressWidth.value = withDelay(
      600,
      withTiming(180, { duration: 1800 }, (finished) => {
        if (finished) {
          runOnJS(triggerSuccessHaptic)();
          mainPortalOpacity.value = withTiming(1, { duration: 500 });
          runOnJS(setAnimationCompleted)(true);
        }
      })
    );
  };

  useEffect(() => {
    startSplashAnimation();
  }, []);

  const triggerSuccessHaptic = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {}
  };

  const triggerLightHaptic = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
  };

  // Reanimated style definitions
  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [
        { scale: logoScale.value },
        { rotate: `${logoRotate.value}deg` },
      ],
    };
  });

  const progressAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: progressWidth.value,
    };
  });

  const portalAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: mainPortalOpacity.value,
    };
  });

  // Cart Helper functions
  const updateCartQty = (productId: string, delta: number, product: Product) => {
    triggerLightHaptic();
    setCart((prev) => {
      const currentQty = prev[productId] || 0;
      let newQty = currentQty + delta;
      
      if (newQty < 0) {
        newQty = 0;
      }
      
      const updated = { ...prev };
      if (newQty === 0) {
        delete updated[productId];
      } else {
        updated[productId] = newQty;
      }
      return updated;
    });
  };

  const handlePlaceOrderDirect = () => {
    triggerSuccessHaptic();
    setShowOrderSuccess(true);
  };

  const handleDismissSuccess = () => {
    triggerLightHaptic();
    setShowOrderSuccess(false);
    setCart({});
    setSelectedProduct(null);
    setCurrentTab('catalog');
  };

  // Splash Loading Screen
  if (!animationCompleted) {
    return (
      <View className="flex-1 justify-center items-center bg-[#090D1A]">
        <StatusBar style="light" />
        <View className="absolute w-[240] h-[240] bg-[#3B82F6]/10 rounded-full blur-[60px]" />
        <Animated.View style={[logoAnimatedStyle]} className="z-10 items-center justify-center">
          <View className="w-36 h-36 bg-[#161C30] border border-white/10 rounded-[36px] overflow-hidden items-center justify-center shadow-2xl shadow-[#3B82F6]/20">
            <Image
              source={require('../assets/images/splash-logo.png')}
              contentFit="cover"
              style={{ width: '100%', height: '100%' }}
            />
          </View>
        </Animated.View>
        <View className="mt-10 h-[3px] bg-[#161C30] rounded-full overflow-hidden" style={{ width: 180 }}>
          <Animated.View style={[progressAnimatedStyle]} className="h-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-full" />
        </View>
      </View>
    );
  }

  return (
    <Animated.View style={[portalAnimatedStyle]} className="flex-1 bg-[#090D1A]">
      <StatusBar style="light" />
      
      {/* 2. Main Tab Views */}
      <View className="flex-1">
        {currentTab === 'home' && (
          <DashboardView
            setCurrentTab={setCurrentTab}
            setSelectedCategoryId={setSelectedCategoryId}
            setActiveSubCategory={setActiveSubCategory}
            setSelectedProduct={setSelectedProduct}
            triggerLightHaptic={triggerLightHaptic}
            startSplashAnimation={startSplashAnimation}
          />
        )}

        {currentTab === 'catalog' && (
          <View className="flex-1 mb-20">
            {/* Header Section */}
            <View className="flex-row justify-between items-center px-6 pt-16 pb-4 bg-[#0E1325] border-b border-white/5">
              <View className="flex-1 pr-2">
                <Text className="text-xs text-[#3B82F6] font-extrabold uppercase tracking-widest">
                  Wholesale Catalog
                </Text>
                <Text className="text-2xl font-bold text-white mt-1">
                  VoltLine Distributor
                </Text>
              </View>
              <Pressable 
                onPress={() => {
                  triggerLightHaptic();
                  startSplashAnimation();
                }}
                className="w-12 h-12 bg-[#161C30] border border-white/10 rounded-none overflow-hidden items-center justify-center active:scale-95"
              >
                <Image
                  source={require('../assets/images/splash-logo.png')}
                  contentFit="cover"
                  style={{ width: '100%', height: '100%' }}
                />
              </Pressable>
            </View>

            {selectedProduct ? (
              <ProductDetailView
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
                activeDetailImg={activeDetailImg}
                setActiveDetailImg={setActiveDetailImg}
                cart={cart}
                updateCartQty={updateCartQty}
                onPlaceOrderDirect={handlePlaceOrderDirect}
                triggerLightHaptic={triggerLightHaptic}
              />
            ) : (
              <CatalogView
                selectedCategoryId={selectedCategoryId}
                setSelectedCategoryId={setSelectedCategoryId}
                activeSubCategory={activeSubCategory}
                setActiveSubCategory={setActiveSubCategory}
                setSelectedProduct={setSelectedProduct}
                cart={cart}
                updateCartQty={updateCartQty}
                triggerLightHaptic={triggerLightHaptic}
              />
            )}
          </View>
        )}

        {currentTab === 'cart' && (
          <CartView
            cart={cart}
            setSelectedProduct={setSelectedProduct}
            setCurrentTab={setCurrentTab}
            updateCartQty={updateCartQty}
            handlePlaceOrderDirect={handlePlaceOrderDirect}
            triggerLightHaptic={triggerLightHaptic}
          />
        )}

        {currentTab === 'contact' && (
          <ContactView
            triggerLightHaptic={triggerLightHaptic}
            triggerSuccessHaptic={triggerSuccessHaptic}
          />
        )}
      </View>

      {/* 3. PREMIUM BOTTOM TAB BAR */}
      <BottomTabBar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        setSelectedProduct={setSelectedProduct}
        cart={cart}
        triggerLightHaptic={triggerLightHaptic}
      />

      {/* 4. ORDER CONFIRMED SUCCESS OVERLAY */}
      <SuccessModal
        showOrderSuccess={showOrderSuccess}
        setShowOrderSuccess={setShowOrderSuccess}
        setCart={setCart}
        handleDismissSuccess={handleDismissSuccess}
        triggerLightHaptic={triggerLightHaptic}
      />
    </Animated.View>
  );
}
