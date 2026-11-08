import { Pressable, PressableProps, StyleSheet, Text, View } from "react-native";
import { Colors, Radius } from "../tokens";
export function Button({ text,  ...props }: { text: string } & PressableProps) {
    return(
        <Pressable {...props} >
            <View style={styles.button}>
                <Text style={styles.text}>{text}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.salatText,
        height: 58,
        borderRadius: Radius.r10,
    },
    text: {
        fontSize: 20,
        color: Colors.DarkGreenBack,
        fontWeight: 700,
        textAlign: 'center',
    },

})