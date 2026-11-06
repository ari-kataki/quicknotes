import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { LoginScreen } from './components/screens/LoginScreen';
import { MessagesScreen } from './components/screens/MessagesScreen';

export default function App() {
    const [page, setPage] = useState('Login');
    const [userData, setUserData] = useState({ username: '', token: '', messages: [] });

    const navigateToPage = (newPage, data = {}) => {
        setPage(newPage);
        setUserData({ ...userData, ...data });
    };

    return (
        <View style={styles.container}>
            {page === 'Login' ? (
                <LoginScreen navigateToPage={navigateToPage} />
            ) : (
                <MessagesScreen
                    username={userData.username}
                    token={userData.token}
                    initialMessages={userData.messages}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
