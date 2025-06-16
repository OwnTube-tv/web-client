import { useTranslation } from "react-i18next";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { RootStackParams } from "../app/_layout";
import { ROUTES } from "../types";
import { useAuthSessionStore } from "../store";
import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";
import { ModalContainer } from "./ModalContainer";
import { View, StyleSheet } from "react-native";
import { Button } from "./shared";
import { spacing } from "../theme";

export const SignedOutModal = ({ handleClose }: { handleClose: () => Promise<void> }) => {
  const { t } = useTranslation();
  const { backend } = useGlobalSearchParams<RootStackParams[ROUTES.INDEX]>();
  const { session } = useAuthSessionStore();
  const router = useRouter();

  const handleSignInAgain = async () => {
    await handleClose();
    router.navigate({ pathname: ROUTES.SIGNIN, params: { backend, username: session?.email } });
  };

  return (
    <Animated.View entering={SlideInUp} exiting={SlideOutUp} style={styles.modalWrapper} pointerEvents="box-none">
      <ModalContainer containerStyle={{ width: 328 }} onClose={handleClose} title={t("signedOut")}>
        <View style={styles.modalContentContainer}>
          <Button
            contrast="high"
            style={{ width: "100%", height: 48 }}
            onPress={handleSignInAgain}
            text={t("signInAgain")}
          />
        </View>
      </ModalContainer>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modalContentContainer: { flexDirection: "row", gap: spacing.lg, justifyContent: "flex-end" },
  modalWrapper: { alignItems: "center", flex: 1, justifyContent: "center" },
});
