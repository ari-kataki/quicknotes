import { StyleSheet, Text, View, Button, TextInput, ScrollView } from 'react-native';

export default function AuthForm({ fields, primaryLabel, onPrimaryPress, secondaryLabel, onSecondaryPress }) {
    return (
        <ScrollView contentContainerStyle={styles.mainContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.formContainer}>
                {fields.map(field => (
                    <View key={field.label}>
                        <Text>{field.label}</Text>
                        <TextInput
                            style={styles.input}
                            value={field.value}
                            onChangeText={field.onChangeText}
                            secureTextEntry={field.secure === true}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>
                ))}

                <Button title={primaryLabel} onPress={onPrimaryPress} />
                <Button title={secondaryLabel} onPress={onSecondaryPress} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    formContainer: {
        width: '100%',
        padding: 10,
        backgroundColor: 'white',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: 'grey',
        alignItems: 'center',
    },
    input: {
        width: 200,
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 1,
        margin: 10,
        padding: 6,
    },
});