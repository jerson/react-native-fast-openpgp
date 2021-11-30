import React from 'react';

import {Colors} from "react-native/Libraries/NewAppScreen";
import {StyleSheet, Text} from "react-native";

interface Props {
    children: String
}

export default function ({children}: Props) {
    return <Text style={styles.sectionTitle}>{children}</Text>;
}
const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
    },
});
