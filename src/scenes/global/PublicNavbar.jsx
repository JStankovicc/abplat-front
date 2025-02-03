import React, { useContext } from "react";
import { Box, Button, IconButton, useTheme } from "@mui/material";
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

const PublicNavbar = () => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={2}
            sx={{
                backgroundColor: theme.palette.background.default,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1201,
                width: '90%',
                marginLeft: '5%',
                marginRight: '5%',
                boxSizing: 'border-box',
                overflow: 'hidden'
            }}
        >
            {/* Logo - left */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
            >
                <img
                    src={
                        theme.palette.mode === "dark"
                            ? "../../assets/ABPlatLogoInline.png"
                            : "../../assets/ABPlatLogoInlineDark.png"
                    }
                    alt="ABPlat"
                    style={{height: "25px", cursor: "pointer"}}
                />

            </Box>

            {/* Navigation - center */}
            <Box display="flex" gap={2}>
                <Button color="inherit" href="/">Početna</Button>
                <Button color="inherit" href="/product">Proizvod</Button>
                <Button color="inherit" href="/contact">Kontakt</Button>
            </Box>

            {/* Theme toggle and login button - right */}
            <Box display="flex" gap={2}>
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === "dark" ? (
                        <DarkModeOutlinedIcon />
                    ) : (
                        <LightModeOutlinedIcon />
                    )}
                </IconButton>

                <Button color="inherit" href="/login" sx={{ minWidth: 'auto' }}>
                    Uloguj se
                </Button>
            </Box>
        </Box>
    );
};

export default PublicNavbar;
