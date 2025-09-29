import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import srLocale from "@fullcalendar/core/locales/sr";
import axios from "axios";
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
  Grid, 
  Chip,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RefreshIcon from "@mui/icons-material/Refresh";
import { tokens } from "../../theme";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dateClickInfo, setDateClickInfo] = useState(null);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Data states
  const [companyUsers, setCompanyUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [eventDetails, setEventDetails] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    location: "",
    priority: "NORMAL",
    participantUserIds: [],
    groupParticipants: []
  });

  // API Base URL
  const API_BASE_URL = "http://localhost:8080/api/v1/calendar";

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      "Authorization": `Bearer ${token}`
    };
  };

  // Debounce function to prevent spam
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // API Functions
  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const calendarViewRequest = {};

      const response = await axios.post(`${API_BASE_URL}/events/my`, calendarViewRequest, {
        headers: getAuthHeaders()
      });
      console.log('My events response:', response.data);
      
      const formattedEvents = response.data.map(event => ({
        id: event.id,
        title: event.title,
        start: event.startDateTime,
        end: event.endDateTime,
        extendedProps: {
          description: event.description,
          priority: event.priority,
          createdByUserId: event.createdByUserId,
          createdByUserName: event.createdByUserName,
          teamId: event.teamId,
          teamName: event.teamName,
          participants: event.participants,
          createdAt: event.createdAt,
          updatedAt: event.updatedAt
        }
      }));
      
      setCurrentEvents(formattedEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setError('Greška pri učitavanju događaja');
    } finally {
      setLoading(false);
    }
  };

  // Note: Company users, teams, and departments are not available via /calendar endpoints
  // These would need to be fetched from separate endpoints or included in calendar responses

  // Debounced version of fetchMyEvents to prevent spam
  const debouncedFetchMyEvents = debounce(fetchMyEvents, 1000); // 1 sekunda

  // useEffect for initial data loading
  useEffect(() => {
    // Load only calendar events since other endpoints are not available
    fetchMyEvents();
  }, []); // Samo jednom kad se komponenta mount-uje

  const eventContent = (eventInfo) => {
    const startTime = eventInfo.event.start?.toLocaleTimeString('sr-RS', {
      hour: '2-digit',
      minute: '2-digit'
    }) || '';

    const priority = eventInfo.event.extendedProps.priority;
    const priorityColor = {
      LOW: colors.grey[500],
      NORMAL: colors.greenAccent[500],
      HIGH: colors.blueAccent[500],
      URGENT: colors.redAccent[500]
    }[priority] || colors.greenAccent[500];

    return (
      <Box sx={{
        p: 0.5,
        backgroundColor: priorityColor,
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
        {eventInfo.event.extendedProps.teamName && (
          <Typography variant="caption" display="block" sx={{ fontStyle: 'italic' }}>
            👥 {eventInfo.event.extendedProps.teamName}
          </Typography>
        )}
        {eventInfo.event.extendedProps.description && (
          <Typography variant="caption" display="block" sx={{
            whiteSpace: 'normal',
            lineHeight: 1.2
          }}>
            {eventInfo.event.extendedProps.description}
          </Typography>
        )}
        <Box display="flex" gap={0.5} mt={0.5}>
          {eventInfo.event.extendedProps.participants?.slice(0, 3).map(participant => (
            <Avatar
              key={participant.userId}
              sx={{
                width: 20,
                height: 20,
                fontSize: '0.7rem',
                bgcolor: colors.blueAccent[500]
              }}
            >
              {participant.userName ? participant.userName.split(' ').map(n => n[0]).join('') : '?'}
            </Avatar>
          ))}
          {eventInfo.event.extendedProps.participants?.length > 3 && (
            <Typography variant="caption" sx={{ alignSelf: 'center', ml: 0.5 }}>
              +{eventInfo.event.extendedProps.participants.length - 3}
            </Typography>
          )}
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
      location: "", // Keep for form but not used
      priority: "NORMAL",
      start: startDate.toISOString().slice(0, 16),
      end: endDate.toISOString().slice(0, 16),
      participantUserIds: [],
      groupParticipants: [] // Keep for form but not used
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
      location: "", // Backend doesn't have location field
      priority: event.extendedProps.priority || "NORMAL",
      start: start.toISOString().slice(0, 16),
      end: end.toISOString().slice(0, 16),
      participantUserIds: event.extendedProps.participants?.map(p => p.userId) || [],
      groupParticipants: [] // Backend doesn't have groupParticipants
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleSaveEvent = async () => {
    try {
      setLoading(true);
      setError(null);

      const eventPayload = {
        title: eventDetails.title,
        description: eventDetails.description,
        priority: eventDetails.priority,
        startDateTime: new Date(eventDetails.start).toISOString(),
        endDateTime: new Date(eventDetails.end).toISOString(),
        participantUserIds: eventDetails.participantUserIds
        // Note: location and groupParticipants not supported by backend yet
      };

      if (isEditing && selectedEvent) {
        // Update existing event
        const response = await axios.put(`${API_BASE_URL}/events/${selectedEvent.event.id}`, eventPayload, {
          headers: getAuthHeaders()
        });
        console.log('Update event response:', response.data);
      } else {
        // Create new event
        const response = await axios.post(`${API_BASE_URL}/events`, eventPayload, {
          headers: getAuthHeaders()
        });
        console.log('Create event response:', response.data);
      }

      // Refresh events
      await fetchMyEvents();
      setOpenDialog(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save event:', error);
      setError('Greška pri čuvanju događaja');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.delete(`${API_BASE_URL}/events/${selectedEvent.event.id}`, {
        headers: getAuthHeaders()
      });
      console.log('Delete event response:', response.status);

      // Refresh events
      await fetchMyEvents();
      setOpenDialog(false);
      resetForm();
    } catch (error) {
      console.error('Failed to delete event:', error);
      setError('Greška pri brisanju događaja');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (userId) => {
    const users = [...eventDetails.participantUserIds];
    const index = users.indexOf(userId);
    if (index === -1) {
      users.push(userId);
    } else {
      users.splice(index, 1);
    }
    setEventDetails({ ...eventDetails, participantUserIds: users });
  };

  const handleGroupSelect = (groupType, groupId) => {
    const groups = [...eventDetails.groupParticipants];
    const existingIndex = groups.findIndex(g => g.groupType === groupType && g.groupId === groupId);
    
    if (existingIndex === -1) {
      groups.push({ groupType, groupId });
    } else {
      groups.splice(existingIndex, 1);
    }
    
    setEventDetails({ ...eventDetails, groupParticipants: groups });
  };

  // Get team events
  const fetchTeamEvents = async (teamId, startDate, endDate) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_BASE_URL}/events/team/${teamId}`, {
        headers: getAuthHeaders(),
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      console.log('Team events response:', response.data);

      return response.data;
    } catch (error) {
      console.error('Failed to fetch team events:', error);
      setError('Greška pri učitavanju timskih događaja');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Respond to event invitation
  const respondToEvent = async (eventId, participationStatus) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${API_BASE_URL}/events/${eventId}/respond`, null, {
        headers: getAuthHeaders(),
        params: { response: participationStatus }
      });
      console.log('Respond to event:', response.status);

      // Refresh events to update status
      await fetchMyEvents();
    } catch (error) {
      console.error('Failed to respond to event:', error);
      setError('Greška pri odgovaranju na poziv');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEventDetails({
      title: "",
      description: "",
      location: "", // Keep for form consistency but not sent to backend
      priority: "NORMAL",
      start: "",
      end: "",
      participantUserIds: [],
      groupParticipants: [] // Keep for form consistency but not sent to backend
    });
    setSelectedEvent(null);
    setError(null);
  };

  return (
      <Box m="20px">
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Loading overlay */}
        {loading && (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress />
          </Box>
        )}

        {/* Event Dialog */}
        <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            fullWidth
            maxWidth="lg"
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
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
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
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: colors.grey[100] }}>Prioritet</InputLabel>
                  <Select
                    value={eventDetails.priority}
                    onChange={(e) => setEventDetails({...eventDetails, priority: e.target.value})}
                    sx={{
                      color: colors.grey[100],
                      "& .MuiSelect-icon": { color: colors.grey[100] }
                    }}
                  >
                    <MenuItem value="LOW">Nizak</MenuItem>
                    <MenuItem value="NORMAL">Normalan</MenuItem>
                    <MenuItem value="HIGH">Visok</MenuItem>
                    <MenuItem value="URGENT">Hitan</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

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

            {/* Location field removed - not supported by backend yet */}

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

            {/* Napomena o učesnicima */}
            <Typography variant="body2" sx={{ color: colors.grey[300], fontStyle: 'italic', mt: 2 }}>
              Napomena: Učesnici se dodaju kroz backend logiku na osnovu team-a i ostalih parametara.
              Trenutno možete kreirati događaj samo sa osnovnim podacima.
            </Typography>
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
                    disabled={loading}
                >
                  Obriši
                </Button>
            )}
            <Button
                onClick={() => setOpenDialog(false)}
                sx={{ color: colors.grey[100] }}
                disabled={loading}
            >
              Otkaži
            </Button>
            <Button
                onClick={handleSaveEvent}
                variant="contained"
                color="secondary"
                disabled={loading || !eventDetails.title || !eventDetails.start || !eventDetails.end}
                startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? "Čuva..." : isEditing ? "Sačuvaj" : "Kreiraj"}
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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5">
                Svi Događaji ({currentEvents.length})
              </Typography>
              <Tooltip title="Osveži događaje">
                <IconButton 
                  onClick={debouncedFetchMyEvents}
                  disabled={loading}
                  sx={{ color: colors.grey[100] }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
            
            {loading && (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress />
              </Box>
            )}
            
            <List>
              {currentEvents.map((event) => {
                const start = new Date(event.start);
                const end = new Date(event.end);
                const priority = event.extendedProps.priority;
                const priorityColor = {
                  LOW: colors.grey[500],
                  NORMAL: colors.greenAccent[500],
                  HIGH: colors.blueAccent[500],
                  URGENT: colors.redAccent[500]
                }[priority] || colors.greenAccent[500];

                return (
                    <ListItem
                        key={event.id}
                        sx={{
                          backgroundColor: priorityColor,
                          margin: "10px 0",
                          borderRadius: "4px",
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          cursor: 'pointer',
                          '&:hover': {
                            opacity: 0.8
                          }
                        }}
                        onClick={() => {
                          // Simulacija click eventa za editing
                          const clickInfo = {
                            event: {
                              id: event.id,
                              title: event.title,
                              start: event.start,
                              end: event.end,
                              extendedProps: event.extendedProps
                            }
                          };
                          handleEventClick(clickInfo);
                        }}
                    >
                      <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                        <Typography variant="h6">{event.title}</Typography>
                        <Chip 
                          label={priority} 
                          size="small"
                          sx={{ 
                            bgcolor: colors.grey[700],
                            color: colors.grey[100]
                          }}
                        />
                      </Box>
                      
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

                      {event.extendedProps.teamName && (
                        <Typography variant="caption" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                          👥 {event.extendedProps.teamName}
                        </Typography>
                      )}
                      
                      {event.extendedProps.createdByUserName && (
                        <Typography variant="caption" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                          👤 Kreirao: {event.extendedProps.createdByUserName}
                        </Typography>
                      )}
                      
                      {event.extendedProps.description && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {event.extendedProps.description}
                          </Typography>
                      )}
                      
                      {/* Prikaz učesnika */}
                      <Box display="flex" flexDirection="column" gap={1} mt={1} width="100%">
                        {event.extendedProps.participants?.length > 0 && (
                          <Box display="flex" flexWrap="wrap" gap={1}>
                            <Typography variant="caption" sx={{ alignSelf: 'center' }}>
                              Učesnici:
                            </Typography>
                            {event.extendedProps.participants.slice(0, 3).map(participant => (
                              <Chip
                                key={participant.userId}
                                avatar={
                                  <Avatar sx={{
                                    bgcolor: colors.blueAccent[500],
                                    width: 20,
                                    height: 20,
                                    fontSize: '0.7rem'
                                  }}>
                                    {participant.userName ? participant.userName.split(' ').map(n => n[0]).join('') : '?'}
                                  </Avatar>
                                }
                                label={participant.userName}
                                size="small"
                                sx={{ height: 24 }}
                              />
                            ))}
                            {event.extendedProps.participants.length > 3 && (
                              <Typography variant="caption" sx={{ alignSelf: 'center' }}>
                                +{event.extendedProps.participants.length - 3} još
                              </Typography>
                            )}
                          </Box>
                        )}
                        
                        {/* Prikaz tima */}
                        {event.extendedProps.teamName && (
                          <Box display="flex" flexWrap="wrap" gap={1}>
                            <Typography variant="caption" sx={{ alignSelf: 'center' }}>
                              Tim:
                            </Typography>
                            <Chip
                              label={event.extendedProps.teamName}
                              size="small"
                              color="primary"
                              sx={{ height: 24 }}
                            />
                          </Box>
                        )}
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
                editable={false}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={3}
                select={handleDateClick}
                eventClick={handleEventClick}
                events={currentEvents}
                locales={[srLocale]}
                locale="sr"
                eventContent={eventContent}
                eventOrder={(a, b) => {
                  const aDuration = a.end - a.start;
                  const bDuration = b.end - b.start;
                  return aDuration - bDuration;
                }}
                datesSet={(dateInfo) => {
                  // Optionally refresh only when month/year changes significantly
                  // Remove auto-refresh to prevent spam
                }}
                // Uklanjamo loading callback koji može uzrokovati loop
            />
          </Box>
        </Box>
      </Box>
  );
};

export default Calendar;