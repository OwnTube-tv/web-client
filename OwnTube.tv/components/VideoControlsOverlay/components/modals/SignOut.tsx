import { ModalContainer } from "../../../ModalContainer";
import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";
import { StyleSheet, View } from "react-native";
import { Button } from "../../../shared";
import { spacing } from "../../../../theme";
import { useTranslation } from "react-i18next";
import { useGlobalSearchParams } from "expo-router";
import { RootStackParams } from "../../../../app/_layout";
import { ROUTES } from "../../../../types";
import { useAppConfigContext } from "../../../../contexts";
import { useGetInstanceInfoQuery } from "../../../../api";
import { useAuthSessionStore } from "../../../../store";

export const SignOutModal = ({ handleClose }: { handleClose: () => void }) => {
  const { t } = useTranslation();
  const { backend } = useGlobalSearchParams<RootStackParams[ROUTES.INDEX]>();
  const { removeSession } = useAuthSessionStore();
  const { currentInstanceConfig } = useAppConfigContext();
  const { data: instanceInfo } = useGetInstanceInfoQuery(backend);

  return (
    <Animated.View entering={SlideInUp} exiting={SlideOutUp} style={styles.modalWrapper} pointerEvents="box-none">
      <ModalContainer
        onClose={handleClose}
        title={t("signOutPermanently", {
          appName: currentInstanceConfig?.customizations?.pageTitle || instanceInfo?.name,
        })}
      >
        <View style={styles.modalContentContainer}>
          <Button onPress={handleClose} text={t("cancel")} />
          <Button
            contrast="high"
            text={t("confirm")}
            onPress={() => {
              handleClose();
              removeSession(backend);
            }}
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
