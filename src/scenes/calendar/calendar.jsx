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
  ListItemText,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Avatar,
  Chip,
  Checkbox,
  Divider,
  FormControlLabel
} from "@mui/material";
import { tokens } from "../../theme";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
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

  const handleDateClick = (selected) => {
    setDateClickInfo(selected);
    setEventDetails({
      ...eventDetails,
      start: selected.startStr,
      end: selected.endStr
    });
    setOpenAddDialog(true);
  };

  const handleAddEvent = () => {
    if (eventDetails.title && dateClickInfo) {
      const calendarApi = dateClickInfo.view.calendar;
      calendarApi.addEvent({
        id: `${dateClickInfo.dateStr}-${eventDetails.title}`,
        title: eventDetails.title,
        description: eventDetails.description,
        start: eventDetails.start,
        end: eventDetails.end,
        allDay: dateClickInfo.allDay,
        invitedUsers: eventDetails.invitedUsers,
        extendedProps: {
          description: eventDetails.description,
          invitedUsers: eventDetails.invitedUsers
        }
      });
      calendarApi.unselect();
    }
    setOpenAddDialog(false);
    setEventDetails({
      title: "",
      description: "",
      start: "",
      end: "",
      invitedUsers: []
    });
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

  const handleEventClick = (selected) => {
    setSelectedEvent(selected);
    setOpenDeleteDialog(true);
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      selectedEvent.event.remove();
    }
    setOpenDeleteDialog(false);
  };

  const eventContent = (eventInfo) => {
    const invitedUsers = eventInfo.event.extendedProps.invitedUsers || [];
    return (
        <Box>
          <Typography variant="body2">{eventInfo.event.title}</Typography>
          <Box display="flex" gap={0.5} mt={0.5}>
            {invitedUsers.map(userId => {
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

  return (
      <Box m="20px">
        {/* Add Event Dialog */}
        <Dialog
            open={openAddDialog}
            onClose={() => setOpenAddDialog(false)}
            fullWidth
            maxWidth="md"
        >
          <DialogTitle sx={{
            backgroundColor: colors.primary[400],
            color: colors.grey[100],
            borderBottom: `1px solid ${colors.grey[700]}`
          }}>
            Kreiraj Novi Događaj
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

            <Box display="flex" gap={2}>
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
            </Box>

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
            <Button
                onClick={() => setOpenAddDialog(false)}
                sx={{ color: colors.grey[100] }}
            >
              Otkaži
            </Button>
            <Button
                onClick={handleAddEvent}
                variant="contained"
                color="secondary"
                disabled={!eventDetails.title || !eventDetails.start || !eventDetails.end}
            >
              Kreiraj Događaj
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Event Dialog */}
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle sx={{ backgroundColor: colors.primary[400], color: colors.grey[100] }}>
            Potvrda brisanja
          </DialogTitle>
          <DialogContent sx={{ backgroundColor: colors.primary[400], padding: "20px" }}>
            <Typography variant="body1" sx={{ color: colors.grey[100] }}>
              Da li ste sigurni da želite da obrišete događaj:
              <br />
              <strong>"{selectedEvent?.event.title}"</strong>?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ backgroundColor: colors.primary[400], padding: "16px" }}>
            <Button
                onClick={() => setOpenDeleteDialog(false)}
                sx={{ color: colors.grey[100] }}
            >
              Otkaži
            </Button>
            <Button
                onClick={handleDeleteEvent}
                variant="contained"
                color="error"
            >
              Obriši
            </Button>
          </DialogActions>
        </Dialog>

        <Box display="flex" justifyContent="space-between">
          {/* CALENDAR SIDEBAR */}
          <Box
              flex="1 1 20%"
              backgroundColor={colors.primary[400]}
              p="15px"
              borderRadius="4px"
          >
            <Typography variant="h5">Događaji</Typography>
            <List>
              {currentEvents.map((event) => (
                  <ListItem
                      key={event.id}
                      sx={{
                        backgroundColor: colors.greenAccent[500],
                        margin: "10px 0",
                        borderRadius: "2px",
                      }}
                  >
                    <ListItemText
                        primary={event.title}
                        secondary={
                          <Box>
                            <Typography>
                              {new Date(event.start).toLocaleDateString('sr-RS', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Typography>
                            {event.extendedProps.description && (
                                <Typography variant="caption">
                                  {event.extendedProps.description}
                                </Typography>
                            )}
                          </Box>
                        }
                    />
                  </ListItem>
              ))}
            </List>
          </Box>

          {/* CALENDAR */}
          <Box flex="1 1 100%" ml="15px">
            <FullCalendar
                height="75vh"
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
                dayMaxEvents={true}
                select={handleDateClick}
                eventClick={handleEventClick}
                eventsSet={(events) => setCurrentEvents(events)}
                locales={[srLocale]}
                locale="sr"
                eventContent={eventContent}
                initialEvents={[
                  {
                    id: "12315",
                    title: "Sastanak",
                    description: "Planiranje projekta",
                    start: new Date().setHours(10, 0, 0),
                    end: new Date().setHours(12, 0, 0),
                    invitedUsers: [1, 2]
                  },
                ]}
            />
          </Box>
        </Box>
      </Box>
  );
};

export default Calendar;