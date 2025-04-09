// src/scenes/project/ProjectView.jsx
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
    ViewKanban as KanbanIcon,
    Timeline as TimelineIcon,
    TableChart as DataIcon,
    CalendarMonth as CalendarIcon
} from "@mui/icons-material";
import OverviewSection from "../../components/project/OverviewSection";
import KanbanBoard from "../../components/project/KanbanBoard";
import TimelineSection from "../../components/project/TimelineSection";
import DataSection from "../../components/project/DataSection";
import ProjectCalendar from "../../components/project/ProjectCalendar";
import MobileMenu from "../../components/project/MobileMenu";

const sections = [
    { id: 0, label: "Pregled", icon: <DashboardIcon />, component: <OverviewSection /> },
    { id: 1, label: "Kanban", icon: <KanbanIcon />, component: <KanbanBoard /> },
    { id: 2, label: "Timeline", icon: <TimelineIcon />, component: <TimelineSection /> },
    { id: 3, label: "Podaci", icon: <DataIcon />, component: <DataSection /> },
    { id: 4, label: "Kalendar", icon: <CalendarIcon />, component: <ProjectCalendar /> },
];

const ProjectView = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:900px)");
    const [activeSection, setActiveSection] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleSectionChange = (event, newValue) => {
        setActiveSection(newValue);
        setMobileOpen(false);
    };

    return (
        <Box 
            sx={{ 
                height: "calc(100vh - 74px)", // 64px je visina topbara
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                p: "10px"
            }}
        >
            {/* Header with Navigation */}
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
                    Projekat X
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

export default ProjectView;