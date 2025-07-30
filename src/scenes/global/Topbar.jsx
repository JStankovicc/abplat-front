import {Box, IconButton, useMediaQuery, useTheme} from "@mui/material";
import { useContext } from "react";
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

const Topbar = ({ companyInfo }) => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isMobile = useMediaQuery("(max-width:600px)");

  // Funkcija za konverziju byte array u base64 string
  const byteArrayToBase64 = (byteArray) => {
    if (!byteArray) return null;
    
    try {
      // Ako je već string, vrati ga direktno
      if (typeof byteArray === 'string') {
        return byteArray;
      }
      
      // Ako je array brojeva
      if (Array.isArray(byteArray)) {
        const binary = String.fromCharCode.apply(null, byteArray);
        return btoa(binary);
      }
      
      // Ako je Uint8Array ili slična struktura
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

  // Kreiranje URL-a za company logo
  const getCompanyLogoUrl = () => {
    if (companyInfo?.logoPic) {
      const base64String = byteArrayToBase64(companyInfo.logoPic);
      return `data:image/jpeg;base64,${base64String}`;
    }
    return "/assets/logoipsum-378.svg"; // fallback
  };

  if (isMobile) return null;

  return (
      <Box display="flex" justifyContent="space-between" p={2}>
        {/* Logo Section */}
        <Box display="flex" alignItems="center">
          <img
              src={getCompanyLogoUrl()}
              alt="Company Logo"
              style={{ height: "40px", marginRight: "10px" }}
          />
        </Box>

        {/* ICONS Section */}
        <Box display="flex">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
                <DarkModeOutlinedIcon />
            ) : (
                <LightModeOutlinedIcon />
            )}
          </IconButton>
          <IconButton>
            <NotificationsOutlinedIcon />
          </IconButton>
          <IconButton>
            <SettingsOutlinedIcon />
          </IconButton>
          <IconButton>
            <PersonOutlinedIcon />
          </IconButton>
        </Box>
      </Box>
  );
};

export default Topbar;