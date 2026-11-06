import { StyleSheet, View, Text, Button, TextInput } from 'react-native';

export default function Note({ note, isEditing, editTitle, editText, onEditTitleChange, onEditTextChange, onEdit, onSave, onCancel, onDelete }) {
    return (
        <View style={styles.noteBox}>

            {isEditing ? (
                <>
                    <TextInput style={styles.editInput} value={editTitle} onChangeText={onEditTitleChange} maxLength={100} />
                    <TextInput style={styles.editInput} value={editText} onChangeText={onEditTextChange} maxLength={1000} multiline />
                </>
            ) : (
                <>
                    <Text style={styles.titleBox}>{note.title}</Text>
                    <Text style={styles.textBox} numberOfLines={2}>{note.text}</Text>
                </>
            )}

            <Text style={styles.dateBox}>{note.date.slice(0, 16)}</Text>

            <View style={styles.buttonBox}>
                {isEditing ? (
                    <>
                        <Button title="Salva" color="green" onPress={onSave} />
                        <Button title="Annulla" color="grey" onPress={onCancel} />
                    </>
                ) : (
                    <>
                        <Button title="Modifica" color="green" onPress={onEdit} />
                        <Button title="Elimina" color="red" onPress={onDelete} />
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    noteBox: {
        backgroundColor: '#dceef7',
        borderRadius: 10,
        padding: 5,
        marginTop: 10,
        borderLeftWidth: 5,
        borderLeftColor: '#2a7da8',
    },
    titleBox: {
        borderBottomWidth: 1,
        borderColor: 'black',
        paddingBottom: 3,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    textBox: {
        paddingBottom: 3,
        marginBottom: 10,
    },
    dateBox: {
        color: 'grey',
        fontSize: 12,
        marginBottom: 10,
    },
    buttonBox: {
        gap: 10,
        flexDirection: 'row',
    },
    editInput: {
        backgroundColor: 'white',
        marginBottom: 10,
        padding: 6,
    },
});
