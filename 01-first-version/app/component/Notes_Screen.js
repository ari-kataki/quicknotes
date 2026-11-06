import { Button, StyleSheet, ScrollView, TextInput, View, Alert } from "react-native";
import { Note } from "./ui/Notes";
import { useState, useEffect } from "react";
import axios from "axios";

export function Notes_Screen(props) {

    const tokenValue = props.token?.token ?? props.token;

    const [notes, setNotes] = useState([]);
    const [inputNotes, setInputNotes] = useState('');

    const handleChangeText = (text) => setInputNotes(text);

    const publishingHandler = () => {
        if (!inputNotes.trim()) return;

        axios.post(
            'http://YOUR_PC_IP:8082/api_QuickNotes/create_note.php',
            { content: inputNotes },
            { headers: { Authorization: `Bearer ${tokenValue}` } }
        )
            .then((response) => {
                if (response.data?.success) {
                    const newNotes = {
                        id: Date.now(),
                        content: inputNotes,
                        creation_date: new Date().toISOString(),
                        username: props.username,
                    };
                    setNotes([...notes, newNotes]);
                    setInputNotes('');
                } else {
                    console.log('Errore risposta API:', response.data);
                }
            })
            .catch((error) => {
                console.log('Errore creazione nota:', error);
            });
    };

    const deleteNote = async (id) => {
        try {
            const res = await axios.post(
                'YOUR_PC_IP:8082/api_QuickNotes/delete_notes.php',
                { note_id: id },
                { headers: { Authorization: `Bearer ${tokenValue}` } }
            );
            if (res.data?.success) {
                setNotes(notes.filter(nts => nts.note_id !== id));
            } else {
                Alert.alert('Errore', res.data?.error || 'Impossibile eliminare la nota.');
            }
        } catch (err) {
            console.log('Errore eliminazione note:', err);
            Alert.alert('Errore', 'Problema di connessione con il server.');
        }
    };

    useEffect(() => {
        axios.get('http://YOUR_PC_IP:8082/api_QuickNotes/notes.php', {
            headers: { Authorization: `Bearer ${tokenValue}` }
        })
            .then((response) => {
                const items = response?.data?.items ?? [];
                setNotes(items);
            })
            .catch((error) => {
                console.log('Errore caricamento note:', error);
                setNotes([]);
            });
    }, [tokenValue]);

    return (
        <View style={styles.appContainer}>
            <View style={styles.boxNote}>
                <TextInput
                    placeholder="Scrivi una nota"
                    onChangeText={handleChangeText}
                    value={inputNotes}
                    style={styles.input}
                />
                <Button onPress={publishingHandler} title="Invia!" />

                <ScrollView style={styles.scrollView}>
                    {(notes || []).map((note, index) => (
                        <View key={note.id ?? index}>
                            <Note
                                id={note.id}
                                publishingDate={note.creation_date}
                                username={note.username}
                            />
                            {note.username === props.username && (
                                <Button title="Elimina!" onPress={() => deleteNote(note.id)} />
                            )}
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "orange",
    },
    boxNote: {
        width: "80%",
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#000000",
        borderRadius: 5,
        padding: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: "#000000",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: "#ffffff",
    },
    scrollView: {
        borderWidth: 1,
        borderColor: "#000000",
        borderRadius: 5,
        backgroundColor: "#f5f5f5",
        padding: 5,
    },
});
