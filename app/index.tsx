import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, View } from 'react-native';


import { ContactView } from '../components/contact/ContactView';
import { BottomTabBar } from '../components/layout/BottomTabBar';
import { HeaderBar } from '../components/layout/HeaderBar';
import { OffersView } from '../components/offers/OffersView';
import { OrdersView } from '../components/orders/OrdersView';
import { ProfileView } from '../components/profile/ProfileView';
import { ShopView } from '../components/shop/ShopView';
import SplashScreen from '../components/splash/SplashScreen';
import { SuccessModal } from '../components/SuccessModal';
import { Cart, Product, TabType } from '../components/types';
import { CartDrawer } from '../components/ui/CartDrawer';
import { NewProductDetailView } from '../components/ui/NewProductDetailView';
import { NewProduct } from '../lib/products';

export default function Index() {
  const [animationCompleted, setAnimationCompleted] = useState(false);

  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('cables');
  const [activeShopCategory, setActiveShopCategory] = useState<string | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<string>('ALL');

  // Product Detail State
  const [selectedNewProduct, setSelectedNewProduct] = useState<NewProduct | null>(null);
  const [activeDetailImg, setActiveDetailImg] = useState(0);

  // Order Cart State: { [productId]: packQuantity }
  const [cart, setCart] = useState<Cart>({});
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [cartDrawerStep, setCartDrawerStep] = useState<'cart' | 'checkout'>('cart');
  const [selectedOffersCategory, setSelectedOffersCategory] = useState<string>('All');

  // Intercept system/gesture back buttons (Android/iOS swipe)
  useEffect(() => {
    const onBackPress = () => {
      if (selectedNewProduct) {
        setSelectedNewProduct(null);
        return true;
      }
      if (activeShopCategory) {
        setActiveShopCategory(null);
        return true;
      }
      if (currentTab !== 'home') {
        setCurrentTab('home');
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [selectedNewProduct, currentTab]);

  // Standard Animated value for splash screen portal fade-in
  const mainPortalOpacity = useRef(new Animated.Value(0)).current;

  const startSplashAnimation = () => {
    mainPortalOpacity.setValue(0);
    setAnimationCompleted(false);
  };

  // Run new SVG splash screen on initial mount and dismiss after animation finishes (7.0s)
  useEffect(() => {
    if (!animationCompleted) {
      const timer = setTimeout(() => {
        Animated.timing(mainPortalOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
        setAnimationCompleted(true);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [animationCompleted]);

  const triggerSuccessHaptic = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) { }
  };

  const triggerLightHaptic = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) { }
  };

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

  const handleBuyNow = (productId: string) => {
    triggerLightHaptic();
    setCart((prev) => {
      const currentQty = prev[productId] || 0;
      if (currentQty === 0) {
        return { ...prev, [productId]: 1 };
      }
      return prev;
    });
    setCartDrawerStep('checkout');
    setIsCartDrawerOpen(true);
  };

  const handlePlaceOrderDirect = () => {
    triggerSuccessHaptic();
    setShowOrderSuccess(true);
  };

  const handleDismissSuccess = () => {
    triggerLightHaptic();
    setShowOrderSuccess(false);
    setCart({});
    setCurrentTab('home');
  };

  // Splash Loading Screen
  if (!animationCompleted) {
    return <SplashScreen />;
  }

  const activeCategoryTitle = activeShopCategory || '';

  return (
    <Animated.View style={{ flex: 1, opacity: mainPortalOpacity }} className="bg-white">
      <StatusBar style="dark" />

      {/* Global Header Bar */}
      <HeaderBar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeCategoryTitle={activeCategoryTitle}
        cart={cart}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        triggerLightHaptic={triggerLightHaptic}
        startSplashAnimation={startSplashAnimation}
        setIsCartDrawerOpen={(open: boolean) => {
          if (open) setCartDrawerStep('cart');
          setIsCartDrawerOpen(open);
        }}
        isSearchActive={isSearchActive}
        setIsSearchActive={setIsSearchActive}
        onProductSelect={(product) => {
          setSelectedNewProduct(product);
          setCurrentTab('home');
        }}
        onCategorySelect={(categoryName) => {
          setActiveShopCategory(categoryName);
          setSelectedNewProduct(null);
          setCurrentTab('home');
        }}
      />

      {/* 2. Main Tab Views */}
      <View className="flex-1">
        {currentTab === 'home' && (
          selectedNewProduct ? (
            <NewProductDetailView
              product={selectedNewProduct}
              onBack={() => setSelectedNewProduct(null)}
              cart={cart}
              updateCartQty={updateCartQty}
              onPlaceOrder={() => handleBuyNow(selectedNewProduct.id)}
              triggerLightHaptic={triggerLightHaptic}
              onProductSelect={setSelectedNewProduct}
            />
          ) : (
            <ShopView
              setCurrentTab={setCurrentTab}
              activeShopCategory={activeShopCategory}
              setActiveShopCategory={setActiveShopCategory}
              setSelectedCategoryId={setSelectedCategoryId}
              setActiveSubCategory={setActiveSubCategory}
              setSelectedNewProduct={setSelectedNewProduct}
              triggerLightHaptic={triggerLightHaptic}
              startSplashAnimation={startSplashAnimation}
              cart={cart}
              updateCartQty={updateCartQty}
              onBuyNow={handleBuyNow}
              onOfferPress={(category: string) => {
                setSelectedNewProduct(null);
                setSelectedOffersCategory(category);
                setCurrentTab('catalog');
              }}
            />
          )
        )}

        {currentTab === 'catalog' && (
          <View className="flex-1">
            {selectedNewProduct ? (
              <NewProductDetailView
                product={selectedNewProduct}
                onBack={() => setSelectedNewProduct(null)}
                cart={cart}
                updateCartQty={updateCartQty}
                onPlaceOrder={() => handleBuyNow(selectedNewProduct.id)}
                triggerLightHaptic={triggerLightHaptic}
                onProductSelect={setSelectedNewProduct}
              />
            ) : (
              <OffersView
                setSelectedNewProduct={setSelectedNewProduct}
                cart={cart}
                updateCartQty={updateCartQty}
                triggerLightHaptic={triggerLightHaptic}
                searchQuery={searchQuery}
                selectedCategory={selectedOffersCategory}
                setSelectedCategory={setSelectedOffersCategory}
              />
            )}
          </View>
        )}

        {currentTab === 'cart' && (
          <OrdersView
            cart={cart}
            setSelectedNewProduct={setSelectedNewProduct}
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

        {currentTab === 'profile' && (
          <ProfileView
            triggerLightHaptic={triggerLightHaptic}
          />
        )}
      </View>

      {/* 3. PREMIUM BOTTOM TAB BAR */}
      {/* 3. PREMIUM BOTTOM TAB BAR */}
      <View style={{ display: isSearchActive ? 'none' : 'flex' }}>
        <BottomTabBar
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            if (tab === 'catalog') {
              setSelectedOffersCategory('All');
            }
            setCurrentTab(tab);
          }}
          setSelectedNewProduct={setSelectedNewProduct}
          isDetailViewActive={!!selectedNewProduct}
          cart={cart}
          triggerLightHaptic={triggerLightHaptic}
          hasActiveDelivery={true} // Mock state to show the blue dot indicator
        />
      </View>

      {/* 4. ORDER CONFIRMED SUCCESS OVERLAY (Legacy) */}
      <SuccessModal
        showOrderSuccess={showOrderSuccess}
        setShowOrderSuccess={setShowOrderSuccess}
        setCart={setCart}
        handleDismissSuccess={handleDismissSuccess}
        triggerLightHaptic={triggerLightHaptic}
      />

      {/* 5. NEW FULL SCREEN CART DRAWER */}
      <CartDrawer
        isVisible={isCartDrawerOpen}
        initialStep={cartDrawerStep}
        onClose={() => setIsCartDrawerOpen(false)}
        onBrowse={() => {
          setIsCartDrawerOpen(false);
          setCurrentTab('home');
        }}
        cart={cart}
        updateCartQty={updateCartQty}
        clearCart={() => setCart({})}
        triggerLightHaptic={triggerLightHaptic}
      />
    </Animated.View>
  );
}
