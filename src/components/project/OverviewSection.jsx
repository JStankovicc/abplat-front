// src/components/project/OverviewSection.jsx
import { Grid } from "@mui/material";
import MyTasks from "./MyTasks";
import ProjectTimeline from "./ProjectTimeline";
import Notes from "./Notes";
import Notifications from "./Notifications";

const OverviewSection = ({ noteValue, onNoteChange, noteLoading }) => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <MyTasks />
            </Grid>
            <Grid item xs={12} md={6}>
                <ProjectTimeline />
            </Grid>
            <Grid item xs={12} md={6}>
                <Notes 
                    note={noteValue}
                    onNoteChange={onNoteChange}
                    loading={noteLoading}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Notifications />
            </Grid>
        </Grid>
    );
};

export default OverviewSection;