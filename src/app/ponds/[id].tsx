import { catchApi } from "@/api/catchApi";
import { feedingApi } from "@/api/feedingApi";
import { pondApi } from "@/api/pondApi";
import { AddCatchSheet } from "@/components/AddCatchSheet";
import { AddFeedingSheet } from "@/components/AddFeedingSheet";
import { AddFishSheet } from "@/components/AddFishSheet";
import { Button } from "@/components/Button/button";
import { DeleteButton } from "@/components/Button/deleteButton";
import { EditCatchSheet } from "@/components/EditCatchSheet";
import { EditFeedingSheet } from "@/components/EditFeedingSheet";
import { EditFishSheet } from "@/components/EditFishSheet";
import { ItemActionsSheet } from "@/components/ItemActionSheet";
import { Colors, Gaps, Radius } from "@/components/tokens";
import BottomSheet from '@gorhom/bottom-sheet';
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import type { Catch, Feeding, FishBatch, Pond } from "../../../shared/types";
import { fishApi } from "../../api/fishApi";

export default function PondScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [pond, setPond] = useState<Pond | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [fishBatches, setFishBatch] = useState<FishBatch[]>([]);
    const [feedings, setFeeding] = useState<Feeding[]>([]);
    const catchSheetRef = useRef<BottomSheet>(null);
    const feedingSheetRef = useRef<BottomSheet>(null);

    const [activeTab, setActiveTab] = useState<'batches' | 'catches' | 'feedings'>('batches');
    const [catches, setCatches] = useState<Catch[]>([]);

    const [selectedItem, setSelectedItem] = useState<{ type: 'batch' | 'catch' | 'feeding', id: number, title: string } | null>(null);
    const actionsSheetRef = useRef<BottomSheet>(null);

    const editFishSheetRef = useRef<BottomSheet>(null);

    const editCatchSheetRef = useRef<BottomSheet>(null);
    const editFeedingSheetRef = useRef<BottomSheet>(null);

  const openActions = (type: 'batch' | 'catch' | 'feeding', id: number, title: string) => {
  setSelectedItem({ type, id, title });
  actionsSheetRef.current?.expand();
};

    const { width } = useWindowDimensions();
    const tabWidth = (width - 40 - 8) / 3; 
    const translateX = useSharedValue(0);

    const handleTabChange = (tab: 'batches' | 'catches' | 'feedings') => {
      setActiveTab(tab);
    let targetIndex = 0;
    if (tab === 'catches') targetIndex = 1;
    if (tab === 'feedings') targetIndex = 2;

    translateX.value = withTiming(targetIndex * tabWidth, { duration: 250 });
    };

    const animatedStyle = useAnimatedStyle(() => {
      return {
      transform: [{ translateX: translateX.value }],
    };
    });

    const loadCatches = async () => {
    try {
      const data = await catchApi.getByPondId(Number(id));
      setCatches(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
    };

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

  const loadFeedings = async () => {
    try {
      const data = await feedingApi.getByPondId(Number(id));
      setFeeding(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
    };

  const deletePond = async () => {
    try {
      setError(null);
      await pondApi.delete(Number(id));
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
        useCallback(() => {
          setLoading(true);
          loadFishBatches();
          loadCatches();
          loadFeedings();
        }, [])
      );

        useFocusEffect(
        useCallback(() => {
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
        }, [id])
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
            <View style={styles.tabsContainer}>
            <Animated.View style={[styles.activeTabBg, { width: tabWidth }, animatedStyle]} />
            <Pressable 
              style={[styles.tab, activeTab === 'batches' && styles.activeTabText]} 
              onPress={() => handleTabChange('batches')}
            >
              <Text style={[styles.tabText, activeTab === 'batches' && styles.activeTabText]}>
                Поголовья
              </Text>
            </Pressable>
            
            <Pressable 
              style={styles.tab} onPress={() => handleTabChange('catches')}
            >
              <Text style={[styles.tabText, activeTab === 'catches' && styles.activeTabText]}>
                Выловы
              </Text>
            </Pressable>
            <Pressable 
              style={styles.tab} onPress={() => handleTabChange('feedings')}
            >
              <Text style={[styles.tabText, activeTab === 'feedings' && styles.activeTabText]}>
                Кормления
              </Text>
            </Pressable>
          </View>
                        {activeTab === 'batches' ? (
              <Animated.View key="batches" entering={FadeIn.duration(300)} style={{ flex: 1 }}>
                <FlatList
                    data={fishBatches}
                    keyExtractor={(item) => item.id.toString()}
                    ListHeaderComponent={<Text style={styles.title}>Запущенная рыба:</Text>}
                    renderItem={({ item }) => (
                        <Pressable
                            style={({ pressed }) => [styles.card, pressed && styles.pressedCard]}
                            onPress={() => openActions('batch', item.id, 'Действия с поголовьем')}                        >
                            <Text style={styles.infoName}>{item.speciesName || 'Неизвестный вид'}</Text>
                            <View style={styles.cardFlex}>
                                <Text style={styles.cardText}>Количество: {item.quantity ?? '—'}</Text>
                                <Text style={styles.cardText}>Средний вес: {item.avgWeight ?? '—'} кг</Text>
                            </View>
                        </Pressable>
                    )}
                    ListFooterComponent={
                      <>
                        <Button text="Добавить поголовье" style={styles.addButton} onPress={() => bottomSheetRef.current?.expand()} />
                          <Button 
                          onPress={() => {
                          router.push({
                            pathname: '/ponds/edit',
                            params: {
                              id: pond.id,
                              name: pond.name,
                              area: pond.area,
                              depth: pond.depth,
                            }
                          })
                        }}
                          style={({ pressed }) => 
                            [ styles.button, pressed && styles.pressedButton]}
                          text='Изменить пруд' 
                          />
                        <DeleteButton text="Удалить пруд" onPress={() => {
                            Alert.alert('Подтвердите удаление', 'Вы точно хотите удалить пруд?', [
                                { text: 'Отменить', style: 'cancel' },
                                { text: 'Удалить', style: 'destructive', onPress: () => { deletePond() } }
                            ]);
                        }} style={styles.deleteButton}/>
                      </>
                    }
                    ListEmptyComponent={<Text style={styles.empty}>Поголовьев пока нет</Text>}
                    contentContainerStyle={styles.list}
                />
              </Animated.View>
            ) : activeTab === 'catches' ? (
              <Animated.View key="catches" entering={FadeIn.duration(300)} style={{ flex: 1 }}>
                <FlatList
                    data={catches}
                    keyExtractor={(item) => item.id.toString()}
                    ListHeaderComponent={<Text style={styles.title}>История вылова:</Text>}
                    renderItem={({ item }) => (
                      <Pressable 
                      style={({ pressed }) => [styles.card, pressed && styles.pressedCard]}
                      onPress={() => openActions('catch', item.id, 'Действия с выловом')}                       
                      >
                        <View style={styles.card}>
                            <Text style={styles.infoName}>Выловлено: {item.quantity} шт.</Text>
                            <View style={styles.cardFlex}>
                                <Text style={styles.cardText}>Общий вес: {item.totalWeight ?? '—'} кг</Text>
                                <Text style={styles.cardText}>Цель: {item.purpose ?? '—'}</Text>
                            </View>
                        </View>
                      </Pressable>
                    )}
                    ListFooterComponent={
                      <>
                        <Button text="Добавить вылов" style={styles.addButton} onPress={() => catchSheetRef.current?.expand()} />
                          <Button 
                          onPress={() => {
                          router.push({
                            pathname: '/ponds/edit',
                            params: {
                              id: pond.id,
                              name: pond.name,
                              area: pond.area,
                              depth: pond.depth,
                            }
                          })
                        }}
                          style={({ pressed }) => 
                            [ styles.button, pressed && styles.pressedButton]}
                          text='Изменить пруд' 
                          />
                        <DeleteButton text="Удалить пруд" onPress={() => {
                            Alert.alert('Подтвердите удаление', 'Вы точно хотите удалить пруд?', [
                                { text: 'Отменить', style: 'cancel' },
                                { text: 'Удалить', style: 'destructive', onPress: () => { deletePond() } }
                            ]);
                        }} style={styles.deleteButton}/>
                      </>
                    }
                    ListEmptyComponent={<Text style={styles.empty}>Выловов пока нет</Text>}
                    contentContainerStyle={styles.list}
                />
              </Animated.View>
            ) : (
              <Animated.View key="feedings" entering={FadeIn.duration(300)} style={{ flex: 1 }}>
                <FlatList
                    data={feedings}
                    keyExtractor={(item) => item.id.toString()}
                    ListHeaderComponent={<Text style={styles.title}>История кормлений:</Text>}
                    renderItem={({ item }) => (
                      <Pressable
                      style={({ pressed }) => [styles.card, pressed && styles.pressedCard]}
                      onPress={() => openActions('feeding', item.id, 'Действия с кормлением')}
                      >
                        <View style={styles.card}>
                            <Text style={styles.infoName}>Тип корма: {item.feedType || 'Не указан'}</Text>
                            <View style={styles.cardFlex}>
                                <Text style={styles.cardText}>Количество: {item.amount} кг</Text>
                            </View>
                        </View>
                      </Pressable>
                    )}
                    ListFooterComponent={
                      <>
                        <Button text="Добавить кормление" style={styles.addButton} onPress={() => feedingSheetRef.current?.expand()} />
                          <Button 
                          onPress={() => {
                          router.push({
                            pathname: '/ponds/edit',
                            params: {
                              id: pond.id,
                              name: pond.name,
                              area: pond.area,
                              depth: pond.depth,
                            }
                          })
                        }}
                          style={({ pressed }) => 
                            [ styles.button, pressed && styles.pressedButton]}
                          text='Изменить пруд' 
                          />
                        <DeleteButton text="Удалить пруд" onPress={() => {
                            Alert.alert('Подтвердите удаление', 'Вы точно хотите удалить пруд?', [
                                { text: 'Отменить', style: 'cancel' },
                                { text: 'Удалить', style: 'destructive', onPress: () => { deletePond() } }
                            ]);
                        }} style={styles.deleteButton}/>
                      </>
                    }
                    ListEmptyComponent={<Text style={styles.empty}>Кормлений пока нет</Text>}
                    contentContainerStyle={styles.list}
                />
              </Animated.View>
            )}

            <AddFishSheet
                ref={bottomSheetRef}
                pondId={Number(id)}
                onClose={() => bottomSheetRef.current?.close()}
                onSuccess={loadFishBatches}
            />
            <AddCatchSheet
                ref={catchSheetRef}
                pondId={Number(id)}
                onClose={() => catchSheetRef.current?.close()}
                onSuccess={loadCatches}
            />
            <AddFeedingSheet
                ref={feedingSheetRef}
                pondId={Number(id)}
                onClose={() => feedingSheetRef.current?.close()}
                onSuccess={loadFeedings}
            />
            <ItemActionsSheet
          ref={actionsSheetRef}
          title={selectedItem?.title || ''}
          onClose={() => actionsSheetRef.current?.close()}
          onEdit={() => {
            actionsSheetRef.current?.close();
            if (selectedItem?.type === 'batch') {
              editFishSheetRef.current?.expand();
            } else if (selectedItem?.type === 'catch') {
              editCatchSheetRef.current?.expand();
            } else if (selectedItem?.type === 'feeding') {
              editFeedingSheetRef.current?.expand();
            }
          }}
          onDelete={() => {
            actionsSheetRef.current?.close();
                Alert.alert(
              'Подтвердите удаление',
              `Вы точно хотите удалить эту запись?`,
              [
                { text: 'Отмена', style: 'cancel' },
                { 
                  text: 'Удалить', 
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      if (selectedItem?.type === 'batch') {
                        await fishApi.delete(selectedItem.id);
                        loadFishBatches();
                      } else if (selectedItem?.type === 'catch') {
                        await catchApi.delete(selectedItem.id);
                        loadCatches();
                      } else if (selectedItem?.type === 'feeding') {
                        await feedingApi.delete(selectedItem.id);
                        loadFeedings();
                      }
                    } catch (err) {
                      Alert.alert('Ошибка', err instanceof Error ? err.message : 'Не удалось удалить');
                    }
                  } 
                }
              ]
            );
          }}
        />
        <EditFishSheet
          ref={editFishSheetRef}
          batch={selectedItem?.type === 'batch' ? fishBatches.find(b => b.id === selectedItem.id) || null : null}
          onClose={() => editFishSheetRef.current?.close()}
          onSuccess={loadFishBatches}
        />
        <EditFishSheet
          ref={editFishSheetRef}
          batch={selectedItem?.type === 'batch' ? fishBatches.find(b => b.id === selectedItem.id) || null : null}
          onClose={() => editFishSheetRef.current?.close()}
          onSuccess={loadFishBatches}
        />
        <EditCatchSheet
          ref={editCatchSheetRef}
          catchItem={selectedItem?.type === 'catch' ? catches.find(c => c.id === selectedItem.id) || null : null}
          onClose={() => editCatchSheetRef.current?.close()}
          onSuccess={loadCatches}
        />
        <EditFeedingSheet
          ref={editFeedingSheetRef}
          feeding={selectedItem?.type === 'feeding' ? feedings.find(f => f.id === selectedItem.id) || null : null}
          onClose={() => editFeedingSheetRef.current?.close()}
          onSuccess={loadFeedings}
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
    gap: Gaps.g10
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
  },
    tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.GreenInput,
    borderRadius: Radius.r10,
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 4,
    position: 'relative',
  },
  activeTabBg: {
    position: 'absolute',
    top: 4,
    left: 4,
    bottom: 4,
    backgroundColor: Colors.GreenPlaceHolder,
    borderRadius: Radius.r10,
    zIndex: 0,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabText: {
    color: Colors.salatText,
    fontWeight: 'bold',
    opacity: 0.6,
  },
  activeTabText: {
    opacity: 1,
  },
  addButton: {
    paddingHorizontal: 55,
    marginTop: 15,
    marginBottom: 20,
    },
  deleteButton: {
    paddingHorizontal: 55,
    marginTop: 15,
    marginBottom: 20,
  }
})