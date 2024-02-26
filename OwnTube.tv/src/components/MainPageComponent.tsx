import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import VideoCategoryPreviewComponent from './VideoCategoryPreviewComponent';
import { Video } from './VideoTypes';


interface MainPageProps {
  videos: Video[];
}

const MainPageComponent: React.FC<MainPageProps> = ({ videos }) => {
  return (
    <View style={styles.mainPageContainer}>
      <Image
         source={{ uri: 'https://example.com/owntube-logo.png' }}
          style={styles.logo}
      />
      <Text style={styles.heading}>Main Page</Text>
      <VideoCategoryPreviewComponent videos={videos} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainPageContainer: {
    flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 20,
      width: '100%',
      backgroundColor: '#1e1e1e', 
    },
    heading: {
      color: '#ffffff', 
     fontSize: 28, 
     fontWeight: '800', 
     marginBottom: 30, 
     textTransform: 'uppercase', 
     letterSpacing: 2, 
    },
    logo: {
      width: 120,
      height: 120,
      marginBottom: 40,
      borderRadius: 60, 
    },
});


export default MainPageComponent;