// src/components/project/OverviewSection.jsx
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import MyTasks from "./MyTasks";
import ProjectTimeline from "./ProjectTimeline";
import Notes from "./Notes";
import Notifications from "./Notifications";
import TimelineIcon from "@mui/icons-material/Timeline";
import NotificationsIcon from "@mui/icons-material/Notifications";

const OverviewSection = ({ noteValue, onNoteChange, noteLoading }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <MyTasks />
            </Grid>
            <Grid item xs={12} md={6}>
                {/* Vremenska linija - zamrznuta */}
                <Card sx={{ 
                    height: '100%',
                    backgroundColor: colors.primary[500],
                    opacity: 0.6,
                    cursor: 'not-allowed'
                }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <TimelineIcon sx={{ mr: 1, color: colors.grey[400] }} />
                            <Typography variant="h6" sx={{ color: colors.grey[400] }}>
                                Vremenska linija
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: colors.grey[500], fontStyle: 'italic' }}>
                            Funkcionalnost je trenutno u razvoju...
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
                <Notes 
                    note={noteValue}
                    onNoteChange={onNoteChange}
                    loading={noteLoading}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                {/* Obaveštenja - zamrznuta */}
                <Card sx={{ 
                    height: '100%',
                    backgroundColor: colors.primary[500],
                    opacity: 0.6,
                    cursor: 'not-allowed'
                }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <NotificationsIcon sx={{ mr: 1, color: colors.grey[400] }} />
                            <Typography variant="h6" sx={{ color: colors.grey[400] }}>
                                Obaveštenja
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: colors.grey[500], fontStyle: 'italic' }}>
                            Funkcionalnost je trenutno u razvoju...
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default OverviewSection;