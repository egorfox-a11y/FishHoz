import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Catch, FishSpecies } from '../../shared/types';
import { catchApi } from '../api/catchApi';
import { speciesApi } from '../api/speciesApi';
import { Button } from './Button/button';
import { Input } from './input/input';
import { Colors } from './tokens';

type Props = {
  catchItem: Catch | null; 
  onClose: () => void;
  onSuccess: () => void; 
};

export const EditCatchSheet = forwardRef<BottomSheet, Props>(
  ({ catchItem, onClose, onSuccess }, ref) => {
    const [speciesList, setSpeciesList] = useState<FishSpecies[]>([]);
    const [selectedSpeciesId, setSelectedSpeciesId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState('');
    const [weight, setWeight] = useState('');
    const [purpose, setPurpose] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      speciesApi.getAll().then(setSpeciesList);
    }, []);

    useEffect(() => {
      if (catchItem) {
        setSelectedSpeciesId(catchItem.speciesId);
        setQuantity(catchItem.quantity.toString());
        setWeight(catchItem.totalWeight ? catchItem.totalWeight.toString() : '');
        setPurpose(catchItem.purpose || '');
      }
    }, [catchItem]);

    const snapPoints = ['100%'];

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} onPress={onClose} />
      ),
      [onClose]
    );

    const handleSave = async () => {
      if (!catchItem) return;
      if (!selectedSpeciesId || !quantity) {
        Alert.alert('Ошибка', 'Заполните вид рыбы и количество');
        return;
      }

      setLoading(true);
      try {
        await catchApi.update(catchItem.id, {
          speciesId: selectedSpeciesId,
          quantity: Number(quantity),
          totalWeight: weight ? Number(weight) : undefined,
          purpose: purpose || undefined,
        });
        
        Alert.alert('Успех', 'Вылов обновлен!');
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
          <Text style={styles.title}>Редактировать вылов</Text>

          <Text style={styles.label}>Вид рыбы:</Text>
          <View style={styles.speciesList}>
            {speciesList.map((item) => (
              <Pressable
                key={item.id}
                style={[styles.speciesItem, selectedSpeciesId === item.id && styles.speciesItemSelected]}
                onPress={() => setSelectedSpeciesId(item.id)}
              >
                <Text style={styles.speciesText}>{item.name}</Text>
              </Pressable>
            ))}
          </View>

          <Input placeholder="Количество (шт.)" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
          <Input placeholder="Общий вес (кг)" value={weight} onChangeText={setWeight} keyboardType="numeric" />
          <Input placeholder="Цель вылова (опционально)" value={purpose} onChangeText={setPurpose} />

          <Button text={loading ? 'Сохранение...' : 'Сохранить'} onPress={handleSave} disabled={loading} />
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  content: { padding: 20, gap: 15 },
  title: { fontSize: 22, fontWeight: 'bold', color: Colors.salatText, marginBottom: 10 },
  label: { color: Colors.salatText, fontSize: 16, marginBottom: 5 },
  speciesList: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 15 },
  speciesItem: { padding: 10, borderRadius: 8, backgroundColor: Colors.GreenInput, borderWidth: 1, borderColor: 'transparent' },
  speciesItemSelected: { borderColor: Colors.salatText },
  speciesText: { color: Colors.salatText },
});