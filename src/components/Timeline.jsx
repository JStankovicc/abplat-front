import { Box, Typography } from "@mui/material";
import { Timeline as MuiTimeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent } from "@mui/lab";

const Timeline = ({ compact = false }) => {
    const events = [
        { date: '2023-12-01', title: 'Početak projekta' },
        { date: '2024-01-15', title: 'Prva faza završena' },
        { date: '2024-02-28', title: 'Testiranje' },
        { date: '2024-03-15', title: 'Finalna verzija' },
    ];

    return (
        <MuiTimeline position={compact ? "right" : "alternate"} sx={{ p: 0 }}>
            {events.map((event, index) => (
                <TimelineItem key={event.date}>
                    <TimelineSeparator>
                        <TimelineDot color="primary" />
                        {index < events.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                        <Typography variant="body1" fontWeight="bold">{event.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{event.date}</Typography>
                    </TimelineContent>
                </TimelineItem>
            ))}
        </MuiTimeline>
    );
};

export default Timeline;