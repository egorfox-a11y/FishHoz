import { auth } from '@/api/auth';
import { transactionApi } from '@/api/transactionApi';
import { Button } from '@/components/Button/button';
import { DeleteButton } from '@/components/Button/deleteButton';
import { Colors, Radius } from '@/components/tokens';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const loadProfileData = async () => {
    try {
      const user = await auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }

      const transactions = await transactionApi.getAll();
      const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      
      setBalance(income - expense);
    } catch (err) {
      console.error('Ошибка загрузки профиля:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadProfileData();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await auth.logout();
      router.replace('/login');
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось выйти');
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Удаление аккаунта',
      'Вы уверены? Все ваши данные будут потеряны навсегда.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await auth.deleteAccount(); 
              await auth.logout(); 
              router.replace('/login');
            } catch (e) {
              Alert.alert('Ошибка', e instanceof Error ? e.message : 'Не удалось удалить');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.salatText} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профиль</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Аккаунт</Text>
        <Text style={styles.value}>{userEmail || 'Пользователь'}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: balance >= 0 ? '#1b301d' : '#3a1a1a' }]}>
        <Text style={styles.label}>Текущий баланс</Text>
        <Text style={[styles.balanceValue, { color: balance >= 0 ? '#4ade80' : '#f87171' }]}>
          {balance} ₽
        </Text>
      </View>
        <Button 
          text="Справочник видов рыбы" 
          onPress={() => router.push('/species')} 
          style={{ marginBottom: 20 }} 
        />
        <DeleteButton 
        text="Выйти из аккаунта" 
        onPress={handleLogout} 
        style={{ marginTop: 20 }}
      />
      <DeleteButton 
        text="Удалить аккаунт" 
        onPress={handleDeleteAccount} 
        style={{ marginTop: 20 }}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.DarkGreenBack, padding: 20, justifyContent: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.DarkGreenBack },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.salatText, textAlign: 'center', marginBottom: 30 },
  card: {
    backgroundColor: Colors.GreenInput,
    padding: 20,
    borderRadius: Radius.r10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.GreenPlaceHolder,
  },
  label: { color: Colors.GreenPlaceHolder, fontSize: 14, marginBottom: 5 },
  value: { color: Colors.salatText, fontSize: 18, fontWeight: 'bold' },
  balanceValue: { fontSize: 32, fontWeight: 'bold' },
  logoutButton: { marginTop: 20 },
});