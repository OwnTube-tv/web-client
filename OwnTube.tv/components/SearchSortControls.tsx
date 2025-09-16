import { useTranslation } from "react-i18next";
import { View, Platform } from "react-native";
import { Typography } from "./Typography";
import { VideosSearchQuery } from "@peertube/peertube-types";
import { Separator } from "./shared";
import { spacing } from "../theme";
import { RadioButton } from "./RadioButton";
import { Spacer } from "./shared/Spacer";
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";
import { useEffect } from "react";
import { useBreakpoints } from "../hooks";

interface SearchSortControlsProps {
  sort: VideosSearchQuery["sort"];
  setSort: (sort: VideosSearchQuery["sort"]) => void;
  isExpanded: boolean;
}

export const SearchSortControls = ({ sort, setSort, isExpanded }: SearchSortControlsProps) => {
  const { t } = useTranslation();
  const breakpoints = useBreakpoints();

  const sortOptions = [
    { label: t("relevance"), value: "-match" },
    { label: t("publishDateNewest"), value: "-publishedAt" },
    { label: t("publishDateOldest"), value: "publishedAt" },
    { label: t("viewsSortKey"), value: "-views" },
  ];
  const isExpandedSV = useSharedValue(isExpanded ? 1 : 0);
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpandedSV.value), {
      duration: 300,
    }),
  );

  const animatedContainerStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
    opacity: withTiming(isExpandedSV.value ? 1 : 0, { duration: 300 }),
  }));

  useEffect(() => {
    isExpandedSV.value = isExpanded ? 1 : 0;
  }, [isExpanded]);

  return (
    <Animated.View style={animatedContainerStyle}>
      <View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={{ height: Platform.OS !== "web" ? 150 : undefined }}
      >
        <Spacer height={spacing.xl} />
        <Typography fontSize="sizeSm" fontWeight="Bold">
          {t("sortBy")}
        </Typography>
        <Spacer height={spacing.lg} />
        <View
          style={{
            flexDirection: "row",
            alignItems: breakpoints.isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            gap: spacing.sm,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: spacing.xl,
              flex: 1,
              flexWrap: breakpoints.isMobile ? "wrap" : "nowrap",
            }}
          >
            {sortOptions.map((option) => (
              <RadioButton
                key={option.value}
                selected={sort === option.value}
                onPress={() => setSort(option.value)}
                label={option.label}
              />
            ))}
          </View>
        </View>
        <Spacer height={spacing.lg} />
        <Separator />
      </View>
    </Animated.View>
  );
};
