import Head from "expo-router/head";
import { Platform, ScrollView, StyleSheet } from "react-native";
import { Button, Typography } from "../../components";
import { Link, useRouter } from "expo-router";
import { spacing } from "../../theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ROUTES } from "../../types";
import { Spacer } from "../../components/shared/Spacer";
import { colors } from "../../colors";

export default function privacy() {
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const handleBackButton = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate(ROUTES.HOME);
    }
  };

  return (
    <>
      {Platform.select({
        default: null,
        web: (
          <Head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width" />
            <title>Privacy Policy</title>
          </Head>
        ),
      })}
      <ScrollView style={{ padding: spacing.xl, paddingTop: top }}>
        {Platform.select({
          web: <Spacer height={spacing.xl} />,
          default: (
            <Button
              onPress={handleBackButton}
              contrast="high"
              icon="Arrow-Left"
              style={{ alignSelf: "flex-start", marginBottom: spacing.xl }}
            />
          ),
        })}
        <Typography fontWeight="Bold">Privacy Policy</Typography>
        <Typography>
          This privacy policy applies to this app (hereafter referred to as &#34;Application&#34;) for mobile/TV devices
          that is created by {process.env.EXPO_PUBLIC_PROVIDER_LEGAL_ENTITY || "OwnTube Nordic AB"} (hereafter referred
          to as &#34;Service Provider&#34;) as a free service. This service is provided &#34;AS IS&#34;.
        </Typography>
        <Typography>{"\n"}</Typography>
        <Typography fontWeight="Bold">What information does the Application obtain and how is it used?</Typography>
        <Typography>
          The Application does not collect, store, or process any personal data. No registration is required, and no
          analytics, tracking, or user profiling is performed.
        </Typography>
        <Typography>{"\n"}</Typography>
        <Typography fontWeight="Bold">
          Does the Application collect precise real-time location information of the device?
        </Typography>
        <Typography>This Application does not collect or use precise location data from your mobile device.</Typography>
        <Typography>{"\n"}</Typography>
        <Typography fontWeight="Bold">
          Do third parties see and/or have access to personal information obtained by the Application?
        </Typography>
        <Typography>
          Since the Application does not collect any personal information, no data is shared with third parties.
        </Typography>
        <Typography>{"\n"}</Typography>
        <Typography fontWeight="Bold">Children</Typography>
        <Typography>
          The Application is intended for users aged 13 and older. We do not knowingly collect any personal data from
          children under 13. If you believe a child has provided personal data, please contact us at{" "}
          <Link
            style={styles.link}
            href={`mailto:${process.env.EXPO_PUBLIC_PROVIDER_LEGAL_EMAIL || "legal@owntube.tv"}`}
          >
            {process.env.EXPO_PUBLIC_PROVIDER_LEGAL_EMAIL || "legal@owntube.tv"}
          </Link>{" "}
          so that we can take appropriate action.
        </Typography>
        <Typography>{"\n"}</Typography>
        <Typography fontWeight="Bold">Security</Typography>
        <Typography>
          Since the Application does not collect or store user data, there are no security risks related to personal
          information.
        </Typography>
        <Typography>{"\n"}</Typography>
        <Typography fontWeight="Bold">Changes</Typography>
        <Typography>
          This Privacy Policy may be updated from time to time for any reason. The Service Provider will notify you of
          any changes to this Privacy Policy by updating this page. You are advised to consult this Privacy Policy
          regularly for any updates, as continued use is deemed approval of all changes.
        </Typography>
        <Typography>{"\n"}</Typography>
        <Typography>This privacy policy is effective as of 2025-01-21</Typography>
        <Typography>{"\n"}</Typography>
        <Typography fontWeight="Bold">Contact Us</Typography>
        <Typography>
          If you have any questions regarding privacy while using the Application, please contact the Service Provider
          via email at{" "}
          <Link
            style={styles.link}
            href={`mailto:${process.env.EXPO_PUBLIC_PROVIDER_CONTACT_EMAIL || "hello@owntube.tv"}`}
          >
            {process.env.EXPO_PUBLIC_PROVIDER_CONTACT_EMAIL || "hello@owntube.tv"}
          </Link>
          .
        </Typography>
        <Spacer height={spacing.lg} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  link: { color: colors.blue, textDecorationLine: "underline" },
});
