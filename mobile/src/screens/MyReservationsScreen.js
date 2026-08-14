import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setReservations, setLoading, updateReservation } from '../redux/slices/reservationSlice';
import { reservationAPI } from '../services/apiClient';

const MyReservationsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { reservations, isLoading } = useSelector((state) => state.reservation);
  const [refreshing, setRefreshing] = useState(false);

  const statusColors = {
    pending: { bg: '#FFF3E0', text: '#FF6F00', label: '대기중' },
    confirmed: { bg: '#E8F5E9', text: '#2E7D32', label: '확정' },
    completed: { bg: '#E3F2FD', text: '#1565C0', label: '완료' },
    cancelled: { bg: '#FFEBEE', text: '#C62828', label: '취소' },
  };

  const fetchReservations = async () => {
    dispatch(setLoading(true));
    try {
      const response = await reservationAPI.getMyReservations();
      dispatch(setReservations(response.data));
    } catch (error) {
      Alert.alert('오류', '예약 목록을 불러올 수 없습니다.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReservations();
    setRefreshing(false);
  };

  const handleCancel = (reservationId) => {
    Alert.alert(
      '예약 취소',
      '정말 취소하시겠습니까?',
      [
        {
          text: '취소',
          onPress: () => console.log('취소됨'),
        },
        {
          text: '확인',
          onPress: async () => {
            try {
              await reservationAPI.cancelReservation(reservationId);
              fetchReservations();
              Alert.alert('성공', '예약이 취소되었습니다.');
            } catch (error) {
              Alert.alert('오류', '예약 취소에 실패했습니다.');
            }
          },
        },
      ]
    );
  };

  const ReservationCard = ({ item }) => {
    const status = statusColors[item.status] || statusColors.pending;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ReservationDetail', { reservationId: item._id })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.batteryName}>{item.batteryId?.name || 'N/A'}</Text>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusText, { color: status.text }]}>
              {status.label}
            </Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>예약 날짜</Text>
            <Text style={styles.infoValue}>
              {new Date(item.reservationDate).toLocaleDateString('ko-KR')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>시간</Text>
            <Text style={styles.infoValue}>{item.timeSlot}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>위치</Text>
            <Text style={styles.infoValue}>{item.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>차량</Text>
            <Text style={styles.infoValue}>
              {item.carInfo?.carModel} ({item.carInfo?.carYear})
            </Text>
          </View>
          {item.paymentId && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>결제 금액</Text>
              <Text style={styles.priceValue}>
                ₩{item.batteryId?.price?.toLocaleString() || '0'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.cardFooter}>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => navigation.navigate('ReservationDetail', { reservationId: item._id })}
          >
            <Text style={styles.detailButtonText}>상세보기</Text>
          </TouchableOpacity>
          {(item.status === 'pending' || item.status === 'confirmed') && (
            <TouchableOpacity
              style={[styles.cancelButton]}
              onPress={() => handleCancel(item._id)}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E88E5" />
        </View>
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ReservationCard item={item} />}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>예약 내역이 없습니다.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 10,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  batteryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  infoLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 14,
    color: '#1E88E5',
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 10,
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#E3F2FD',
    borderRadius: 6,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#1E88E5',
    fontSize: 13,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFEBEE',
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#F44336',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default MyReservationsScreen;
