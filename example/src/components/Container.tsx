import React from 'react';
import {StyleSheet, View} from "react-native";

interface Props {
    children: React.ReactNode[] | React.ReactNode
    testID: string
}

export default function ({testID,children}: Props) {
    return <View testID={testID} style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f1f0f0',
        borderRadius: 10,
        padding: 5,
        margin: 5,
        marginBottom:10,
    },
});
