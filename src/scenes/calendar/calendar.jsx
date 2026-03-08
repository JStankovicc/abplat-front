import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import srLocale from "@fullcalendar/core/locales/sr";
import axios from "axios";
import { Box, Alert, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { API_BASE_URL } from "../../config/apiConfig";
import { getAuthHeaders } from "../../lib/api";
import { useCalendarEvents } from "../../hooks/useCalendarEvents";
import { EventContent, EventDialog, EventsSidebar } from "../../components/calendar";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
    <Box m="20px">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress />
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
      />

      <Box display="flex" justifyContent="space-between">
        <EventsSidebar
          events={currentEvents}
          loading={loading}
          colors={colors}
          onRefresh={debouncedFetch}
          onEventClick={handleEventClick}
        />

        <Box flex="1 1 75%" ml="15px">
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
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
