import EyeClosedIcon from "@/assets/icons/eye-closed"
import EyeOpenedIcon from "@/assets/icons/eye-opened"
import { useState } from "react"
import { Pressable, StyleSheet, TextInput, TextInputProps, View } from "react-native"
import { Colors, Radius } from "../tokens"
export function Input({isPassword, ...props}: TextInputProps & { isPassword?: boolean }) {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
    return (
        <View>
            <TextInput
                style={styles.input}
                secureTextEntry={isPassword && !isPasswordVisible}
                placeholderTextColor={Colors.GreenPlaceHolder}
                {...props} />
            {isPassword && 
                <Pressable style={styles.eyeIcon} onPress={() => setIsPasswordVisible(state => !state)}>
                {isPasswordVisible ? <EyeClosedIcon /> : <EyeOpenedIcon />}    
            </Pressable>}
            
        </View>

    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: Colors.GreenInput,
        height: 58,
        borderRadius: Radius.r10,
        fontSize: 16,
        color: Colors.salatText
    },
    eyeIcon: {
        position: 'absolute',
        right: 0,
        paddingHorizontal: 15,
        paddingVertical: 13,
    }
})