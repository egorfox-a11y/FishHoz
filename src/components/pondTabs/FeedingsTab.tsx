import { Button } from '@/components/Button/button';
import { DeleteButton } from '@/components/Button/deleteButton';
import { Colors, Gaps, Radius } from '@/components/tokens';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Feeding } from '../../../shared/types';

type Props = {
  feedings: Feeding[];
  onAdd: () => void;
  onPressItem: (item: Feeding) => void;
  onDeletePond: () => void;
};

export const FeedingsTab = ({ feedings, onAdd, onPressItem, onDeletePond }: Props) => {
  return (
    <FlatList
      data={feedings}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={<Text style={styles.title}>История кормлений:</Text>}
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.pressedCard]}
          onPress={() => onPressItem(item)}
        >
          <Text style={styles.infoName}>Тип корма: {item.feedType || 'Не указан'}</Text>
          <View style={styles.cardFlex}>
            <Text style={styles.cardText}>Количество: {item.amount} кг</Text>
          </View>
        </Pressable>
      )}
      ListFooterComponent={
        <>
          <Button text="Добавить кормление" style={styles.addButton} onPress={onAdd} />
          <DeleteButton text="Удалить пруд" onPress={() => {
            Alert.alert('Подтвердите удаление', 'Вы точно хотите удалить пруд?', [
              { text: 'Отменить', style: 'cancel' },
              { text: 'Удалить', style: 'destructive', onPress: onDeletePond }
            ]);
          }} style={styles.deleteButton} />
        </>
      }
      ListEmptyComponent={<Text style={styles.empty}>Кормлений пока нет</Text>}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: Colors.salatText, paddingHorizontal: 25 },
  card: { backgroundColor: Colors.GreenInput, borderRadius: Radius.r10, borderWidth: 1, borderColor: Colors.GreenPlaceHolder, marginBottom: 10 },
  pressedCard: { opacity: 0.8 },
  infoName: { padding: 15, fontSize: 20, color: Colors.salatText, fontWeight: 'bold' },
  cardFlex: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 35, paddingVertical: 10, gap: Gaps.g10 },
  cardText: { color: Colors.salatText, fontSize: 16 },
  addButton: { paddingHorizontal: 55, marginTop: 15, marginBottom: 20 },
  deleteButton: { paddingHorizontal: 55, marginTop: 15, marginBottom: 20 },
  empty: { color: Colors.salatText, textAlign: 'center' },
  list: { gap: Gaps.g10, paddingHorizontal: 15 },
});