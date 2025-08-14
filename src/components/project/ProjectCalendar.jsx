import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Box, useTheme } from '@mui/material';
import { tokens } from '../../theme';

const ProjectCalendar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const events = [
        {
            title: 'Team Meeting',
            start: new Date(),
            end: new Date(new Date().setHours(new Date().getHours() + 1)),
        },
        {
            title: 'Project Deadline',
            start: new Date(new Date().setDate(new Date().getDate() + 3)),
        }
    ];

    return (
        <Box sx={{ 
            height: "calc(100vh - 200px)",
            p: 3,
            backgroundColor: colors.primary[400],
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            '& .fc-theme-standard .fc-scrollgrid': {
                borderColor: colors.grey[700]
            },
            '& .fc-theme-standard th': {
                backgroundColor: colors.primary[500],
                color: colors.grey[100],
                borderColor: colors.grey[700]
            },
            '& .fc-theme-standard td': {
                borderColor: colors.grey[700]
            },
            '& .fc-day-today': {
                backgroundColor: `${colors.primary[600]} !important`
            },
            '& .fc-button-primary': {
                backgroundColor: colors.primary[500],
                borderColor: colors.grey[700],
                '&:hover': {
                    backgroundColor: colors.primary[600]
                }
            },
            '& .fc-button-active': {
                backgroundColor: `${colors.primary[600]} !important`
            },
            '& .fc-event': {
                backgroundColor: colors.primary[500],
                borderColor: colors.primary[500],
                color: colors.grey[100]
            },
            '& .fc-toolbar-title': {
                color: colors.grey[100]
            },
            '& .fc-col-header-cell-cushion': {
                color: colors.grey[100]
            }
        }}>
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    height="100%"
                    contentHeight="100%"
                    aspectRatio={1.8}
                    expandRows={true}
                    stickyHeaderDates={true}
                    dayMaxEvents={true}
                    themeSystem="standard"
                    nowIndicator={true}
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEventRows={true}
                    weekends={true}
                    businessHours={{
                        daysOfWeek: [1, 2, 3, 4, 5],
                        startTime: '09:00',
                        endTime: '17:00',
                    }}
                    eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        meridiem: false
                    }}
                    slotMinTime="08:00:00"
                    slotMaxTime="18:00:00"
                    allDaySlot={false}
                    slotDuration="00:30:00"
                    slotLabelInterval="01:00"
                    slotLabelFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        meridiem: false
                    }}
                />
            </Box>
        </Box>
    );
};

export default ProjectCalendar;