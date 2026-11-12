import { speciesApi } from '@/api/speciesApi';
import { Button } from '@/components/Button/button';
import { ItemActionsSheet } from '@/components/ItemActionSheet';
import { Colors, Gaps, Radius } from '@/components/tokens';
import BottomSheet from '@gorhom/bottom-sheet';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { FishSpecies } from '../../../shared/types';

export default function SpeciesScreen() {
  const [species, setSpecies] = useState<FishSpecies[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedSpecies, setSelectedSpecies] = useState<FishSpecies | null>(null);
  const actionsSheetRef = useRef<BottomSheet>(null);

  const loadSpecies = async () => {
    try {
      setError(null);
      const data = await speciesApi.getAll();
      setSpecies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadSpecies();
    }, [])
  );

  const openActions = (item: FishSpecies) => {
    setSelectedSpecies(item);
    actionsSheetRef.current?.expand();
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
      <FlatList
        data={species}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => openActions(item)} style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            {item.description && <Text style={styles.cardDesc}>{item.description}</Text>}
            <View style={styles.cardFlex}>
              <Text style={styles.cardText}>Норма кормления: {item.feedRate ?? '—'}</Text>
              <Text style={styles.cardText}>Созревание: {item.maturityMonths ?? '—'} мес.</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Видов пока нет</Text>}
        contentContainerStyle={styles.list}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.footer}>
        <Button 
          text="Добавить вид рыбы" 
          onPress={() => router.push('/species/add')} 
          style={styles.button}
        />
      </View>

      <ItemActionsSheet
        ref={actionsSheetRef}
        title={selectedSpecies?.name || ''}
        onClose={() => actionsSheetRef.current?.close()}
        onEdit={() => {
          actionsSheetRef.current?.close();
          if (selectedSpecies) {
            router.push({
              pathname: '/species/edit',
              params: { ...selectedSpecies }
            });
          }
        }}
        onDelete={() => {
          actionsSheetRef.current?.close();
          Alert.alert('Удалить вид?', 'Это действие нельзя отменить', [
            { text: 'Отмена', style: 'cancel' },
            { 
              text: 'Удалить', 
              style: 'destructive',
              onPress: async () => {
                try {
                  await speciesApi.delete(selectedSpecies!.id);
                  loadSpecies();
                } catch (err) {
                  Alert.alert('Ошибка', 'Не удалось удалить вид');
                }
              }
            }
          ]);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.DarkGreenBack, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.DarkGreenBack },
  card: { backgroundColor: Colors.GreenInput, padding: 15, borderRadius: Radius.r10, marginBottom: 10, borderWidth: 1, borderColor: Colors.GreenPlaceHolder },
  cardTitle: { color: Colors.salatText, fontSize: 18, fontWeight: 'bold' },
  cardDesc: { color: Colors.GreenPlaceHolder, fontSize: 14, marginTop: 3 },
  cardFlex: { flexDirection: 'row', gap: 15, marginTop: 10 },
  cardText: { color: Colors.salatText, fontSize: 14 },
  list: { gap: Gaps.g10, paddingBottom: 20 },
  empty: { color: Colors.salatText, textAlign: 'center', marginTop: 20 },
  error: { color: 'red', textAlign: 'center', marginBottom: 10 },
  footer: { gap: 10, marginTop: 10 },
  button: { marginVertical: 5 },
});