import { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import Toast from "react-native-toast-message";
import { Typography } from "./Typography";

const TAP_LIMIT = 10;
const RESET_TIMEOUT = 5_000;

export const ClickableHeaderText = (props: PropsWithChildren) => {
  const [tapCount, setTapCount] = useState(0);
  const counterRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (tapCount >= TAP_LIMIT) {
      Toast.show({ type: "buildInfo", visibilityTime: 10_000 });
    }
  }, [tapCount]);

  useEffect(() => {
    if (counterRef.current) {
      clearTimeout(counterRef.current);
    }

    if (tapCount) {
      counterRef.current = setTimeout(() => {
        setTapCount(0);
      }, RESET_TIMEOUT);
    }

    return () => clearTimeout(counterRef.current);
  }, [tapCount]);

  const onIncreaseCount = useCallback(() => {
    if (tapCount >= TAP_LIMIT) {
      return;
    }

    setTapCount((prevValue) => prevValue + 1);
  }, [tapCount]);

  return <Typography onPress={onIncreaseCount}>{props.children}</Typography>;
};
