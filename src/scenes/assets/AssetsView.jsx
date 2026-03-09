import { useState } from "react";
import {
    Box,
    Tabs,
    Tab,
    Typography,
    useTheme,
    useMediaQuery,
    IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import InventoryIcon from "@mui/icons-material/Inventory";
import BusinessIcon from "@mui/icons-material/Business";
import { tokens } from "../../theme";
import MovingAssets from "../../components/assets/moving";
import NonMovingAssets from "../../components/assets/NonMovingAssets";
import AssetDashboard from "../../components/assets/AssetDashboard";
import MobileMenu from "../../components/common/MobileMenu";

const sections = [
    { id: 0, label: "Pregled", icon: <DashboardOutlinedIcon />, component: <AssetDashboard />, disabled: true },
    { id: 1, label: "Pokretna imovina", icon: <InventoryIcon />, component: <MovingAssets />, disabled: false },
    { id: 2, label: "Nepokretna imovina", icon: <BusinessIcon />, component: <NonMovingAssets />, disabled: true },
];

const AssetsView = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [activeSection, setActiveSection] = useState(1);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleSectionChange = (event, newValue) => {
        if (typeof newValue === "number" && sections[newValue]?.disabled) return;
        setActiveSection(typeof newValue === "number" ? newValue : newValue);
        setMobileOpen(false);
    };

    const handleMobileSectionChange = (sectionId) => {
        if (sections[sectionId]?.disabled) return;
        setActiveSection(sectionId);
        setMobileOpen(false);
    };

    return (
        <Box 
            sx={{ 
                height: { md: "calc(100vh - 74px)" },
                minHeight: { xs: "calc(100vh - 56px)", md: "calc(100vh - 74px)" },
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                p: { xs: 1, sm: "10px" }
            }}
        >
            {/* Header with navigation */}
            <Box 
                sx={{
                    backgroundColor: colors.primary[400],
                    borderRadius: "4px",
                    p: { xs: "8px 8px", sm: "2px 10px" },
                    boxShadow: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    minHeight: "25px",
                    flexWrap: "wrap",
                    gap: 1,
                }}
            >
                <Box display="flex" alignItems="center" gap={1}>
                    {isMobile && (
                        <IconButton size="small" onClick={() => setMobileOpen(true)} sx={{ color: colors.grey[100] }}>
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography
                        variant="h5"
                        color={colors.grey[100]}
                        sx={{ fontSize: { xs: "1rem", sm: "1.1rem" }, fontWeight: "bold", lineHeight: 1 }}
                    >
                        Upravljanje imovinom
                    </Typography>
                </Box>
                {!isMobile && (
                    <Tabs
                        value={activeSection}
                        onChange={handleSectionChange}
                        textColor="inherit"
                        sx={{
                            minHeight: "25px",
                            "& .MuiTabs-indicator": { backgroundColor: colors.greenAccent[500], height: 2 },
                            "& .MuiTabs-flexContainer": { flexWrap: "wrap" },
                        }}
                    >
                        {sections.map((section) => (
                            <Tab
                                key={section.id}
                                label={section.label}
                                disabled={section.disabled}
                                sx={{
                                    minWidth: { sm: 80, md: 100 },
                                    minHeight: "25px",
                                    color: colors.grey[100],
                                    opacity: section.disabled ? 0.6 : 1,
                                    "&.Mui-selected": { color: colors.greenAccent[500] },
                                }}
                            />
                        ))}
                    </Tabs>
                )}
            </Box>

            <MobileMenu
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                sections={sections}
                activeSection={activeSection}
                onChangeSection={handleMobileSectionChange}
                colors={colors}
                anchor="right"
                showCloseButton
            />

            {/* Main content area */}
            <Box
                sx={{
                    flex: 1,
                    backgroundColor: colors.primary[400],
                    borderRadius: "4px",
                    p: { xs: 1.5, sm: 2, md: "20px" },
                    overflow: "auto",
                    boxShadow: 1,
                    minHeight: 0,
                }}
            >
                {sections[activeSection].component}
            </Box>
        </Box>
    );
};

export default AssetsView; 