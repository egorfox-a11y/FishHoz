import { pondApi } from "@/api/pondApi";
import { AddFishSheet } from "@/components/AddFishSheet";
import { Button } from "@/components/Button/button";
import { Colors, Gaps, Radius } from "@/components/tokens";
import BottomSheet from '@gorhom/bottom-sheet';
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import type { FishBatch, Pond } from "../../../shared/types";
import { fishApi } from "../../api/fishApi";

export default function PondScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [pond, setPond] = useState<Pond | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [FishBatch, setFishBatch] = useState<FishBatch[]>([])

    const loadFishBatches = async () => {
    try {
      setError(null);
      const data = await fishApi.getByPondId(Number(id));
      setFishBatch(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
        useCallback(() => {
          setLoading(true);
          loadFishBatches();
        }, [])
      );

    useEffect(() => {
    const loadPond = async () => {
        try {
            const data = await pondApi.getById(Number(id));
            setPond(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка загрузки')
        } finally {
            setLoading(false);
        }
    };
    loadPond();
    }, [id]);

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
        <Text style={styles.error}>Ошибка: {error}</Text>
        </View>
    );
    }

    if (!pond) {
        return (
            <View style={styles.center}>
                <Text>Пруд не найден</Text>
            </View>
        );
    }

    return(
        <View style={styles.center}>
            <Text style={styles.header}>{pond.name}</Text>
            <View style={styles.info}>
                <Text style={styles.infoText}>Площадь: {pond.area ?? '-'} м²</Text>
                <Text style={styles.infoText}>Глубина: {pond.depth ?? '-'} м</Text>
            </View>
            <FlatList
                    data={FishBatch}
                    keyExtractor={(item) => item.id.toString()}
            
                    ListHeaderComponent={
                      <>
                        <Text style={styles.title}>Поголовья:</Text>
                      </>
                    }
            
                    renderItem={({ item }) => (
                      <Pressable
                      style={({ pressed }) => [
                      styles.card,
                      pressed && styles.pressedCard
                      ]}
                      >
                        <View style={styles.card}>
                            <Text style={styles.infoName}>{item.speciesName}</Text>
                          <View style={styles.cardFlex}>
                            <Text style={styles.cardText}>Количество: {item.quantity ?? '—'} </Text>
                            <Text style={styles.cardText}>Средний вес: {item.avgWeight ?? '—'} </Text>
                          </View>
                        </View>
                      </Pressable>
                    )}
                    ListFooterComponent={
                    <>
                        <Button text="Добавить поголовье рыбы" style={styles.addFishButton}
                    onPress={() => bottomSheetRef.current?.expand()}
                    />
                    </>
                    }
                    ListEmptyComponent={<Text style={styles.empty}>Поголовий пока нет</Text>}
                    contentContainerStyle={styles.list}
                  />
            <AddFishSheet
        ref={bottomSheetRef}
        pondId={Number(id)}
        onClose={() => bottomSheetRef.current?.close()}
        onSuccess={() => {
        }}
      />
        </View>
    );
};

const styles = StyleSheet.create({
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
  header: {
    textAlign: 'center',
    fontSize: 45,
    fontWeight: 'bold',
    color: Colors.salatText,
  },
  info: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 25,
  },
  infoText: {
    color: Colors.salatText,
    fontSize: 20,
  },
  addFishButton: {
    paddingHorizontal: 55,
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
        paddingHorizontal: 15,
    },
    empty: {
        color: Colors.salatText,
        textAlign: 'center',
    },
    pressedCard: {
        opacity: 0.8,
    },
button: {
    paddingVertical: 25,
    paddingHorizontal: 55
  },
  pressedButton: {
    opacity: 0.9,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.salatText,
    paddingHorizontal: 25,
  },
  infoName: {
    padding: 15,
    fontSize: 20,
    color: Colors.salatText,
    fontWeight: 'bold'
  }
})