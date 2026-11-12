import { speciesApi } from '@/api/speciesApi';
import { Button } from '@/components/Button/button';
import { Input } from '@/components/input/input';
import { Colors, Gaps } from '@/components/tokens';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditSpeciesScreen() {
  const params = useLocalSearchParams();
  
  const [name, setName] = useState(params.name as string || '');
  const [description, setDescription] = useState(params.description as string || '');
  const [optimalTempMin, setOptimalTempMin] = useState(params.optimalTempMin?.toString() || '');
  const [optimalTempMax, setOptimalTempMax] = useState(params.optimalTempMax?.toString() || '');
  const [feedRate, setFeedRate] = useState(params.feedRate?.toString() || '');
  const [growthRate, setGrowthRate] = useState(params.growthRate?.toString() || '');
  const [maturityMonths, setMaturityMonths] = useState(params.maturityMonths?.toString() || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Ошибка', 'Введите название вида');
      return;
    }

    setLoading(true);
    try {
      await speciesApi.update(Number(params.id), {
        name: name.trim(),
        description: description.trim() || null,
        optimalTempMin: optimalTempMin ? Number(optimalTempMin) : null,
        optimalTempMax: optimalTempMax ? Number(optimalTempMax) : null,
        feedRate: feedRate ? Number(feedRate) : null,
        growthRate: growthRate ? Number(growthRate) : null,
        maturityMonths: maturityMonths ? Number(maturityMonths) : null,
      });
      router.back();
    } catch (err) {
      Alert.alert('Ошибка', err instanceof Error ? err.message : 'Не удалось обновить');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.DarkGreenBack }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Text style={styles.title}>Редактировать вид</Text>

            <View style={styles.inputs}>
              <Input placeholder="Название" value={name} onChangeText={setName} />
              <Input placeholder="Описание" value={description} onChangeText={setDescription} />
              
              <Input placeholder="Мин. температура (°C)" value={optimalTempMin} onChangeText={setOptimalTempMin} keyboardType="numeric" />
              <Input placeholder="Макс. температура (°C)" value={optimalTempMax} onChangeText={setOptimalTempMax} keyboardType="numeric" />
              
              <Input placeholder="Норма кормления" value={feedRate} onChangeText={setFeedRate} keyboardType="numeric" />
              <Input placeholder="Скорость роста" value={growthRate} onChangeText={setGrowthRate} keyboardType="numeric" />
              
              <Input placeholder="Месяцев до созревания" value={maturityMonths} onChangeText={setMaturityMonths} keyboardType="numeric" />

              <Button text={loading ? 'Сохранение...' : 'Сохранить'} onPress={handleSave} disabled={loading} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, justifyContent: 'center' },
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.salatText, textAlign: 'center', marginBottom: 20 },
  inputs: { gap: Gaps.g10 },
});