// src/scenes/project/ProjectView.jsx
import { useState, useEffect } from "react";
import {
    Box,
    IconButton,
    useTheme,
    useMediaQuery,
    Tabs,
    Tab,
    Typography
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
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

// Premesti sections definiciju u komponentu da može da koristi state

// API konstante
const API_BASE_URL = "http://localhost:8080/api/v1/project";

// Helper funkcija za auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
};

const ProjectView = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:900px)");
    const [activeSection, setActiveSection] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [projectInfo, setProjectInfo] = useState({ name: "Projekat", description: "", note: "" });
    const [noteValue, setNoteValue] = useState("");
    const [noteLoading, setNoteLoading] = useState(false);
    const { projectId } = useParams();

    // API funkcije
    const fetchProjectInfo = async () => {
        try {
            if (!projectId) {
                console.error('Nema projectId u URL-u');
                return;
            }

            const response = await axios.get(`${API_BASE_URL}/${projectId}`, {
                headers: getAuthHeaders()
            });

            setProjectInfo(response.data);
            setNoteValue(response.data.note || "");
        } catch (error) {
            console.error('Failed to fetch project info:', error);
            // Zadržavamo default naziv ako API poziv ne uspe
        }
    };

    const updateProjectNote = async (newNote) => {
        try {
            setNoteLoading(true);
            await axios.put(`${API_BASE_URL}/updateNote`, {
                id: projectInfo.id,
                note: newNote
            }, {
                headers: getAuthHeaders()
            });
            setProjectInfo(prev => ({ ...prev, note: newNote }));
        } catch (error) {
            console.error('Failed to update project note:', error);
            // Vrati na prethodnu vrednost ako API poziv ne uspe
            setNoteValue(projectInfo.note || "");
        } finally {
            setNoteLoading(false);
        }
    };

    const handleNoteChange = (newNote) => {
        setNoteValue(newNote);
        // Debounce API poziv
        clearTimeout(window.noteTimeout);
        window.noteTimeout = setTimeout(() => {
            if (newNote !== projectInfo.note) {
                updateProjectNote(newNote);
            }
        }, 1000); // 1 sekunda delay
    };

    // useEffect za inicijalno učitavanje
    useEffect(() => {
        fetchProjectInfo();
    }, [projectId]);

    // Definiši sections unutar komponente da može da koristi state
    const sections = [
        { id: 0, label: "Pregled", icon: <DashboardIcon />, component: <OverviewSection noteValue={noteValue} onNoteChange={handleNoteChange} noteLoading={noteLoading} />, disabled: false },
        { id: 1, label: "Kanban", icon: <KanbanIcon />, component: <KanbanBoard />, disabled: false },
        { id: 2, label: "Timeline", icon: <TimelineIcon />, component: <TimelineSection />, disabled: true },
        { id: 3, label: "Podaci", icon: <DataIcon />, component: <DataSection />, disabled: true },
        { id: 4, label: "Kalendar", icon: <CalendarIcon />, component: <ProjectCalendar />, disabled: false },
    ];

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
                    title={projectInfo.description || ""}
                >
                    {projectInfo.name || "Projekat"}
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