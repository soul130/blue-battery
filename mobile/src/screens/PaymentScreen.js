import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { IamportCertification } from 'iamport-react-native';
import { useDispatch } from 'react-redux';
import { addPayment } from '../redux/slices/paymentSlice';
import { paymentAPI } from '../services/apiClient';

const PaymentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { reservationId, amount } = route.params;

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    { id: 'credit_card', name: '신용카드', icon: '💳' },
    { id: 'kakao_pay', name: '카카오페이', icon: '🟨' },
    { id: 'toss', name: '토스', icon: '🔵' },
  ];

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      Alert.alert('알림', '결제 수단을 선택해주세요.');
      return;
    }

    setLoading(true);
    try {
      // 1. 서버에서 결제 준비
      const prepareResponse = await paymentAPI.preparePayment(
        reservationId,
        amount,
        selectedMethod
      );

      const { merchantUid } = prepareResponse.data;

      // 2. Iamport 결제창 오픈
      const data = {
        pg: selectedMethod === 'kakao_pay' ? 'kakaopay' : selectedMethod === 'toss' ? 'tosspayments' : 'html5_inicis',
        pay_method: selectedMethod === 'credit_card' ? 'card' : selectedMethod,
        merchant_uid: merchantUid,
        name: '블루배터리 배터리 교체',
        amount: amount,
        buyer_email: 'buyer@example.com',
        buyer_name: '구매자',
        buyer_tel: '01012345678',
      };

      // 실제 구현에서는 Iamport 결제 모달 오픈
      // 여기서는 시뮬레이션
      simulatePayment(merchantUid);
    } catch (error) {
      Alert.alert('오류', error.response?.data?.error || '결제 준비에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const simulatePayment = async (merchantUid) => {
    // 실제로는 Iamport 결제 후 impUid를 받지만, 여기서는 시뮬레이션
    Alert.alert(
      '결제',
      '실제 결제 화면이 표시됩니다.',
      [
        {
          text: '결제 완료',
          onPress: async () => {
            try {
              // 시뮬레이션 impUid
              const impUid = `imp_${Date.now()}`;

              const response = await paymentAPI.completePayment(impUid, merchantUid);
              dispatch(addPayment(response.data.payment));

              Alert.alert('성공', '결제가 완료되었습니다!', [
                {
                  text: '확인',
                  onPress: () => {
                    navigation.navigate('ReservationsMain');
                  },
                },
              ]);
            } catch (error) {
              Alert.alert('오류', error.response?.data?.error || '결제 완료 처리에 실패했습니다.');
            }
          },
        },
        {
          text: '결제 취소',
          onPress: () => Alert.alert('취소됨', '결제가 취소되었습니다.'),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 결제 정보 */}
      <View style={styles.paymentInfo}>
        <Text style={styles.paymentInfoLabel}>결제 예정 금액</Text>
        <Text style={styles.paymentInfoAmount}>₩{amount.toLocaleString()}</Text>
      </View>

      {/* 결제 수단 선택 */}
      <Text style={styles.sectionTitle}>결제 수단 선택</Text>
      <View style={styles.methodsContainer}>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodCard,
              selectedMethod === method.id && styles.methodCardActive,
            ]}
            onPress={() => handlePaymentMethodSelect(method.id)}
          >
            <Text style={styles.methodIcon}>{method.icon}</Text>
            <Text
              style={[
                styles.methodName,
                selectedMethod === method.id && styles.methodNameActive,
              ]}
            >
              {method.name}
            </Text>
            {selectedMethod === method.id && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* 결제 안내 */}
      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>⚠️ 결제 안내</Text>
        <Text style={styles.noticeText}>
          • 결제 후 예약이 자동으로 확정됩니다.{`\n`}
          • 결제 취소는 예약 취소 후 가능합니다.{`\n`}
          • 환불은 3-5일 소요됩니다.
        </Text>
      </View>

      {/* 결제하기 버튼 */}
      <TouchableOpacity
        style={[
          styles.paymentButton,
          (loading || !selectedMethod) && styles.paymentButtonDisabled,
        ]}
        onPress={handlePayment}
        disabled={loading || !selectedMethod}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.paymentButtonText}>
            ₩{amount.toLocaleString()} 결제하기
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
  paymentInfo: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  paymentInfoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  paymentInfoAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  methodsContainer: {
    gap: 12,
    marginBottom: 30,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  methodCardActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#1E88E5',
  },
  methodIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  methodNameActive: {
    color: '#1E88E5',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notice: {
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    padding: 15,
    borderRadius: 4,
    marginBottom: 30,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6F00',
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 13,
    color: '#E65100',
    lineHeight: 20,
  },
  paymentButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  paymentButtonDisabled: {
    backgroundColor: '#999',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
