import { Button } from '@/components/Button/button';
import { Colors, Gaps, Radius } from '@/components/tokens';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { pondService } from '../services/pondService';
import type { Pond } from '../types/types';


export default function HomeScreen() {
  const [ponds, setPonds] = useState<Pond[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPonds = async () => {
    try {
      setError(null);
      const data = await pondService.getAllPonds();
      setPonds(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadPonds();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.salatText} />
        <Text style={styles.load}>Загрузка...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <FlatList
        data={ponds}
        keyExtractor={(item) => item.id.toString()}

        ListHeaderComponent={
          <>
            <Text style={styles.title}>Мои пруды</Text>
          </>
        }

        renderItem={({ item }) => (
          <Pressable
          style={({ pressed }) => [
          styles.card,
          pressed && styles.pressedCard
          ]}
          onPress={() => router.push(`./ponds/${item.id}`)}
          >
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <View style={styles.cardFlex}>
                <Text style={styles.cardText}>Площадь: {item.area ?? '—'} м²</Text>
                <Text style={styles.cardText}>Глубина: {item.depth ?? '—'} м</Text>
              </View>
            </View>
          </Pressable>
        )}
        ListFooterComponent={
          <>
            <Button 
              onPress={() => {
                router.push('/ponds/add')
              }}
              style={({ pressed }) => 
                [ styles.button, pressed && styles.pressedButton]}
              text='Добавить пруд' 
              />
          </>
        }
        ListEmptyComponent={<Text style={styles.empty}>Прудов пока нет</Text>}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.DarkGreenBack,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.salatText
  },
  subtitle: {
    fontSize: 16,
    color: Colors.salatText,
  },
  button: {
    paddingVertical: 25,
    paddingHorizontal: 55
  },
  pressedButton: {
    opacity: 0.9,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.DarkGreenBack,
  },
  load: {
    textAlign: 'center',
    color: Colors.salatText
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  card: {
    backgroundColor: Colors.GreenInput,
    borderRadius: Radius.r10,
    borderWidth: 1,
    borderColor: Colors.GreenPlaceHolder,
  },
  cardTitle: {
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: Colors.salatText,
    fontWeight: 'bold'
  },
  cardFlex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 35,
    paddingVertical: 10,
  },
  cardText: {
    color: Colors.salatText,
    fontSize: 16,
  },
  list: {
    gap: Gaps.g10,
  },
  empty: {
    color: Colors.salatText,
    textAlign: 'center',
  },
  pressedCard: {
    opacity: 0.8,
  }
});