import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { Typography } from "./Typography";
import { borderRadius, spacing } from "../theme";
import { useTheme } from "@react-navigation/native";
import { forwardRef, PropsWithChildren, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import TVFocusGuideHelper from "./helpers/TVFocusGuideHelper";

const urlSymbolsSet = {
  chars: [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ],
  symbols: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_", "~", "/"],
};

const symbolSets = {
  url: urlSymbolsSet,
};

const Key = forwardRef<
  View,
  PropsWithChildren<
    {
      onKeyPress: () => void;
    } & TouchableOpacityProps
  >
>(({ onKeyPress, children, nextFocusRight, nextFocusLeft, nextFocusUp }, ref) => {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={1}
      ref={ref}
      style={{
        alignItems: "center",
        justifyContent: "center",
        borderRadius: borderRadius.radiusSm,
        paddingHorizontal: spacing.xs - (focused ? 2 : 0),
        paddingVertical: focused ? -2 : 0,
        minWidth: spacing.xl,
        backgroundColor: colors.theme200,
        position: "relative",
        zIndex: focused ? 1 : 0,
        borderWidth: focused ? 2 : 0,
        borderColor: colors.theme950,
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPress={onKeyPress}
      nextFocusRight={nextFocusRight}
      nextFocusLeft={nextFocusLeft}
      nextFocusUp={nextFocusUp}
    >
      {children}
    </TouchableOpacity>
  );
});
Key.displayName = "Key";

interface TvKeyboardProps {
  mode?: "url";
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  nextFocusUp: number | undefined;
}

export const TvKeyboard = ({ mode = "url", onKeyPress, onBackspace, nextFocusUp }: TvKeyboardProps) => {
  const { colors } = useTheme();

  const [keyboardMode, setKeyboardMode] = useState<"chars" | "symbols">("chars");
  const symbolsKeyRef = useRef(null);
  const backspaceKeyRef = useRef(null);

  return (
    <TVFocusGuideHelper autoFocus trapFocusRight trapFocusLeft style={styles.container}>
      <Key
        onKeyPress={() =>
          setKeyboardMode((prev) => {
            return prev === "chars" ? "symbols" : "chars";
          })
        }
        ref={symbolsKeyRef}
        nextFocusLeft={backspaceKeyRef?.current}
        nextFocusUp={nextFocusUp}
      >
        <Typography color={colors.theme950}>{"123-/~"}</Typography>
      </Key>
      {symbolSets[mode][keyboardMode].map((char, idx) => (
        <Key onKeyPress={() => onKeyPress(char)} key={idx} nextFocusUp={nextFocusUp}>
          <Typography color={colors.theme950}>{char}</Typography>
        </Key>
      ))}
      <Key onKeyPress={() => onKeyPress(".")} nextFocusUp={nextFocusUp}>
        <Typography color={colors.theme950}>{"."}</Typography>
      </Key>
      <Key
        nextFocusUp={nextFocusUp}
        nextFocusRight={symbolsKeyRef?.current}
        ref={backspaceKeyRef}
        onKeyPress={onBackspace}
      >
        <Ionicons name="backspace" size={spacing.lg} color={colors.theme950} />
      </Key>
    </TVFocusGuideHelper>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: spacing.xs, height: spacing.xl, justifyContent: "center", width: "100%" },
});
