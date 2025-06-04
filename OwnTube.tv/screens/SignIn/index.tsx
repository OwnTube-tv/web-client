import { Platform, Pressable, StyleSheet, View } from "react-native";
import { Button, Input, QrCodeLinkModal, Separator, Typography } from "../../components";
import { useTranslation } from "react-i18next";
import { useGetInstanceInfoQuery, useGetInstanceServerConfigQuery } from "../../api";
import { useAppConfigContext, useFullScreenModalContext } from "../../contexts";
import { Link, useFocusEffect, useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ROUTES } from "../../types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { borderRadius, spacing } from "../../theme";
import { Spacer } from "../../components/shared/Spacer";
import { useTheme } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SignInFormLoader } from "../../components/loaders/SignInFormLoader";
import { useCallback } from "react";

const signInFormValidationSchema = z.object({
  username: z.string().trim().min(1, "requiredField"),
  password: z.string().trim().min(1, "requiredField"),
});

export const SignIn = () => {
  const { t } = useTranslation();
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.SIGNIN]>();
  const { colors } = useTheme();

  const { data: instanceInfo, isLoading: isLoadingInstanceInfo } = useGetInstanceInfoQuery(backend);
  const { data: instanceServerConfig, isLoading: isLoadingInstanceServerConfig } = useGetInstanceServerConfigQuery({
    hostname: backend,
  });
  const { currentInstanceConfig } = useAppConfigContext();
  const { top } = useSafeAreaInsets();
  const { toggleModal, setContent } = useFullScreenModalContext();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onTouched",
    resolver: zodResolver(signInFormValidationSchema),
  });

  useFocusEffect(
    useCallback(() => {
      return () => {
        reset();
      };
    }, []),
  );

  const handleSignIn = (formValues: z.infer<typeof signInFormValidationSchema>) => {
    console.info(formValues);
  };

  const resetPwdHref = `https://${backend}/login`;
  const signUpHref = `https://${backend}/signup`;

  const isLoading = isLoadingInstanceInfo || isLoadingInstanceServerConfig;

  return (
    <View style={[{ paddingTop: spacing.xxxl + top }, styles.container]}>
      {isLoading ? (
        <SignInFormLoader />
      ) : (
        <>
          <Typography fontWeight="ExtraBold" fontSize="sizeXL" style={styles.textAlignCenter}>
            {t("signInToApp", { appName: currentInstanceConfig?.customizations?.pageTitle || instanceInfo?.name })}
          </Typography>
          <Spacer height={spacing.xxl} />
          <Controller
            name="username"
            control={control}
            render={({ field, fieldState }) => {
              return (
                <Input
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  autoComplete="email"
                  variant="default"
                  placeholder={t("email")}
                  placeholderTextColor={colors.themeDesaturated500}
                  error={fieldState.error?.message && t(fieldState.error?.message)}
                />
              );
            }}
          />
          <Spacer height={spacing.xl} />
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => {
              return (
                <Input
                  secureTextEntry
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  autoComplete="current-password"
                  variant="default"
                  placeholder={t("password")}
                  placeholderTextColor={colors.themeDesaturated500}
                  error={fieldState.error?.message && t(fieldState.error?.message)}
                />
              );
            }}
          />
          <Spacer height={spacing.xl} />
          <Button onPress={handleSubmit(handleSignIn)} style={styles.height48} contrast="high" text={t("signIn")} />
          <Spacer height={spacing.xl} />
          <View style={styles.alignItemsCenter}>
            <Typography
              style={styles.textAlignCenter}
              fontSize="sizeXS"
              fontWeight="Medium"
              color={colors.themeDesaturated500}
            >
              {t("forgotPassword")}
            </Typography>
            {Platform.isTV ? (
              <Pressable
                onPress={() => {
                  toggleModal(true);
                  setContent(<QrCodeLinkModal link={resetPwdHref} />);
                }}
                style={({ focused }) => ({
                  borderWidth: focused ? 2 : 0,
                  margin: focused ? -2 : 0,
                  borderRadius: borderRadius.radiusSm,
                })}
              >
                <Typography
                  style={[{ color: colors.theme500 }, styles.textAlignCenter]}
                  fontSize="sizeXS"
                  fontWeight="Medium"
                >
                  {resetPwdHref}
                </Typography>
              </Pressable>
            ) : (
              <Link target="_blank" rel="noreferrer noopener" href={{ pathname: resetPwdHref }}>
                <Typography
                  style={[{ color: colors.theme500 }, styles.textAlignCenter]}
                  fontSize="sizeXS"
                  fontWeight="Medium"
                >
                  {resetPwdHref}
                </Typography>
              </Link>
            )}
            {instanceServerConfig?.signup.allowed && (
              <>
                <Spacer height={spacing.xl} />
                <Separator />
                <Spacer height={spacing.xl} />
                <Typography
                  style={styles.textAlignCenter}
                  fontSize="sizeXS"
                  fontWeight="Medium"
                  color={colors.themeDesaturated500}
                >
                  {t("noAccountCreateOne")}
                </Typography>
                {Platform.isTV ? (
                  <Pressable
                    style={({ focused }) => ({
                      borderWidth: focused ? 2 : 0,
                      margin: focused ? -2 : 0,
                      borderRadius: borderRadius.radiusSm,
                    })}
                    onPress={() => {
                      toggleModal(true);
                      setContent(<QrCodeLinkModal link={signUpHref} />);
                    }}
                  >
                    <Typography
                      style={[{ color: colors.theme500 }, styles.textAlignCenter]}
                      fontSize="sizeXS"
                      fontWeight="Medium"
                    >
                      {signUpHref}
                    </Typography>
                  </Pressable>
                ) : (
                  <Link target="_blank" rel="noreferrer noopener" href={{ pathname: signUpHref }}>
                    <Typography
                      style={[{ color: colors.theme500 }, styles.textAlignCenter]}
                      fontSize="sizeXS"
                      fontWeight="Medium"
                    >
                      {signUpHref}
                    </Typography>
                  </Link>
                )}
              </>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  alignItemsCenter: { alignItems: "center" },
  container: { alignSelf: "center", flex: 1, maxWidth: 320, width: "100%" },
  height48: { height: 48 },
  textAlignCenter: { textAlign: "center" },
});
