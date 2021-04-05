import * as React from 'react';

import { StyleSheet, View, Text, Button } from 'react-native';
import FastOpenpgp from 'react-native-fast-openpgp';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

  const sampleFn = async () => {
    try {
      const sample = await FastOpenpgp.sample();
      console.log("FastOpenpgp result in example",sample);
    } catch (e) {
      console.warn("FastOpenpgp sample in example",e);
    }
  };
 /* React.useEffect(() => {
    sampleFn();
  }, []);
*/
  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
      <Button onPress={sampleFn} title="dd" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
