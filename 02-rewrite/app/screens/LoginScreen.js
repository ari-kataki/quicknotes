import { useState } from 'react';
import axios from 'axios';
import { LOGIN_URL } from '../config';
import AuthForm from '../ui/AuthForm';

export default function LoginScreen({ onLogin, goToRegister }) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function handleLogin() {
        if (!username || !password) {
            alert('Inserisci username e password');
            return;
        }

        axios
            .post(LOGIN_URL, { username: username, password: password }, { timeout: 8000 })
            .then((response) => {
                if (response.data.token) {
                    onLogin(response.data.token);
                } else {
                    alert('Risposta del server non valida');
                }
            })
            .catch((error) => {
                if (error.response) {
                    alert(error.response.data.error);
                } else {
                    alert('Impossibile contattare il server');
                }
            });
    }

    return (
        <AuthForm
            fields={[
                { label: 'Username:', value: username, onChangeText: setUsername },
                { label: 'Password:', value: password, onChangeText: setPassword, secure: true },
            ]}
            primaryLabel="Login"
            onPrimaryPress={handleLogin}
            secondaryLabel="Registrati"
            onSecondaryPress={goToRegister}
        />
    );
}