import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Animated } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NewProduct } from '../../lib/products';
import { fetchAllProducts } from '../../lib/fetchAllProducts';
import { NewProductCard } from './NewProductCard';
import { Cart } from '../types';

const THEME = '#D74A33';
const NAVY = '#1E3A5F';

const SIZE_OPTIONS: Record<string, string[]> = {
  Mobile:  ['64GB', '128GB', '256GB', '512GB'],
  Console: ['Standard', 'Digital Ed.', 'Bundle'],
  Dress:   ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  Polos:   ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  Shoes:   ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
  Watches: ['38mm', '40mm', '42mm', '44mm'],
};

const COLOR_OPTIONS: Record<string, { label: string; hex: string }[]> = {
  Mobile:  [{ label: 'Black', hex: '#111827' }, { label: 'Silver', hex: '#9CA3AF' }, { label: 'Gold', hex: '#B45309' }],
  Console: [{ label: 'White', hex: '#F1F5F9' }, { label: 'Black', hex: '#111827' }],
  Dress:   [{ label: 'Navy', hex: '#1E3A5F' }, { label: 'Ivory', hex: '#F5F0E8' }, { label: 'Blush', hex: '#F9A8C9' }, { label: 'Olive', hex: '#4D7C0F' }],
  Polos:   [{ label: 'Cream', hex: '#FEF9C3' }, { label: 'Navy', hex: '#1E3A5F' }, { label: 'Taupe', hex: '#A8936A' }],
  Shoes:   [{ label: 'White', hex: '#F1F5F9' }, { label: 'Black', hex: '#111827' }, { label: 'Grey', hex: '#6B7280' }],
  Watches: [{ label: 'Silver', hex: '#9CA3AF' }, { label: 'Gold', hex: '#B45309' }, { label: 'Black', hex: '#111827' }],
};

const MOCK_REVIEWS = [
  { name: 'Arjun M.', rating: 5, date: 'Jul 2025', comment: 'Absolutely love it! Premium quality, exactly as shown in photos. Fast delivery too.' },
  { name: 'Priya S.', rating: 4, date: 'Jun 2025', comment: 'Great product overall. Packaging was excellent and it arrived in perfect condition.' },
  { name: 'Ravi K.', rating: 5, date: 'Jun 2025', comment: "Highly recommended! Best purchase I've made this year. Will definitely buy again." },
];

interface Props {
  product: NewProduct;
  onBack: () => void;
  cart: Cart;
  updateCartQty: (id: string, delta: number, product: any) => void;
  onPlaceOrder: () => void;
  triggerLightHaptic: () => void;
  onProductSelect?: (product: NewProduct) => void;
}

const ProductDetailSkeleton = () => {
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
    <Animated.View style={{ flex: 1, opacity: pulseAnim, backgroundColor: '#fff' }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Hero image 3:4 */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16, backgroundColor: '#fff' }}>
          <View style={{ width: '100%', aspectRatio: 3 / 4, backgroundColor: '#F1F5F9', borderRadius: 16 }} />
        </View>

        {/* Thumbnails */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
          {[1, 2, 3, 4].map((_, i) => (
            <View key={i} style={{ width: 52, height: 52, borderRadius: 10, backgroundColor: '#F1F5F9' }} />
          ))}
        </View>

        <View style={{ padding: 16, gap: 16 }}>
          {/* Brand & Rating */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ width: 60, height: 12, backgroundColor: '#E2E8F0', borderRadius: 4 }} />
            <View style={{ width: 40, height: 16, backgroundColor: '#F1F5F9', borderRadius: 8 }} />
          </View>
          
          {/* Title */}
          <View style={{ width: '80%', height: 28, backgroundColor: '#F1F5F9', borderRadius: 6 }} />
          <View style={{ width: '50%', height: 16, backgroundColor: '#E2E8F0', borderRadius: 4 }} />

          {/* Badges */}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <View style={{ width: 70, height: 24, backgroundColor: '#F1F5F9', borderRadius: 8 }} />
            <View style={{ width: 60, height: 24, backgroundColor: '#E2E8F0', borderRadius: 8 }} />
          </View>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: '#F1F5F9', marginVertical: 8 }} />

          {/* Price */}
          <View style={{ width: 120, height: 32, backgroundColor: '#F1F5F9', borderRadius: 8 }} />

          {/* Sizes */}
          <View style={{ marginTop: 16 }}>
            <View style={{ width: 50, height: 14, backgroundColor: '#E2E8F0', borderRadius: 4, marginBottom: 12 }} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {[1, 2, 3, 4, 5].map((_, i) => (
                <View key={i} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#F1F5F9' }} />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

export const NewProductDetailView: React.FC<Props> = ({
  product, onBack, cart, updateCartQty, onPlaceOrder, triggerLightHaptic, onProductSelect,
}) => {
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState((SIZE_OPTIONS[product.category] || ['One Size'])[0]);
  const [selectedColor, setSelectedColor] = useState(0);
  const [activeTab, setActiveTab] = useState<'desc' | 'spec' | 'reviews'>('desc');
  const [isReady, setIsReady] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<NewProduct[]>([]);

  useEffect(() => {
    setIsReady(false);
    const timer = setTimeout(() => setIsReady(true), 1200);

    // Fetch related products dynamically
    fetchAllProducts({ category: product.category, limit: 3 })
      .then(res => {
        setRelatedProducts(res.products.filter((p: any) => p.id !== product.id).slice(0, 2));
      })
      .catch(err => console.error(err));

    // Prefetch detail image slides
    const urls = (product.images || []).filter((url: any) => typeof url === 'string');
    if (urls.length > 0) {
      Image.prefetch(urls);
    }

    return () => clearTimeout(timer);
  }, [product.id, product.category, product.images]);

  const sizes = SIZE_OPTIONS[product.category] || ['One Size'];
  const colors = COLOR_OPTIONS[product.category] || [{ label: 'Default', hex: '#64748B' }];
  const cartQty = cart[product.id] || 0;
  const discountedPrice = product.offer ? product.price * (1 - product.offer / 100) : product.price;
  const avgRating = (MOCK_REVIEWS.reduce((s, r) => s + r.rating, 0) / MOCK_REVIEWS.length).toFixed(1);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>

      {/* ── Back / breadcrumb bar ──────────────────────────────────────── */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 10,
        backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
      }}>
        <Pressable
          onPress={() => { triggerLightHaptic(); onBack(); }}
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1,
            borderColor: '#E2E8F0', paddingHorizontal: 12, paddingVertical: 7,
          }}
        >
          <Ionicons name="arrow-back" size={15} color={THEME} />
          <Text style={{ fontSize: 10, fontWeight: '900', color: '#475569', textTransform: 'uppercase', letterSpacing: 0.8 }}>Back</Text>
        </Pressable>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ backgroundColor: NAVY, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 5 }}>
            <Text style={{ fontSize: 8, fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: 0.6 }}>{product.tag}</Text>
          </View>
          {product.offer ? (
            <View style={{ backgroundColor: THEME, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 5 }}>
              <Text style={{ fontSize: 8, fontWeight: '900', color: '#fff' }}>{product.offer}% OFF</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* ── Scrollable content ────────────────────────────────────────── */}
      {!isReady ? (
        <ProductDetailSkeleton />
      ) : (
      <>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

        {/* Hero image 3:4 */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16, backgroundColor: '#fff' }}>
          <View style={{ width: '100%', aspectRatio: 3 / 4, backgroundColor: '#F8FAFC', borderRadius: 16, overflow: 'hidden' }}>
            <Image
              source={product.images[activeImg] ?? product.rootImage}
              placeholder={product.rootImage}
              contentFit="cover"
              style={{ width: '100%', height: '100%' }}
              cachePolicy="disk"
              transition={200}
            />
          </View>
        </View>

        {/* Thumbnails */}
        {product.images.length > 1 && (
          <View style={{
            flexDirection: 'row', justifyContent: 'center', gap: 8,
            paddingVertical: 12, backgroundColor: '#fff',
            borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
          }}>
            {product.images.map((img, idx) => (
              <Pressable
                key={idx}
                onPress={() => { triggerLightHaptic(); setActiveImg(idx); }}
                style={{
                  width: 52, height: 52, borderRadius: 10, overflow: 'hidden',
                  borderWidth: 2, borderColor: activeImg === idx ? THEME : '#E2E8F0',
                }}
              >
                <Image 
                  source={img} 
                  contentFit="cover" 
                  style={{ width: '100%', height: '100%' }} 
                  cachePolicy="disk"
                  transition={200}
                />
              </Pressable>
            ))}
          </View>
        )}

        <View style={{ padding: 16, gap: 16 }}>

          {/* Brand & Name Group */}
          <View style={{ gap: 2 }}>
            {/* Brand + Rating */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 9, fontWeight: '900', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.2 }}>{product.brand}</Text>
              <View style={{
                flexDirection: 'row', alignItems: 'center', gap: 4,
                backgroundColor: '#FFFBEB', borderRadius: 99, borderWidth: 1,
                borderColor: '#FDE68A', paddingHorizontal: 10, paddingVertical: 4,
              }}>
                <Ionicons name="star" size={11} color="#F59E0B" />
                <Text style={{ fontSize: 11, fontWeight: '900', color: '#92400E' }}>{avgRating}</Text>
                <Text style={{ fontSize: 9, color: '#B45309', fontWeight: '600' }}>({MOCK_REVIEWS.length})</Text>
              </View>
            </View>

            {/* Name */}
            <View style={{ gap: 2 }}>
              <Text style={{ fontSize: 22, fontWeight: '900', color: '#0F172A', lineHeight: 28 }}>{product.name}</Text>
              <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '500', lineHeight: 18 }}>{product.subtitle}</Text>
            </View>
          </View>

          {/* Feature badges */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {product.badges.map((b, i) => (
              <View key={i} style={{ backgroundColor: '#F1F5F9', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ fontSize: 9, fontWeight: '700', color: '#475569' }}>{b}</Text>
              </View>
            ))}
          </View>

          {/* Price card */}
          <View style={{
            backgroundColor: '#FEF2F2', borderRadius: 16, borderWidth: 1,
            borderColor: '#FECACA', padding: 16,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <View>
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#DC2626', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>
                {product.offer ? 'Offer Price' : 'Price'}
              </Text>
              <Text style={{ fontSize: 32, fontWeight: '900', color: THEME, lineHeight: 36 }}>
                ${discountedPrice.toFixed(2)}
              </Text>
              {product.offer ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}>
                  <Text style={{ fontSize: 13, color: '#94A3B8', textDecorationLine: 'line-through' }}>${product.price.toFixed(2)}</Text>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#16A34A' }}>
                    Save ${(product.price - discountedPrice).toFixed(2)}
                  </Text>
                </View>
              ) : null}
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#DCFCE7', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 5 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#16A34A' }} />
                <Text style={{ fontSize: 9, fontWeight: '800', color: '#15803D' }}>In Stock</Text>
              </View>
              <Text style={{ fontSize: 8, color: '#94A3B8', fontWeight: '600' }}>Ships in 1–2 days</Text>
            </View>
          </View>

          {/* Color selector */}
          <View style={{ gap: 10 }}>
            <Text style={{ fontSize: 10, fontWeight: '900', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Color — <Text style={{ color: THEME }}>{colors[selectedColor].label}</Text>
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
              {colors.map((c, i) => (
                <Pressable
                  key={i}
                  onPress={() => { triggerLightHaptic(); setSelectedColor(i); }}
                  style={{
                    width: 34, height: 34, borderRadius: 17,
                    backgroundColor: c.hex,
                    borderWidth: selectedColor === i ? 3 : 1.5,
                    borderColor: selectedColor === i ? THEME : '#CBD5E1',
                  }}
                />
              ))}
            </View>
          </View>

          {/* Size selector */}
          <View style={{ gap: 10 }}>
            <Text style={{ fontSize: 10, fontWeight: '900', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.8 }}>
              {product.category === 'Shoes' ? 'Size' : product.category === 'Mobile' || product.category === 'Console' ? 'Variant' : 'Size'}
              {' '}— <Text style={{ color: THEME }}>{selectedSize}</Text>
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {sizes.map(s => (
                <Pressable
                  key={s}
                  onPress={() => { triggerLightHaptic(); setSelectedSize(s); }}
                  style={{
                    borderRadius: 10, borderWidth: 1.5,
                    borderColor: selectedSize === s ? THEME : '#E2E8F0',
                    backgroundColor: selectedSize === s ? '#FEF2F2' : '#F8FAFC',
                    paddingHorizontal: 14, paddingVertical: 8,
                  }}
                >
                  <Text style={{ fontSize: 10, fontWeight: '900', color: selectedSize === s ? THEME : '#475569' }}>{s}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Quantity + Buttons column */}
          <View style={{ gap: 10 }}>
            <Text style={{ fontSize: 10, fontWeight: '900', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.8 }}>Quantity</Text>
            {/* Stepper compact */}
            <View style={{
              flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
              borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, overflow: 'hidden', height: 46,
            }}>
              <Pressable
                onPress={() => updateCartQty(product.id, -1, product)}
                style={{ width: 46, height: 46, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="remove" size={20} color={cartQty > 0 ? THEME : '#CBD5E1'} />
              </Pressable>
              <Text style={{ fontSize: 16, fontWeight: '900', color: '#0F172A', paddingHorizontal: 20 }}>{cartQty}</Text>
              <Pressable
                onPress={() => updateCartQty(product.id, 1, product)}
                style={{ width: 46, height: 46, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="add" size={20} color={THEME} />
              </Pressable>
            </View>

            {/* Add to Cart + Buy Now */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable
                onPress={() => updateCartQty(product.id, 1, product)}
                style={{
                  flex: 1, borderRadius: 14, borderWidth: 2, borderColor: THEME,
                  alignItems: 'center', justifyContent: 'center', paddingVertical: 14,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '900', color: THEME, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  {cartQty > 0 ? `In Cart (${cartQty})` : 'Add to Cart'}
                </Text>
              </Pressable>
              <Pressable
                onPress={onPlaceOrder}
                style={{
                  flex: 1, borderRadius: 14, backgroundColor: THEME,
                  alignItems: 'center', justifyContent: 'center', paddingVertical: 14,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  Buy Now
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Trust badges */}
          <View style={{
            flexDirection: 'row', backgroundColor: '#F8FAFC',
            borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', padding: 14,
          }}>
            {[
              { icon: 'truck-delivery', label: 'Free Delivery', sub: 'Orders ≥ $50', color: '#10B981' },
              { icon: 'autorenew', label: 'Easy Returns', sub: '30-day policy', color: '#3B82F6' },
              { icon: 'cash', label: 'Cash on Del.', sub: 'Available', color: '#F59E0B' },
            ].map((item, i) => (
              <View
                key={i}
                style={{
                  flex: 1, alignItems: 'center', gap: 4,
                  borderLeftWidth: i > 0 ? 1 : 0, borderLeftColor: '#E2E8F0',
                }}
              >
                <MaterialCommunityIcons name={item.icon as any} size={22} color={item.color} />
                <Text style={{ fontSize: 8.5, fontWeight: '900', color: '#334155', textAlign: 'center' }}>{item.label}</Text>
                <Text style={{ fontSize: 7.5, color: '#94A3B8', fontWeight: '600', textAlign: 'center' }}>{item.sub}</Text>
              </View>
            ))}
          </View>

          {/* Tabs */}
          <View style={{ gap: 0, marginTop: 16 }}>
            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
              {(['desc', 'spec', 'reviews'] as const).map(tab => (
                <Pressable
                  key={tab}
                  onPress={() => { triggerLightHaptic(); setActiveTab(tab); }}
                  style={{
                    flex: 1, alignItems: 'center', paddingBottom: 12, paddingTop: 4,
                    borderBottomWidth: 2.5,
                    borderBottomColor: activeTab === tab ? THEME : 'transparent',
                  }}
                >
                  <Text style={{
                    fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.6,
                    color: activeTab === tab ? THEME : '#94A3B8',
                  }}>
                    {tab === 'desc' ? 'About' : tab === 'spec' ? 'Specs' : 'Reviews'}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={{ paddingTop: 16, gap: 12 }}>
              {activeTab === 'desc' && (
                <Text style={{ fontSize: 13, color: '#475569', fontWeight: '500', lineHeight: 22 }}>
                  {product.specification.paragraph}
                </Text>
              )}

              {activeTab === 'spec' && (
                <View style={{ borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' }}>
                  {product.specification.points.map((pt, i) => (
                    <View
                      key={i}
                      style={{
                        flexDirection: 'row', alignItems: 'flex-start', gap: 12,
                        paddingHorizontal: 14, paddingVertical: 12,
                        backgroundColor: i % 2 === 0 ? '#F8FAFC' : '#fff',
                      }}
                    >
                      <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: THEME, alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
                        <Ionicons name="checkmark" size={11} color="#fff" />
                      </View>
                      <Text style={{ flex: 1, fontSize: 12, color: '#475569', fontWeight: '500', lineHeight: 18 }}>{pt}</Text>
                    </View>
                  ))}
                </View>
              )}

              {activeTab === 'reviews' && (
                <View style={{ gap: 12 }}>
                  {/* Summary */}
                  <View style={{
                    flexDirection: 'row', alignItems: 'center', gap: 16,
                    backgroundColor: '#F8FAFC', borderRadius: 16, borderWidth: 1,
                    borderColor: '#E2E8F0', padding: 14,
                  }}>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: 42, fontWeight: '900', color: '#0F172A', lineHeight: 48 }}>{avgRating}</Text>
                      <View style={{ flexDirection: 'row', gap: 2, marginTop: 2 }}>
                        {[1,2,3,4,5].map(s => (
                          <Ionicons key={s} name="star" size={11} color={s <= Math.round(Number(avgRating)) ? '#F59E0B' : '#E2E8F0'} />
                        ))}
                      </View>
                      <Text style={{ fontSize: 9, color: '#94A3B8', fontWeight: '600', marginTop: 4 }}>{MOCK_REVIEWS.length} reviews</Text>
                    </View>
                    <View style={{ flex: 1, gap: 6 }}>
                      {[5,4,3,2,1].map(star => {
                        const cnt = MOCK_REVIEWS.filter(r => r.rating === star).length;
                        const pct = (cnt / MOCK_REVIEWS.length) * 100;
                        return (
                          <View key={star} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={{ fontSize: 9, fontWeight: '800', color: '#64748B', width: 10 }}>{star}</Text>
                            <Ionicons name="star" size={8} color="#F59E0B" />
                            <View style={{ flex: 1, height: 5, backgroundColor: '#E2E8F0', borderRadius: 99, overflow: 'hidden' }}>
                              <View style={{ width: `${pct}%`, height: '100%', backgroundColor: '#F59E0B', borderRadius: 99 }} />
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>

                  {/* Review cards */}
                  {MOCK_REVIEWS.map((rv, i) => (
                    <View key={i} style={{
                      backgroundColor: '#fff', borderRadius: 16, borderWidth: 1,
                      borderColor: '#F1F5F9', padding: 14, gap: 10,
                    }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 14, fontWeight: '900', color: '#64748B' }}>{rv.name[0]}</Text>
                          </View>
                          <View>
                            <Text style={{ fontSize: 12, fontWeight: '900', color: '#0F172A' }}>{rv.name}</Text>
                            <Text style={{ fontSize: 9, color: '#94A3B8' }}>{rv.date}</Text>
                          </View>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 2 }}>
                          {[1,2,3,4,5].map(s => (
                            <Ionicons key={s} name="star" size={10} color={s <= rv.rating ? '#F59E0B' : '#E2E8F0'} />
                          ))}
                        </View>
                      </View>
                      <Text style={{ fontSize: 12, color: '#475569', fontWeight: '500', lineHeight: 18 }}>{rv.comment}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <View style={{ gap: 12, marginTop: 24 }}>
              <Text style={{ fontSize: 12, fontWeight: '900', color: '#0F172A', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                Related Products
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {relatedProducts.map(rp => (
                  <NewProductCard
                    key={rp.id}
                    product={rp}
                    cartQty={cart[rp.id] || 0}
                    onUpdateQty={(delta) => updateCartQty(rp.id, delta, rp)}
                    onPress={() => {
                      triggerLightHaptic();
                      if (onProductSelect) {
                        onProductSelect(rp);
                      }
                    }}
                    isGrid={true}
                  />
                ))}
              </View>
          </View>
        )}
        </View>

        {/* Bottom spacer to clear BottomTabBar */}
        <View style={{ height: 100 }} />
      </ScrollView>
      </>
      )}
    </View>
  );
};

export default NewProductDetailView;
