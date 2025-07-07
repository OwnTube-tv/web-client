import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import { FlatList, Platform, StyleSheet, View, ViewStyle } from "react-native";
import { spacing } from "../../theme";
import { VideoGridCardLoader } from "../loaders";
import { VideoGridCard } from "../VideoGridCard";
import { VideoGridProps } from "./VideoGrid";
import { TVActionCard, TVActionCardProps } from "../TVActionCard";
import { useBreakpoints } from "../../hooks";
import { GetVideosVideo } from "../../api/models";

export interface VideoGridContentHandle {
  focusLastItem: () => void;
}

interface VideoGridContentProps extends Pick<VideoGridProps, "data" | "variant"> {
  isLoading?: boolean;
  backend?: string;
  tvActionCardProps: Omit<TVActionCardProps, "width"> & { isHidden?: boolean };
  scrollable?: boolean;
}

export const VideoGridContent = forwardRef<VideoGridContentHandle, VideoGridContentProps>(
  ({ isLoading, data = [], variant, backend, tvActionCardProps, scrollable = false }, ref) => {
    const [containerWidth, setContainerWidth] = useState(0);
    const lastItemRef = useRef<View>(null);

    const breakpoints = useBreakpoints();
    const numColumns = useMemo(() => {
      return breakpoints.isMobile ? 1 : breakpoints.isTablet ? 2 : Platform.isTV ? 4 : 3;
    }, [breakpoints]);

    const columnWidth = useMemo(() => {
      return (containerWidth - (numColumns - 1) * spacing.xl) / numColumns;
    }, [containerWidth, numColumns]);

    useImperativeHandle(ref, () => ({
      focusLastItem: () => {
        lastItemRef.current?.requestTVFocus?.();
      },
    }));

    const isTVActionCardVisible = Platform.isTV && !isLoading && !tvActionCardProps.isHidden;
    const isHorizontalScrollingEnabled = scrollable && breakpoints.isMobile;

    const listData = useMemo(() => {
      const numItemsToAdd = numColumns - (data.length % numColumns);
      if (numItemsToAdd > 0 && Platform.OS !== "web" && !isHorizontalScrollingEnabled) {
        return data.concat(
          [...Array(numItemsToAdd)].map(
            (_, index) =>
              ({
                isEmptyItemForListSpacing: true,
                isReservedForTVActionCard: isTVActionCardVisible && index === 0,
              }) as unknown as GetVideosVideo,
          ),
        );
      }

      return data;
    }, [data, numColumns, isTVActionCardVisible, isHorizontalScrollingEnabled]);

    const renderVerticalListItem = useCallback(
      ({ item: card, index }: { item: (typeof listData)[number]; index: number }) => {
        const isLastItem = index === data.length - 1;

        if (card.isEmptyItemForListSpacing) {
          if (card.isReservedForTVActionCard) {
            return <TVActionCard width={columnWidth} {...tvActionCardProps} />;
          }

          return <View pointerEvents="none" key={`empty-item-${index}`} style={styles.gridItemNonWeb} />;
        }

        return (
          <View
            key={card.uuid}
            style={{
              ...styles.gridItemNonWeb,
              ...(Platform.isTV
                ? {
                    width: columnWidth,
                    flex: 0,
                  }
                : {}),
            }}
          >
            <VideoGridCard
              ref={isLastItem ? lastItemRef : undefined}
              backend={variant === "history" && "backend" in card ? card.backend : backend}
              video={card}
            />
          </View>
        );
      },
      [columnWidth, tvActionCardProps, variant, backend, data.length],
    );

    const renderHorizontalListItem = useCallback(
      ({ item: card }: { item: (typeof listData)[number] }) => {
        return (
          <View key={card.uuid} style={styles.horizontalCard}>
            <VideoGridCard backend={variant === "history" && "backend" in card ? card.backend : backend} video={card} />
          </View>
        );
      },
      [variant, backend],
    );

    const handleLayout = useCallback((e: { nativeEvent: { layout: { width: number } } }) => {
      setContainerWidth(e.nativeEvent.layout.width);
    }, []);

    return (
      <View
        style={Platform.select<ViewStyle>({
          web: { $$css: true, _: `grid-container${isHorizontalScrollingEnabled ? "-scrollable" : ""}` },
          default: { ...styles.gridContainerNonWeb, flexWrap: isHorizontalScrollingEnabled ? "nowrap" : "wrap" },
        })}
        onLayout={isHorizontalScrollingEnabled ? undefined : handleLayout}
      >
        {isLoading ? (
          [...Array(4)].map((_, index) => (
            <View
              key={index}
              style={Platform.select<ViewStyle>({
                web: styles.loaderGridItemWeb,
                native: { ...styles.loaderGridItemNonWeb, width: isHorizontalScrollingEnabled ? 277 : columnWidth },
              })}
            >
              <VideoGridCardLoader />
            </View>
          ))
        ) : Platform.OS === "web" ? (
          data.map((video, index) => {
            const isLastItem = index === data.length - 1;
            return (
              <View key={video.uuid} style={styles.gridItemWeb}>
                <VideoGridCard
                  ref={isLastItem ? lastItemRef : undefined}
                  backend={variant === "history" && "backend" in video ? video.backend : backend}
                  video={video}
                />
              </View>
            );
          })
        ) : (
          <FlatList
            showsHorizontalScrollIndicator={false}
            removeClippedSubviews={false}
            disableVirtualization
            key={numColumns}
            numColumns={isHorizontalScrollingEnabled ? undefined : numColumns}
            data={listData}
            columnWrapperStyle={numColumns > 1 && !isHorizontalScrollingEnabled ? styles.listColumnWrapper : undefined}
            style={styles.gapXL}
            contentContainerStyle={styles.gapXL}
            renderItem={isHorizontalScrollingEnabled ? renderHorizontalListItem : renderVerticalListItem}
            horizontal={isHorizontalScrollingEnabled}
          />
        )}
      </View>
    );
  },
);

VideoGridContent.displayName = "VideoGridContent";

const styles = StyleSheet.create({
  gapXL: { gap: spacing.xl },
  gridContainerNonWeb: {
    alignItems: "flex-start",
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xl,
  },
  gridItemNonWeb: {
    alignSelf: "flex-start",
    flex: 1,
  },
  gridItemWeb: { flex: 1, width: "auto" },
  horizontalCard: { width: 277 },
  listColumnWrapper: { gap: spacing.xl, minWidth: "100%" },
  loaderGridItemNonWeb: {
    aspectRatio: 1.145,
    flexDirection: "row",
    flex: 0,
    justifyContent: "flex-start",
    maxHeight: "100%",
    maxWidth: "100%",
    width: "100%",
  },
  loaderGridItemWeb: { height: "100%", minHeight: 314 },
});
