import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext } from "../../theme";
import { useMobileSidebar } from "../../context/MobileSidebarContext";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

const Topbar = ({ companyInfo }) => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isMobile = useMediaQuery("(max-width:600px)");
  const { setOpen: setMobileSidebarOpen } = useMobileSidebar();

  const byteArrayToBase64 = (byteArray) => {
    if (!byteArray) return null;
    
    try {
      if (typeof byteArray === 'string') {
        return byteArray;
      }
      
      if (Array.isArray(byteArray)) {
        const binary = String.fromCharCode.apply(null, byteArray);
        return btoa(binary);
      }
      
      if (byteArray.constructor === Uint8Array || byteArray.buffer) {
        const binary = String.fromCharCode.apply(null, new Uint8Array(byteArray));
        return btoa(binary);
      }
      
      return null;
    } catch (error) {
      console.error('Error converting byte array to base64:', error, byteArray);
      return null;
    }
  };

  const getCompanyLogoUrl = () => {
    if (companyInfo?.logoPic) {
      const base64String = byteArrayToBase64(companyInfo.logoPic);
      return `data:image/jpeg;base64,${base64String}`;
    }
    return "/assets/logoipsum-378.svg";
  };

  if (isMobile) {
    return (
      <Box
        display="flex"
        alignItems="center"
        gap={0.5}
        px={1.5}
        py={1}
        sx={{
          minHeight: 56,
          flexShrink: 0,
          paddingLeft: "max(12px, env(safe-area-inset-left))",
        }}
      >
        <IconButton
          onClick={() => setMobileSidebarOpen(true)}
          aria-label="Otvori meni"
          sx={{
            minWidth: 44,
            minHeight: 44,
            p: 1,
            mr: 0.25,
          }}
        >
          <MenuOutlinedIcon sx={{ fontSize: 24 }} />
        </IconButton>
        <img
          src={getCompanyLogoUrl()}
          alt="Logo"
          style={{
            height: 26,
            maxWidth: 120,
            objectFit: "contain",
            objectPosition: "left center",
          }}
        />
      </Box>
    );
  }

  return (
      <Box display="flex" justifyContent="space-between" p={2}>
        <Box display="flex" alignItems="center">
          <img
              src={getCompanyLogoUrl()}
              alt="Company Logo"
              style={{ height: "40px", marginRight: "10px" }}
          />
        </Box>

        <Box display="flex">
          <IconButton onClick={colorMode.toggleColorMode} disabled>
            {theme.palette.mode === "dark" ? (
                <DarkModeOutlinedIcon />
            ) : (
                <LightModeOutlinedIcon />
            )}
          </IconButton>
          <IconButton disabled>
            <NotificationsOutlinedIcon />
          </IconButton>
          <IconButton disabled>
            <SettingsOutlinedIcon />
          </IconButton>
          <IconButton disabled>
            <PersonOutlinedIcon />
          </IconButton>
        </Box>
      </Box>
  );
};

export default Topbar;
