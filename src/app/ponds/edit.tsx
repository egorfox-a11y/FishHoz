import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { pondApi } from '../../api/pondApi';
import { Button } from '../../components/Button/button';
import { Input } from '../../components/input/input';
import { Colors, Gaps } from '../../components/tokens';

export default function EditPondScreen() {
    const params = useLocalSearchParams();

    const [name, setName] = useState(params.name as string || '');
    const [area, setArea] = useState(params.area?.toString() || '');
    const [depth, setDepth] = useState(params.depth?.toString() || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Ошибка', 'Название пруда обязательно');
            return;
        }

        const areaNum = area ? parseFloat(area) : null;
        const depthNum = depth ? parseFloat(depth) : null;

        if (area && isNaN(areaNum!)) {
            Alert.alert('Ошибка', 'Площадь должна быть числом');
            return;
        }

        if (depth && isNaN(depthNum!)) {
            Alert.alert('Ошибка', 'Глубина должна быть числом');
            return;
        }

        setLoading(true);
        
        try {
            await pondApi.update(Number(params.id), {
                name: name.trim(),
                area: areaNum || null,
                depth: depthNum || null,
            });
            router.back();
        } catch (error) {
            Alert.alert('Ошибка', error instanceof Error ? error.message : '...');
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.header}>Редактировать пруд</Text>

                <View style={styles.form}>
                    <Input placeholder='Название' value={name} onChangeText={setName} />
                    <Input placeholder='Площадь' value={area} onChangeText={setArea} keyboardType="numeric" />
                    <Input placeholder='Глубина' value={depth} onChangeText={setDepth} keyboardType="numeric" />
                    <Button
                        style={({ pressed }) => [pressed && styles.pressedButton]}
                        text='Сохранить'
                        onPress={handleSave}
                        disabled={loading} 
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.DarkGreenBack,
    },
    content: {
        alignItems: 'center',
        gap: Gaps.g40,
    },
    form: {
        alignSelf: 'stretch',
        gap: Gaps.g10,
        paddingHorizontal: 55,
    },
    header: {
        textAlign: 'center',
        fontSize: 35,
        color: Colors.salatText,
        fontWeight: 'bold',
    },
    pressedButton: {
        opacity: 0.8
    }
});