import { useState } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { tokens } from "../../theme";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

// Mock podaci
const mockEvents = [
    {
        id: "1",
        title: "Sastanak sa Markom",
        start: "2024-03-20T10:00:00",
        end: "2024-03-20T11:00:00",
        type: "sastanak"
    },
    {
        id: "2",
        title: "Demo prezentacija",
        start: "2024-03-21T14:00:00",
        end: "2024-03-21T15:30:00",
        type: "demo"
    },
    {
        id: "3",
        title: "Pregovori sa klijentom",
        start: "2024-03-22T09:00:00",
        end: "2024-03-22T10:00:00",
        type: "pregovori"
    }
];

const SalesCalendar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:768px)");
    const [events, setEvents] = useState(mockEvents);

    const handleEventClick = (info) => {
        alert(`Događaj: ${info.event.title}`);
    };

    const handleDateSelect = (selectInfo) => {
        const title = prompt("Unesite naziv događaja:");
        if (title) {
            const calendarApi = selectInfo.view.calendar;
            calendarApi.unselect();

            const newEvent = {
                id: String(events.length + 1),
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                type: "sastanak"
            };

            setEvents([...events, newEvent]);
        }
    };

    return (
        <Box
            sx={{
                height: "100%",
                "& .fc": {
                    backgroundColor: colors.primary[600],
                    color: colors.grey[100],
                    borderRadius: "4px",
                    padding: "10px"
                },
                "& .fc-toolbar-title": {
                    color: colors.grey[100]
                },
                "& .fc-button": {
                    backgroundColor: colors.primary[400],
                    borderColor: colors.primary[400],
                    color: colors.grey[100],
                    "&:hover": {
                        backgroundColor: colors.primary[500],
                        borderColor: colors.primary[500]
                    }
                },
                "& .fc-daygrid-day": {
                    backgroundColor: colors.primary[500]
                },
                "& .fc-event": {
                    backgroundColor: colors.greenAccent[500],
                    borderColor: colors.greenAccent[500],
                    "&:hover": {
                        backgroundColor: colors.greenAccent[600],
                        borderColor: colors.greenAccent[600]
                    }
                },
                "& .fc-day-today": {
                    backgroundColor: colors.primary[400]
                }
            }}
        >
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: isMobile ? "timeGridDay" : "dayGridMonth,timeGridWeek,timeGridDay"
                }}
                initialView={isMobile ? "timeGridDay" : "dayGridMonth"}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                events={events}
                select={handleDateSelect}
                eventClick={handleEventClick}
                height="100%"
                locale="sr"
                buttonText={{
                    today: "Danas",
                    month: "Mesec",
                    week: "Nedelja",
                    day: "Dan"
                }}
            />
        </Box>
    );
};

export default SalesCalendar; 