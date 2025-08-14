import { useState } from "react";
import {
    Box,
    Tabs,
    Tab,
    Typography,
    useTheme
} from "@mui/material";
import { tokens } from "../../theme";
import MovingAssets from "../../components/assets/MovingAssets";
import NonMovingAssets from "../../components/assets/NonMovingAssets";
import AssetDashboard from "../../components/assets/AssetDashboard";

const sections = [
    { id: 0, label: "Pregled", component: <AssetDashboard /> },
    { id: 1, label: "Pokretna imovina", component: <MovingAssets /> },
    { id: 2, label: "Nepokretna imovina", component: <NonMovingAssets /> },
];

const AssetsView = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [activeSection, setActiveSection] = useState(0);

    const handleSectionChange = (event, newValue) => {
        setActiveSection(newValue);
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
                    Upravljanje imovinom
                </Typography>
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
                            label={section.label}
                            sx={{
                                minWidth: 100,
                                minHeight: "25px",
                                color: colors.grey[100],
                                '&.Mui-selected': {
                                    color: colors.greenAccent[500],
                                }
                            }}
                        />
                    ))}
                </Tabs>
            </Box>

            {/* Glavni sadržaj */}
            <Box
                sx={{
                    flex: 1,
                    backgroundColor: colors.primary[400],
                    borderRadius: "4px",
                    p: "20px",
                    overflow: "auto",
                    boxShadow: 1,
                    minHeight: 0
                }}
            >
                {sections[activeSection].component}
            </Box>
        </Box>
    );
};

export default AssetsView; 