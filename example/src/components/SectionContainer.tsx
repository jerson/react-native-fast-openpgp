import React from 'react';
import {StyleSheet, View} from "react-native";

interface Props {
    children: React.ReactNode[]
}

export default function ({children}: Props) {
    return <View style={styles.sectionContainer}>{children}</View>;
}

const styles = StyleSheet.create({
    sectionContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 10,
        paddingHorizontal: 20,
        margin: 10,
    },
});
