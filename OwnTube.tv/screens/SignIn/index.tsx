import { Keyboard, Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Button, FormComponent, Input, QrCodeLinkModal, Separator, Typography } from "../../components";
import { useTranslation } from "react-i18next";
import {
  useGetInstanceInfoQuery,
  useGetInstanceServerConfigQuery,
  useGetLoginPrerequisitesQuery,
  useGetMyUserInfoQuery,
  useLoginWithUsernameAndPasswordMutation,
} from "../../api";
import { useAppConfigContext, useFullScreenModalContext } from "../../contexts";
import { Link, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
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
import { useCallback, useRef } from "react";
import { useCustomFocusManager } from "../../hooks";
import { useAuthSessionStore } from "../../store";
import { parseAuthSessionData } from "../../utils/auth";
import { ServerErrorCodes, UserLoginResponse } from "../../api/models";

const signInFormValidationSchema = z.object({
  username: z.string().trim().min(1, "requiredField"),
  password: z.string().trim().min(1, "requiredField"),
});

export const SignIn = () => {
  const { t } = useTranslation();
  const { backend, username = "" } = useLocalSearchParams<RootStackParams[ROUTES.SIGNIN]>();
  const { colors } = useTheme();

  const { data: instanceInfo, isLoading: isLoadingInstanceInfo } = useGetInstanceInfoQuery(backend);
  const { data: instanceServerConfig, isLoading: isLoadingInstanceServerConfig } = useGetInstanceServerConfigQuery({
    hostname: backend,
  });
  const { data: loginPrerequisites, isLoading: isLoadingLoginPrerequisites } = useGetLoginPrerequisitesQuery();
  const {
    mutateAsync: login,
    isError: isLoginError,
    isPending: isLoggingIn,
    reset: resetLoginMutation,
  } = useLoginWithUsernameAndPasswordMutation();
  const { refetch: getUserInfo, isFetching: isGettingUserInfo, isError: isUserInfoError } = useGetMyUserInfoQuery();
  const { currentInstanceConfig } = useAppConfigContext();
  const { top } = useSafeAreaInsets();
  const { toggleModal, setContent } = useFullScreenModalContext();
  useCustomFocusManager();
  const { addSession, selectSession, updateSession } = useAuthSessionStore();
  const router = useRouter();

  const { control, handleSubmit, reset, formState } = useForm({
    values: {
      username,
      password: "",
    },
    mode: "onTouched",
    resolver: zodResolver(signInFormValidationSchema),
  });

  useFocusEffect(
    useCallback(() => {
      if (formState.isSubmitSuccessful) {
        reset();
      }

      return () => {
        reset();
        resetLoginMutation();
      };
    }, [formState.isSubmitSuccessful]),
  );

  const handleSignIn = async (formValues: z.infer<typeof signInFormValidationSchema>) => {
    if (loginPrerequisites) {
      let loginResponse: UserLoginResponse;

      try {
        loginResponse = await login({ loginPrerequisites, ...formValues });
      } catch (e) {
        const { code } = e as { code: string };

        if (code === ServerErrorCodes.MISSING_TWO_FACTOR) {
          router.navigate({ pathname: ROUTES.OTP, params: { backend } });
          return;
        }

        throw e;
      }

      const authSessionData = parseAuthSessionData(loginResponse, backend);

      if (loginResponse) {
        await addSession(backend, authSessionData);
        await selectSession(backend);

        const { data: userInfoResponse } = await getUserInfo();

        if (userInfoResponse) {
          await updateSession(backend, {
            userInfoUpdatedAt: new Date().toISOString(),
            userInfoResponse,
            email: userInfoResponse.email,
          });
        }

        router.navigate({ pathname: ROUTES.HOME, params: { backend } });
      }
    }
  };

  const resetPwdHref = `https://${backend}/login`;
  const signUpHref = `https://${backend}/signup`;

  const passwordFieldRef = useRef<TextInput | null>(null);

  const isLoading = isLoadingInstanceInfo || isLoadingInstanceServerConfig || isLoadingLoginPrerequisites;

  return (
    <FormComponent
      style={{ paddingTop: spacing.xxxl + top, ...styles.container }}
      onSubmit={handleSubmit(handleSignIn)}
    >
      {isLoading ? (
        <SignInFormLoader />
      ) : (
        <View>
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
                  autoFocus={!username}
                  autoCorrect={false}
                  autoCapitalize="none"
                  value={field.value}
                  keyboardType={Platform.OS !== "web" ? "email-address" : undefined}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  autoComplete="email"
                  variant="default"
                  placeholder={t("email")}
                  placeholderTextColor={colors.themeDesaturated500}
                  error={fieldState.error?.message && t(fieldState.error?.message)}
                  onSubmitEditing={() => {
                    passwordFieldRef.current?.focus?.();
                  }}
                  enterKeyHint="next"
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
                  autoFocus={!!username}
                  ref={passwordFieldRef}
                  autoCorrect={false}
                  value={field.value}
                  secureTextEntry
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                    handleSubmit(handleSignIn)();
                  }}
                  autoComplete="current-password"
                  variant="default"
                  placeholder={t("password")}
                  placeholderTextColor={colors.themeDesaturated500}
                  error={fieldState.error?.message && t(fieldState.error?.message)}
                  enterKeyHint="done"
                />
              );
            }}
          />
          <Spacer height={spacing.xl} />
          <Button
            disabled={isLoggingIn || isGettingUserInfo || isLoadingLoginPrerequisites}
            onPress={() => {
              Keyboard.dismiss();
              handleSubmit(handleSignIn)();
            }}
            style={styles.height48}
            contrast="high"
            text={t("signIn")}
          />
          {Platform.OS === "web" && <button type="submit" style={{ display: "none" }} />}
          <Spacer height={spacing.xl} />
          {(isLoginError || isUserInfoError) && (
            <>
              <Typography style={styles.textAlignCenter} fontSize="sizeXS" color={colors.error500}>
                {t("signInDataIncorrect")}
              </Typography>
              <Spacer height={spacing.xl} />
            </>
          )}
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
        </View>
      )}
    </FormComponent>
  );
};

const styles = StyleSheet.create({
  alignItemsCenter: { alignItems: "center" },
  container: {
    alignSelf: "center",
    flex: 1,
    maxWidth: 320,
    width: "100%",
  },
  height48: { height: 48 },
  textAlignCenter: { textAlign: "center" },
});
