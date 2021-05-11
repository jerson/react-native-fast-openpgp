import React from 'react';

import {Colors} from "react-native/Libraries/NewAppScreen";
import {StyleSheet, Text} from "react-native";

interface Props {
    children: React.ReactNode
}

export default function ({children}: Props) {
    return <Text  selectable style={styles.sectionDescription}>{children}</Text>;
}
const styles = StyleSheet.create({
    sectionDescription: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '400',
        color: Colors.dark,
    },
});
