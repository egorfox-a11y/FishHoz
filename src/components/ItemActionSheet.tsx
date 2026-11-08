import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { forwardRef, useCallback } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button } from './Button/button';
import { DeleteButton } from './Button/deleteButton';
import { Colors } from './tokens';

type Props = {
  title: string;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
};

export const ItemActionsSheet = forwardRef<BottomSheet, Props>(
  ({ title, onEdit, onDelete, onClose }, ref) => {
    const snapPoints = ['35%'];

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} onPress={onClose} />
      ),
      [onClose]
    );

    return (
      <BottomSheet ref={ref} index={-1} snapPoints={snapPoints} enablePanDownToClose backdropComponent={renderBackdrop} backgroundStyle={{ backgroundColor: Colors.DarkGreenBack }} handleIndicatorStyle={{ backgroundColor: Colors.GreenPlaceHolder }}>
        <BottomSheetView style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          
          <Button text="Изменить" onPress={onEdit} style={styles.button} />
          <DeleteButton text="Удалить" onPress={onDelete} style={styles.button} />
          <Button text="Отмена" onPress={onClose} style={[styles.button, { backgroundColor: 'transparent' }]} />
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  content: { padding: 20, gap: 10 },
  title: { fontSize: 20, fontWeight: 'bold', color: Colors.salatText, textAlign: 'center', marginBottom: 15 },
  button: { paddingVertical: 15 }
});