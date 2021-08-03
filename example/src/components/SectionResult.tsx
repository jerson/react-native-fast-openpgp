import React from 'react';

import {Colors} from "react-native/Libraries/NewAppScreen";
import {StyleSheet, Text} from "react-native";

interface Props {
    children: React.ReactNode
    testID: string
}

export default function ({children, testID}: Props) {
    return <Text testID={testID} selectable style={styles.sectionDescription}>{children}</Text>;
}
const styles = StyleSheet.create({
    sectionDescription: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '400',
        color: Colors.dark,
    },
});
