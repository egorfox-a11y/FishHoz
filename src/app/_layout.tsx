import { Colors } from '@/components/tokens';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { auth } from '../api/auth';

export default function RootLayout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await auth.getUser();
      
      if (!user) {
  
        router.replace('/register');
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return null;   
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <BottomSheetModalProvider>
    <Stack>
    <Stack.Screen 
      name="(tabs)" 
      options={{ 
        headerShown: false, 
      }} 
      />
      <Stack.Screen name="login" options={{ title: 'Вход', headerShown: false }} />
      <Stack.Screen name="register" options={{ title: 'Регистрация', headerShown: false }} />
      <Stack.Screen name="ponds/add" 
      options={{ title: 'Создание пруда',
      headerStyle: {
          backgroundColor: Colors.DarkGreenBack,
        },
        headerTintColor: Colors.salatText,
        headerTitleStyle: {
          fontWeight: 'bold',
        }, 
      }} 
      />
      <Stack.Screen 
        name="transactions/add" 
        options={{ 
          title: 'Новая транзакция',
          headerStyle: { backgroundColor: Colors.DarkGreenBack },
          headerTintColor: Colors.salatText,
          headerTitleStyle: { fontWeight: 'bold' }, 
        }} 
      />
      <Stack.Screen name="ponds/[id]" 
      options={{ title: 'Пруд',
      headerStyle: {
          backgroundColor: Colors.DarkGreenBack,
        },
        headerTintColor: Colors.salatText,
        headerTitleStyle: {
          fontWeight: 'bold',
        }, 
      }} 
      />
      <Stack.Screen 
        name="reports/add" 
        options={{ 
          title: 'Финансовый отчет',
          headerStyle: { backgroundColor: Colors.DarkGreenBack },
          headerTintColor: Colors.salatText,
          headerTitleStyle: { fontWeight: 'bold' }, 
        }} 
      />
      <Stack.Screen 
      name="transactions/edit" 
      options={{ 
        title: 'Редактировать транзакцию',
        headerStyle: { backgroundColor: Colors.DarkGreenBack },
        headerTintColor: Colors.salatText,
        headerTitleStyle: { fontWeight: 'bold' }, 
      }} 
    />
    <Stack.Screen name="species/index" 
    options={{ title: 'Виды рыбы', 
      headerStyle: { backgroundColor: Colors.DarkGreenBack }, 
      headerTintColor: Colors.salatText }} />
    <Stack.Screen name="species/add" 
    options={{ title: 'Добавить вид', 
      headerStyle: { backgroundColor: Colors.DarkGreenBack }, 
      headerTintColor: Colors.salatText }} />
    <Stack.Screen name="species/edit" 
    options={{ title: 'Редактировать вид', 
      headerStyle: { backgroundColor: Colors.DarkGreenBack }, 
      headerTintColor: Colors.salatText }} />
      <Stack.Screen name="ponds/edit" 
    options={{ title: 'Редактировать пруд', 
      headerStyle: { backgroundColor: Colors.DarkGreenBack }, 
      headerTintColor: Colors.salatText }} />
      <Stack.Screen 
        name="reports/index" 
        options={{ 
          title: 'Отчеты',
          headerStyle: { backgroundColor: Colors.DarkGreenBack },
          headerTintColor: Colors.salatText,
          headerTitleStyle: { fontWeight: 'bold' }, 
        }} 
      />
    </Stack>
    </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}