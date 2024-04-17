import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from "react-native";
import VideosByCategoryComponent from "./VideosByCategoryComponent";
import { MainPageProps } from "../VideoTypes"; // Ensure this import path is correct

const { width } = Dimensions.get("window");

const MainPageComponent: React.FC<MainPageProps> = ({ videos, categories }) => {
  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.mainPageContainer}>
      <View style={styles.logoContainer}>
        <Image
          source={{
            uri: "https://raw.githubusercontent.com/OwnTube-tv/web-client/993710bda5f5ba9eec50ca74d0ccc1f9d4d6134c/OwnTube.tv/assets/favicons/android-chrome-512x512.png",
          }}
          style={styles.logo}
        />
        <Text style={styles.logoText}>OwnTube</Text>
      </View>
      {categories.map((category) => (
        <VideosByCategoryComponent
          key={category.id}
          category={category}
          videos={videos.filter((video) => video.category.label === category.label)}
        />
      ))}
    </ScrollView>
  );
};

const COLOR_DARK = "#333";
const COLOR_WHITE = "#FFF";

const styles = StyleSheet.create({
  logo: {
    borderRadius: 2,
    height: width * 0.25,
    width: width * 0.25,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    color: COLOR_WHITE,
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 10,
  },
  mainPageContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 20,
    paddingTop: 20,
  },
  scrollContainer: {
    backgroundColor: COLOR_DARK,
    flex: 3,
  },
});

export default MainPageComponent;
