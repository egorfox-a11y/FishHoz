import { reportApi } from '@/api/reportApi';
import { Button } from '@/components/Button/button';
import { DeleteButton } from '@/components/Button/deleteButton';
import { Colors, Gaps, Radius } from '@/components/tokens';
import * as Print from 'expo-print';
import { router, useFocusEffect } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import type { Report } from '../../../shared/types';

export default function ReportsScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReports = async () => {
    try {
      setError(null);
      const data = await reportApi.getAll();
      setReports(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadReports();
    }, [])
  );

  const handleShare = async (report: Report) => {
    try {
      const rows = (report.data || []).map((t: any) => `
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
            <p style="text-align: center;">Период: ${report.period}</p>
            <p style="text-align: center;">Дата формирования: ${new Date().toLocaleDateString('ru-RU')}</p>
            
            <div class="summary">
              <div>
                <div>Доходы</div>
                <div class="amount income">+${report.totalIncome} ₽</div>
              </div>
              <div>
                <div>Расходы</div>
                <div class="amount expense">-${report.totalExpense} ₽</div>
              </div>
              <div>
                <div>Баланс</div>
                <div class="amount">${report.balance} ₽</div>
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
      const fileUri = FileSystem.documentDirectory + `report-${report.id}.pdf`;
      
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
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось сгенерировать PDF');
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert('Удалить отчет?', 'Это действие нельзя отменить', [
      { text: 'Отмена', style: 'cancel' },
      { 
        text: 'Удалить', 
        style: 'destructive',
        onPress: async () => {
          try {
            await reportApi.delete(id);
            loadReports();
          } catch (err) {
            Alert.alert('Ошибка', 'Не удалось удалить');
          }
        }
      }
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.salatText} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Отчет за {item.period}</Text>
            <View style={styles.cardFlex}>
              <Text style={styles.cardText}>Доход: +{item.totalIncome} ₽</Text>
              <Text style={styles.cardText}>Расход: -{item.totalExpense} ₽</Text>
            </View>
            <Text style={styles.cardBalance}>Баланс: {item.balance} ₽</Text>
            
            <View style={styles.actions}>
              <Button text="Скачать PDF" onPress={() => handleShare(item)} style={styles.actionButton} />
              <DeleteButton text="Удалить" onPress={() => handleDelete(item.id)} style={styles.actionButton} />
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Отчетов пока нет</Text>}
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <Button 
          text="Создать отчет" 
          onPress={() => router.push('/reports/add')} 
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.DarkGreenBack, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.DarkGreenBack },
  card: { backgroundColor: Colors.GreenInput, padding: 15, borderRadius: Radius.r10, marginBottom: 10, borderWidth: 1, borderColor: Colors.GreenPlaceHolder },
  cardTitle: { color: Colors.salatText, fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  cardFlex: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  cardText: { color: Colors.salatText, fontSize: 14 },
  cardBalance: { color: Colors.salatText, fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  actions: { flexDirection: 'row', gap: 10 },
  actionButton: { flex: 1, paddingVertical: 10 },
  list: { gap: Gaps.g10, paddingBottom: 20 },
  empty: { color: Colors.salatText, textAlign: 'center', marginTop: 20 },
  footer: { marginTop: 10 },
  button: { paddingVertical: 15 },
});