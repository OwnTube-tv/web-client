import { createContext, FC, PropsWithChildren, useContext, useState } from "react";

const FullScreenModalContext = createContext<{
  isOpen: boolean;
  toggleModal: (newValue: boolean) => void;
  content?: JSX.Element;
  setContent: (newContent: JSX.Element) => void;
  handleModalClose?: () => void;
  setHandleModalClose?: (fn: () => void) => void;
}>({
  isOpen: false,
  toggleModal: () => {},
  setContent: () => {},
});

export const FullScreenModalContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [content, setContent] = useState<JSX.Element>();
  const [isOpen, setIsOpen] = useState(false);
  const [handleModalClose, setHandleModalClose] = useState<() => void | undefined>();

  return (
    <FullScreenModalContext.Provider
      value={{
        isOpen,
        toggleModal: (newValue: boolean) => {
          setIsOpen(newValue);
          if (!newValue) {
            setContent(undefined);
            setHandleModalClose(undefined);
          }
        },
        content,
        setContent: (newContent: JSX.Element) => setContent(newContent),
        handleModalClose,
        setHandleModalClose,
      }}
    >
      {children}
    </FullScreenModalContext.Provider>
  );
};

export const useFullScreenModalContext = () => useContext(FullScreenModalContext);
