import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NEW_PRODUCTS } from '../../lib/products';

import { Cart, Product } from '../types';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const THEME = '#D74A33';
const NAVY = '#1E3A5F';

interface CartDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  onBrowse?: () => void;
  cart: Cart;
  updateCartQty: (id: string, delta: number, product: Product) => void;
  clearCart: () => void;
  triggerLightHaptic: () => void;
  initialStep?: 'cart' | 'checkout';
}

type Step = 'cart' | 'checkout' | 'success';

const CartSkeleton = () => {
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
    <View style={{ flex: 1, padding: 24, gap: 16 }}>
      {[1, 2, 3].map((_, i) => (
        <Animated.View key={i} style={{
          flexDirection: 'row', backgroundColor: '#fff', borderRadius: 20, padding: 12,
          borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', opacity: pulseAnim
        }}>
          {/* Image placeholder */}
          <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: '#F1F5F9', marginRight: 12 }} />
          {/* Text placeholder */}
          <View style={{ flex: 1, gap: 8 }}>
            <View style={{ width: '80%', height: 14, backgroundColor: '#E2E8F0', borderRadius: 4 }} />
            <View style={{ width: '40%', height: 14, backgroundColor: '#F1F5F9', borderRadius: 4 }} />
          </View>
          {/* Qty placeholder */}
          <View style={{ width: 70, height: 36, backgroundColor: '#F1F5F9', borderRadius: 8 }} />
        </Animated.View>
      ))}
    </View>
  );
};

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isVisible,
  onClose,
  onBrowse,
  cart,
  updateCartQty,
  clearCart,
  triggerLightHaptic,
  initialStep = 'cart',
}) => {
  const [step, setStep] = useState<Step>(initialStep);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'paypal'>('card');
  const [isLoading, setIsLoading] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const insets = useSafeAreaInsets();

  const getProductInfo = (id: string) => {
    let p2 = NEW_PRODUCTS.find((p) => p.id === id);
    if (p2) {
      const units = cart[id]; // no packSize
      const price = p2.offer ? p2.price * (1 - p2.offer / 100) : p2.price;
      return { name: p2.name, units, price, rootImage: p2.rootImage, isLegacy: false };
    }
    return null;
  };

  // Calculate totals
  const totalItems = Object.keys(cart).reduce((sum, id) => {
    const info = getProductInfo(id);
    return sum + (info ? info.units : 0);
  }, 0);

  const totalPrice = Object.keys(cart).reduce((sum, id) => {
    const info = getProductInfo(id);
    if (!info) return sum;
    return sum + (info.units * info.price);
  }, 0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isVisible) {
      setStep(initialStep);
      setIsLoading(true);
      timer = setTimeout(() => setIsLoading(false), 800);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
        speed: 14,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible, initialStep]);

  const handleClose = () => {
    triggerLightHaptic();
    Animated.timing(slideAnim, {
      toValue: SCREEN_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleProceed = () => {
    triggerLightHaptic();
    setStep('checkout');
  };

  const handlePay = () => {
    triggerLightHaptic();
    setStep('success');
    // Clear cart after a brief delay
    setTimeout(() => {
      clearCart();
    }, 1000);
  };

  const cartIsEmpty = Object.keys(cart).length === 0;

  return (
    <Modal visible={isVisible} transparent animationType="none" onRequestClose={handleClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', flexDirection: 'row', justifyContent: 'flex-end' }}>

        {/* Backdrop dismiss */}
        <Pressable style={{ flex: 1 }} onPress={handleClose} />

        {/* Sliding Drawer */}
        <Animated.View style={{
          backgroundColor: '#F8FAFC',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          transform: [{ translateX: slideAnim }]
        }}>

          {/* Header */}
          {step !== 'success' && (
            <View style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              paddingHorizontal: 24, paddingTop: Math.max(insets.top + 16, 32), paddingBottom: 16, backgroundColor: '#fff',
              borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
            }}>
              <View>
                <Text style={{ fontSize: 24, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 }}>
                  {step === 'cart' ? 'Your Cart' : 'Checkout'}
                </Text>
                <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '500', marginTop: 2 }}>
                  {step === 'cart' ? `${totalItems} items selected` : 'Select payment method'}
                </Text>
              </View>
              <Pressable onPress={step === 'checkout' ? () => { 
                triggerLightHaptic(); 
                if (initialStep === 'checkout') {
                  handleClose();
                } else {
                  setStep('cart');
                }
              } : handleClose} style={{
                width: 44, height: 44, borderRadius: 22, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center'
              }}>
                <Ionicons name={step === 'checkout' && initialStep !== 'checkout' ? 'arrow-back' : 'close'} size={20} color={NAVY} />
              </Pressable>
            </View>
          )}

          {/* ── STEP 1: CART ── */}
          {step === 'cart' && (
            <View style={{ flex: 1 }}>
              {isLoading ? (
                <CartSkeleton />
              ) : cartIsEmpty ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                  <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <Ionicons name="cart-outline" size={40} color="#94A3B8" />
                  </View>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 8 }}>Cart is Empty</Text>
                  <Text style={{ fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 24 }}>Add some products to your cart before checking out.</Text>
                  <Pressable onPress={() => { if (onBrowse) onBrowse(); else onClose(); }} style={{ backgroundColor: THEME, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 }}>
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 }}>Browse Items</Text>
                  </Pressable>
                </View>
              ) : (
                <>
                  <ScrollView style={{ flex: 1, padding: 24 }} showsVerticalScrollIndicator={false}>
                    <View style={{ gap: 16, paddingBottom: 40 }}>
                      {Object.keys(cart).map(id => {
                        const info = getProductInfo(id);
                        if (!info) return null;
                        const qty = cart[id];

                        return (
                          <View key={id} style={{
                            flexDirection: 'row', backgroundColor: '#fff', borderRadius: 20, padding: 12,
                            borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center'
                          }}>
                            {info.rootImage && (
                              <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: '#F8FAFC', overflow: 'hidden', marginRight: 12 }}>
                                <Image source={info.rootImage} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                              </View>
                            )}
                            <View style={{ flex: 1, paddingLeft: info.rootImage ? 0 : 8 }}>
                              <Text style={{ fontSize: 14, fontWeight: '800', color: '#0F172A' }} numberOfLines={2}>{info.name}</Text>
                              <Text style={{ fontSize: 13, fontWeight: '900', color: THEME, marginTop: 4 }}>${info.price.toFixed(2)}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end', paddingRight: 4 }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 8, padding: 4 }}>
                                <Pressable onPress={() => { triggerLightHaptic(); updateCartQty(id, -1, {} as any); }} style={{ width: 28, height: 28, backgroundColor: '#fff', borderRadius: 6, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } }}>
                                  <Ionicons name={qty <= 1 ? "trash-outline" : "remove"} size={16} color={qty <= 1 ? THEME : "#0F172A"} />
                                </Pressable>
                                <Text style={{ width: 32, textAlign: 'center', fontSize: 14, fontWeight: '800', color: '#0F172A' }}>{qty}</Text>
                                <Pressable onPress={() => { triggerLightHaptic(); updateCartQty(id, 1, {} as any); }} style={{ width: 28, height: 28, backgroundColor: '#fff', borderRadius: 6, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } }}>
                                  <Ionicons name="add" size={16} color="#0F172A" />
                                </Pressable>
                              </View>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </ScrollView>

                  {/* Cart Footer */}
                  <View style={{ backgroundColor: '#fff', padding: 24, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingBottom: 40 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
                      <Text style={{ fontSize: 14, fontWeight: '900', color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 }}>Order Total</Text>
                      <Text style={{ fontSize: 28, fontWeight: '900', color: THEME }}>${totalPrice.toFixed(2)}</Text>
                    </View>
                    <Pressable
                      onPress={handleProceed}
                      style={{ backgroundColor: THEME, borderRadius: 16, paddingVertical: 18, alignItems: 'center' }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: 1.5 }}>Proceed to Checkout</Text>
                    </Pressable>
                  </View>
                </>
              )}
            </View>
          )}

          {/* ── STEP 2: CHECKOUT ── */}
          {step === 'checkout' && (
            <View style={{ flex: 1, padding: 24 }}>
              <Text style={{ fontSize: 12, fontWeight: '900', color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Payment Method</Text>

              <View style={{ gap: 12 }}>
                {[
                  { id: 'card', icon: 'card-outline', label: 'Credit Card', sub: '**** **** **** 4242' },
                  { id: 'apple', icon: 'logo-apple', label: 'Apple Pay', sub: 'john.doe@icloud.com' },
                  { id: 'paypal', icon: 'logo-paypal', label: 'PayPal', sub: 'johndoe@gmail.com' },
                ].map(method => {
                  const isActive = paymentMethod === method.id;
                  return (
                    <Pressable
                      key={method.id}
                      onPress={() => { triggerLightHaptic(); setPaymentMethod(method.id as any); }}
                      style={{
                        flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16,
                        backgroundColor: isActive ? '#FFFBEB' : '#fff',
                        borderWidth: 2, borderColor: isActive ? '#F59E0B' : '#E2E8F0'
                      }}
                    >
                      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isActive ? '#FEF3C7' : '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                        <Ionicons name={method.icon as any} size={20} color={isActive ? '#D97706' : '#64748B'} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 15, fontWeight: '800', color: isActive ? '#92400E' : '#0F172A' }}>{method.label}</Text>
                        <Text style={{ fontSize: 12, color: isActive ? '#B45309' : '#64748B', marginTop: 2 }}>{method.sub}</Text>
                      </View>
                      <View style={{
                        width: 24, height: 24, borderRadius: 12, borderWidth: 2,
                        borderColor: isActive ? '#F59E0B' : '#CBD5E1',
                        alignItems: 'center', justifyContent: 'center'
                      }}>
                        {isActive && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#F59E0B' }} />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              <View style={{ flex: 1 }} />

              <View style={{ paddingBottom: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: '#64748B' }}>Total to pay</Text>
                  <Text style={{ fontSize: 20, fontWeight: '900', color: '#0F172A' }}>${totalPrice.toFixed(2)}</Text>
                </View>
                <Pressable
                  onPress={handlePay}
                  style={{ backgroundColor: NAVY, borderRadius: 16, paddingVertical: 18, alignItems: 'center' }}
                >
                  <Text style={{ fontSize: 14, fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: 1.5 }}>Pay ${totalPrice.toFixed(2)}</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* ── STEP 3: SUCCESS ── */}
          {step === 'success' && (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#DCFCE7' }}>
              <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 24, shadowColor: '#16A34A', shadowOpacity: 0.2, shadowRadius: 20 }}>
                <Ionicons name="checkmark-circle" size={64} color="#16A34A" />
              </View>
              <Text style={{ fontSize: 28, fontWeight: '900', color: '#166534', marginBottom: 8 }}>Order Placed!</Text>
              <Text style={{ fontSize: 15, color: '#15803D', textAlign: 'center', marginBottom: 40, lineHeight: 22 }}>
                Your payment was successful. We'll start processing your order right away.
              </Text>
              <Pressable
                onPress={handleClose}
                style={{ backgroundColor: '#16A34A', borderRadius: 16, paddingVertical: 18, paddingHorizontal: 32, alignItems: 'center', width: '100%' }}
              >
                <Text style={{ fontSize: 14, fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: 1.5 }}>Done</Text>
              </Pressable>
            </View>
          )}

        </Animated.View>
      </View>
    </Modal>
  );
};
