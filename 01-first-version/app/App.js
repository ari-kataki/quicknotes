import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Login_Screen } from './component/Login_Screen';
import { Notes_Screen } from './component/Notes_Screen';

export default function App() {
    const [page, setPage] = useState('Login');
    const [userData, setUserData] = useState({ username: '', token: '', notes: [] });

    const navigateToPage = (newPage, data = {}) => {
        setPage(newPage);
        setUserData({ ...userData, ...data });
    };

    return (
        <View style={styles.container}>
            {page === 'Login' ? (
                <Login_Screen navigateToPage={navigateToPage} />
            ) : (
                <Notes_Screen
                    username={userData.username}
                    token={userData.token}
                    initialNotes={userData.notes}
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