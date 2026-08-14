import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setCurrentReservation } from '../redux/slices/reservationSlice';
import { reservationAPI } from '../services/apiClient';

const ReservationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { batteryId, batteryPrice } = route.params;

  const [reservationDate, setReservationDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timeSlot, setTimeSlot] = useState('09:00-10:00');
  const [location, setLocation] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    '09:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '14:00-15:00',
    '15:00-16:00',
    '16:00-17:00',
    '17:00-18:00',
  ];

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setReservationDate(selectedDate);
    }
  };

  const handleReservation = async () => {
    if (!location || !carModel || !carYear || !licensePlate) {
      Alert.alert('오류', '모든 필수 정보를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await reservationAPI.createReservation(
        batteryId,
        reservationDate.toISOString().split('T')[0],
        timeSlot,
        location,
        {
          carModel,
          carYear,
          licensePlate,
        },
        notes
      );

      dispatch(setCurrentReservation(response.data.reservation));

      Alert.alert('성공', '예약이 생성되었습니다.', [
        {
          text: '결제하기',
          onPress: () =>
            navigation.navigate('Payment', {
              reservationId: response.data.reservation._id,
              amount: batteryPrice,
            }),
        },
      ]);
    } catch (error) {
      Alert.alert('오류', error.response?.data?.error || '예약 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>예약 정보</Text>

      {/* 날짜 선택 */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>예약 날짜</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {reservationDate.toLocaleDateString('ko-KR')}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={reservationDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      {/* 시간 선택 */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>예약 시간</Text>
        <View style={styles.timeSlotContainer}>
          {timeSlots.map((slot) => (
            <TouchableOpacity
              key={slot}
              style={[
                styles.timeSlotButton,
                timeSlot === slot && styles.timeSlotButtonActive,
              ]}
              onPress={() => setTimeSlot(slot)}
            >
              <Text
                style={[
                  styles.timeSlotText,
                  timeSlot === slot && styles.timeSlotTextActive,
                ]}
              >
                {slot}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 위치 입력 */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>교체 위치 *</Text>
        <TextInput
          style={styles.input}
          placeholder="예: 서울시 강남구 삼성동"
          value={location}
          onChangeText={setLocation}
          placeholderTextColor="#999"
        />
      </View>

      <Text style={styles.sectionTitle}>차량 정보</Text>

      {/* 차량 모델 */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>차량 모델 *</Text>
        <TextInput
          style={styles.input}
          placeholder="예: 아반떼"
          value={carModel}
          onChangeText={setCarModel}
          placeholderTextColor="#999"
        />
      </View>

      {/* 차량 연식 */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>차량 연식 *</Text>
        <TextInput
          style={styles.input}
          placeholder="예: 2020"
          value={carYear}
          onChangeText={setCarYear}
          keyboardType="numeric"
          placeholderTextColor="#999"
        />
      </View>

      {/* 차량 번호판 */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>차량 번호판 *</Text>
        <TextInput
          style={styles.input}
          placeholder="예: 서울 12가 1234"
          value={licensePlate}
          onChangeText={setLicensePlate}
          placeholderTextColor="#999"
        />
      </View>

      {/* 메모 */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>요청사항 (선택)</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="기술자에게 전달할 특별 요청사항이 있으면 입력해주세요."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          placeholderTextColor="#999"
        />
      </View>

      {/* 가격 요약 */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>배터리 가격</Text>
          <Text style={styles.summaryValue}>₩{batteryPrice.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabelTotal}>총 가격</Text>
          <Text style={styles.summaryValueTotal}>₩{batteryPrice.toLocaleString()}</Text>
        </View>
      </View>

      {/* 예약 확인 버튼 */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleReservation}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? '예약 중...' : '예약 확인하기'}
        </Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 15,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
  },
  timeSlotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlotButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  timeSlotButtonActive: {
    backgroundColor: '#1E88E5',
    borderColor: '#1E88E5',
  },
  timeSlotText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  timeSlotTextActive: {
    color: '#fff',
  },
  summary: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginVertical: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  summaryLabelTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryValueTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  button: {
    backgroundColor: '#1E88E5',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReservationScreen;
