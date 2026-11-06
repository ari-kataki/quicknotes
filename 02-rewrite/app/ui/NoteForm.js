import { StyleSheet, View, TextInput, Button } from 'react-native';

export default function NoteForm({ title, content, onChangeTitle, onChangeContent, onSave }) {
    return (
        <View>
            <TextInput
                style={style.input}
                placeholder="Titolo"
                onChangeText={onChangeTitle}
                value={title}
                maxLength={100}
            />
            <TextInput
                style={style.input}
                placeholder="Contenuto"
                onChangeText={onChangeContent}
                value={content}
                maxLength={1000}
                multiline
            />
            <Button title="Salva" onPress={onSave} />
        </View>
    );
}

const style = StyleSheet.create({
    input: {
        backgroundColor: 'white',
        padding: 6,
        marginBottom: 10,
    },
});
