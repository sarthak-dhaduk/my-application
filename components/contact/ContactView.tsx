import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Alert, Linking, Animated, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

const THEME = '#D74A33';
const NAVY = '#1E3A5F';

interface ContactViewProps {
  triggerLightHaptic: () => void;
  triggerSuccessHaptic: () => void;
}

const ContactSkeleton = () => {
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
    <View>
      {/* Contact Method Cards */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32, gap: 12 }}>
        {[1, 2, 3].map((_, i) => (
          <View key={i} style={{ 
            flex: 1, backgroundColor: '#fff', borderRadius: 20, padding: 16, alignItems: 'center',
            shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2
          }}>
            <View style={{ width: '100%', alignItems: 'center' }}>
              <Animated.View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: shimmerSub, marginBottom: 12 }} />
              <Animated.View style={{ width: 60, height: 12, backgroundColor: shimmerMain, borderRadius: 4, marginBottom: 4 }} />
              <Animated.View style={{ width: 70, height: 8, backgroundColor: shimmerSub, borderRadius: 4 }} />
            </View>
          </View>
        ))}
      </View>

      {/* Map Area */}
      <Animated.View style={{ 
        backgroundColor: shimmerSub,
        height: 220, borderRadius: 24, marginBottom: 32,
        borderWidth: 4, borderColor: '#fff',
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 2
      }} />

      {/* Form Area */}
      <View style={{ 
        backgroundColor: '#fff', borderRadius: 24, padding: 24, 
        shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 15, shadowOffset: { width: 0, height: 5 }, elevation: 3 
      }}>
        <View>
          <Animated.View style={{ width: 140, height: 20, backgroundColor: shimmerMain, borderRadius: 6, marginBottom: 20 }} />
          
          <Animated.View style={{ width: 80, height: 10, backgroundColor: shimmerSub, borderRadius: 4, marginBottom: 8 }} />
          <Animated.View style={{ width: '100%', height: 52, backgroundColor: shimmerMain, borderWidth: 2, borderColor: '#F1F5F9', borderRadius: 12, marginBottom: 20 }} />
          
          <Animated.View style={{ width: 100, height: 10, backgroundColor: shimmerSub, borderRadius: 4, marginBottom: 8 }} />
          <Animated.View style={{ width: '100%', height: 52, backgroundColor: shimmerMain, borderWidth: 2, borderColor: '#F1F5F9', borderRadius: 12, marginBottom: 20 }} />
          
          <Animated.View style={{ width: 110, height: 10, backgroundColor: shimmerSub, borderRadius: 4, marginBottom: 8 }} />
          <Animated.View style={{ width: '100%', height: 120, backgroundColor: shimmerMain, borderWidth: 2, borderColor: '#F1F5F9', borderRadius: 12, marginBottom: 24 }} />
          
          <Animated.View style={{ width: '100%', height: 56, backgroundColor: shimmerMain, borderRadius: 16 }} />
        </View>
      </View>
    </View>
  );
};

export const ContactView: React.FC<ContactViewProps> = ({
  triggerLightHaptic,
  triggerSuccessHaptic,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isReady, setIsReady] = useState(false);

  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsReady(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSendInquiry = () => {
    triggerSuccessHaptic();
    Alert.alert(
      'Message Sent',
      `Thank you, ${name}! We have received your message and will respond to ${email} shortly.`,
      [{ text: 'OK' }]
    );
    setName('');
    setEmail('');
    setMessage('');
  };

  const isFormValid = name.trim().length > 0 && email.trim().length > 0 && message.trim().length > 0;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F8FAFC' }} showsVerticalScrollIndicator={false}>
      
      {/* Header Area */}
      <View style={{ backgroundColor: THEME, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 60 }}>
        <Text style={{ fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: -0.5, marginBottom: 8 }}>
          Get in Touch
        </Text>
        <Text style={{ fontSize: 15, color: '#CBD5E1', lineHeight: 22 }}>
          Have a question or need help with an order? We're here for you. Reach out to our support team.
        </Text>
      </View>

      <View style={{ paddingHorizontal: 24, marginTop: -32, paddingBottom: 120 }}>
        {!isReady ? (
          <ContactSkeleton />
        ) : (
          <>
            {/* Contact Method Cards */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32, gap: 12 }}>
          {[
            { icon: 'logo-whatsapp', label: 'WhatsApp', sub: '+91 7622972543', color: '#10B981', action: () => Linking.openURL('whatsapp://send?text=Hello&phone=917622972543').catch(() => Alert.alert('Error', 'WhatsApp is not installed on this device.')) },
            { icon: 'mail', label: 'Email', sub: 'contact@xunifire.com', color: THEME, action: () => Linking.openURL('mailto:contact@xunifire.com') },
            { icon: 'call', label: 'Call Us', sub: '+91 7622972543', color: '#3B82F6', action: () => Linking.openURL('tel:+917622972543') },
          ].map((item, idx) => (
            <Pressable
              key={idx}
              onPress={() => { triggerLightHaptic(); item.action(); }}
              style={{
                flex: 1, backgroundColor: '#fff', borderRadius: 20, padding: 16, alignItems: 'center',
                shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2
              }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: item.color + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Ionicons name={item.icon as any} size={22} color={item.color} />
              </View>
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 4 }}>{item.label}</Text>
              <Text style={{ fontSize: 9, fontWeight: '700', color: '#64748B', textAlign: 'center' }} numberOfLines={1} adjustsFontSizeToFit>{item.sub}</Text>
            </Pressable>
          ))}
        </View>

        {/* Interactive Google Map */}
        <View style={{ 
          height: 220, 
          backgroundColor: '#E2E8F0', 
          borderRadius: 24, 
          overflow: 'hidden',
          marginBottom: 32,
          borderWidth: 4,
          borderColor: '#fff',
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 5 },
          elevation: 2
        }}>
          <WebView 
            source={{ html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                  <style>
                    body { margin: 0; padding: 0; overflow: hidden; background-color: #E2E8F0; }
                    iframe { width: 100vw; height: 100vh; border: none; }
                  </style>
                </head>
                <body>
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15236.892825492974!2d-122.40845228351276!3d37.78776682612927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2sin!4v1784550067251!5m2!1sen!2sin" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </body>
              </html>
            `}}
            style={{ flex: 1 }}
            scrollEnabled={false}
          />
        </View>

        {/* Message Form */}
        <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 15, shadowOffset: { width: 0, height: 5 }, elevation: 3 }}>
          <Text style={{ fontSize: 18, fontWeight: '900', color: '#0F172A', marginBottom: 20 }}>Send a Message</Text>
          
          <Text style={{ fontSize: 12, fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Your Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            onFocus={() => setFocusedInput('name')}
            onBlur={() => setFocusedInput(null)}
            placeholder="John Doe"
            placeholderTextColor="#94A3B8"
            style={{
              backgroundColor: focusedInput === 'name' ? '#fff' : '#F1F5F9',
              borderWidth: 2,
              borderColor: focusedInput === 'name' ? THEME : 'transparent',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
              fontSize: 15,
              color: '#0F172A',
              marginBottom: 20
            }}
          />

          <Text style={{ fontSize: 12, fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Email Address</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocusedInput('email')}
            onBlur={() => setFocusedInput(null)}
            placeholder="john@example.com"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              backgroundColor: focusedInput === 'email' ? '#fff' : '#F1F5F9',
              borderWidth: 2,
              borderColor: focusedInput === 'email' ? THEME : 'transparent',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
              fontSize: 15,
              color: '#0F172A',
              marginBottom: 20
            }}
          />

          <Text style={{ fontSize: 12, fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>How can we help?</Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            onFocus={() => setFocusedInput('msg')}
            onBlur={() => setFocusedInput(null)}
            placeholder="Describe your issue or question..."
            placeholderTextColor="#94A3B8"
            multiline
            style={{
              backgroundColor: focusedInput === 'msg' ? '#fff' : '#F1F5F9',
              borderWidth: 2,
              borderColor: focusedInput === 'msg' ? THEME : 'transparent',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 16,
              fontSize: 15,
              color: '#0F172A',
              minHeight: 120,
              textAlignVertical: 'top',
              marginBottom: 24
            }}
          />

          <Pressable
            onPress={handleSendInquiry}
            disabled={!isFormValid}
            style={{
              backgroundColor: isFormValid ? THEME : '#E2E8F0',
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              shadowColor: THEME,
              shadowOpacity: isFormValid ? 0.3 : 0,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
            }}
          >
            <Ionicons name="paper-plane" size={18} color={isFormValid ? '#fff' : '#94A3B8'} style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 14, fontWeight: '900', color: isFormValid ? '#fff' : '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.5 }}>
              Send Message
            </Text>
          </Pressable>
        </View>
      </>
    )}
  </View>
</ScrollView>
  );
};

export default ContactView;
