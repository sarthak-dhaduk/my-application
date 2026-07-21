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
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        paddingHorizontal: 24,
      }}
    >
      <Pressable onPress={() => {}} style={{ width: '100%', maxWidth: 384 }}>
        <View className="bg-white border border-gray-150 p-8 w-full rounded-none relative overflow-hidden">
          {/* Top Accent Line */}
          <View className="absolute top-0 left-0 right-0 h-[3.5px] bg-[#D74A33]" />
          
          <View className="items-center py-4">
            <View className="w-16 h-16 bg-red-50 border border-[#D74A33]/20 items-center justify-center mb-6 rounded-full">
              <Ionicons name="checkmark-circle" size={36} color="#D74A33" />
            </View>
            
            <Text className="text-[10px] text-[#D74A33] font-bold uppercase tracking-wider mb-2">
              Order Confirmed
            </Text>
            
            <Text className="text-xl font-bold text-black text-center mb-2">
              Order Placed Successfully!
            </Text>
            
            <Text className="text-xs text-slate-500 text-center mb-6 leading-relaxed">
              Your wholesale order has been processed. Our distribution team will review your specs and verify shop details.
            </Text>
            
            <Pressable
              onPress={handleDismissSuccess}
              className="w-full bg-[#D74A33] py-3.5 items-center justify-center rounded-none active:bg-[#C23C27]"
            >
              <Text className="text-white font-bold text-xs uppercase tracking-wider">
                Back to Home
              </Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Pressable>
  );
};
export default SuccessModal;
