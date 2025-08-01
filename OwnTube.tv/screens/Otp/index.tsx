import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, FormComponent, Input, Typography } from "../../components";
import { useMutationState } from "@tanstack/react-query";
import { MUTATION_KEYS, useGetMyUserInfoQuery, useLoginWithUsernameAndPasswordMutation } from "../../api";
import { Keyboard, Platform, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { LoginRequestArgs } from "../../api/models";
import { useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { spacing } from "../../theme";
import { Spacer } from "../../components/shared/Spacer";
import { ROUTES } from "../../types";
import { RootStackParams } from "../../app/_layout";
import { parseAuthSessionData } from "../../utils/auth";
import { useAuthSessionStore } from "../../store";
import { useCustomDiagnosticsEvents } from "../../diagnostics/useCustomDiagnosticEvents";
import { CustomPostHogEvents } from "../../diagnostics/constants";

const otpValidationSchema = z.object({
  otp: z.string().trim().min(1, "requiredField"),
});

export const Otp = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.OTP]>();
  const { addSession, selectSession, updateSession } = useAuthSessionStore();
  const { refetch: getUserInfo, isFetching: isGettingUserInfo, isError: isUserInfoError } = useGetMyUserInfoQuery();

  const { control, handleSubmit, reset, formState } = useForm({
    values: {
      otp: "",
    },
    mode: "onTouched",
    resolver: zodResolver(otpValidationSchema),
  });
  const {
    mutateAsync: sendOtp,
    isError: isOtpError,
    isPending: isSendingOtp,
    reset: resetSendOtp,
  } = useLoginWithUsernameAndPasswordMutation();
  const { captureDiagnosticsEvent } = useCustomDiagnosticsEvents();

  useFocusEffect(
    useCallback(() => {
      if (formState.isSubmitSuccessful) {
        reset();
      }

      return () => {
        reset();
        resetSendOtp();
      };
    }, [formState.isSubmitSuccessful]),
  );

  const loginMutationsState = useMutationState({
    filters: {
      mutationKey: [MUTATION_KEYS.login],
    },
    select: (mutation) => mutation.state.variables as LoginRequestArgs,
  });

  const handleSendOtp = async (formValues: z.infer<typeof otpValidationSchema>) => {
    const latestLoginMutation = loginMutationsState.at(-1);

    if (latestLoginMutation) {
      const loginResponse = await sendOtp({ ...latestLoginMutation, otp: formValues.otp });

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

        captureDiagnosticsEvent(CustomPostHogEvents.Login, { backend });
        router.navigate({ pathname: ROUTES.HOME, params: { backend } });
      }
    }
  };

  return (
    <FormComponent
      style={{ paddingTop: spacing.xxxl + top, ...styles.container }}
      onSubmit={handleSubmit(handleSendOtp)}
    >
      <View>
        <Typography fontWeight="ExtraBold" fontSize="sizeXL" style={styles.textAlignCenter}>
          {t("twoFactorAuth")}
        </Typography>
        <Spacer height={spacing.xxl} />
        <Typography
          fontWeight="Medium"
          fontSize="sizeSm"
          style={styles.textAlignCenter}
          color={colors.themeDesaturated500}
        >
          {t("check2ndFactor")}
        </Typography>
        <Spacer height={spacing.xl} />
        <Controller
          name="otp"
          control={control}
          render={({ field, fieldState }) => {
            return (
              <Input
                autoFocus
                autoCorrect={false}
                autoCapitalize="none"
                value={field.value}
                keyboardType={"numeric"}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                autoComplete="sms-otp"
                variant="default"
                placeholder={t("verificationCode")}
                placeholderTextColor={colors.themeDesaturated500}
                error={fieldState.error?.message && t(fieldState.error?.message)}
                enterKeyHint="send"
              />
            );
          }}
        />
        <Spacer height={spacing.xl} />
        {Platform.OS === "web" && <button type="submit" style={{ display: "none" }} />}
        {(isOtpError || isUserInfoError) && (
          <>
            <Typography style={styles.textAlignCenter} fontSize="sizeXS" color={colors.error500}>
              {t("invalidOtp")}
            </Typography>
            <Spacer height={spacing.xl} />
          </>
        )}
        <Button
          disabled={isSendingOtp || isGettingUserInfo}
          onPress={() => {
            Keyboard.dismiss();
            handleSubmit(handleSendOtp)();
          }}
          style={styles.height48}
          contrast="high"
          text={t("verify")}
        />
        <Spacer height={spacing.md} />
        <Button
          onPress={() => {
            router.navigate({ pathname: ROUTES.HOME, params: { backend } });
          }}
          style={styles.height48}
          contrast="none"
          text={t("cancel")}
        />
      </View>
    </FormComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    flex: 1,
    maxWidth: 320,
    width: "100%",
  },
  height48: { height: 48 },
  textAlignCenter: { textAlign: "center" },
});
