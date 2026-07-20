import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Switch, Animated } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

interface ProfileViewProps {
  triggerLightHaptic: () => void;
}

const THEME = '#D74A33';
const NAVY = '#1E3A5F';

const ProfileSkeleton = () => {
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

  const shimmerHeader = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.5)']
  });

  return (
    <View>
      {/* 1. Header (Avatar + Name + Logout) */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 16 }}>
          <Animated.View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: shimmerHeader, borderWidth: 3, borderColor: '#fff' }} />
          <View style={{ marginLeft: 16, flex: 1 }}>
            <Animated.View style={{ width: 120, height: 24, backgroundColor: shimmerHeader, borderRadius: 6, marginBottom: 8 }} />
            <Animated.View style={{ width: 160, height: 14, backgroundColor: shimmerHeader, borderRadius: 4 }} />
          </View>
        </View>
        <Animated.View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: shimmerHeader }} />
      </View>

      {/* Quick Stats */}
      <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 32 }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Animated.View style={{ width: 40, height: 24, backgroundColor: shimmerMain, borderRadius: 6, marginBottom: 8 }} />
          <Animated.View style={{ width: 70, height: 12, backgroundColor: shimmerSub, borderRadius: 4 }} />
        </View>
        <View style={{ width: 1, backgroundColor: '#F1F5F9', marginHorizontal: 4 }} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Animated.View style={{ width: 60, height: 24, backgroundColor: shimmerMain, borderRadius: 6, marginBottom: 8 }} />
          <Animated.View style={{ width: 80, height: 12, backgroundColor: shimmerSub, borderRadius: 4 }} />
        </View>
      </View>

      {/* Payment Methods */}
      <Animated.View style={{ width: 140, height: 16, backgroundColor: shimmerMain, borderRadius: 4, marginBottom: 16 }} />
      <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 32, height: 120 }} />

      {/* Preferences */}
      <Animated.View style={{ width: 120, height: 16, backgroundColor: shimmerMain, borderRadius: 4, marginBottom: 16 }} />
      <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <Animated.View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: shimmerSub }} />
            <View style={{ justifyContent: 'center' }}>
              <Animated.View style={{ width: 100, height: 14, backgroundColor: shimmerMain, borderRadius: 4, marginBottom: 6 }} />
              <Animated.View style={{ width: 160, height: 10, backgroundColor: shimmerSub, borderRadius: 4 }} />
            </View>
          </View>
          <Animated.View style={{ width: 40, height: 24, borderRadius: 12, backgroundColor: shimmerSub, alignSelf: 'center' }} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <Animated.View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: shimmerSub }} />
            <View style={{ justifyContent: 'center' }}>
              <Animated.View style={{ width: 90, height: 14, backgroundColor: shimmerMain, borderRadius: 4, marginBottom: 6 }} />
              <Animated.View style={{ width: 140, height: 10, backgroundColor: shimmerSub, borderRadius: 4 }} />
            </View>
          </View>
          <Animated.View style={{ width: 40, height: 24, borderRadius: 12, backgroundColor: shimmerSub, alignSelf: 'center' }} />
        </View>
      </View>
    </View>
  );
};

export const ProfileView: React.FC<ProfileViewProps> = ({ triggerLightHaptic }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailOffersEnabled, setEmailOffersEnabled] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const toggleSwitch = (setter: React.Dispatch<React.SetStateAction<boolean>>, value: boolean) => {
    triggerLightHaptic();
    setter(!value);
  };

  return (
    <ScrollView className="flex-1 bg-[#F8FAFC]" showsVerticalScrollIndicator={false}>
      
      {/* Top Header Background (Signature Theme Color) */}
      <View style={{ backgroundColor: THEME, height: 185, position: 'absolute', top: 0, left: 0, right: 0 }} />

      <View className="px-6 pt-12 pb-36">
        {!isReady ? (
          <ProfileSkeleton />
        ) : (
          <>
            {/* 1. Person Information Section */}
            <View className="mb-8">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 pr-4">
              {/* Avatar on the left */}
              <View style={{
                width: 72, height: 72, borderRadius: 36, backgroundColor: '#fff',
                alignItems: 'center', justifyContent: 'center',
                shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5,
                borderWidth: 3, borderColor: '#fff'
              }}>
                <Image
                  source={require('../../assets/images/dp.png')}
                  style={{ width: 66, height: 66, borderRadius: 33 }}
                  contentFit="cover"
                />
                {/* Online Status Badge */}
                <View style={{ position: 'absolute', bottom: 2, right: 2, width: 16, height: 16, borderRadius: 8, backgroundColor: '#22C55E', borderWidth: 3, borderColor: '#fff' }} />
              </View>
              
              {/* Name and Email */}
              <View className="ml-4 flex-1">
                <Text style={{ fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: -0.5 }}>Ava Blake</Text>
                <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 2, fontWeight: '600' }} numberOfLines={1}>ava.blake@xunifire.com</Text>
              </View>
            </View>

            {/* Logout button on the right */}
            <Pressable 
              onPress={() => triggerLightHaptic()}
              className="w-12 h-12 items-center justify-center rounded-2xl"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <Ionicons name="log-out-outline" size={24} color="#fff" style={{ marginLeft: 3 }} />
            </Pressable>
          </View>
          
          {/* Quick Stats */}
          <View style={{ flexDirection: 'row', marginTop: 32, backgroundColor: '#fff', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15, shadowOffset: { width: 0, height: 8 }, elevation: 5, width: '100%', justifyContent: 'space-around' }}>
            <View className="items-center flex-1">
              <Text style={{ fontSize: 22, fontWeight: '900', color: THEME }}>42</Text>
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginTop: 4 }}>Total Orders</Text>
            </View>
            
            <View style={{ width: 1, backgroundColor: '#F1F5F9', marginHorizontal: 4 }} />
            
            <View className="items-center flex-1">
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <FontAwesome5 name="coins" size={14} color="#F59E0B" />
                <Text style={{ fontSize: 22, fontWeight: '900', color: THEME }}>12.5k</Text>
              </View>
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginTop: 4 }}>XCoins Earned</Text>
            </View>
          </View>
        </View>

        {/* 2. Connected Payment Method Section */}
        <Text style={{ fontSize: 14, fontWeight: '900', color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, marginTop: 8 }}>
          Payment Methods
        </Text>
        
        <View style={{
          backgroundColor: NAVY, borderRadius: 24, padding: 24, marginBottom: 16,
          shadowColor: NAVY, shadowOpacity: 0.3, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 8,
          overflow: 'hidden'
        }}>
          {/* Card Decorative Theme Accent */}
          <View style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: 70, backgroundColor: THEME, opacity: 0.9 }} />
          <View style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.1)' }} />
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
            <FontAwesome5 name="cc-visa" size={36} color="#fff" />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
                <Text style={{ fontSize: 10, fontWeight: '800', color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5 }}>Primary</Text>
              </View>
              {/* Remove Button - High Visibility (No shadow to prevent square artifact) */}
              <Pressable 
                onPress={triggerLightHaptic}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FEF2F2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}
              >
                <Ionicons name="trash" size={12} color="#EF4444" />
                <Text style={{ fontSize: 10, fontWeight: '900', color: '#EF4444', textTransform: 'uppercase', letterSpacing: 0.5 }}>Remove</Text>
              </Pressable>
            </View>
          </View>
          
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#fff', letterSpacing: 4, marginBottom: 24 }}>
            ••••  ••••  ••••  4242
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, fontWeight: '600' }}>Card Holder</Text>
              <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff', letterSpacing: 0.5 }}>AVA BLAKE</Text>
            </View>
            <View>
              <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, fontWeight: '600' }}>Expires</Text>
              <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff', letterSpacing: 0.5 }}>12/28</Text>
            </View>
          </View>
        </View>

        {/* Add Payment Method Button */}
        <Pressable 
          onPress={triggerLightHaptic}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 18, backgroundColor: 'transparent', borderRadius: 20, borderWidth: 2, borderColor: '#CBD5E1', borderStyle: 'dashed', marginBottom: 32 }}
        >
          <Ionicons name="add-circle" size={24} color="#64748B" />
          <Text style={{ fontSize: 14, fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 }}>Add New Payment Method</Text>
        </Pressable>

        {/* 3. Notification & Preferences Section */}
        <Text style={{ fontSize: 14, fontWeight: '900', color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
          Preferences
        </Text>

        <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 15, shadowOffset: { width: 0, height: 6 }, elevation: 4, marginBottom: 32 }}>
          
          {/* Push Notifications Toggle */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="notifications" size={20} color={THEME} />
              </View>
              <View>
                <Text style={{ fontSize: 15, fontWeight: '900', color: '#0F172A' }}>Push Notifications</Text>
                <Text style={{ fontSize: 12, color: '#64748B', marginTop: 2, fontWeight: '500' }}>Order updates & delivery alerts</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: '#E2E8F0', true: THEME }}
              thumbColor={'#fff'}
              ios_backgroundColor="#E2E8F0"
              onValueChange={() => toggleSwitch(setNotificationsEnabled, notificationsEnabled)}
              value={notificationsEnabled}
            />
          </View>

          {/* Email Offers Toggle */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="mail" size={20} color={THEME} />
              </View>
              <View>
                <Text style={{ fontSize: 15, fontWeight: '900', color: '#0F172A' }}>Email Offers</Text>
                <Text style={{ fontSize: 12, color: '#64748B', marginTop: 2, fontWeight: '500' }}>Exclusive partner discounts</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: '#E2E8F0', true: THEME }}
              thumbColor={'#fff'}
              ios_backgroundColor="#E2E8F0"
              onValueChange={() => toggleSwitch(setEmailOffersEnabled, emailOffersEnabled)}
              value={emailOffersEnabled}
            />
          </View>
        </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default ProfileView;
