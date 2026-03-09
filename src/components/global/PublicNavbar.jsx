import React, { useState } from "react";
import { Box, Button, IconButton, Drawer, useTheme, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const PublicNavbar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [drawerOpen, setDrawerOpen] = useState(false);

    const navLinks = (
        <>
            <Button color="inherit" href="/" onClick={() => setDrawerOpen(false)} sx={{ display: "block", width: "100%", textAlign: "left", py: 1.5, justifyContent: "flex-start" }}>
                Početna
            </Button>
            <Button color="inherit" href="/login" onClick={() => setDrawerOpen(false)} sx={{ display: "block", width: "100%", textAlign: "left", py: 1.5, justifyContent: "flex-start" }}>
                Uloguj se
            </Button>
        </>
    );

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={{ xs: 1.5, sm: 2 }}
            sx={{
                backgroundColor: theme.palette.background.default,
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1201,
                width: { xs: "100%", sm: "90%" },
                marginLeft: { xs: 0, sm: "5%" },
                marginRight: { xs: 0, sm: "5%" },
                boxSizing: "border-box",
                overflow: "hidden",
                paddingLeft: { xs: "max(16px, env(safe-area-inset-left))", sm: 2 },
                paddingRight: { xs: "max(16px, env(safe-area-inset-right))", sm: 2 },
            }}
        >
            <Box display="flex" alignItems="center" sx={{ minHeight: 40 }}>
                <img
                    src={theme.palette.mode === "dark" ? "/assets/ABPlatLogoInline.png" : "/assets/ABPlatLogoInlineDark.png"}
                    alt="ABPlat"
                    style={{ height: isMobile ? "22px" : "25px", cursor: "pointer" }}
                />
            </Box>

            {isMobile ? (
                <>
                    <IconButton color="inherit" onClick={() => setDrawerOpen(true)} aria-label="Meni" sx={{ ml: "auto" }}>
                        <MenuIcon />
                    </IconButton>
                    <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} sx={{ "& .MuiDrawer-paper": { width: "min(280px, 85vw)", pt: 2 } }}>
                        <IconButton onClick={() => setDrawerOpen(false)} sx={{ position: "absolute", top: 8, right: 8 }}>
                            <CloseIcon />
                        </IconButton>
                        <Box display="flex" flexDirection="column" gap={0} px={2} pt={4}>
                            {navLinks}
                        </Box>
                    </Drawer>
                </>
            ) : (
                <Box display="flex" gap={2}>
                    <Button color="inherit" href="/">Početna</Button>
                    <Button color="inherit" href="/login" sx={{ minWidth: "auto" }}>Uloguj se</Button>
                </Box>
            )}
        </Box>
    );
};

export default PublicNavbar;
