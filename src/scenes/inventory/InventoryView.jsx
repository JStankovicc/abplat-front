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
    Category as CategoryIcon,
    ShoppingCart as OrderIcon,
    LocalShipping as SupplierIcon,
    AssignmentReturn as ReturnsIcon,
    BarChart as AnalyticsIcon
} from "@mui/icons-material";
import MobileMenu from "../../components/inventory/MobileMenu";

import DashboardSection from "../../components/inventory/DashboardSection";
import StockTrackingSection from "../../components/inventory/StockTrackingSection";
import CategoriesSection from "../../components/inventory/CategoriesSection";
import OrdersSection from "../../components/inventory/OrdersSection";
import SuppliersSection from "../../components/inventory/SuppliersSection";
import ReturnsSection from "../../components/inventory/ReturnsSection";
import AnalyticsSection from "../../components/inventory/AnalyticsSection";

const sections = [
    { id: "dashboard", label: "Dashboard", icon: <DashboardIcon />, component: <DashboardSection /> },
    { id: "stock", label: "Stanje", icon: <InventoryIcon />, component: <StockTrackingSection /> },
    { id: "categories", label: "Kategorije", icon: <CategoryIcon />, component: <CategoriesSection /> },
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
                {!isMobile ? (
                    <Tabs
                        value={activeSection}
                        onChange={(e, newValue) => setActiveSection(newValue)}
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
                ) : (
                    <IconButton
                        size="small"
                        onClick={() => setMobileMenuOpen(true)}
                        sx={{ color: colors.grey[100] }}
                    >
                        <MenuIcon />
                    </IconButton>
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
                onClose={() => setMobileMenuOpen(false)}
                sections={sections}
                activeSection={activeSection}
                onChangeSection={setActiveSection}
                colors={colors}
            />
        </Box>
    );
};

export default InventoryView; 