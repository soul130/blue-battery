import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import store from './src/redux/store';

// 화면 import
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import BatteryDetailScreen from './src/screens/BatteryDetailScreen';
import ReservationScreen from './src/screens/ReservationScreen';
import MyReservationsScreen from './src/screens/MyReservationsScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#1E88E5',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
    }}
  >
    <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: '블루배터리' }} />
    <Stack.Screen name="BatteryDetail" component={BatteryDetailScreen} options={{ title: '배터리 상세' }} />
    <Stack.Screen name="Reservation" component={ReservationScreen} options={{ title: '예약하기' }} />
    <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: '결제' }} />
  </Stack.Navigator>
);

const ReservationStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#1E88E5',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
    }}
  >
    <Stack.Screen name="ReservationsMain" component={MyReservationsScreen} options={{ title: '내 예약' }} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#1E88E5',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
    }}
  >
    <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: '프로필' }} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#1E88E5',
      tabBarInactiveTintColor: '#999',
      headerShown: false,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeStack}
      options={{
        title: '홈',
        tabBarLabel: '홈',
      }}
    />
    <Tab.Screen
      name="Reservations"
      component={ReservationStack}
      options={{
        title: '예약',
        tabBarLabel: '내 예약',
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileStack}
      options={{
        title: '프로필',
        tabBarLabel: '프로필',
      }}
    />
  </Tab.Navigator>
);

const RootStack = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null);

  React.useEffect(() => {
    // 토큰 확인 로직 (AsyncStorage에서)
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setUserToken(token);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken == null ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <Stack.Screen name="App" component={AppStack} />
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
