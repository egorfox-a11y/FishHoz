import { Button } from '@/components/Button/button';
import { Input } from '@/components/input/input';
import { Colors, Gaps } from '@/components/tokens';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { auth } from '../api/auth';

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {

        if (!email || !password || !confirmPassword) {
            Alert.alert('Ошибка', 'Заполните все поля');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Ошибка', 'Пароли не совпадают');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Ошибка', 'Пароль должен быть не менее 6 символов');
            return;
        }
        setLoading(true);

        try {
            await auth.register(email, password);
            Alert.alert('Успех!', 'Аккаунт создан! Войдите!');
            router.replace('/login');
        } catch (error) {
            Alert.alert('Ошибка регистрации', error instanceof 
                Error ? error.message : 'Что-то пошло не так')
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.header}>Регистрация в FishHoz</Text>
                    <View style={styles.form}>

                        <Input 
                        placeholder='email'
                        value={email}
                        onChangeText={setEmail} 
                        />

                        <Input 
                        isPassword
                        placeholder='Пароль'
                        value={password}
                        onChangeText={setPassword} 
                        />

                        <Input 
                        isPassword
                        placeholder='Подтвердите пароль'
                        value={confirmPassword}
                        onChangeText={setConfirmPassword} 
                        />

                        <Button 
                        text='Зарегистрироваться'
                        onPress={handleRegister}
                        disabled={loading} 
                        />
                    </View>
                <Pressable onPress={() => {router.push('/login')}}>
                    <Text style={styles.link}>Есть аккаунт? Войдите!</Text>
                </Pressable>
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
            paddingHorizontal: 55,
        },
        form: {
            alignSelf: 'stretch',
            gap: Gaps.g10
        },
        header: {
            textAlign: 'center',
            fontSize: 35,
            color: Colors.salatText,
            fontWeight: 'bold',
        },
        link: {
            color: Colors.GreenPlaceHolder,
        }
    })   
