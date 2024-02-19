import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import build_info from './build-info.json';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app, current deployed revision is <a href={build_info.COMMIT_URL} target="_blank">{build_info.GITHUB_SHA_SHORT}</a> built at {build_info.BUILD_TIMESTAMP}.</Text>
      <hr></hr>
      <Text>(Your friendly <a href="https://github.com/ar9708" target="_blank"><code>ar9708</code></a> 🙋‍♀️ was here!)</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
