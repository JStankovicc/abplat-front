import { createContext, useContext, useState } from "react";

const MobileSidebarContext = createContext({
  open: false,
  setOpen: () => {},
});

export const useMobileSidebar = () => useContext(MobileSidebarContext);

export const MobileSidebarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <MobileSidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </MobileSidebarContext.Provider>
  );
};
