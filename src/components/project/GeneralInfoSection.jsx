import { Box, Typography, Paper } from '@mui/material';

const GeneralInfoSection = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h3" gutterBottom>
            Project Name
        </Typography>
        <Box display="flex" gap={4} flexWrap="wrap">
            <InfoItem title="Status" value="In Progress" />
            <InfoItem title="Project Manager" value="John Doe" />
            <InfoItem title="Deadline" value="2024-03-15" />
        </Box>
        <Typography variant="body1" mt={2}>
            Project description and key objectives will be displayed here.
        </Typography>
    </Paper>
);

const InfoItem = ({ title, value }) => (
    <Box>
        <Typography variant="h6" color="textSecondary">{title}</Typography>
        <Typography variant="h5">{value}</Typography>
    </Box>
);

export default GeneralInfoSection;