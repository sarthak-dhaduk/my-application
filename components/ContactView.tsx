import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ContactViewProps {
  triggerLightHaptic: () => void;
  triggerSuccessHaptic: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({
  triggerLightHaptic,
  triggerSuccessHaptic,
}) => {
  const [inquiryShop, setInquiryShop] = useState('');
  const [inquiryContact, setInquiryContact] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');

  const handleSendInquiry = () => {
    triggerSuccessHaptic();
    Alert.alert(
      'Inquiry Submitted!',
      `We have received your request for: ${inquiryShop}.\nOur sales team will reach out at: ${inquiryContact}.`
    );
    setInquiryShop('');
    setInquiryContact('');
    setInquiryMsg('');
  };

  return (
    <ScrollView className="flex-1 px-6 pt-16 mb-20" showsVerticalScrollIndicator={false}>
      <Text className="text-xs text-[#3B82F6] font-extrabold uppercase tracking-widest">
        Direct Distributor Contact
      </Text>
      <Text className="text-2xl font-bold text-white mt-1 mb-6">
        VoltLine Distributor Owner
      </Text>

      <View className="bg-gradient-to-br from-[#161C30] to-[#0E1325] border border-white/5 p-6 rounded-none mb-6 relative overflow-hidden">
        <Text className="text-lg font-bold text-white mb-1">MobiAccessories Wholesales</Text>
        <Text className="text-gray-400 text-xs mb-4">Connecting mobile shops with premium stock.</Text>
        
        <View className="flex-row items-center mb-3">
          <Ionicons name="call-outline" size={18} color="#3B82F6" className="mr-3" />
          <Text className="text-white text-xs font-semibold">+1 (555) 019-2834</Text>
        </View>
        <View className="flex-row items-center mb-3">
          <Ionicons name="mail-outline" size={18} color="#3B82F6" className="mr-3" />
          <Text className="text-white text-xs font-semibold">orders@voltlineb2b.com</Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="pin-outline" size={18} color="#3B82F6" className="mr-3" />
          <Text className="text-white text-xs font-semibold">Suite 404, Electronics Wholesale Hub</Text>
        </View>
      </View>

      <Text className="text-sm font-bold text-white mb-4">Quick B2B Inquiries</Text>

      <Pressable
        onPress={triggerLightHaptic}
        className="bg-[#121829] border border-white/5 p-4 rounded-none flex-row items-center mb-6 active:border-[#3B82F6]/30"
      >
        <View className="w-10 h-10 bg-[#3B82F6]/10 rounded-none items-center justify-center mr-3">
          <Ionicons name="logo-whatsapp" size={20} color="#3B82F6" />
        </View>
        <View className="flex-1">
          <Text className="text-white text-xs font-bold">Chat on WhatsApp</Text>
          <Text className="text-[10px] text-gray-500 mt-0.5">Average response: 5 mins</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={16} color="#475569" />
      </Pressable>

      {/* Inquiry Form Section */}
      <View className="bg-[#121829] border border-white/5 p-5 rounded-none mb-12">
        <Text className="text-xs font-black text-[#3B82F6] uppercase tracking-widest mb-4">Send Wholesale Inquiry</Text>
        
        <Text className="text-xs text-gray-500 mb-1">Your Shop Name</Text>
        <TextInput
          value={inquiryShop}
          onChangeText={setInquiryShop}
          placeholder="Enter shop name"
          placeholderTextColor="#475569"
          className="bg-[#161C30] border border-white/10 rounded-none px-4 py-2.5 text-white text-xs mb-3 focus:border-[#3B82F6]"
        />

        <Text className="text-xs text-gray-500 mb-1">Email / Phone</Text>
        <TextInput
          value={inquiryContact}
          onChangeText={setInquiryContact}
          placeholder="How should we reach you?"
          placeholderTextColor="#475569"
          className="bg-[#161C30] border border-white/10 rounded-none px-4 py-2.5 text-white text-xs mb-3 focus:border-[#3B82F6]"
        />

        <Text className="text-xs text-gray-500 mb-1">Inquiry Details</Text>
        <TextInput
          value={inquiryMsg}
          onChangeText={setInquiryMsg}
          placeholder="Describe what models/quantities you require..."
          placeholderTextColor="#475569"
          multiline
          numberOfLines={4}
          style={{ textAlignVertical: 'top', height: 80 }}
          className="bg-[#161C30] border border-white/10 rounded-none px-4 py-2.5 text-white text-xs mb-4 focus:border-[#3B82F6]"
        />

        <Pressable
          onPress={handleSendInquiry}
          disabled={!inquiryShop || !inquiryContact || !inquiryMsg}
          className={`py-3.5 rounded-none items-center justify-center flex-row ${
            inquiryShop && inquiryContact && inquiryMsg ? 'bg-[#3B82F6] active:bg-[#1D4ED8]' : 'bg-[#161C30] opacity-50'
          }`}
        >
          <Ionicons name="send-outline" size={12} color="white" style={{ marginRight: 6 }} />
          <Text className="text-white font-bold text-xs uppercase tracking-widest">
            Submit Inquiry Form
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};
export default ContactView;
