import { View, Text } from 'react-native';

export const Note = (props) => {
    const formatDateTime = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    }

    return (
        <View>
            <Text>ID: {props.id}</Text>
            <Text>{props.username}</Text>
            <Text>{props.data}</Text>
            <Text>{formatDateTime(props.publishingDate)}</Text>
        </View>
    );
};
