import useTheme from "./useTheme";

const useThemedStyles = (styles) => {
  const theme = useTheme();
  return styles(theme);
};

export default useThemedStyles;
