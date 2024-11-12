import { Pressable } from "react-native";
import { Typography } from "./Typography";
import { useTranslation } from "react-i18next";
import { useTheme } from "@react-navigation/native";

interface ErrorTextWithRetryProps {
  errorText: string;
  refetch?: () => void;
}

export const ErrorTextWithRetry = ({ errorText, refetch }: ErrorTextWithRetryProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Typography fontSize="sizeSm" fontWeight="Medium" color={colors.themeDesaturated500}>
      {errorText}{" "}
      <Pressable
        onPress={refetch}
        style={({ focused }) => ({
          borderWidth: focused ? 2 : 0,
          borderColor: colors.theme950,
          padding: focused ? 0 : 2,
        })}
      >
        <Typography
          fontSize="sizeSm"
          fontWeight="Medium"
          color={colors.themeDesaturated500}
          style={{ textDecorationLine: "underline" }}
        >
          {t("retryQuestion")}
        </Typography>
      </Pressable>
    </Typography>
  );
};
