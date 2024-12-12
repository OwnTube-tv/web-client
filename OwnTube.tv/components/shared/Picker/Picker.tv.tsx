import { PickerSelectProps } from "react-native-picker-select";
import { Pressable, StyleSheet, View } from "react-native";
import { useCallback, useRef, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { borderRadius, spacing } from "../../../theme";
import { Typography } from "../../Typography";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Spacer } from "../Spacer";
import TVFocusGuideHelper from "../../helpers/TVFocusGuideHelper";

const ITEM_HEIGHT = 48;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Picker = (props: PickerSelectProps) => {
  const { colors } = useTheme();
  const isExpandedSV = useSharedValue<number>(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isExpandButtonFocused, setIsExpandButtonFocused] = useState(false);
  const expandButtonRef = useRef<View | null>(null);
  const firstItemRef = useRef<View | null>(null);

  const renderListItem = useCallback(
    ({ item, index }: { item: PickerSelectProps["items"][number]; index: number }) => {
      const isSelected = props.value === item.value;

      return (
        <Pressable
          ref={index === 0 ? firstItemRef : undefined}
          onPress={() => {
            props.onValueChange(item.value, index);
            isExpandedSV.value = 0;
            expandButtonRef.current?.requestTVFocus();
          }}
          style={({ focused }) => [
            styles.listItemContainer,
            {
              backgroundColor: colors.theme100,
              borderColor: colors.theme900,
              padding: focused ? 0 : -2,
              paddingLeft: styles.listItemContainer.paddingLeft - (focused ? 2 : 0),
              paddingRight: spacing.sm - (focused ? 2 : 0),
              borderWidth: focused ? 2 : 0,
            },
          ]}
        >
          <Typography>{item.label}</Typography>
          {isSelected && <Ionicons name="checkmark" size={24} color={colors.theme900} />}
        </Pressable>
      );
    },
    [props],
  );

  const animatedFlatListStyle = useAnimatedStyle(() => ({
    left: withTiming(isExpandedSV.value ? -containerWidth : containerWidth),
    height: withTiming(
      isExpandedSV.value ? ITEM_HEIGHT * (props.items.length > 3 ? 3.5 : props.items.length) : ITEM_HEIGHT,
    ),
  }));

  const animatedExpandButtonStyle = useAnimatedStyle(() => ({
    left: withTiming(isExpandedSV.value ? -containerWidth : 0),
  }));

  return (
    <View
      style={{ flexDirection: "row", width: "100%" }}
      onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
    >
      <AnimatedPressable
        ref={expandButtonRef}
        onPress={() => {
          isExpandedSV.value = 1;
          firstItemRef.current?.requestTVFocus();
        }}
        onFocus={() => setIsExpandButtonFocused(true)}
        onBlur={() => setIsExpandButtonFocused(false)}
        style={[
          styles.listItemContainer,
          {
            backgroundColor: colors.theme100,
            borderColor: colors.theme900,
            padding: isExpandButtonFocused ? 0 : -2,
            paddingLeft: styles.listItemContainer.paddingLeft - (isExpandButtonFocused ? 2 : 0),
            paddingRight: spacing.sm - (isExpandButtonFocused ? 2 : 0),
            borderWidth: isExpandButtonFocused ? 2 : 0,
            width: "100%",
          },
          animatedExpandButtonStyle,
        ]}
      >
        <Typography>{props.items.find(({ value }) => value === props.value)?.label}</Typography>
        <Ionicons color={colors.theme900} name="chevron-forward" size={24} />
      </AnimatedPressable>
      <TVFocusGuideHelper trapFocusUp trapFocusDown trapFocusLeft>
        <Animated.FlatList
          data={props.items}
          renderItem={renderListItem}
          style={[animatedFlatListStyle, { width: containerWidth }]}
          ItemSeparatorComponent={() => <Spacer height={spacing.sm} />}
        />
      </TVFocusGuideHelper>
    </View>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    alignItems: "center",
    borderRadius: borderRadius.radiusMd,
    borderWidth: 1,
    flexDirection: "row",
    height: ITEM_HEIGHT,
    justifyContent: "space-between",
    paddingLeft: spacing.lg,
  },
});

export default Picker;
