import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Cart } from './types';

interface SuccessModalProps {
  showOrderSuccess: boolean;
  setShowOrderSuccess: (show: boolean) => void;
  setCart: (cart: Cart) => void;
  handleDismissSuccess: () => void;
  triggerLightHaptic: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  showOrderSuccess,
  setShowOrderSuccess,
  setCart,
  handleDismissSuccess,
  triggerLightHaptic,
}) => {
  if (!showOrderSuccess) return null;

  return (
    <Pressable
      onPress={() => {
        triggerLightHaptic();
        setShowOrderSuccess(false);
        setCart({});
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        paddingHorizontal: 24,
      }}
    >
      <Pressable onPress={() => {}} style={{ width: '100%', maxWidth: 384 }}>
        <View className="bg-[#090D16] border border-[#10B981]/30 p-8 w-full rounded-none relative overflow-hidden">
          {/* Neon Green Top Accent Line */}
          <View className="absolute top-0 left-0 right-0 h-[3.5px] bg-[#10B981]" />
          
          <View className="items-center py-4">
            <View className="w-16 h-16 bg-[#10B981]/10 border border-[#10B981]/30 items-center justify-center mb-6 rounded-none">
              <Ionicons name="checkmark-circle" size={36} color="#10B981" />
            </View>
            
            <Text className="text-[10px] text-[#10B981] font-black uppercase tracking-widest mb-2">
              Order Confirmed
            </Text>
            
            <Text className="text-xl font-bold text-white text-center mb-2">
              Order Placed Successfully!
            </Text>
            
            <Text className="text-xs text-gray-500 text-center mb-6 leading-relaxed">
              Your wholesale order has been processed. Our distribution team will review your specs and verify shop details.
            </Text>
            
            <Pressable
              onPress={handleDismissSuccess}
              className="w-full bg-[#10B981] py-3.5 items-center justify-center rounded-none active:bg-emerald-600"
            >
              <Text className="text-white font-bold text-xs uppercase tracking-widest">
                Back to Catalog
              </Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Pressable>
  );
};
export default SuccessModal;
