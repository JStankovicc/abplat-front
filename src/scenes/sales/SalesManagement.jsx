import { useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Grid,
    useTheme,
    useMediaQuery
} from "@mui/material";
import { tokens } from "../../theme";

const SalesManagement = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:768px)");

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
            {/* Header */}
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
            </Box>

            {/* Glavni sadržaj */}
            <Box
                sx={{
                    flex: 1,
                    backgroundColor: colors.primary[400],
                    borderRadius: "4px",
                    p: "20px",
                    overflow: "auto",
                    boxShadow: 1
                }}
            >
                <Grid container spacing={2}>
                    {/* Ovde će biti dodate komponente za upravljanje prodajom */}
                    <Grid item xs={12}>
                        <Paper
                            sx={{
                                p: 2,
                                backgroundColor: colors.primary[600],
                                color: colors.grey[100]
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Upravljanje prodajom
                            </Typography>
                            <Typography variant="body1">
                                Ova sekcija će sadržati funkcionalnosti za upravljanje prodajom, uključujući:
                            </Typography>
                            <ul>
                                <li>Upravljanje prodajnim timom</li>
                                <li>Definisanje ciljeva prodaje</li>
                                <li>Podešavanje strategija prodaje</li>
                                <li>Upravljanje cenama i popustima</li>
                            </ul>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default SalesManagement; 