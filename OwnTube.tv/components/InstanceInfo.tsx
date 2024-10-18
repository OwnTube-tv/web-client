import { spacing } from "../theme";
import { StyleSheet, View } from "react-native";
import { Typography } from "./Typography";
import { useTheme } from "@react-navigation/native";
import { useGetInstanceInfoQuery } from "../api";
import { useMemo } from "react";
import { InstanceLogo } from "./InstanceLogo";

interface InstanceInfoProps {
  backend?: string;
  showText?: boolean;
}

export const InstanceInfo = ({ backend, showText = true }: InstanceInfoProps) => {
  const { colors } = useTheme();
  const { data } = useGetInstanceInfoQuery(backend);

  const logoSrc = useMemo(() => {
    return data?.avatars?.[0] ? `https://${backend}${data?.avatars[0]?.path}` : "";
  }, [data, backend]);

  return (
    <View
      style={[
        styles.container,
        {
          justifyContent: !showText ? "center" : undefined,
          paddingBottom: !showText ? spacing.md : undefined,
        },
      ]}
    >
      <InstanceLogo logoUrl={logoSrc} size={32} />
      {showText && (
        <Typography fontSize="sizeSm" fontWeight="SemiBold" color={colors.theme950} numberOfLines={1}>
          {data?.name}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", flexDirection: "row", gap: spacing.md },
});
