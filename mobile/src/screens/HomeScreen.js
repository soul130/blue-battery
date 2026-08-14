import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setBatteries, setSelectedBattery, setLoading } from '../redux/slices/batterySlice';
import { batteryAPI } from '../services/apiClient';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { batteries, isLoading } = useSelector((state) => state.battery);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { id: 'all', name: '전체', value: null },
    { id: 'standard', name: '일반형', value: 'standard' },
    { id: 'premium', name: '프리미엄', value: 'premium' },
    { id: 'professional', name: '프로페셔널', value: 'professional' },
  ];

  const fetchBatteries = async () => {
    dispatch(setLoading(true));
    try {
      const response = await batteryAPI.getBatteries(selectedCategory, search);
      dispatch(setBatteries(response.data));
    } catch (error) {
      Alert.alert('오류', '배터리 정보를 불러올 수 없습니다.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchBatteries();
  }, [selectedCategory, search]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBatteries();
    setRefreshing(false);
  };

  const handleBatteryPress = (battery) => {
    dispatch(setSelectedBattery(battery));
    navigation.navigate('BatteryDetail', { batteryId: battery._id });
  };

  const BatteryCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleBatteryPress(item)}
    >
      <View style={styles.cardContent}>
        <Text style={styles.batteryName}>{item.name}</Text>
        <Text style={styles.batteryModel}>{item.model}</Text>
        <Text style={styles.batteryDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.price}>₩{item.price.toLocaleString()}</Text>
          <View
            style={[
              styles.stockBadge,
              item.stock > 0 ? styles.stockAvailable : styles.stockUnavailable,
            ]}
          >
            <Text style={styles.stockText}>
              {item.stock > 0 ? `${item.stock}개 남음` : '재고 없음'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 검색창 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="배터리 검색..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#999"
        />
      </View>

      {/* 카테고리 필터 */}
      <View style={styles.categoryContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryBtn,
                selectedCategory === item.value && styles.categoryBtnActive,
              ]}
              onPress={() => setSelectedCategory(item.value)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item.value && styles.categoryTextActive,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* 배터리 목록 */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E88E5" />
        </View>
      ) : (
        <FlatList
          data={batteries}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <BatteryCard item={item} />}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
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
  searchContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  categoryContainer: {
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  categoryBtnActive: {
    backgroundColor: '#1E88E5',
    borderColor: '#1E88E5',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  cardContent: {
    padding: 15,
  },
  batteryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  batteryModel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  batteryDescription: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  stockBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  stockAvailable: {
    backgroundColor: '#E8F5E9',
  },
  stockUnavailable: {
    backgroundColor: '#FFEBEE',
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
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
});

export default HomeScreen;
