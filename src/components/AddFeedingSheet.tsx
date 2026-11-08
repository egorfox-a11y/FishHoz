import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { feedingApi } from '../api/feedingApi';
import { Button } from './Button/button';
import { Input } from './input/input';
import { Colors } from './tokens';

type Props = {
  pondId: number;
  onClose: () => void;
  onSuccess: () => void; 
};

export const AddFeedingSheet = forwardRef<BottomSheet, Props>(
  ({ pondId, onClose, onSuccess }, ref) => {
    const [amount, setAmount] = useState('');
    const [feedType, setFeedType] = useState('');
    const [loading, setLoading] = useState(false);

    const snapPoints = ['100%'];

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} onPress={onClose} />
      ),
      [onClose]
    );

    const handleSave = async () => {
      if (!amount) {
        Alert.alert('Ошибка', 'Введите количество корма');
        return;
      }

      setLoading(true);
      try {
        await feedingApi.create({
          pondId,
          amount: Number(amount),
          feedType: feedType || undefined,
        });
        
        Alert.alert('Успех', 'Кормление добавлено!');
        setAmount('');
        setFeedType('');
        onSuccess(); 
        onClose();   
      } catch (err) {
        Alert.alert('Ошибка', err instanceof Error ? err.message : 'Что-то пошло не так');
      } finally {
        setLoading(false);
      }
    };

    return (
      <BottomSheet ref={ref} index={-1} snapPoints={snapPoints} enablePanDownToClose backdropComponent={renderBackdrop} backgroundStyle={{ backgroundColor: Colors.DarkGreenBack }} handleIndicatorStyle={{ backgroundColor: Colors.GreenPlaceHolder }}>
        <BottomSheetScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Добавить кормление</Text>

          <Input placeholder="Количество корма (кг)" value={amount} onChangeText={setAmount} keyboardType="numeric" />
          <Input placeholder="Тип корма (опционально)" value={feedType} onChangeText={setFeedType} />

          <Button text={loading ? 'Сохранение...' : 'Сохранить'} onPress={handleSave} disabled={loading} />
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  content: { padding: 20, gap: 15 },
  title: { fontSize: 22, fontWeight: 'bold', color: Colors.salatText, marginBottom: 10 },
});