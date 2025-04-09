import { Card, CardContent, Typography } from "@mui/material";
import { Timeline as TimelineIcon } from "@mui/icons-material";
import {Timeline} from "@mui/lab";

const ProjectTimeline = () => {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimelineIcon sx={{ mr: 1 }} /> Vremenska linija
                </Typography>
                <Timeline compact />
            </CardContent>
        </Card>
    );
};

export default ProjectTimeline;