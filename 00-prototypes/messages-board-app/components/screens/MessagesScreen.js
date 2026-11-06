import { Button, StyleSheet, ScrollView, TextInput, View, Alert } from "react-native";
import { Message } from "../ui/Message";
import { useState, useEffect } from "react";
import axios from "axios";

export function MessagesScreen(props) {

    const tokenValue = props.token?.token ?? props.token;

    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    const handleChangeText = (text) => setInputMessage(text);

    const publishingHandler = () => {
        if (!inputMessage.trim()) return;

        axios.post(
            'http://YOUR_PC_IP:8888/API/create_message.php',
            { content: inputMessage },
            { headers: { Authorization: `Bearer ${tokenValue}` } }
        )
            .then((response) => {
                if (response.data?.success) {
                    const newMessage = {
                        id: Date.now(),
                        content: inputMessage,
                        creation_date: new Date().toISOString(),
                        username: props.username,
                    };
                    setMessages([...messages, newMessage]);
                    setInputMessage('');
                } else {
                    console.log('Errore risposta API:', response.data);
                }
            })
            .catch((error) => {
                console.log('Errore creazione messaggio:', error);
            });
    };

    const deleteMessage = async (id) => {
        try {
            const res = await axios.post(
                'http://YOUR_PC_IP:8888/API/delete_message.php',
                { message_id: id },
                { headers: { Authorization: `Bearer ${tokenValue}` } }
            );
            if (res.data?.success) {
                setMessages(messages.filter(msg => msg.id !== id));
            } else {
                Alert.alert('Errore', res.data?.error || 'Impossibile eliminare il messaggio.');
            }
        } catch (err) {
            console.log('Errore eliminazione messaggio:', err);
            Alert.alert('Errore', 'Problema di connessione con il server.');
        }
    };

    useEffect(() => {
        axios.get('http://YOUR_PC_IP:8888/API/messages.php', {
            headers: { Authorization: `Bearer ${tokenValue}` }
        })
            .then((response) => {
                const items = response?.data?.items ?? [];
                setMessages(items);
            })
            .catch((error) => {
                console.log('Errore caricamento messaggi:', error);
                setMessages([]);
            });
    }, [tokenValue]);

    return (
        <View style={styles.appContainer}>
            <View style={styles.boxMessage}>
                <TextInput
                    placeholder="Scrivi il messaggio"
                    onChangeText={handleChangeText}
                    value={inputMessage}
                    style={styles.input}
                />
                <Button onPress={publishingHandler} title="Invia!" />

                <ScrollView style={styles.scrollView}>
                    {(messages || []).map((message, index) => (
                        <View key={message.id ?? index}>
                            <Message
                                id={message.id}
                                content={message.content}
                                publishingDate={message.creation_date}
                                username={message.username}
                            />
                            {message.username === props.username && (
                                <Button title="Delete" onPress={() => deleteMessage(message.id)} />
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
    boxMessage: {
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
