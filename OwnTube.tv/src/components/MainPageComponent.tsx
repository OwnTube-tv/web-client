import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';
import VideosByCategoryComponent from './VideosByCategoryComponent';

const { width } = Dimensions.get('window');

const MainPageComponent: React.FC = () => {
  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.mainPageContainer}>
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: 'https://example.com/owntube-logo.png' }}
          style={styles.logo} // Adjusted style to match the exact dimensions and styles as the first snippet
        />
        <Text style={styles.logoText}>OwnTube</Text>
      </View>
      <VideosByCategoryComponent />
    </ScrollView>
  );
};

const COLOR_DARK = '#333'; 
const COLOR_WHITE = '#FFF'; 

const styles = StyleSheet.create({
  logo: {
    borderRadius: 2, 
    height: width * 0.25, 
    width: width * 0.25, 
  }, 
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    color: COLOR_WHITE,
    fontSize: 30, 
    fontWeight: 'bold',
    marginTop: 10, 
  },
  mainPageContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 20,
    paddingTop: 20,
  },
  scrollContainer: {
    backgroundColor: COLOR_DARK, 
    flex: 3,
  },
});

export default MainPageComponent;
