import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import srLocale from "@fullcalendar/core/locales/sr";
import {
  Box,
  List,
  ListItem,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Avatar,
  Checkbox,
  FormControlLabel,
  Divider,
  Grid, Chip
} from "@mui/material";
import { tokens } from "../../theme";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dateClickInfo, setDateClickInfo] = useState(null);

  const [eventDetails, setEventDetails] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    invitedUsers: []
  });

  const mockUsers = [
    { id: 1, firstName: "Marko", lastName: "Marković", color: "#ff5722" },
    { id: 2, firstName: "Ana", lastName: "Anić", color: "#2196f3" },
    { id: 3, firstName: "Jovan", lastName: "Jovanović", color: "#4caf50" },
    { id: 4, firstName: "Milica", lastName: "Milić", color: "#9c27b0" }
  ];

  const eventContent = (eventInfo) => {

    const startTime = eventInfo.event.start?.toLocaleTimeString('sr-RS', {

      hour: '2-digit',

      minute: '2-digit'

    }) || '';



    return (

        <Box sx={{

          p: 0.5,

          backgroundColor: colors.greenAccent[500],

          borderRadius: '4px',

          color: colors.grey[100],

          margin: '2px'

        }}>

          <Typography variant="caption" display="block">

            {startTime}

          </Typography>

          <Typography variant="body2" sx={{ fontWeight: 500 }}>

            {eventInfo.event.title}

          </Typography>

          {eventInfo.event.extendedProps.description && (

              <Typography variant="caption" display="block" sx={{

                whiteSpace: 'normal',

                lineHeight: 1.2

              }}>

                {eventInfo.event.extendedProps.description}

              </Typography>

          )}

          <Box display="flex" gap={0.5} mt={0.5}>

            {eventInfo.event.extendedProps.invitedUsers?.map(userId => {

              const user = mockUsers.find(u => u.id === userId);

              return (

                  <Avatar

                      key={userId}

                      sx={{

                        width: 20,

                        height: 20,

                        fontSize: '0.7rem',

                        bgcolor: user?.color

                      }}

                  >

                    {user?.firstName[0]}{user?.lastName[0]}

                  </Avatar>

              );

            })}

          </Box>

        </Box>

    );

  };

  const handleDateClick = (selected) => {
    const startDate = new Date(selected.startStr);
    const endDate = new Date(selected.endStr);

    setDateClickInfo(selected);
    setEventDetails({
      title: "",
      description: "",
      start: startDate.toISOString().slice(0, 16),
      end: endDate.toISOString().slice(0, 16),
      invitedUsers: []
    });
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    const start = new Date(event.start);
    const end = new Date(event.end);

    setSelectedEvent(clickInfo);
    setEventDetails({
      title: event.title,
      description: event.extendedProps.description,
      start: start.toISOString().slice(0, 16),
      end: end.toISOString().slice(0, 16),
      invitedUsers: event.extendedProps.invitedUsers
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleSaveEvent = () => {
    const calendarApi = dateClickInfo?.view?.calendar;

    if (isEditing && selectedEvent) {
      selectedEvent.event.setProp('title', eventDetails.title);
      selectedEvent.event.setExtendedProp('description', eventDetails.description);
      selectedEvent.event.setStart(eventDetails.start);
      selectedEvent.event.setEnd(eventDetails.end);
      selectedEvent.event.setExtendedProp('invitedUsers', eventDetails.invitedUsers);
    } else {
      calendarApi.addEvent({
        id: `${Date.now()}-${eventDetails.title}`,
        title: eventDetails.title,
        description: eventDetails.description,
        start: eventDetails.start,
        end: eventDetails.end,
        extendedProps: {
          description: eventDetails.description,
          invitedUsers: eventDetails.invitedUsers
        }
      });
    }

    setOpenDialog(false);
    resetForm();
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      selectedEvent.event.remove();
    }
    setOpenDialog(false);
    resetForm();
  };

  const handleUserSelect = (userId) => {
    const users = [...eventDetails.invitedUsers];
    const index = users.indexOf(userId);
    if (index === -1) {
      users.push(userId);
    } else {
      users.splice(index, 1);
    }
    setEventDetails({ ...eventDetails, invitedUsers: users });
  };

  const resetForm = () => {
    setEventDetails({
      title: "",
      description: "",
      start: "",
      end: "",
      invitedUsers: []
    });
    setSelectedEvent(null);
  };

  return (
      <Box m="20px">
        {/* Event Dialog */}
        <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            fullWidth
            maxWidth="md"
        >
          <DialogTitle sx={{
            backgroundColor: colors.primary[400],
            color: colors.grey[100],
            borderBottom: `1px solid ${colors.grey[700]}`
          }}>
            {isEditing ? "Uredi Događaj" : "Novi Događaj"}
          </DialogTitle>
          <DialogContent sx={{
            backgroundColor: colors.primary[400],
            padding: "20px",
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <TextField
                fullWidth
                label="Naziv događaja"
                value={eventDetails.title}
                onChange={(e) => setEventDetails({...eventDetails, title: e.target.value})}
                required
                sx={{
                  "& .MuiInputBase-input": { color: colors.grey[100] },
                  "& .MuiInputLabel-root": { color: colors.grey[100] }
                }}
            />

            <TextField
                fullWidth
                label="Opis događaja"
                multiline
                rows={3}
                value={eventDetails.description}
                onChange={(e) => setEventDetails({...eventDetails, description: e.target.value})}
                sx={{
                  "& .MuiInputBase-input": { color: colors.grey[100] },
                  "& .MuiInputLabel-root": { color: colors.grey[100] }
                }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label="Početak"
                    type="datetime-local"
                    value={eventDetails.start}
                    onChange={(e) => setEventDetails({...eventDetails, start: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      "& .MuiInputBase-input": { color: colors.grey[100] },
                      "& .MuiInputLabel-root": { color: colors.grey[100] }
                    }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label="Kraj"
                    type="datetime-local"
                    value={eventDetails.end}
                    onChange={(e) => setEventDetails({...eventDetails, end: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      "& .MuiInputBase-input": { color: colors.grey[100] },
                      "& .MuiInputLabel-root": { color: colors.grey[100] }
                    }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ borderColor: colors.grey[700] }} />

            <Typography variant="h6" sx={{ color: colors.grey[100] }}>
              Pozovi učesnike:
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={1}>
              {mockUsers.map(user => (
                  <FormControlLabel
                      key={user.id}
                      control={
                        <Checkbox
                            checked={eventDetails.invitedUsers.includes(user.id)}
                            onChange={() => handleUserSelect(user.id)}
                            sx={{
                              color: colors.grey[100],
                              '&.Mui-checked': {
                                color: user.color,
                              },
                            }}
                        />
                      }
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{
                            bgcolor: user.color,
                            width: 24,
                            height: 24
                          }}>
                            {user.firstName[0]}{user.lastName[0]}
                          </Avatar>
                          <Typography sx={{ color: colors.grey[100] }}>
                            {user.firstName} {user.lastName}
                          </Typography>
                        </Box>
                      }
                  />
              ))}
            </Box>
          </DialogContent>
          <DialogActions sx={{
            backgroundColor: colors.primary[400],
            padding: "16px",
            borderTop: `1px solid ${colors.grey[700]}`
          }}>
            {isEditing && (
                <Button
                    onClick={handleDeleteEvent}
                    variant="contained"
                    color="error"
                >
                  Obriši
                </Button>
            )}
            <Button
                onClick={() => setOpenDialog(false)}
                sx={{ color: colors.grey[100] }}
            >
              Otkaži
            </Button>
            <Button
                onClick={handleSaveEvent}
                variant="contained"
                color="secondary"
                disabled={!eventDetails.title || !eventDetails.start || !eventDetails.end}
            >
              {isEditing ? "Sačuvaj" : "Kreiraj"}
            </Button>
          </DialogActions>
        </Dialog>

        <Box display="flex" justifyContent="space-between">
          {/* Sidebar with Event Details */}
          <Box
              flex="1 1 25%"
              backgroundColor={colors.primary[400]}
              p="15px"
              borderRadius="4px"
              sx={{ overflowY: 'auto', maxHeight: '85vh' }}
          >
            <Typography variant="h5" mb={2}>Svi Događaji</Typography>
            <List>
              {currentEvents.map((event) => {
                const start = new Date(event.start);
                const end = new Date(event.end);

                return (
                    <ListItem
                        key={event.id}
                        sx={{
                          backgroundColor: colors.greenAccent[500],
                          margin: "10px 0",
                          borderRadius: "2px",
                          flexDirection: 'column',
                          alignItems: 'flex-start'
                        }}
                    >
                      <Typography variant="h6">{event.title}</Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {start.toLocaleDateString('sr-RS', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                      <Typography variant="caption">
                        {start.toLocaleTimeString('sr-RS', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {end.toLocaleTimeString('sr-RS', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      </Typography>
                      {event.extendedProps.description && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {event.extendedProps.description}
                          </Typography>
                      )}
                      <Box display="flex" gap={1} mt={1}>
                        {event.extendedProps.invitedUsers?.map(userId => {
                          const user = mockUsers.find(u => u.id === userId);
                          return (
                              <Chip
                                  key={userId}
                                  avatar={
                                    <Avatar sx={{
                                      bgcolor: user?.color,
                                      width: 24,
                                      height: 24
                                    }}>
                                      {user?.firstName[0]}
                                    </Avatar>
                                  }
                                  label={`${user?.firstName} ${user?.lastName}`}
                                  size="small"
                              />
                          );
                        })}
                      </Box>
                    </ListItem>
                );
              })}
            </List>
          </Box>

          {/* Calendar */}
          <Box flex="1 1 75%" ml="15px">
            <FullCalendar
                height="85vh"
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  interactionPlugin,
                  listPlugin,
                ]}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                }}
                initialView="dayGridMonth"
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={2}
                select={handleDateClick}
                eventClick={handleEventClick}
                eventsSet={(events) => setCurrentEvents(events)}
                locales={[srLocale]}
                locale="sr"
                eventContent={eventContent}
                eventOrder={(a, b) => {
                  const aDuration = a.end - a.start;
                  const bDuration = b.end - b.start;
                  return aDuration - bDuration;
                }}
                initialEvents={[
                  {
                    id: "1",
                    title: "Sastanak tima",
                    description: "Dnevna standup sastanka",
                    start: "2025-02-15T09:00:00",
                    end: "2025-02-15T09:30:00",
                    invitedUsers: [1, 2, 3]
                  },
                  {
                    id: "2",
                    title: "Planiranje projekta",
                    description: "Razrada detalja novog projekta",
                    start: "2025-02-15T14:00:00",
                    end: "2025-02-15T17:00:00",
                    invitedUsers: [1, 4]
                  },
                  {
                    id: "3",
                    title: "Obuka novih zaposlenih",
                    description: "Uvod u sisteme kompanije",
                    start: "2025-02-16T10:00:00",
                    end: "2025-02-16T12:00:00",
                    invitedUsers: [2, 3]
                  }
                ]}
            />
          </Box>
        </Box>
      </Box>
  );
};

export default Calendar;