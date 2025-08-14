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
    DirectionsCar as VehicleIcon,
    Person as DriverIcon,
    LocalGasStation as FuelIcon,
    Build as MaintenanceIcon,
    Warning as IncidentIcon,
    LocationOn as TrackingIcon
} from "@mui/icons-material";
import VehicleList from "../../components/fleet/VehicleList";
import DriverList from "../../components/fleet/DriverList";
import FuelTracking from "../../components/fleet/FuelTracking";
import MaintenanceTracking from "../../components/fleet/MaintenanceTracking";
import IncidentTracking from "../../components/fleet/IncidentTracking";
import VehicleTracking from "../../components/fleet/VehicleTracking";

const FleetView = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:900px)");
    const [activeSection, setActiveSection] = useState("vehicles");
    const [mobileOpen, setMobileOpen] = useState(false);

    const sections = [
        { id: "vehicles", label: "Vozila", icon: <VehicleIcon />, component: <VehicleList /> },
        { id: "drivers", label: "Vozači", icon: <DriverIcon />, component: <DriverList /> },
        { id: "fuel", label: "Gorivo", icon: <FuelIcon />, component: <FuelTracking /> },
        { id: "maintenance", label: "Održavanje", icon: <MaintenanceIcon />, component: <MaintenanceTracking /> },
        { id: "incidents", label: "Incidenti", icon: <IncidentIcon />, component: <IncidentTracking /> },
        { id: "tracking", label: "Praćenje", icon: <TrackingIcon />, component: <VehicleTracking /> }
    ];

    const handleSectionChange = (event, newValue) => {
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
                    Upravljanje voznim parkom
                </Typography>
                {!isMobile ? (
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
        </Box>
    );
};

export default FleetView; 