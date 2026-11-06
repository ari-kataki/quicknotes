import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const SERVER_URL = 'http://YOUR_PC_IP:8888';

export function LoginScreen({ navigateToPage }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const performLogin = () => {
        if (!username || !password) {
            Alert.alert('Errore', 'Inserisci username e password');
            return;
        }

        axios.post(`${SERVER_URL}/API/login.php`, { username, password }, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                const data = response.data;
                if (data?.success && data.token) {
                    const token = data.token;

                    axios.get(`${SERVER_URL}/API/messages.php`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                        .then(res => {
                            const messages = res.data.items || [];
                            navigateToPage('Messages', { username, token, messages });
                        })
                        .catch(err => {
                            console.log('Errore caricamento messaggi:', err);
                            Alert.alert('Errore', 'Impossibile caricare i messaggi dal server.');
                        });

                } else {
                    Alert.alert('Login fallito', data?.error || 'Credenziali non valide');
                }
            })
            .catch(error => {
                console.log('AXIOS ERROR:', error);
                Alert.alert('Errore', 'Impossibile effettuare il login.');
            })
            .finally(() => {
                setUsername('');
                setPassword('');
            });
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <Button title="Login" onPress={performLogin} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        width: '85%',
        marginBottom: 15,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
});
