import { Platform } from "react-native";
import { Link } from "expo-router";
import { ExpoRouter } from "expo-router/types/expo-router";
import { PropsWithChildren } from "react";

export const ExternalLink = (
  props: PropsWithChildren<Omit<ExpoRouter.LinkProps, "href"> & { absoluteHref: string }>,
) => {
  return (
    <>
      {Platform.select({
        web: (
          <a target={props.target} rel={props.rel} href={props.absoluteHref} style={{ textDecoration: "none" }}>
            {props.children}
          </a>
        ),
        default: <Link {...props} href={{ pathname: props.absoluteHref }} />,
      })}
    </>
  );
};
