import { Link, useGlobalSearchParams } from "expo-router";
import { FC, useState } from "react";
import { Typography } from "./Typography";
import { useTheme } from "@react-navigation/native";
import { useHoverState } from "../hooks";
import { Linking, Pressable, View, StyleSheet, Platform, PressableProps } from "react-native";
import { LinkProps } from "expo-router/build/link/Link";
import Animated, { SlideOutUp, FadeOut } from "react-native-reanimated";
import { useFullScreenModalContext } from "../contexts";
import { SlideInUp } from "react-native-reanimated";
import { ModalContainer } from "./ModalContainer";
import { spacing } from "../theme";
import { useTranslation } from "react-i18next";
import { Button } from "./shared";
import { QrCodeLinkModal } from "./QRCodeLinkModal";
import Constants from "expo-constants";

interface ChannelLinkProps extends PressableProps {
  href: LinkProps["href"];
  text: string;
  sourceLink: string;
  enableOnTV?: boolean;
  color?: string;
}

export const ChannelLink: FC<ChannelLinkProps> = ({
  href,
  text,
  sourceLink,
  enableOnTV = false,
  color,
  ...restPressableProps
}) => {
  const { colors } = useTheme();
  const { isHovered, toggleHovered } = useHoverState();
  const [focused, setFocused] = useState(false);
  const { backend: urlBackend } = useGlobalSearchParams<{ backend: string }>();
  const { toggleModal, setContent } = useFullScreenModalContext();
  const { t } = useTranslation();

  const handleNavigationConfirmation = () => {
    toggleModal(true);
    setContent(
      <Animated.View
        entering={SlideInUp}
        exiting={Platform.isTV ? FadeOut : SlideOutUp}
        style={styles.animatedContainer}
        pointerEvents="box-none"
      >
        <ModalContainer
          containerStyle={{ maxWidth: 350 }}
          onClose={() => toggleModal(false)}
          title={t("channelNotSupported", { channelName: text, appName: Constants.expoConfig?.name })}
        >
          <View style={styles.buttonContainer}>
            <Button onPress={() => toggleModal(false)} text={t("cancel")} />
            <Button
              contrast="high"
              text={t("confirm")}
              onPress={() => {
                if (Platform.isTV) {
                  setContent(<QrCodeLinkModal link={sourceLink} />);
                  return;
                }

                toggleModal(false);
                Linking.openURL(sourceLink);
              }}
            />
          </View>
        </ModalContainer>
      </Animated.View>,
    );
  };

  const hasBackendMismatch =
    typeof href === "object" && href.params?.backend && urlBackend && href.params.backend !== urlBackend;

  const handlePress = () => {
    if (hasBackendMismatch) {
      handleNavigationConfirmation();
      return;
    }
  };

  const pressableContent = () => (
    <Pressable
      focusable={enableOnTV}
      isTVSelectable={enableOnTV}
      onHoverIn={toggleHovered}
      onHoverOut={toggleHovered}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPress={handlePress}
      {...restPressableProps}
    >
      <Typography
        style={[styles.typography, { textDecorationLine: isHovered || focused ? "underline" : undefined }]}
        fontSize="sizeSm"
        fontWeight="Medium"
        color={color || colors.themeDesaturated500}
        numberOfLines={enableOnTV && Platform.isTV ? 1 : undefined}
      >
        {text}
      </Typography>
    </Pressable>
  );

  if (!hasBackendMismatch) {
    return (
      <Link href={href} asChild>
        {pressableContent()}
      </Link>
    );
  }

  return <>{pressableContent()}</>;
};

const styles = StyleSheet.create({
  animatedContainer: { alignItems: "center", flex: 1, justifyContent: "center" },
  buttonContainer: { flexDirection: "row", gap: spacing.lg, justifyContent: "flex-end" },
  typography: { width: "100%", ...(Platform.isTVOS ? { padding: 0 } : {}) },
});
