import { useState } from "react";

export const useHoverState = () => {
  const [isHovered, setIsHovered] = useState(false);
  const toggleHovered = () => {
    setIsHovered((prevState) => !prevState);
  };

  return { isHovered, toggleHovered, hoverHandlers: { onHoverIn: toggleHovered, onHoverOut: toggleHovered } };
};
