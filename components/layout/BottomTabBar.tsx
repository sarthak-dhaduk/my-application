import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, Entypo, Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { Cart, TabType } from '../types';

interface BottomTabBarProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  setSelectedProduct: (product: any) => void;
  setSelectedNewProduct?: (product: any) => void;
  isDetailViewActive?: boolean;
  cart: Cart;
  triggerLightHaptic: () => void;
  hasActiveDelivery?: boolean;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentTab,
  setCurrentTab,
  setSelectedProduct,
  setSelectedNewProduct,
  isDetailViewActive,
  cart,
  triggerLightHaptic,
  hasActiveDelivery,
}) => {
  const totalPacks = Object.values(cart).reduce((a, b) => a + b, 0);

  const tabsConfig = [
    {
      key: 'home' as TabType,
      label: 'Shop',
      isEntypo: true,
      iconName: 'shopping-bag' as const,
    },
    {
      key: 'catalog' as TabType,
      label: 'Offers',
      isIonicons: true,
      iconActive: 'pricetags' as const,
      iconInactive: 'pricetags-outline' as const,
    },
    {
      key: 'cart' as TabType,
      label: 'Orders',
      isFeather: true,
      iconName: 'package' as const,
      hasBadge: true,
    },
    {
      key: 'contact' as TabType,
      label: 'Contact',
      isIonicons: true,
      iconActive: 'chatbubble-ellipses' as const,
      iconInactive: 'chatbubble-ellipses-outline' as const,
    },
    {
      key: 'profile' as TabType,
      label: 'Profile',
      isProfile: true,
    },
  ];

  return (
    <View className="absolute bottom-0 left-0 right-0 h-28 bg-white border-t border-gray-100 flex-row justify-around items-center px-2 pt-3 pb-9 shadow-lg shadow-black/5 z-50">
      {tabsConfig.map((tab) => {
        const isActive = !isDetailViewActive && currentTab === tab.key;

        // SPECIAL CASE: Center FAB for Orders
        if (tab.key === 'cart') {
          return (
            <Pressable
              key={tab.key}
              onPress={() => {
                triggerLightHaptic();
                setSelectedProduct(null);
                if (setSelectedNewProduct) setSelectedNewProduct(null);
                setCurrentTab(tab.key);
              }}
              className="flex-1 items-center justify-start relative"
            >
              <Animatable.View
                animation={isActive ? 'pulse' : undefined}
                duration={600}
                style={{ top: -20, alignItems: 'center' }}
              >
                <View style={{
                  width: 64, height: 64, borderRadius: 32, backgroundColor: '#D74A33',
                  alignItems: 'center', justifyContent: 'center',
                  shadowColor: '#D74A33', shadowOpacity: 0.6, shadowRadius: 15, shadowOffset: { width: 0, height: 8 },
                  elevation: 8, borderWidth: 5, borderColor: '#fff'
                }}>
                  <Feather name="package" size={24} color="#fff" />
                  {hasActiveDelivery && (
                    <View style={{
                      position: 'absolute', top: 0, right: 0, backgroundColor: '#3B82F6',
                      width: 16, height: 16, borderRadius: 8,
                      borderWidth: 2, borderColor: '#fff',
                      shadowColor: '#3B82F6', shadowOpacity: 0.5, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }
                    }} />
                  )}
                </View>
                <Text style={{ fontSize: 10, fontWeight: '900', color: isActive ? '#D74A33' : '#64748B', marginTop: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Orders
                </Text>
              </Animatable.View>
            </Pressable>
          );
        }

        return (
          <Pressable
            key={tab.key}
            onPress={() => {
              triggerLightHaptic();
              setSelectedProduct(null);
              if (setSelectedNewProduct) setSelectedNewProduct(null);
              setCurrentTab(tab.key);
            }}
            className="flex-1 items-center justify-center h-full relative"
          >
            <Animatable.View
              animation={isActive ? 'rubberBand' : undefined}
              duration={600}
              className="items-center justify-center"
            >
              {tab.isProfile ? (
                /* Profile DP rendering (Sized Bigger with Glow Shadow) */
                <View
                  className={`w-9 h-9 rounded-full overflow-hidden border-2 ${
                    isActive ? 'border-[#D74A33]' : 'border-gray-300'
                  }`}
                  style={isActive ? {
                    shadowColor: '#D74A33',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.5,
                    shadowRadius: 8,
                    elevation: 4,
                  } : undefined}
                >
                  <Image
                    source={require('../../assets/images/dp.png')}
                    contentFit="cover"
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
              ) : (
                /* Icons rendering (Sized Bigger with text shadow glow on active) */
                <View className="relative">
                  {tab.isEntypo && (
                    <Entypo
                      name={tab.iconName!}
                      size={26}
                      color={isActive ? '#D74A33' : '#64748B'}
                      style={isActive ? {
                        textShadowColor: 'rgba(215, 74, 51, 0.55)',
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 8,
                      } : undefined}
                    />
                  )}
                  {tab.isIonicons && (
                    <Ionicons
                      name={isActive ? tab.iconActive! : tab.iconInactive!}
                      size={26}
                      color={isActive ? '#D74A33' : '#64748B'}
                      style={isActive ? {
                        textShadowColor: 'rgba(215, 74, 51, 0.55)',
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 8,
                      } : undefined}
                    />
                  )}
                  {tab.isFeather && (
                    <Feather
                      name={tab.iconName!}
                      size={26}
                      color={isActive ? '#D74A33' : '#64748B'}
                      style={isActive ? {
                        textShadowColor: 'rgba(215, 74, 51, 0.55)',
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 8,
                      } : undefined}
                    />
                  )}

                  {tab.hasBadge && totalPacks > 0 && (
                    <View className="absolute -top-2.5 -right-4 bg-[#D74A33] rounded-full px-1.5 min-w-[17px] h-4.5 items-center justify-center border border-white">
                      <Text className="text-[8.5px] text-white font-black">
                        {totalPacks > 20 ? '20+' : totalPacks}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              <Text
                className={`text-[9.5px] font-bold tracking-wider mt-2.5 uppercase ${
                  isActive ? 'text-[#D74A33] font-black' : 'text-slate-400'
                }`}
                style={isActive ? {
                  textShadowColor: 'rgba(215, 74, 51, 0.5)',
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 6,
                } : undefined}
              >
                {tab.label}
              </Text>
            </Animatable.View>
          </Pressable>
        );
      })}
    </View>
  );
};

export default BottomTabBar;
