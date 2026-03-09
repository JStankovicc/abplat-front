import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import srLocale from "@fullcalendar/core/locales/sr";
import axios from "axios";
import { Box, Alert, CircularProgress, useMediaQuery, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { API_BASE_URL } from "../../config/apiConfig";
import { getAuthHeaders } from "../../lib/api";
import { useCalendarEvents } from "../../hooks/useCalendarEvents";
import { EventContent, EventDialog, EventsSidebar } from "../../components/calendar";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    currentEvents,
    loading,
    error,
    setError,
    fetchMyEvents,
    debouncedFetch,
  } = useCalendarEvents();

  const [saveLoading, setSaveLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDetails, setEventDetails] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    location: "",
    priority: "NORMAL",
    participantUserIds: [],
    groupParticipants: [],
  });

  const resetForm = () => {
    setEventDetails({
      title: "",
      description: "",
      location: "",
      priority: "NORMAL",
      start: "",
      end: "",
      participantUserIds: [],
      groupParticipants: [],
    });
    setSelectedEvent(null);
    setError(null);
  };

  const openNewEventDialog = () => {
    const now = new Date();
    const end = new Date(now.getTime() + 60 * 60 * 1000);
    setEventDetails({
      title: "",
      description: "",
      location: "",
      priority: "NORMAL",
      start: now.toISOString().slice(0, 16),
      end: end.toISOString().slice(0, 16),
      participantUserIds: [],
      groupParticipants: [],
    });
    setIsEditing(false);
    setSelectedEvent(null);
    setOpenDialog(true);
  };

  const handleDateClick = (selected) => {
    const startDate = new Date(selected.startStr);
    const endDate = new Date(selected.endStr);

    setEventDetails({
      title: "",
      description: "",
      location: "",
      priority: "NORMAL",
      start: startDate.toISOString().slice(0, 16),
      end: endDate.toISOString().slice(0, 16),
      participantUserIds: [],
      groupParticipants: [],
    });
    setIsEditing(false);
    setSelectedEvent(null);
    setOpenDialog(true);
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    const start = new Date(event.start);
    const end = new Date(event.end);

    setSelectedEvent(clickInfo);
    setEventDetails({
      title: event.title,
      description: event.extendedProps.description || "",
      location: "",
      priority: event.extendedProps.priority || "NORMAL",
      start: start.toISOString().slice(0, 16),
      end: end.toISOString().slice(0, 16),
      participantUserIds: event.extendedProps.participants?.map((p) => p.userId) || [],
      groupParticipants: [],
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleSaveEvent = async () => {
    try {
      setSaveLoading(true);
      setError(null);

      const eventPayload = {
        title: eventDetails.title,
        description: eventDetails.description,
        priority: eventDetails.priority,
        startDateTime: new Date(eventDetails.start).toISOString(),
        endDateTime: new Date(eventDetails.end).toISOString(),
        participantUserIds: eventDetails.participantUserIds,
      };

      if (isEditing && selectedEvent) {
        await axios.put(
          `${API_BASE_URL}/calendar/events/${selectedEvent.event.id}`,
          eventPayload,
          { headers: getAuthHeaders() }
        );
      } else {
        await axios.post(`${API_BASE_URL}/calendar/events`, eventPayload, {
          headers: getAuthHeaders(),
        });
      }

      await fetchMyEvents();
      setOpenDialog(false);
      resetForm();
    } catch (err) {
      console.error("Failed to save event:", err);
      setError("Greška pri čuvanju događaja");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      setSaveLoading(true);
      setError(null);

      await axios.delete(
        `${API_BASE_URL}/calendar/events/${selectedEvent.event.id}`,
        { headers: getAuthHeaders() }
      );

      await fetchMyEvents();
      setOpenDialog(false);
      resetForm();
    } catch (err) {
      console.error("Failed to delete event:", err);
      setError("Greška pri brisanju događaja");
    } finally {
      setSaveLoading(false);
    }
  };

  const eventContent = (eventInfo) => (
    <EventContent eventInfo={eventInfo} colors={colors} />
  );

  return (
    <Box
      m={{ xs: 0, sm: 2, md: "20px" }}
      px={{ xs: 2, sm: 0 }}
      sx={{
        pb: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        paddingBottom: isMobile ? "96px" : 2,
        paddingLeft: isMobile ? "max(16px, env(safe-area-inset-left))" : undefined,
        paddingRight: isMobile ? "max(16px, env(safe-area-inset-right))" : undefined,
      }}
    >
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 2,
            "& .MuiAlert-message": { fontSize: "0.875rem" },
          }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" py={3}>
          <CircularProgress size={32} thickness={3.6} />
        </Box>
      )}

      <EventDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        isEditing={isEditing}
        eventDetails={eventDetails}
        onEventDetailsChange={setEventDetails}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        loading={saveLoading}
        colors={colors}
        fullScreen={isMobile}
      />

      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        gap={{ xs: 1, md: 0 }}
        sx={{ flex: 1, minHeight: 0, "& > *": { minWidth: 0 } }}
      >
        {isMobile ? (
          <>
            <EventsSidebar
              events={currentEvents}
              loading={loading}
              colors={colors}
              onRefresh={debouncedFetch}
              onEventClick={handleEventClick}
            />
            <Fab
              color="secondary"
              aria-label="Dodaj događaj"
              onClick={openNewEventDialog}
              sx={{
                position: "fixed",
                left: "50%",
                transform: "translateX(-50%)",
                bottom: "max(80px, calc(env(safe-area-inset-bottom) + 28px))",
                zIndex: 1100,
                width: 56,
                height: 56,
                boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                },
                "&:active": {
                  transform: "translateX(-50%) scale(0.96)",
                },
              }}
            >
              <AddIcon sx={{ fontSize: 28 }} />
            </Fab>
          </>
        ) : (
          <>
            <EventsSidebar
              events={currentEvents}
              loading={loading}
              colors={colors}
              onRefresh={debouncedFetch}
              onEventClick={handleEventClick}
            />
            <Box flex="1 1 75%" ml="15px" sx={{ minWidth: 0 }}>
              <FullCalendar
                height="85vh"
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                }}
                initialView="dayGridMonth"
                editable={false}
                selectable
                selectMirror
                dayMaxEvents={3}
                select={handleDateClick}
                eventClick={handleEventClick}
                events={currentEvents}
                locales={[srLocale]}
                locale="sr"
                eventContent={eventContent}
                eventOrder={(a, b) => (a.end - a.start) - (b.end - b.start)}
                fixedWeekCount={false}
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Calendar;
