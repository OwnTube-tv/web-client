import { useTheme } from "@react-navigation/native";
import { PropsWithChildren, FC, useState } from "react";
import { ScrollView, View, StyleSheet, ViewStyle, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenProps extends PropsWithChildren {
  style?: ViewStyle;
  onRefresh?: () => Promise<void>;
}

export const Screen: FC<ScreenProps> = ({ children, style, onRefresh }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { right } = useSafeAreaInsets();
  const { colors } = useTheme();

  const handleRefresh = async () => {
    if (!onRefresh) return;

    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  return (
    <ScrollView
      refreshControl={
        onRefresh ? (
          <RefreshControl
            colors={[colors.theme500]}
            progressBackgroundColor={colors.theme900}
            tintColor={colors.theme900}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        ) : undefined
      }
    >
      <View style={[styles.container, { paddingRight: right }, style]}>{children}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
