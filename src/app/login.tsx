import { Button } from '@/components/Button/button';
import { Colors, Gaps } from '@/components/tokens';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { auth } from '../api/auth';
import { Input } from '../components/input/input';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Ошибка', 'Заполните все поля');
            return;
        }

        setLoading(true);

        try {
            await auth.login(email, password);
            router.replace('/ponds');
        } catch (error) {
            Alert.alert('Ошибка входа', error instanceof Error ? error.message : 
                'Что- то пошло не так');
            } finally {
                setLoading(false);
            }
        }

        return (
            <View style={styles.container}> 
                <View style={styles.content}>
                    <Text style={styles.header}>Вход в FishHoz</Text>
                    <View style={styles.form}>
                        <Input 
                        placeholder='Email'
                        value={email}
                        onChangeText={setEmail}
                         />
                        <Input isPassword 
                        placeholder='Пароль'
                        value={password}
                        onChangeText={setPassword}
                        />
                        <Button 
                        onPress={handleLogin} 
                        text='Войти'
                        disabled={loading}
                        />
                    </View>
                    <Pressable onPress={() => {router.push('/register')}}>
                        <Text style={styles.link}>Нет аккаунта? Зарегестрируйтесь!</Text>
                    </Pressable>
                </View>
            </View>
        );
        
    };
    const styles = StyleSheet.create({
            container: {
                backgroundColor: Colors.DarkGreenBack,
                flex: 1, 
                justifyContent: 'center',
                padding: 55,
            },
            content: {
                alignItems: 'center',
                gap: Gaps.g40,
            },
            form: {
                alignSelf: 'stretch',
                gap: Gaps.g10,
            },
            header: {
                fontSize: 35,
                color: Colors.salatText,
                fontWeight: 'bold',
            },
            link: {
                color: Colors.GreenPlaceHolder,
            }
        })


