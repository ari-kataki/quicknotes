import { useState } from 'react';
import axios from 'axios';
import { REGISTER_URL } from '../config';
import AuthForm from '../ui/AuthForm';

export default function RegisterScreen({ onRegister, backToLogin }) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    function handleRegister() {
        if (!username || !password || !password2) {
            alert('Compila tutti i campi');
            return;
        }

        axios
            .post(REGISTER_URL, { username: username, password: password, password2: password2 }, { timeout: 8000 })
            .then((response) => {
                if (response.data.token) {
                    onRegister(response.data.token);
                } else {
                    alert('Risposta del server non valida');
                }
            })
            .catch((error) => {
                if (error.response) {
                    alert(error.response.data.error || error.response.status + ' ' + REGISTER_URL);
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
                { label: 'Ripeti Password:', value: password2, onChangeText: setPassword2, secure: true },
            ]}
            primaryLabel="Registrati"
            onPrimaryPress={handleRegister}
            secondaryLabel="Torna al Login"
            onSecondaryPress={backToLogin}
        />
    );
}