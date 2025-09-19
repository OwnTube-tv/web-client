import { StyleSheet } from "react-native";
import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";
import { ModalContainer } from "./ModalContainer";
import { FormComponent } from "./helpers";

import { useState } from "react";

import { useRouter } from "expo-router";
import { ROUTES } from "../types";
import { SearchInput } from "./SearchInput";
import { useTranslation } from "react-i18next";
import { useBreakpoints } from "../hooks";

export const SearchPopup = ({ handleClose, backend }: { handleClose: () => void; backend?: string }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();
  const router = useRouter();
  const breakpoints = useBreakpoints();
  const handleSubmit = () => {
    if (searchQuery.trim().length === 0) {
      return;
    }

    router.push({ pathname: `(home)/${ROUTES.SEARCH}`, params: { backend, searchQuery } });
    handleClose();
  };

  return (
    <Animated.View
      style={[styles.modalWrapper, { paddingTop: breakpoints.isMobile ? "25%" : "10%" }]}
      entering={SlideInUp}
      exiting={SlideOutUp}
      pointerEvents="box-none"
    >
      <ModalContainer showCloseButton onClose={handleClose} title={t("searchForVideos")}>
        <FormComponent
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <SearchInput
            autoFocus
            handleSubmit={handleSubmit}
            style={breakpoints.isMobile ? { width: 300 } : { width: 468 }}
            value={searchQuery}
            setValue={setSearchQuery}
          />
        </FormComponent>
      </ModalContainer>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modalWrapper: { alignItems: "center", flex: 1 },
});
