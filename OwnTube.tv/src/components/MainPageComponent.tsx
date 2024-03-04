import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';
import VideoCategoryPreviewComponent from './VideoCategoryPreviewComponent';
import { CategoryLabel, Video } from './VideoTypes';

interface MainPageProps {
  videos: Video[];
  categories: CategoryLabel[];
}

const { width } = Dimensions.get('window');

const MainPageComponent: React.FC<MainPageProps> = ({ videos, categories }) => {
  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.mainPageContainer}>
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: 'https://example.com/owntube-logo.png' }}
          style={[styles.logo, { width: width * 0.0, height: width * 0.0 }]} // Anpassa storleken baserat på skärmens bredd
        />
        <Text style={styles.logoText}>OwnTube</Text> 
      </View>
      {categories.map((category, index) => (
        <React.Fragment key={category.id}>
          <VideoCategoryPreviewComponent
            category={category}
            videos={videos.filter(video => video.category.id === category.id)}
          />
          {index < categories.length - 1 && <View style={styles.categorySeparator} />}
        </React.Fragment>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#333',
  },
  mainPageContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    borderRadius: width * 0.25,
  },
  logoText: {
    fontSize: 100, 
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 50, 
  },
  categoryName: {
    fontSize: 26, // Ökad textstorlek för kategorinamn
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  categorySeparator: {
    height: 1,
    backgroundColor: '#CCC',
    width: '90%',
    alignSelf: 'center',
    marginVertical: 20,
  },
});

export default MainPageComponent;
