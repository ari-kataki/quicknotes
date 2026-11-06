import { View, Text } from 'react-native';

export const Message = (props) => {
    const formatDateTime = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    }

    return (
        <View>
            <Text>ID: {props.id}</Text>
            <Text>{props.username}</Text>
            <Text>{props.content}</Text>
            <Text>{formatDateTime(props.publishingDate)}</Text>
        </View>
    );
};
