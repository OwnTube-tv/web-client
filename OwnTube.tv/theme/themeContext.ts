import { createContext } from "react";
import theme from "./theme";

const themeContext = createContext(theme.light);

export default themeContext;
