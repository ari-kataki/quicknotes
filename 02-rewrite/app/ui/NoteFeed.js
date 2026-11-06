import { FlatList, Text } from 'react-native';
import Note from './Note';

export default function NoteFeed({ notes, loaded, editingId, editTitle, editText, onEditTitleChange, onEditTextChange, onEdit, onSave, onCancel, onDelete, onEndReached }) {
    return (
        <FlatList
            data={notes}
            extraData={[editingId, editTitle, editText]}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={loaded ? <Text>Nessuna nota salvata</Text> : null}
            renderItem={({ item }) => (
                <Note
                    note={item}
                    isEditing={item.id === editingId}
                    editTitle={editTitle}
                    editText={editText}
                    onEditTitleChange={onEditTitleChange}
                    onEditTextChange={onEditTextChange}
                    onEdit={() => onEdit(item)}
                    onSave={onSave}
                    onCancel={onCancel}
                    onDelete={() => onDelete(item.id)}
                />
            )}
        />
    );
}