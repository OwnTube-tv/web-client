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
import { useCustomDiagnosticsEvents } from "../diagnostics/useCustomDiagnosticEvents";
import { CustomPostHogEvents } from "../diagnostics/constants";

export const SignedOutModal = ({ handleClose }: { handleClose: () => void }) => {
  const { t } = useTranslation();
  const { backend } = useGlobalSearchParams<RootStackParams[ROUTES.INDEX]>();
  const { session, removeSession } = useAuthSessionStore();
  const router = useRouter();
  const { captureDiagnosticsEvent } = useCustomDiagnosticsEvents();

  const handleSignInAgain = async () => {
    handleClose();
    await removeSession(backend);
    captureDiagnosticsEvent(CustomPostHogEvents.Reauthenticate, { backend });
    router.navigate({ pathname: ROUTES.SIGNIN, params: { backend, username: session?.email } });
  };

  const handleSignOut = () => {
    removeSession(backend);
    handleClose();
  };

  return (
    <Animated.View entering={SlideInUp} exiting={SlideOutUp} style={styles.modalWrapper} pointerEvents="box-none">
      <ModalContainer containerStyle={styles.modalContainer} onClose={handleClose} title={t("signedOut")}>
        <View style={styles.modalContentContainer}>
          <Button contrast="low" style={styles.button} onPress={handleSignOut} text={t("signOut")} />
          <Button contrast="high" style={styles.button} onPress={handleSignInAgain} text={t("signInAgain")} />
        </View>
      </ModalContainer>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: { flex: 1, height: 48 },
  modalContainer: { width: 328 },
  modalContentContainer: { flexDirection: "row", gap: spacing.lg, justifyContent: "flex-end" },
  modalWrapper: { alignItems: "center", flex: 1, justifyContent: "center" },
});
