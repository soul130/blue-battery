import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { batteryAPI } from '../services/apiClient';

const BatteryDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { batteryId } = route.params;
  const [battery, setBattery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBatteryDetail();
  }, []);

  const fetchBatteryDetail = async () => {
    try {
      setLoading(true);
      const response = await batteryAPI.getBattery(batteryId);
      setBattery(response.data);
    } catch (error) {
      Alert.alert('오류', '배터리 정보를 불러올 수 없습니다.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleReservation = () => {
    if (battery.stock <= 0) {
      Alert.alert('알림', '현재 재고가 없습니다.');
      return;
    }
    navigation.navigate('Reservation', { batteryId: battery._id, batteryPrice: battery.price });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
      </View>
    );
  }

  if (!battery) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>배터리 정보를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 배터리 이미지 영역 */}
      <View style={styles.imageContainer}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>🔋</Text>
        </View>
      </View>

      {/* 기본 정보 */}
      <View style={styles.section}>
        <Text style={styles.name}>{battery.name}</Text>
        <Text style={styles.model}>{battery.model}</Text>
        <Text style={styles.description}>{battery.description}</Text>
      </View>

      {/* 가격 */}
      <View style={styles.priceSection}>
        <Text style={styles.priceLabel}>가격</Text>
        <Text style={styles.price}>₩{battery.price.toLocaleString()}</Text>
      </View>

      {/* 사양 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>사양</Text>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>용량:</Text>
          <Text style={styles.specValue}>{battery.specifications?.capacity || 'N/A'}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>전압:</Text>
          <Text style={styles.specValue}>{battery.specifications?.voltage || 'N/A'}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>보증:</Text>
          <Text style={styles.specValue}>{battery.specifications?.warranty || 'N/A'}</Text>
        </View>
      </View>

      {/* 카테고리 및 재고 */}
      <View style={styles.section}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>카테고리</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{battery.category}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>재고</Text>
          <Text
            style={[
              styles.infoValue,
              battery.stock > 0 ? styles.stockAvailable : styles.stockUnavailable,
            ]}
          >
            {battery.stock > 0 ? `${battery.stock}개 남음` : '재고 없음'}
          </Text>
        </View>
      </View>

      {/* 예약하기 버튼 */}
      <TouchableOpacity
        style={[
          styles.reservationButton,
          battery.stock <= 0 && styles.reservationButtonDisabled,
        ]}
        onPress={handleReservation}
        disabled={battery.stock <= 0}
      >
        <Text style={styles.reservationButtonText}>
          {battery.stock > 0 ? '예약하기' : '재고 없음'}
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
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#999',
  },
  imageContainer: {
    height: 250,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 80,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  model: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
  },
  priceSection: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  price: {
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
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  specLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  specValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    color: '#1E88E5',
    fontSize: 12,
    fontWeight: '600',
  },
  stockAvailable: {
    color: '#4CAF50',
  },
  stockUnavailable: {
    color: '#F44336',
  },
  reservationButton: {
    margin: 20,
    backgroundColor: '#1E88E5',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  reservationButtonDisabled: {
    backgroundColor: '#ccc',
  },
  reservationButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BatteryDetailScreen;
