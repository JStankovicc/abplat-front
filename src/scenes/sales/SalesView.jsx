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
    People as ContactsIcon,
    AccountTree as PipelineIcon,
    Timeline as AnalyticsIcon,
    CalendarMonth as CalendarIcon
} from "@mui/icons-material";
import ContactTable from "../../components/sales/ContactTable";
import PipelineBoard from "../../components/sales/PipelineBoard";
import SalesCalendar from "../../components/sales/SalesCalendar";
import SalesAnalytics from "../../components/sales/SalesAnalytics";
import MobileMenu from "../../components/sales/MobileMenu";

const sections = [
    { id: 0, label: "Kontakti", icon: <ContactsIcon />, component: <ContactTable />, disabled: false },
    { id: 1, label: "Pipeline", icon: <PipelineIcon />, component: <PipelineBoard />, disabled: false },
    { id: 2, label: "Kalendar", icon: <CalendarIcon />, component: <SalesCalendar />, disabled: true },
    { id: 3, label: "Analitika", icon: <AnalyticsIcon />, component: <SalesAnalytics />, disabled: true },
];

const SalesView = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:900px)");
    const [activeSection, setActiveSection] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleSectionChange = (event, newValue) => {
        const selectedSection = sections.find(section => section.id === newValue);
        if (selectedSection && selectedSection.disabled) {
            return; // Sprečava prebacivanje na onemogućenu sekciju
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
                    Prodaja
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
                                    color: section.disabled ? colors.grey[500] : colors.grey[100],
                                    opacity: section.disabled ? 0.6 : 1,
                                    cursor: section.disabled ? 'not-allowed' : 'pointer',
                                    '&.Mui-selected': {
                                        color: colors.greenAccent[500],
                                    },
                                    '&.Mui-disabled': {
                                        color: colors.grey[500],
                                        opacity: 0.6
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
                onChangeSection={(sectionId) => {
                    const selectedSection = sections.find(section => section.id === sectionId);
                    if (selectedSection && selectedSection.disabled) {
                        return; // Sprečava prebacivanje na onemogućenu sekciju u mobilnom meniju
                    }
                    setActiveSection(sectionId);
                }}
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

export default SalesView; 