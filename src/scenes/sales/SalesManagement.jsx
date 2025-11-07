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
    People as TeamIcon,
    Flag as GoalIcon,
    AccountTree as StrategyIcon,
    AttachMoney as PricingIcon,
    Analytics as AnalyticsIcon
} from "@mui/icons-material";
import TeamManagement from "../../components/sales-management/TeamManagement";
import GoalTracker from "../../components/sales-management/GoalTracker";
import StrategyConfig from "../../components/sales-management/StrategyConfig";
import PricingEngine from "../../components/sales-management/PricingEngine";
import UnifiedLeadsTable from "../../components/sales-management/UnifiedLeadsTable";
import PerformanceDashboard from "../../components/sales-management/PerformanceDashboard";
import PredictiveAnalytics from "../../components/sales-management/PredictiveAnalytics";
import MobileMenu from "../../components/sales-management/MobileMenu";

const sections = [
    { id: 0, label: "Tim", icon: <TeamIcon />, component: <TeamManagement />, disabled: false },
    { id: 1, label: "Ciljevi", icon: <GoalIcon />, component: <GoalTracker />, disabled: false },
    { id: 2, label: "Strategija", icon: <StrategyIcon />, component: <StrategyConfig />, disabled: false },
    { id: 3, label: "Cene", icon: <PricingIcon />, component: <PricingEngine />, disabled: false },
    { id: 4, label: "Kontakti", icon: <TeamIcon />, component: <UnifiedLeadsTable />, disabled: false },
    { id: 5, label: "Analitika", icon: <AnalyticsIcon />, component: <PerformanceDashboard />, disabled: false },
];

const SalesManagement = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:900px)");
    const [activeSection, setActiveSection] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleSectionChange = (event, newValue) => {
        // Proveri da li je sekcija onemogućena
        const selectedSection = sections.find(section => section.id === newValue);
        if (selectedSection && selectedSection.disabled) {
            return; // Ne menjaj aktivnu sekciju ako je onemogućena
        }
        
        setActiveSection(newValue);
        setMobileOpen(false);
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
                    Upravljanje prodajom
                </Typography>
                {!isMobile ? (
                    <Tabs
                        value={activeSection}
                        onChange={handleSectionChange}
                        textColor="inherit"
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
                                icon={section.icon}
                                label={section.label}
                                iconPosition="start"
                                disabled={section.disabled}
                                sx={{
                                    minWidth: 100,
                                    minHeight: "25px",
                                    color: section.disabled ? colors.grey[600] : colors.grey[100],
                                    '&.Mui-selected': {
                                        color: colors.greenAccent[500],
                                    },
                                    '&.Mui-disabled': {
                                        color: colors.grey[600],
                                        opacity: 0.5,
                                        cursor: 'not-allowed'
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
                        onClick={() => setMobileOpen(true)}
                        sx={{ color: colors.grey[100] }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}
            </Box>

            {/* Mobilni meni */}
            <MobileMenu
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                sections={sections}
                activeSection={activeSection}
                onChangeSection={(sectionId) => setActiveSection(sectionId)}
                colors={colors}
            />

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
                {sections[activeSection].component}
            </Box>
        </Box>
    );
};

export default SalesManagement; 