import { reportApi } from '@/api/reportApi';
import { transactionApi } from '@/api/transactionApi';
import { Button } from '@/components/Button/button';
import { Input } from '@/components/input/input';
import { Colors, Radius } from '@/components/tokens';
import * as Print from 'expo-print';
import { router } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddReportScreen() {
  const [inputPeriod, setInputPeriod] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    const regex = /^\d{4}-(0[1-9]|1[0-2])$/; 
    if (!regex.test(inputPeriod)) {
      Alert.alert('Ошибка', 'Введите период в формате ГГГГ-ММ (например, 2026-11)');
      return;
    }

    setLoading(true);
    try {
      const transactions = await transactionApi.getAll();
      const filtered = transactions.filter(t => t.transactionDate.startsWith(inputPeriod));

      if (filtered.length === 0) {
        Alert.alert('Ошибка', `Нет транзакций за ${inputPeriod}`);
        setLoading(false);
        return;
      }

      const income = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expense = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const balance = income - expense;

      await reportApi.create({
        period: inputPeriod,
        totalIncome: income,
        totalExpense: expense,
        balance,
        data: filtered,
      });

      const rows = filtered.map(t => `
        <tr>
          <td>${t.transactionDate ? t.transactionDate.split('T')[0] : '—'}</td>
          <td style="color: ${t.type === 'income' ? 'green' : 'red'}">
            ${t.type === 'income' ? 'Доход' : 'Расход'}
          </td>
          <td>${t.category}</td>
          <td>${t.comment || '—'}</td>
          <td style="text-align: right;">${t.amount} ₽</td>
        </tr>
      `).join('');

      const html = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
              body { font-family: 'Helvetica', sans-serif; padding: 20px; }
              h1 { text-align: center; color: #333; }
              .summary { display: flex; justify-content: space-around; margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 8px; }
              .summary div { text-align: center; }
              .summary .amount { font-size: 24px; font-weight: bold; }
              .income { color: green; }
              .expense { color: red; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
              th { background-color: #09110a; color: #ace6b0; }
              tr:nth-child(even) { background-color: #f9f9f9; }
            </style>
          </head>
          <body>
            <h1>Финансовый отчет FishHoz</h1>
            <p style="text-align: center;">Период: ${inputPeriod}</p>
            <p style="text-align: center;">Дата формирования: ${new Date().toLocaleDateString('ru-RU')}</p>
            
            <div class="summary">
              <div>
                <div>Доходы</div>
                <div class="amount income">+${income} ₽</div>
              </div>
              <div>
                <div>Расходы</div>
                <div class="amount expense">-${expense} ₽</div>
              </div>
              <div>
                <div>Баланс</div>
                <div class="amount">${balance} ₽</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Тип</th>
                  <th>Категория</th>
                  <th>Комментарий</th>
                  <th>Сумма</th>
                </tr>
              </thead>
              <tbody>
                ${rows || '<tr><td colspan="5" style="text-align: center;">Транзакций нет</td></tr>'}
              </tbody>
            </table>
          </body>
        </html>
      `;

      const { base64 } = await Print.printToFileAsync({ html, base64: true });
      if (!base64) throw new Error('Не удалось получить PDF');

      const FileSystem = require('expo-file-system/legacy');
      const fileUri = FileSystem.documentDirectory + `report-${Date.now()}.pdf`;
      
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Поделиться отчетом',
          UTI: 'com.adobe.pdf',
        });
      }

      Alert.alert('Успех', 'Отчет создан и сохранен!');
      router.back();
    } catch (err) {
      Alert.alert('Ошибка', err instanceof Error ? err.message : 'Не удалось создать отчет');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.DarkGreenBack }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Создать отчет</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Период (ГГГГ-ММ)</Text>
            
            <Input 
              placeholder="2026-11" 
              value={inputPeriod} 
              onChangeText={(text) => {
                const cleaned = text.replace(/\D/g, '');
                let formatted = cleaned;
                if (cleaned.length > 4) {
                  formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}`;
                }
                setInputPeriod(formatted);
              }} 
              keyboardType="numeric"
              maxLength={7}
            />
            <Text style={styles.hint}>Например: 2026-11</Text>
          </View>

          <Button 
            text={loading ? 'Создание...' : 'Сформировать и сохранить'} 
            onPress={handleCreate} 
            disabled={loading} 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.salatText, textAlign: 'center', marginBottom: 20 },
  card: { backgroundColor: Colors.GreenInput, padding: 20, borderRadius: Radius.r10, marginBottom: 20 },
  label: { color: Colors.GreenPlaceHolder, fontSize: 14 },
  hint: { color: Colors.GreenPlaceHolder, fontSize: 12, marginTop: 10, fontStyle: 'italic' },
});