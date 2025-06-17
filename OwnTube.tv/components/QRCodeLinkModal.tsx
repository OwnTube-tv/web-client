import { StyleSheet, View } from "react-native";
import { ModalContainer } from "./ModalContainer";
import { QRCodeSection } from "./QRCodeSection";
import { useTranslation } from "react-i18next";
import { useFullScreenModalContext } from "../contexts";
import { Typography } from "./Typography";
import { Spacer } from "./shared/Spacer";

interface QRCodeLinkModalProps {
  link: string;
}

export const QrCodeLinkModal = ({ link }: QRCodeLinkModalProps) => {
  const { t } = useTranslation();
  const { toggleModal } = useFullScreenModalContext();

  return (
    <View style={styles.qrCodeContainer}>
      <ModalContainer
        showCloseButton
        containerStyle={{ maxWidth: 350 }}
        onClose={() => toggleModal(false)}
        title={t("qrCodeForURL")}
      >
        <Typography>{link}</Typography>
        <Spacer height={16} />
        <QRCodeSection link={link} />
      </ModalContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  qrCodeContainer: { alignItems: "center", flex: 1, justifyContent: "center" },
});
