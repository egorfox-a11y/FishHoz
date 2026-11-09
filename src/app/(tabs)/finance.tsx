import { transactionApi } from '@/api/transactionApi';
import { Button } from '@/components/Button/button';
import { ItemActionsSheet } from '@/components/ItemActionSheet';
import { Colors, Gaps, Radius } from '@/components/tokens';
import BottomSheet from '@gorhom/bottom-sheet';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Transaction } from '../../../shared/types';

type FilterType = 'all' | 'income' | 'expense';
type SortType = 'newest' | 'oldest';

export default function FinanceScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('newest'); 

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const actionsSheetRef = useRef<BottomSheet>(null);

  const openActions = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    actionsSheetRef.current?.expand();
  };

  const loadTransactions = async () => {
    try {
      setError(null);
      const data = await transactionApi.getAll();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadTransactions();
    }, [])
  );

    const processedTransactions = transactions
    .filter(t => 
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.comment && t.comment.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(t => filter === 'all' ? true : t.type === filter)
    .sort((a, b) => {
      const dateA = new Date(a.transactionDate).getTime();
      const dateB = new Date(b.transactionDate).getTime();
      
      if (sort === 'newest') {
        return dateB - dateA; 
      } else {
        return dateA - dateB; 
      }
    });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.salatText} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Поиск по категории или комментарию..."
        placeholderTextColor={Colors.GreenPlaceHolder}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.filtersRow}>
        <Pressable 
          style={[styles.filterButton, filter === 'all' && styles.filterActive]} 
          onPress={() => setFilter('all')}
        >
          <Text style={styles.filterText}>Все</Text>
        </Pressable>
        <Pressable 
          style={[styles.filterButton, filter === 'income' && styles.filterActive]} 
          onPress={() => setFilter('income')}
        >
          <Text style={styles.filterText}>Доходы</Text>
        </Pressable>
        <Pressable 
          style={[styles.filterButton, filter === 'expense' && styles.filterActive]} 
          onPress={() => setFilter('expense')}
        >
          <Text style={styles.filterText}>Расходы</Text>
        </Pressable>
      </View>

      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Сортировка:</Text>
        <Pressable onPress={() => setSort('newest')}>
          <Text style={[styles.sortText, sort === 'newest' && styles.sortActive]}>Сначала новые</Text>
        </Pressable>
        <Pressable onPress={() => setSort('oldest')}>
          <Text style={[styles.sortText, sort === 'oldest' && styles.sortActive]}>Сначала старые</Text>
        </Pressable>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={processedTransactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => openActions(item)}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardCategory}>{item.category}</Text>
              <Text style={[styles.cardAmount, { color: item.type === 'income' ? '#4ade80' : '#f87171' }]}>
                {item.type === 'income' ? '+' : '-'}{item.amount} ₽
              </Text>
            </View>
            <Text style={styles.cardDate}>{new Date(item.transactionDate).toLocaleDateString('ru-RU')}</Text>
            {item.comment && <Text style={styles.cardComment}>{item.comment}</Text>}
          </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {searchQuery || filter !== 'all' ? 'Ничего не найдено' : 'Транзакций пока нет'}
          </Text>
        }
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <Button 
          text="Добавить транзакцию" 
          onPress={() => router.push('/transactions/add')} 
          style={styles.button}
        />
        <Button 
          text="Сформировать отчет" 
          onPress={() => router.push('/reports/add')} 
          style={styles.button}
        />
      </View>
      <ItemActionsSheet
      ref={actionsSheetRef}
      title={`Транзакция: ${selectedTransaction?.category || ''}`}
      onClose={() => actionsSheetRef.current?.close()}
      onEdit={() => {
        actionsSheetRef.current?.close();
        if (selectedTransaction) {
          router.push({
            pathname: '/transactions/edit',
            params: {
              id: selectedTransaction.id,
              type: selectedTransaction.type,
              category: selectedTransaction.category,
              amount: selectedTransaction.amount,
              comment: selectedTransaction.comment,
              date: selectedTransaction.transactionDate,
            }
          });
        }
      }}
      onDelete={() => {
        actionsSheetRef.current?.close();
        Alert.alert('Удалить?', 'Вы уверены?', [
          { text: 'Отмена', style: 'cancel' },
          { 
            text: 'Удалить', 
            style: 'destructive',
            onPress: async () => {
              try {
                await transactionApi.delete(selectedTransaction!.id);
                loadTransactions(); 
              } catch (err) {
                Alert.alert('Ошибка', 'Не удалось удалить');
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
  container: { flex: 1, backgroundColor: Colors.DarkGreenBack, paddingHorizontal: 20, paddingTop: 70 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.DarkGreenBack },
  searchInput: {
    backgroundColor: Colors.GreenInput,
    color: Colors.salatText,
    padding: 15,
    borderRadius: Radius.r10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.GreenPlaceHolder,
  },
  filtersRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.r10,
    backgroundColor: Colors.GreenInput,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterActive: { borderColor: Colors.salatText },
  filterText: { color: Colors.salatText, fontWeight: 'bold' },
  sortRow: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 15 },
  sortLabel: { color: Colors.GreenPlaceHolder, fontSize: 14 },
  sortText: { color: Colors.GreenPlaceHolder, fontSize: 14 },
  sortActive: { color: Colors.salatText, fontWeight: 'bold', textDecorationLine: 'underline' },
  card: {
    backgroundColor: Colors.GreenInput,
    padding: 15,
    borderRadius: Radius.r10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.GreenPlaceHolder,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  cardCategory: { color: Colors.salatText, fontSize: 18, fontWeight: 'bold' },
  cardAmount: { fontSize: 18, fontWeight: 'bold' },
  cardDate: { color: Colors.GreenPlaceHolder, fontSize: 14 },
  cardComment: { color: Colors.salatText, marginTop: 5, fontStyle: 'italic' },
  list: { gap: Gaps.g10, paddingBottom: 20 },
  empty: { color: Colors.salatText, textAlign: 'center', marginTop: 20 },
  error: { color: 'red', textAlign: 'center', marginBottom: 10 },
  footer: { gap: 10, marginTop: 10, paddingBottom: 20 },
  button: { marginVertical: 5 },
});