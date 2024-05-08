import { ScrollView, View } from "react-native";
import { Header, VideoListComponent } from "../../components";
import { styles } from "./styles";
import React from "react";

export const HomeScreen = () => (
  <ScrollView>
    <View style={styles.container}>
      <Header />
      <VideoListComponent />
    </View>
  </ScrollView>
);
