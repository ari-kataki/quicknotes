import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import NoteForm from '../ui/NoteForm';
import NoteFeed from '../ui/NoteFeed';
import { NOTES_URL, CREATE_URL, EDIT_URL, DELETE_URL } from '../config';


export default function HomeScreen({ token, onLogout }) {

  const [notes, setNotes] = useState([]);
  const [me, setMe] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loaded, setLoaded] = useState(false); 
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState(''); 
  const [editText, setEditText] = useState('');


  const loading = useRef(false);

  const authHeaders = { Authorization: 'Bearer ' + token };

 
  useEffect(() => {
    loadNotes(1);
  }, []);


  function handleApiError(error, fallbackMessage) {
    if (error.response && error.response.status === 401) {
      alert('Sessione scaduta, rifai il login');
      onLogout();
      return;
    }
    const serverMessage = error.response && error.response.data && error.response.data.error;
    alert(serverMessage || fallbackMessage);
    console.error(error);
  }


  async function loadNotes(pageToLoad, force = false) {
    if (loading.current && !force) {
      return;
    }
    loading.current = true;

    try {
      const response = await axios.get(NOTES_URL, {
        params: { page: pageToLoad },
        headers: authHeaders,
      });
      const data = response.data;

      if (!Array.isArray(data.results)) {
        alert('Risposta non valida dal server');
        return;
      }

      const downloaded = data.results.map(note => ({
        id: note.id,
        title: note.title,
        text: note.content,
        date: note.creation_date,
      }));

      setNotes(previous => {
        if (pageToLoad === 1) {
          return downloaded;
        }

        return [...previous, ...downloaded.filter(item => !previous.some(old => old.id === item.id))];
      });
      setMe(data.me);
      setPage(data.pagination.page);
      setTotalPages(data.pagination.total_pages);
      setLoaded(true);
    } catch (error) {
      handleApiError(error, 'Impossibile caricare le note');
    } finally {
      loading.current = false;
    }
  }

  function handleEndReached() {
    if (page < totalPages) {
      loadNotes(page + 1);
    }
  }

  function handleCreate() {
    if (newTitle.trim() === '' || newText.trim() === '') {
      alert('Inserisci titolo e contenuto');
      return;
    }
    axios
      .post(CREATE_URL, { title: newTitle, content: newText }, { headers: authHeaders })
      .then(() => {
        setNewTitle('');
        setNewText('');
        alert('Nota aggiunta con successo');
        loadNotes(1, true);
      })
      .catch((error) => handleApiError(error, 'Impossibile salvare la nota'));
  }

  
  function handleDelete(id) {
    Alert.alert('Elimina nota', 'Vuoi eliminare questa nota?', [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Elimina', style: 'destructive', onPress: () => deleteNote(id) },
    ]);
  }

  function deleteNote(id) {
    axios
      .post(DELETE_URL, { note_id: id }, { headers: authHeaders })
      .then(() => loadNotes(1, true))
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          handleApiError(error);
          return;
        }
        alert("Errore nell'eliminazione");
      });
  }

  
  function handleEdit(note) {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditText(note.text);
  }

  function handleSaveEdit() {
    axios
      .post(EDIT_URL, { note_id: editingId, title: editTitle, content: editText }, { headers: authHeaders })
      .then(() => {
        setEditingId(null);
        setEditTitle('');
        setEditText('');
        loadNotes(1, true);
      })
      .catch((error) => handleApiError(error, 'Impossibile modificare la nota'));
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditTitle('');
    setEditText('');
  }

  return (
    <View style={styles.mainContainer}>

      <View style={styles.titleContainer}>
        <Text style={styles.textTitle}>QuickNotes</Text>
      </View>

      <View style={styles.logoutContainer}>
        <Text style={styles.text}>Utente: {me}</Text>
        <Button title="Logout" onPress={onLogout} />
      </View>

      <View style={styles.formContainer}>
        <NoteForm
          title={newTitle}
          content={newText}
          onChangeTitle={setNewTitle}
          onChangeContent={setNewText}
          onSave={handleCreate}
        />
      </View>

      <View style={styles.feedContainer}>
        <NoteFeed
          notes={notes}
          loaded={loaded}
          editingId={editingId}
          editTitle={editTitle}
          editText={editText}
          onEditTitleChange={setEditTitle}
          onEditTextChange={setEditText}
          onEdit={handleEdit}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          onDelete={handleDelete}
          onEndReached={handleEndReached}
        />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
  },
  titleContainer: {
    alignItems: 'center',
    padding: 10,
  },
  logoutContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10,
    gap: 10,
    alignItems: 'center',
  },
  textTitle: {
    color: 'darkblue',
    fontSize: 35,
  },
  text: {
    color: 'black',
    fontSize: 15,
  },
  formContainer: {
    backgroundColor: '#dceef7',
    padding: 10,
    borderRadius: 10,
  },
  feedContainer: {
    alignSelf: 'stretch',
    flex: 1,
  },
});