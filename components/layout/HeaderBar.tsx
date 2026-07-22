import React, { useState, useEffect, useRef } from 'react';
import { View, Pressable, Text, TextInput, Animated, Dimensions, Keyboard, ScrollView, BackHandler } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Path } from 'react-native-svg';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { TabType, Cart } from '../types';
import { fetchAllProducts } from '../../lib/fetchAllProducts';
import { NewProduct } from '../../lib/products';

interface HeaderBarProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  activeCategoryTitle?: string;
  cart: Cart;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  triggerLightHaptic: () => void;
  startSplashAnimation: () => void;
  setIsCartDrawerOpen: (open: boolean) => void;
  isSearchActive: boolean;
  setIsSearchActive: (active: boolean) => void;
  onProductSelect?: (product: any) => void;
  onCategorySelect?: (categoryName: string) => void;
}

const renderProductCard = (product: any, onPress?: (p: any) => void) => (
  <Pressable 
    key={product.id} 
    onPress={() => onPress && onPress(product)}
    className="active:scale-95"
    style={{ 
      width: 150, 
      marginRight: 16, 
      backgroundColor: '#FFFFFF', 
      borderRadius: 20, 
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#F1F5F9',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 4
    }}
  >
    {/* Image Container with Overlay Badges */}
    <View style={{ width: '100%', height: 140, backgroundColor: '#F8FAFC', marginBottom: 12, position: 'relative', borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' }}>
      
      {/* Top Badges / Rating (Inside Image) */}
      <View style={{ position: 'absolute', top: 10, left: 10, right: 10, flexDirection: 'row', justifyContent: 'space-between', zIndex: 10 }}>
        {product.tag ? (
          <View style={{ backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}>
            <Text style={{ fontSize: 9, fontWeight: '900', color: product.tag === 'Best Seller' ? '#D74A33' : '#0284C7', textTransform: 'uppercase' }}>
              {product.tag === 'Best Seller' ? 'HOT' : 'NEW'}
            </Text>
          </View>
        ) : <View />}
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 6, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}>
          <Ionicons name="star" size={10} color="#F59E0B" />
          <Text style={{ fontSize: 10, fontWeight: '800', color: '#334155', marginLeft: 2 }}>{product.rating}</Text>
        </View>
      </View>

      <Image
        source={product.rootImage}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
        cachePolicy="disk"
        transition={200}
      />
    </View>
    
    {/* Info */}
    <View style={{ width: '100%', alignItems: 'flex-start', paddingHorizontal: 12, paddingBottom: 16 }}>
      <Text style={{ fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 2 }} numberOfLines={1}>
        {product.brand}
      </Text>
      <Text style={{ fontSize: 14, fontWeight: '800', color: '#0F172A', marginBottom: 8 }} numberOfLines={1}>
        {product.name}
      </Text>
      
      <Text style={{ fontSize: 16, color: '#D74A33', fontWeight: '900' }}>
        ${product.price.toFixed(2)}
      </Text>
    </View>
  </Pressable>
);

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentTab,
  setCurrentTab,
  cart,
  searchQuery,
  setSearchQuery,
  triggerLightHaptic,
  startSplashAnimation,
  setIsCartDrawerOpen,
  isSearchActive,
  setIsSearchActive,
  onProductSelect,
  onCategorySelect,
}) => {
  const [isOverlayMounted, setIsOverlayMounted] = useState(false);
  const slimeAnim = useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get('window').height;
  const [products, setProducts] = useState<NewProduct[]>([]);
  const [searchResults, setSearchResults] = useState<NewProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isSearchActive) {
      fetchAllProducts({ limit: 100 }).then(res => {
        setProducts(res.products);
      }).catch(err => console.error(err));
    }
  }, [isSearchActive]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetchAllProducts({ search: searchQuery, limit: 100 });
        setSearchResults(res.products);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useEffect(() => {
    if (isSearchActive) {
      const backAction = () => {
        handleCloseSearch();
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      return () => backHandler.remove();
    }
  }, [isSearchActive]);

  // Calculate total packs in the cart
  const totalPacks = Object.values(cart).reduce((a, b) => a + b, 0);

  const handleSearchClick = () => {
    triggerLightHaptic();
    setIsSearchActive(true);
    setIsOverlayMounted(true);
    setCurrentTab('home'); // Requirement: redirect to shop page
    
    // Trigger Slime Morphism spring animation to expand
    Animated.spring(slimeAnim, {
      toValue: 1,
      friction: 6, // bouncy slime feel
      tension: 50,
      useNativeDriver: true, // Perfect 60fps animation
    }).start();
  };

  const handleCloseSearch = () => {
    triggerLightHaptic();
    Keyboard.dismiss();
    setIsSearchActive(false); // Instantly revert header UI to normal
    setSearchQuery('');
    
    // Reverse slime animation for the dropdown overlay
    Animated.spring(slimeAnim, {
      toValue: 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start(() => {
      setIsOverlayMounted(false); // Unmount overlay when animation finishes
    });
  };

  const SearchSkeleton = () => {
    const pulseAnim = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0.3, duration: 1000, useNativeDriver: true })
        ])
      ).start();
    }, [pulseAnim]);

    return (
      <View style={{ gap: 16 }}>
        <Text style={{ fontSize: 13, fontWeight: '900', color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
          Searching Products...
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginHorizontal: -4, marginBottom: 12 }} contentContainerStyle={{ gap: 12, paddingBottom: 16 }}>
          {[1, 2, 3].map((_, i) => (
            <Animated.View key={i} style={{ opacity: pulseAnim, width: 150, height: 220, backgroundColor: '#F1F5F9', borderRadius: 20 }} />
          ))}
        </ScrollView>
        <View style={{ height: 1, backgroundColor: '#F1F5F9', marginBottom: 12 }} />
        <Text style={{ fontSize: 13, fontWeight: '900', color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          Suggestions
        </Text>
        {[1, 2, 3].map((_, i) => (
          <Animated.View key={i} style={{ opacity: pulseAnim, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16, padding: 8 }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1F5F9' }} />
            <View style={{ flex: 1, gap: 6 }}>
              <View style={{ width: 140, height: 16, backgroundColor: '#F1F5F9', borderRadius: 4 }} />
              <View style={{ width: 80, height: 12, backgroundColor: '#E2E8F0', borderRadius: 4 }} />
            </View>
          </Animated.View>
        ))}
      </View>
    );
  };

  const handleExecuteSearch = () => {
    triggerLightHaptic();
    Keyboard.dismiss();
  };

  return (
    <>
      {/* ── Full Screen Slime Morphism Overlay ── */}
      {isOverlayMounted && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 115,
            left: 0,
            right: 0,
            height: screenHeight,
            backgroundColor: '#ffffff',
            transform: [
              {
                translateY: slimeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-screenHeight, 0],
                })
              }
            ],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 10,
            zIndex: 1,
          }}
        >
          {/* Autocomplete Content */}
          <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()} accessible={false}>
            <Animated.View style={{ 
              opacity: slimeAnim, padding: 24, flex: 1,
              transform: [{ translateY: slimeAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }]
            }}>
              {searchQuery.trim() === '' ? (
              <>
                <Text style={{ fontSize: 13, fontWeight: '900', color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
                  Recent Products
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" style={{ flexGrow: 0, marginHorizontal: -4, marginBottom: 4 }} contentContainerStyle={{ paddingBottom: 28, paddingTop: 12, paddingLeft: 4, paddingRight: 24 }}>
                  {products.slice(0, 5).map(product => renderProductCard(product, (p) => {
                    handleCloseSearch();
                    if (onProductSelect) onProductSelect(p);
                  }))}
                </ScrollView>

                <View style={{ height: 1, backgroundColor: '#F1F5F9', marginBottom: 20 }} />

                <Text style={{ fontSize: 13, fontWeight: '900', color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
                  Recent Searches
                </Text>
                {[
                  { text: 'iPhone 15 Pro', type: 'Product' },
                  { text: 'Watches', type: 'Category' },
                  { text: 'PlayStation 5 Console', type: 'Product' },
                  { text: 'Shoes', type: 'Category' },
                  { text: 'Samsung Galaxy S24', type: 'Product' }
                ].map((item, i) => (
                  <Pressable key={i} onPress={() => {
                    if (item.type === 'Product') {
                      const p = products.find(prod => prod.name === item.text);
                      if (p) {
                        handleCloseSearch();
                        if (onProductSelect) onProductSelect(p);
                      }
                    } else if (item.type === 'Category') {
                      handleCloseSearch();
                      if (onCategorySelect) onCategorySelect(item.text);
                    }
                  }} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name="time-outline" size={16} color="#64748B" />
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#0F172A' }}>{item.text}</Text>
                  </Pressable>
                ))}
              </>
            ) : isSearching ? (
              <SearchSkeleton />
            ) : (
              (() => {
                const query = searchQuery.toLowerCase();
                const filteredProducts = searchResults;
                
                const matchingCategories = Array.from(new Set(filteredProducts.filter(p => p.category.toLowerCase().includes(query)).map(p => p.category))).slice(0, 2);
                const matchingTitles = Array.from(new Set(filteredProducts.filter(p => p.name.toLowerCase().includes(query)).map(p => p.name))).slice(0, 3);
                
                const suggestions = [
                  ...matchingCategories.map(c => ({ icon: 'grid-outline', text: c, type: 'Category' })),
                  ...matchingTitles.map(t => ({ icon: 'search-outline', text: t, type: 'Product' }))
                ];

                return (
                  <>
                    <Text style={{ fontSize: 13, fontWeight: '900', color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
                      Matching Products
                    </Text>
                    {filteredProducts.length > 0 ? (
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" style={{ flexGrow: 0, marginHorizontal: -4, marginBottom: 4 }} contentContainerStyle={{ paddingBottom: 28, paddingTop: 12, paddingLeft: 4, paddingRight: 24 }}>
                        {filteredProducts.slice(0, 8).map(product => renderProductCard(product, (p) => {
                          handleCloseSearch();
                          if (onProductSelect) onProductSelect(p);
                        }))}
                      </ScrollView>
                    ) : (
                      <View style={{ marginBottom: 24 }}>
                        <Text style={{ color: '#94A3B8', fontSize: 13 }}>No product cards found.</Text>
                      </View>
                    )}

                    <View style={{ height: 1, backgroundColor: '#F1F5F9', marginBottom: 20 }} />

                    <Text style={{ fontSize: 13, fontWeight: '900', color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
                      Suggestions
                    </Text>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 120 }}>
                      {suggestions.map((item, i) => (
                        <Pressable key={i} onPress={() => {
                          if (item.type === 'Product') {
                            const p = products.find(prod => prod.name === item.text);
                            if (p) {
                              handleCloseSearch();
                              if (onProductSelect) onProductSelect(p);
                            }
                          } else if (item.type === 'Category') {
                            handleCloseSearch();
                            if (onCategorySelect) onCategorySelect(item.text);
                          } else {
                            setSearchQuery(item.text);
                          }
                        }} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, padding: 8 }}>
                          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                            <Ionicons name={item.icon as any} size={16} color="#64748B" />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 15, fontWeight: '700', color: '#0F172A' }}>{item.text}</Text>
                            <Text style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Search in {item.type}</Text>
                          </View>
                          <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
                        </Pressable>
                      ))}
                      {suggestions.length === 0 && (
                        <View style={{ alignItems: 'center', marginTop: 20 }}>
                          <Ionicons name="search-outline" size={48} color="#CBD5E1" />
                          <Text style={{ textAlign: 'center', marginTop: 12, color: '#64748B', fontWeight: '600', fontSize: 16 }}>
                            No text suggestions found
                          </Text>
                        </View>
                      )}
                    </ScrollView>
                  </>
                );
              })()
            )}
            </Animated.View>
          </Pressable>
        </Animated.View>
      )}

      {/* ── Main Header UI ── */}
      <View style={{ zIndex: 2 }} className="flex-row justify-between items-center px-6 pt-16 pb-4 bg-white border-b border-gray-100 h-[115px] relative">
        {isSearchActive ? (
        /* Full Width Next-Level Search Header View */
        <View className="flex-1 flex-row items-center justify-between">
          <View className="flex-1 bg-gray-50 border border-gray-200 rounded-none px-4 h-11 flex-row items-center mr-3 shadow-inner">
            <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search wholesale catalog..."
              placeholderTextColor="#94A3B8"
              autoFocus
              className="flex-1 text-sm text-black font-semibold p-0 m-0"
              style={{ height: 24 }}
            />
          </View>

          {/* Action Buttons Outside the Input Box */}
          <View className="flex-row items-center gap-2">
            {/* Search Close Button */}
            <Pressable
              onPress={handleCloseSearch}
              className="w-11 h-11 bg-gray-100 border border-gray-200 rounded-none items-center justify-center active:scale-95 shadow-sm"
            >
              <Ionicons name="close-sharp" size={18} color="black" />
            </Pressable>

            {/* Search Execute Button */}
            <Pressable
              onPress={handleExecuteSearch}
              className="w-11 h-11 bg-[#D74A33] rounded-none items-center justify-center active:scale-95 shadow-sm"
            >
              <Ionicons name="checkmark-sharp" size={18} color="white" />
            </Pressable>
          </View>
        </View>
      ) : (
        /* Standard Header Bar View */
        <>
          {/* Reserved area for custom SVG Icon - pressable to start splash screen animation */}
          <Pressable
            onPress={() => {
              triggerLightHaptic();
              startSplashAnimation();
            }}
            style={{ width: 150, height: 44, justifyContent: 'center', alignItems: 'flex-start' }}
          >
            <Svg width={127} height={44} viewBox="0 0 964 333" fill="none">
              <Path d="M245.74 236.366C253.57 240.656 261.723 242.109 270.145 242.149C286.477 242.228 302.81 242.22 319.142 242.09C322.424 242.064 324.746 243.118 326.947 245.558C332.638 251.866 338.624 257.906 344.409 264.131C345.595 265.407 347.295 266.464 347.329 268.627C345.668 270.24 343.558 269.664 341.663 269.669C316.998 269.729 292.33 269.929 267.667 269.677C229.945 269.292 198.385 240.503 194.177 203.013C190.52 170.431 211.118 139.803 244.403 128.259C253.468 125.114 262.857 123.685 272.363 123.583C293.86 123.353 315.36 123.483 336.86 123.493C338.64 123.494 340.52 123.224 342.628 124.82C336.548 133.063 329.952 140.661 323.027 147.975C321.67 149.409 319.538 148.815 317.738 148.819C301.572 148.858 285.405 148.755 269.24 148.896C248.1 149.08 228.769 163.25 223.089 182.51C216.881 203.565 225.792 224.998 245.74 236.366Z" fill="black" />
              <Path d="M71.8772 239.766C48.2211 270.965 24.7705 301.873 1.29666 332.763C1.15309 332.952 0.686754 332.895 0.281812 332.97C-0.645735 331.03 0.944509 329.863 1.76275 328.602C31.4199 282.914 61.0782 237.226 90.8897 191.638C93.1614 188.164 93.2393 185.774 90.7923 182.378C69.8514 153.322 49.078 124.145 28.2803 94.9859C26.8744 93.0147 24.8596 91.3281 24.7628 88.6255C26.4189 86.7993 28.5368 87.3389 30.4545 87.336C54.4487 87.2995 78.4439 87.4237 102.436 87.2104C106.844 87.1713 109.363 88.7419 111.76 92.2883C120.62 105.397 129.793 118.294 138.876 131.251C139.806 132.577 140.469 134.217 143.035 135.001C177.768 90.1443 212.667 45.0721 247.565 0C248.069 0.354668 248.572 0.709327 249.075 1.064C214.249 54.6194 178.731 107.717 143.014 160.504C139.931 159.71 139.277 157.442 138.098 155.732C126.372 138.725 114.633 121.727 103.037 104.631C101.142 101.837 99.0256 100.715 95.6378 100.766C83.4768 100.948 71.3114 100.825 59.1477 100.861C56.8798 100.868 54.4976 100.574 52.2814 102.345C54.184 106.766 57.3073 110.243 59.973 113.977C76.1355 136.619 92.2836 159.273 108.689 181.738C111.531 185.631 111.015 188.113 108.266 191.67C96.0469 207.482 84.1166 223.518 71.8772 239.766Z" fill="#D74A33" />
              <Path d="M579.584 216.62C563.097 216.666 547.109 216.71 531.12 216.785C530.675 216.787 530.23 217.132 529.329 217.506C530.956 224.109 534.903 228.691 540.922 231.49C551.171 236.257 562.763 234.385 570.962 226.481C573.084 224.436 574.665 224.232 576.953 225.892C579.916 228.042 582.916 230.192 586.112 231.957C589.919 234.058 589.479 236.181 586.95 238.976C576.443 250.588 562.997 253.969 548.013 252.927C530.586 251.714 517.58 243.53 510.395 227.457C503.222 211.411 505.049 195.826 515.25 181.588C525.658 167.062 545.478 160.851 563.016 166.027C580.014 171.044 591.87 185.616 592.712 203.955C593.418 219.335 594.17 216.193 579.584 216.62ZM537.862 187.203C534.967 188.982 532.709 191.384 531.131 194.373C529.133 198.159 529.846 199.409 534.21 199.441C544.659 199.518 555.109 199.512 565.557 199.441C570.583 199.407 571.319 197.892 568.714 193.41C562.962 183.514 550.161 180.713 537.862 187.203Z" fill="black" />
              <Path d="M367.536 167.225C397.739 156.772 427.113 175.75 428.617 207.068C429.883 233.433 409.756 254.344 382.172 253.116C357.31 252.01 339.927 234.999 338.848 210.24C338.086 192.761 347.489 174.66 367.536 167.225ZM381.497 184.924C370.758 186.497 364.084 192.599 361.44 203.078C357.316 219.415 371.068 235.639 386.622 232.842C400.387 230.365 407.753 220.348 406.498 205.808C405.417 193.28 395.813 184.958 381.497 184.924Z" fill="black" />
              <Path d="M796.342 178.279C809.692 165.457 825.088 161.207 842.53 166.246C859.361 171.109 869.901 182.607 873.222 199.702C878.352 226.118 862.31 247.928 838.129 252.479C812.698 257.265 788.827 240.802 785.202 216.041C783.121 201.836 786.874 189.414 796.342 178.279ZM844.269 190.327C840.297 187.069 835.793 185.056 830.625 184.905C821.548 184.639 814.241 188.218 809.889 196.206C805.204 204.805 805.257 213.801 810.331 222.336C814.982 230.159 824.083 234.195 832.419 232.791C841.845 231.203 848.317 225.955 851.103 216.927C854.115 207.171 852.371 198.192 844.269 190.327Z" fill="black" />
              <Path d="M883.261 245.277C883.253 220.657 883.359 196.508 883.147 172.363C883.105 167.563 884.588 165.611 889.396 166.165C891.532 166.411 893.721 166.204 895.886 166.203C903.401 166.199 903.401 166.198 905.698 172.816C909.822 170.716 913.282 167.551 917.741 166.078C941.231 158.319 962.978 173.219 963.753 198.182C964.253 214.321 963.8 230.487 963.925 246.64C963.952 250.185 962.601 251.315 959.164 251.111C955.186 250.873 951.164 250.903 947.19 251.204C943.428 251.488 942.213 250.033 942.246 246.363C942.375 232.042 942.422 217.718 942.241 203.398C942.096 191.974 935.268 185.033 924.421 184.777C912.637 184.499 905.104 191.447 904.916 203.272C904.696 217.091 904.683 230.918 904.908 244.737C904.985 249.468 903.517 251.47 898.646 251.008C895.347 250.695 891.967 250.731 888.667 251.057C884.493 251.468 882.712 249.915 883.261 245.277Z" fill="black" />
              <Path d="M599.997 209.565C599.778 180.69 623.02 163.314 646.483 164.331C659.779 164.907 670.936 170.159 679.437 180.697C681.791 183.615 682.341 185.79 678.403 187.63C677.058 188.259 675.891 189.262 674.617 190.052C671.787 191.808 669.138 194.229 666.053 195.108C661.904 196.291 661.273 191.331 658.79 189.43C645.792 179.482 626.739 186.114 622.632 202.236C617.832 221.08 632.921 236.94 651.124 232.161C655.636 230.977 659.451 228.587 661.949 224.632C663.675 221.9 665.319 221.459 668.014 223.254C671.476 225.56 675.061 227.708 678.731 229.665C681.975 231.395 681.95 233.327 679.922 236C673.295 244.735 664.695 250.176 653.905 252.343C628.969 257.351 606.121 242.617 600.855 217.922C600.303 215.334 600.262 212.637 599.997 209.565Z" fill="black" />
              <Path d="M743.177 249.049C730.533 254.804 718.275 254.726 706.969 246.807C699.907 241.859 697.607 233.976 697.405 225.707C697.128 214.381 697.094 203.037 697.401 191.713C697.535 186.771 697.567 186.771 691.055 185.656C689.911 185.811 688.725 185.648 687.559 185.635C685.062 185.608 684.023 184.443 684.156 181.868C684.338 178.377 684.414 174.859 684.193 171.374C683.945 167.47 685.476 166.119 689.385 166.135C697.293 166.168 697.294 165.984 697.29 158.268C697.289 154.102 697.391 149.932 697.253 145.77C697.15 142.65 698.267 141.122 701.563 141.22C705.892 141.348 710.231 141.335 714.56 141.211C717.855 141.117 718.956 142.699 718.897 145.786C718.799 150.95 719.056 156.125 718.843 161.282C718.692 164.909 719.881 166.456 723.675 166.258C728.328 166.015 733.012 166.367 737.669 166.156C741.439 165.986 742.67 167.651 742.601 171.199C742.265 188.361 744.434 185.38 728.361 185.635C717.627 185.805 718.932 184.858 718.872 194.942C718.818 203.942 718.815 212.942 718.909 221.941C718.995 230.149 723.76 234.087 731.91 232.864C739.928 231.661 739.983 231.649 741.74 239.381C742.437 242.45 742.828 245.59 743.177 249.049Z" fill="black" />
              <Path d="M72.9506 309.866C70.5434 312.416 68.3924 314.721 66.2 316.986C66.0795 317.11 65.6148 316.902 64.3115 316.673C92.3225 276.277 120.566 236.598 149.953 196.302C170.69 223.875 190.717 250.504 211.411 278.019C205.131 279.28 199.981 278.156 195.024 278.854C186.754 280.02 181.703 276.811 177.253 269.72C169.299 257.046 160.214 245.08 151.581 232.833C150.542 231.358 149.374 229.974 147.886 228.061C122.358 255.032 97.8385 282.378 72.9506 309.866Z" fill="black" />
              <Path d="M226.338 130.271C214.525 137.544 205.526 147.107 198.799 158.718C197.005 157.759 197.611 156.763 197.969 155.908C210.945 124.95 232.353 103.657 266.177 96.8256C270.545 95.9434 275.101 95.6852 279.571 95.6676C305.539 95.5653 331.508 95.6026 357.477 95.6511C360.27 95.6563 363.064 96.0375 367.332 96.3534C360.896 103.792 355.293 110.425 349.483 116.873C348.056 118.457 345.691 117.795 343.726 117.8C319.922 117.85 296.116 118.039 272.313 117.838C255.887 117.699 240.77 121.895 226.338 130.271Z" fill="#D74A33" />
              <Path d="M475.383 169.522C475.389 156.868 475.511 144.713 475.339 132.562C475.281 128.443 476.765 126.839 480.879 127.088C484.86 127.328 488.872 127.247 492.861 127.08C496.38 126.933 497.364 128.412 497.341 131.855C497.136 163.303 497.084 194.751 497.016 226.199C497.001 233.018 496.906 239.847 497.225 246.653C497.398 250.35 495.695 251.37 492.531 251.361C488.711 251.351 484.885 251.246 481.073 251.415C476.746 251.607 475.315 249.707 475.337 245.439C475.469 220.301 475.391 195.161 475.383 169.522Z" fill="black" />
              <Path d="M445.108 251.274C439.615 252.112 438.156 249.924 438.181 244.901C438.363 207.784 438.366 170.666 438.17 133.55C438.144 128.507 439.625 126.995 444.657 127.008C459.949 127.05 459.944 126.848 459.938 142.025C459.923 176.146 459.916 210.268 459.9 244.389C459.896 251.262 459.597 251.534 452.504 251.386C450.179 251.338 447.853 251.288 445.108 251.274Z" fill="black" />
              <Path d="M753.234 172.626C752.621 167.619 754.498 165.714 759.109 166.162C761.909 166.435 764.758 166.199 767.585 166.206C774.841 166.224 774.871 166.227 774.875 173.28C774.889 194.399 774.879 215.519 774.875 236.639C774.874 240.131 774.785 243.625 774.877 247.114C774.948 249.834 773.664 251.028 771.057 251.232C765.257 251.684 759.521 251.058 753.233 250.744C753.233 224.6 753.233 198.856 753.234 172.626Z" fill="black" />
              <Path d="M761.921 153.878C754.209 151.99 750.042 147.332 749.81 140.805C749.583 134.422 753.711 128.465 759.643 126.615C765.826 124.687 772.411 126.934 775.909 132.345C778.881 136.941 778.906 141.939 776.497 146.625C773.619 152.222 768.65 154.545 761.921 153.878Z" fill="black" />
            </Svg>
          </Pressable>

          {/* Right Side Icons */}
          <View className="flex-row items-center gap-3">
            {/* Rounded Search Button */}
            <Pressable
              onPress={handleSearchClick}
              className="w-10 h-10 bg-gray-50 border border-gray-150 rounded-none items-center justify-center active:scale-95 shadow-sm"
            >
              <Ionicons name="search-outline" size={18} color="black" />
            </Pressable>

            {/* Rounded Cart Button with Badge */}
            <Pressable
              onPress={() => {
                triggerLightHaptic();
                setIsCartDrawerOpen(true);
              }}
              className="w-10 h-10 bg-[#D74A33] rounded-none items-center justify-center active:scale-95 relative shadow-sm"
            >
              <MaterialCommunityIcons name="cart" size={20} color="white" />
              {totalPacks > 0 && (
                <View className="absolute -top-2.5 -right-2.5 bg-black rounded-full px-1.5 min-w-[22px] h-[22px] items-center justify-center border border-white">
                  <Text className="text-[11px] text-white font-black">
                    {totalPacks > 20 ? '20+' : totalPacks}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </>
        )}
      </View>
    </>
  );
};

export default HeaderBar;
