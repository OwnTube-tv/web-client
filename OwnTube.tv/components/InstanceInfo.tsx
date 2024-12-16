import { spacing } from "../theme";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Typography } from "./Typography";
import { useTheme } from "@react-navigation/native";
import { useGetInstanceInfoQuery } from "../api";
import { useMemo } from "react";
import { InstanceLogo } from "./InstanceLogo";
import { useInstanceConfig } from "../hooks";

interface InstanceInfoProps {
  backend?: string;
  showText?: boolean;
}

export const InstanceInfo = ({ backend, showText = true }: InstanceInfoProps) => {
  const { colors } = useTheme();
  const { data, isFetching } = useGetInstanceInfoQuery(backend);
  const { currentInstanceConfig } = useInstanceConfig();

  const logoSrc = useMemo(() => {
    return data?.avatars?.[0] ? `https://${backend}${data?.avatars[0]?.path}` : currentInstanceConfig?.logoUrl || "";
  }, [data, backend, currentInstanceConfig]);

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
      {isFetching ? <ActivityIndicator size={32} /> : <InstanceLogo logoUrl={logoSrc} size={32} />}
      {showText && (
        <>
          {isFetching ? (
            <ActivityIndicator size="small" />
          ) : (
            <Typography fontSize="sizeSm" fontWeight="SemiBold" color={colors.theme950} numberOfLines={1}>
              {data?.name}
            </Typography>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", flexDirection: "row", gap: spacing.md },
});
