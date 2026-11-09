import { transactionApi } from '@/api/transactionApi';
import { Button } from '@/components/Button/button';
import { Colors } from '@/components/tokens';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';


export default function AddReportScreen() {
  const [loading, setLoading] = useState(false);

  const generatePdf = async () => {
    setLoading(true);
    try {
      // 1. Получаем все транзакции
      const transactions = await transactionApi.getAll();

      // 2. Считаем итоги
      const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const rows = transactions.map(t => `
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

      // 4. Собираем HTML документ
      const html = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
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
                <div class="amount">${income - expense} ₽</div>
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
      
      const { base64 } = await Print.printToFileAsync({ 
        html, 
        base64: true 
      });

      if (!base64) throw new Error('Не удалось получить PDF');

      const FileSystem = require('expo-file-system/legacy');
      const fileUri = FileSystem.documentDirectory + 'report.pdf';
      
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/pdf', 
          dialogTitle: 'Поделиться отчетом',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('Ошибка', 'Функция "Поделиться" недоступна');
      }

    } catch (error) {
      Alert.alert('Ошибка', error instanceof Error ? error.message : 'Не удалось создать PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Финансовый отчет</Text>
      <Text style={styles.subtitle}>
        Нажмите кнопку ниже, чтобы сформировать PDF-файл со всеми транзакциями и итогами.
      </Text>

      <Button 
        text={loading ? 'Формирование PDF...' : 'Скачать PDF'} 
        onPress={generatePdf} 
        disabled={loading} 
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.DarkGreenBack, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.salatText, textAlign: 'center', marginBottom: 10 },
  subtitle: { color: Colors.GreenPlaceHolder, textAlign: 'center', fontSize: 16, marginBottom: 20 },
});