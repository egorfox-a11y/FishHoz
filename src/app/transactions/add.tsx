import { transactionApi } from '@/api/transactionApi';
import { Button } from '@/components/Button/button';
import { Input } from '@/components/input/input';
import { Colors, Gaps, Radius } from '@/components/tokens';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddTransactionScreen() {
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);


  const handleSave = async () => {
    if (!category.trim() || !amount) {
      Alert.alert('Ошибка', 'Заполните категорию и сумму');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Ошибка', 'Сумма должна быть больше нуля');
      return;
    }

    setLoading(true);
    try {
      await transactionApi.create({
        type,
        category: category.trim(),
        amount: amountNum,
        transactionDate: date,
        comment: comment.trim() || undefined,
      });
      router.back();
    } catch (err) {
      Alert.alert('Ошибка', err instanceof Error ? err.message : 'Не удалось сохранить');
    } finally {
      setLoading(false);
    }
  };

    return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.DarkGreenBack }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={styles.title}>Новая транзакция</Text>

            <View style={styles.typeContainer}>
              <Pressable
                style={[styles.typeButton, type === 'income' && styles.typeActive]}
                onPress={() => setType('income')}
              >
                <Text style={styles.typeText}>Доход</Text>
              </Pressable>
              <Pressable
                style={[styles.typeButton, type === 'expense' && styles.typeActive]}
                onPress={() => setType('expense')}
              >
                <Text style={styles.typeText}>Расход</Text>
              </Pressable>
            </View>

            <View style={styles.inputs}>
              <Input placeholder="Категория" value={category} onChangeText={setCategory} />
              <Input placeholder="Сумма (₽)" value={amount} onChangeText={setAmount} keyboardType="numeric" />
              <Input placeholder="Комментарий" value={comment} onChangeText={setComment} />

              <Pressable 
                onPress={() => setShowDatePicker(true)} 
                style={styles.dateButton}
              >
                <Text style={styles.dateButtonText}>Дата: {date}</Text>
              </Pressable>

              <Button text={loading ? 'Сохранение...' : 'Сохранить'} onPress={handleSave} disabled={loading} />
            </View>
          </View>
        </ScrollView>

        {showDatePicker && (
        <DateTimePicker
            value={new Date(date)}
            mode="date"
            display="default"
            onValueChange={(_, selectedDate) => {
            setShowDatePicker(false); 
            
            if (selectedDate) {
                setDate(selectedDate.toISOString().split('T')[0]);
            }
            }}
            onDismiss={() => {
            setShowDatePicker(false);
            }}
        />
        )}
            </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { 
    flexGrow: 1, 
    justifyContent: 'center',
  },
  container: { 
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.salatText, textAlign: 'center', marginBottom: 20 },
  typeContainer: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  typeButton: { flex: 1, padding: 15, borderRadius: Radius.r10, backgroundColor: Colors.GreenInput, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  typeActive: { borderColor: Colors.salatText },
  typeText: { color: Colors.salatText, fontWeight: 'bold' },
  inputs: { gap: Gaps.g10 },
  dateButton: {
  backgroundColor: Colors.GreenInput,
  padding: 15,
  borderRadius: Radius.r10,
  borderWidth: 1,
  borderColor: Colors.GreenPlaceHolder,
  alignItems: 'center',
},
dateButtonText: {
  color: Colors.salatText,
  fontSize: 16,
},
});