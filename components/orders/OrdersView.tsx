import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Animated, Linking, Modal, LayoutAnimation } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Product, Cart, TabType } from '../types';

import { fetchAllProducts } from '../../lib/fetchAllProducts';

const THEME = '#D74A33';
const NAVY = '#1E3A5F';

const OrdersSkeleton = () => {
  const shimmerAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 800, useNativeDriver: false }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 800, useNativeDriver: false })
      ])
    ).start();
  }, [shimmerAnim]);

  const shimmerMain = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E2E8F0', '#F8FAFC']
  });

  const shimmerSub = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F1F5F9', '#ffffff']
  });

  return (
    <View style={{ padding: 16, gap: 16 }}>
      {/* Title Placeholder */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, marginTop: 8 }}>
        <Animated.View style={{ width: 4, height: 16, backgroundColor: shimmerMain, borderRadius: 4 }} />
        <Animated.View style={{ width: 180, height: 16, backgroundColor: shimmerMain, borderRadius: 4 }} />
      </View>

      {/* Skeleton cards */}
      {[1, 2, 3].map((_, i) => (
        <View key={i} style={{
          backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', padding: 16
        }}>
          <View>
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 16 }}>
              <View>
                <Animated.View style={{ width: 100, height: 16, backgroundColor: shimmerMain, borderRadius: 4, marginBottom: 8 }} />
                <Animated.View style={{ width: 80, height: 12, backgroundColor: shimmerSub, borderRadius: 4 }} />
              </View>
              <Animated.View style={{ width: 80, height: 20, backgroundColor: shimmerSub, borderRadius: 10 }} />
            </View>
            {/* Body items */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Animated.View style={{ width: 50, height: 50, backgroundColor: shimmerMain, borderRadius: 8 }} />
              <Animated.View style={{ width: 50, height: 50, backgroundColor: shimmerMain, borderRadius: 8 }} />
              <Animated.View style={{ width: 50, height: 50, backgroundColor: shimmerMain, borderRadius: 8 }} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

interface OrdersViewProps {
  cart: Cart;
  setSelectedNewProduct: (product: any) => void;
  setCurrentTab: (tab: TabType) => void;
  updateCartQty: (id: string, delta: number, product: Product) => void;
  handlePlaceOrderDirect: () => void;
  triggerLightHaptic: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  cart,
  setSelectedNewProduct,
  setCurrentTab,
  updateCartQty,
  handlePlaceOrderDirect,
  triggerLightHaptic,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchAllProducts({ limit: 100 }).then(res => {
      setProducts(res.products);
      const list = res.products;
      if (list.length >= 11) {
        setOrders([
          {
            id: '#ORD-88219',
            date: 'July 18, 2026',
            status: 'Out for Delivery',
            total: (list[4].price * 1) + (list[5].price * 2),
            itemsText: '3 items',
            products: [
              { name: list[4].name, qty: 1, price: list[4].price, image: list[4].rootImage },
              { name: list[5].name, qty: 2, price: list[5].price, image: list[5].rootImage }
            ],
            address: {
              name: 'Retail Partners Inc.',
              street: '1284 Market Street, Suite 400',
              city: 'San Francisco, CA 94104',
              phone: '+1 (555) 019-2834'
            },
            deliveryAgent: {
              name: 'Michael Davis',
              phone: '+1 (555) 890-1234',
              vehicle: 'White Ford Transit',
              eta: '15 Mins'
            },
            trackingSteps: [
              { title: 'Order Confirmed', time: 'Jul 18, 09:30 AM', done: true },
              { title: 'Processing', time: 'Jul 18, 11:15 AM', done: true },
              { title: 'Shipped', time: 'Jul 19, 08:45 AM', done: true },
              { title: 'Out for Delivery', time: 'Jul 20, 10:12 AM', done: true },
              { title: 'Delivered', time: 'Pending', done: false }
            ]
          },
          {
            id: '#ORD-77402',
            date: 'July 12, 2026',
            status: 'Delivered',
            total: (list[8].price * 1) + (list[9].price * 1) + (list[10].price * 2),
            itemsText: '4 items',
            products: [
              { name: list[8].name, qty: 1, price: list[8].price, image: list[8].rootImage },
              { name: list[9].name, qty: 1, price: list[9].price, image: list[9].rootImage },
              { name: list[10].name, qty: 2, price: list[10].price, image: list[10].rootImage }
            ],
            address: {
              name: 'Retail Partners Inc.',
              street: '1284 Market Street, Suite 400',
              city: 'San Francisco, CA 94104',
              phone: '+1 (555) 019-2834'
            }
          }
        ]);
      }
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsReady(true);
    }).catch(err => {
      console.error(err);
      setIsReady(true);
    });
  }, []);

  // Calculate order metrics locally for current cart
  const getCartTotals = () => {
    let totalItems = 0;
    let totalPrice = 0;
    Object.keys(cart).forEach((id) => {
      const product = products.find((p) => p.id === id);
      if (product) {
        const units = cart[id];
        totalItems += units;
        
        const finalUnitPrice = product.offer
          ? product.price * (1 - product.offer / 100)
          : product.price;

        totalPrice += units * finalUnitPrice;
      }
    });
    return { totalItems, totalPrice };
  };

  const { totalItems, totalPrice } = getCartTotals();
  const totalPacks = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartIsEmpty = Object.keys(cart).length === 0;

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);

  const handleCancelClick = () => {
    triggerLightHaptic();
    setCancelModalVisible(true);
  };

  const handleInvoiceClick = () => {
    triggerLightHaptic();
    setInvoiceModalVisible(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      
      {/* ── Fixed Header ── */}
      <View style={{
        paddingTop: 20, paddingBottom: 16, paddingHorizontal: 20,
        backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <View>
          <Text style={{ fontSize: 24, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 }}>Orders</Text>
          <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '500', marginTop: 2 }}>Manage your purchases & tracking</Text>
        </View>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
          <Feather name="package" size={20} color={NAVY} />
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {!isReady ? (
          <OrdersSkeleton />
        ) : (
          <View style={{ padding: 16, gap: 24 }}>
            
            {/* ── ORDER HISTORY ── */}
          <View style={{ paddingTop: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <View style={{ width: 4, height: 16, backgroundColor: NAVY, borderRadius: 4 }} />
              <Text style={{ fontSize: 13, fontWeight: '900', color: '#334155', textTransform: 'uppercase', letterSpacing: 1 }}>Past & Active Orders</Text>
            </View>

            <View style={{ gap: 16 }}>
              {orders.map((order, idx) => (
                <View key={idx} style={{
                  backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden'
                }}>
                  {/* Header Row */}
                  <View style={{ padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                    <View>
                      <Text style={{ fontSize: 16, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 }}>{order.id}</Text>
                      <Text style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{order.date}</Text>
                    </View>
                    <View style={{
                      backgroundColor: order.status === 'Delivered' ? '#DCFCE7' : '#DBEAFE',
                      paddingHorizontal: 10, paddingVertical: 5, borderRadius: 99
                    }}>
                      <Text style={{
                        fontSize: 9, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5,
                        color: order.status === 'Delivered' ? '#16A34A' : '#2563EB'
                      }}>
                        {order.status}
                      </Text>
                    </View>
                  </View>

                  {/* Body Info */}
                  <View style={{ padding: 16, gap: 16 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#475569' }}>{order.itemsText}</Text>
                      <Text style={{ fontSize: 16, fontWeight: '900', color: '#0F172A' }}>${order.total.toFixed(2)}</Text>
                    </View>

                    {/* Products List */}
                    <View style={{ backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' }}>
                      <View style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', backgroundColor: '#F1F5F9' }}>
                        <Text style={{ fontSize: 10, fontWeight: '900', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.8 }}>Products in Order</Text>
                      </View>
                      {order.products.map((prod: any, pIdx: number) => (
                        <View key={pIdx} style={{
                          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                          padding: 12, borderTopWidth: pIdx > 0 ? 1 : 0, borderTopColor: '#F1F5F9'
                        }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#E2E8F0', overflow: 'hidden' }}>
                              <Image
                                source={prod.image}
                                contentFit="cover"
                                style={{ width: '100%', height: '100%' }}
                                cachePolicy="disk"
                                transition={200}
                              />
                            </View>
                            <View>
                              <Text style={{ fontSize: 12, fontWeight: '800', color: '#0F172A' }}>{prod.name}</Text>
                              <Text style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Qty: {prod.qty}</Text>
                            </View>
                          </View>
                          <Text style={{ fontSize: 12, fontWeight: '900', color: '#0F172A' }}>${prod.price.toFixed(2)}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Address Box */}
                    <View style={{ backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#F1F5F9' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <Ionicons name="location" size={14} color="#64748B" />
                        <Text style={{ fontSize: 10, fontWeight: '900', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.8 }}>Delivery Address</Text>
                      </View>
                      <Text style={{ fontSize: 12, fontWeight: '800', color: '#0F172A' }}>{order.address.name}</Text>
                      <Text style={{ fontSize: 12, color: '#475569', marginTop: 2, lineHeight: 18 }}>{order.address.street}</Text>
                      <Text style={{ fontSize: 12, color: '#475569', lineHeight: 18 }}>{order.address.city}</Text>
                      <Text style={{ fontSize: 12, color: '#475569', marginTop: 4, fontWeight: '500' }}>{order.address.phone}</Text>
                    </View>

                    {/* Tracking Timeline (If active) */}
                    {(order.status === 'In Transit' || order.status === 'Out for Delivery') && order.trackingSteps && (
                      <View style={{ marginTop: 4 }}>
                        <Text style={{ fontSize: 10, fontWeight: '900', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>Delivery Tracking</Text>
                        <View style={{ paddingLeft: 8 }}>
                          {order.trackingSteps.map((step: any, sIdx: number) => {
                            const isLast = sIdx === order.trackingSteps.length - 1;
                            return (
                              <View key={sIdx} style={{ flexDirection: 'row', gap: 12, marginBottom: isLast ? 0 : 16 }}>
                                {/* Timeline line & dot */}
                                <View style={{ alignItems: 'center', width: 12 }}>
                                  <View style={{
                                    width: 12, height: 12, borderRadius: 6,
                                    backgroundColor: step.done ? '#2563EB' : '#E2E8F0',
                                    borderWidth: 2, borderColor: '#fff', zIndex: 1
                                  }} />
                                  {!isLast && (
                                    <View style={{
                                      position: 'absolute', top: 10, bottom: -16, width: 2,
                                      backgroundColor: step.done ? '#2563EB' : '#E2E8F0'
                                    }} />
                                  )}
                                </View>
                                {/* Content */}
                                <View style={{ flex: 1, marginTop: -2 }}>
                                  <Text style={{ fontSize: 13, fontWeight: step.done ? '800' : '500', color: step.done ? '#0F172A' : '#94A3B8' }}>{step.title}</Text>
                                  <Text style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{step.time}</Text>
                                </View>
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    )}

                    {/* Delivery Partner Info */}
                    {order.status === 'Out for Delivery' && (order as any).deliveryAgent && (
                      <View style={{ marginTop: 8, padding: 16, backgroundColor: '#F0FDF4', borderRadius: 16, borderWidth: 1, borderColor: '#DCFCE7' }}>
                        <Text style={{ fontSize: 10, fontWeight: '900', color: '#16A34A', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>Arriving in {(order as any).deliveryAgent.eta}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#16A34A', alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="person" size={20} color="#fff" />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 14, fontWeight: '800', color: '#0F172A' }}>{(order as any).deliveryAgent.name}</Text>
                            <Text style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{(order as any).deliveryAgent.phone}</Text>
                          </View>
                          <Pressable 
                            onPress={() => Linking.openURL(`tel:${(order as any).deliveryAgent.phone}`)}
                            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#22C55E', alignItems: 'center', justifyContent: 'center', shadowColor: '#16A34A', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: {width: 0, height: 4} }}
                          >
                            <Ionicons name="call" size={18} color="#fff" />
                          </Pressable>
                        </View>
                      </View>
                    )}
                  </View>

                  <View style={{
                    flexDirection: 'row', gap: 12, padding: 16,
                    backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#F1F5F9'
                  }}>
                    <Pressable
                      onPress={handleInvoiceClick}
                      style={{
                        flex: 1, borderRadius: 10, borderWidth: 1, borderColor: '#CBD5E1', backgroundColor: '#fff',
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10
                      }}
                    >
                      <Ionicons name="document-text-outline" size={14} color="#475569" />
                      <Text style={{ fontSize: 11, fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5 }}>Invoice</Text>
                    </Pressable>

                    {order.status !== 'Delivered' && (
                      <Pressable
                        onPress={handleCancelClick}
                        style={{
                          flex: 1, borderRadius: 10, borderWidth: 1, borderColor: '#FECACA', backgroundColor: '#FEF2F2',
                          flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10
                        }}
                      >
                        <Ionicons name="close-circle-outline" size={14} color="#DC2626" />
                        <Text style={{ fontSize: 11, fontWeight: '800', color: '#DC2626', textTransform: 'uppercase', letterSpacing: 0.5 }}>Cancel</Text>
                      </Pressable>
                    )}
                  </View>

                </View>
              ))}
            </View>
          </View>

          {/* Bottom padding for tab bar */}
          <View style={{ height: 120 }} />
        </View>
        )}
      </ScrollView>

      {/* ── Demo Invoice Modal ── */}
      <Modal visible={invoiceModalVisible} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 24, width: '100%', alignItems: 'center' }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Ionicons name="document-text" size={32} color="#3B82F6" />
            </View>
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#0F172A', marginBottom: 8 }}>Invoice Downloaded</Text>
            <Text style={{ fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 24, lineHeight: 20 }}>
              This is a demo invoice view. In a real app, this would open a PDF or trigger a download.
            </Text>
            <Pressable
              onPress={() => { triggerLightHaptic(); setInvoiceModalVisible(false); }}
              style={{ width: '100%', backgroundColor: NAVY, paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ── Demo Cancel Confirmation Modal ── */}
      <Modal visible={cancelModalVisible} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 24, width: '100%', alignItems: 'center' }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Ionicons name="warning" size={32} color="#EF4444" />
            </View>
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#0F172A', marginBottom: 8 }}>Cancel Order?</Text>
            <Text style={{ fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 24, lineHeight: 20 }}>
              Are you sure you want to cancel this order? This action cannot be undone.
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
              <Pressable
                onPress={() => { triggerLightHaptic(); setCancelModalVisible(false); }}
                style={{ flex: 1, backgroundColor: '#F1F5F9', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
              >
                <Text style={{ color: '#475569', fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 }}>Keep Order</Text>
              </Pressable>
              <Pressable
                onPress={() => { triggerLightHaptic(); setCancelModalVisible(false); }}
                style={{ flex: 1, backgroundColor: '#EF4444', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
              >
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 }}>Yes, Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default OrdersView;
