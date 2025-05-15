import { useState } from "react";
import {
    Box,
    IconButton,
    useTheme,
    useMediaQuery,
    Tabs,
    Tab,
    Typography
} from "@mui/material";
import { tokens } from "../../theme";
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Inventory as InventoryIcon,
    ShoppingCart as OrderIcon,
    LocalShipping as SupplierIcon,
    AssignmentReturn as ReturnsIcon,
    BarChart as AnalyticsIcon
} from "@mui/icons-material";
import MobileMenu from "../../components/inventory/MobileMenu";

import DashboardSection from "../../components/inventory/DashboardSection";
import StockTrackingSection from "../../components/inventory/StockTrackingSection";
import OrdersSection from "../../components/inventory/OrdersSection";
import SuppliersSection from "../../components/inventory/SuppliersSection";
import ReturnsSection from "../../components/inventory/ReturnsSection";
import AnalyticsSection from "../../components/inventory/AnalyticsSection";

const sections = [
    { id: "dashboard", label: "Pregled", icon: <DashboardIcon />, component: <DashboardSection /> },
    { id: "stock", label: "Stanje", icon: <InventoryIcon />, component: <StockTrackingSection /> },
    { id: "orders", label: "Porudžbine", icon: <OrderIcon />, component: <OrdersSection /> },
    { id: "suppliers", label: "Dobavljači", icon: <SupplierIcon />, component: <SuppliersSection /> },
    { id: "returns", label: "Povrati", icon: <ReturnsIcon />, component: <ReturnsSection /> },
    { id: "analytics", label: "Analitika", icon: <AnalyticsIcon />, component: <AnalyticsSection /> },
];

const InventoryView = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [activeSection, setActiveSection] = useState("dashboard");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSectionChange = (event, newValue) => {
        setActiveSection(newValue);
    };

    const handleMobileMenuToggle = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <Box 
            sx={{ 
                height: "calc(100vh - 74px)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                p: "10px"
            }}
        >
            {/* Header sa navigacijom */}
            <Box 
                sx={{
                    backgroundColor: colors.primary[400],
                    borderRadius: "4px",
                    p: "2px 10px",
                    boxShadow: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    minHeight: "25px"
                }}
            >
                <Typography
                    variant="h5"
                    color={colors.grey[100]}
                    sx={{ 
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        lineHeight: 1
                    }}
                >
                    Upravljanje Inventarom
                </Typography>
                {isMobile ? (
                    <IconButton
                        size="small"
                        onClick={handleMobileMenuToggle}
                        sx={{ color: colors.grey[100] }}
                    >
                        <MenuIcon />
                    </IconButton>
                ) : (
                    <Tabs
                        value={activeSection}
                        onChange={handleSectionChange}
                        textColor="inherit"
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            minHeight: "25px",
                            '& .MuiTabs-indicator': {
                                backgroundColor: colors.greenAccent[500],
                                height: 2
                            }
                        }}
                    >
                        {sections.map((section) => (
                            <Tab
                                key={section.id}
                                value={section.id}
                                label={section.label}
                                icon={section.icon}
                                iconPosition="start"
                                sx={{
                                    minWidth: 100,
                                    minHeight: "25px",
                                    color: colors.grey[100],
                                    '&.Mui-selected': {
                                        color: colors.greenAccent[500],
                                    },
                                    '& .MuiTab-iconWrapper': {
                                        mr: 1,
                                        fontSize: "1rem"
                                    }
                                }}
                            />
                        ))}
                    </Tabs>
                )}
            </Box>

            {/* Glavni sadržaj */}
            <Box
                sx={(theme) => ({
                    flex: 1,
                    backgroundColor: colors.primary[400],
                    borderRadius: "4px",
                    p: "20px",
                    overflow: "auto",
                    boxShadow: 1,
                    minHeight: 0,
                    '& .MuiCardContent-root': {
                        backgroundColor: theme.palette.mode === 'dark' ? colors.primary[600] : colors.primary[800],
                        transition: 'all 0.3s ease'
                    },
                    '& .MuiPaper-root': {
                        backgroundColor: theme.palette.mode === 'dark' ? colors.primary[600] : colors.primary[800],
                        transition: 'all 0.3s ease',
                        '--Paper-shadow': 'none',
                        '--Paper-overlay': 'unset',
                        boxShadow: 'none'
                    },
                    '& .MuiCard-root': {
                        backgroundColor: theme.palette.mode === 'dark' ? colors.primary[600] : colors.primary[800],
                        transition: 'all 0.3s ease',
                        '--Paper-shadow': 'none',
                        '--Paper-overlay': 'unset',
                        boxShadow: 'none'
                    }
                })}
            >
                {sections.find((section) => section.id === activeSection)?.component}
            </Box>

            <MobileMenu
                open={mobileMenuOpen}
                onClose={handleMobileMenuToggle}
                sections={sections}
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
                colors={colors}
            />
        </Box>
    );
};

export default InventoryView; 