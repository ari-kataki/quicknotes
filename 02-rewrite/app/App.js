import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { saveToken, loadToken, deleteToken } from './storage';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
 
export default function App() {

  const [token, setToken] = useState(null);
  const [view, setView] = useState('login');;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadToken().then(saved => {
      setToken(saved);
      setLoading(false);
    });
  }, []);

  async function handleAuth(newToken) {
    await saveToken(newToken);
    setToken(newToken);
  }

  async function handleLogout() {
    await deleteToken();
    setToken(null);
    setView('login');
  }
 
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
 
  if (token) {
    return <HomeScreen token={token} onLogout={handleLogout} />;
  }
 
  if (view === 'register') {
    return <RegisterScreen onRegister={handleAuth} backToLogin={() => setView('login')} />;
  }
 
  return <LoginScreen onLogin={handleAuth} goToRegister={() => setView('register')} />;
}