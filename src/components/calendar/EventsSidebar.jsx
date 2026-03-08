import {
  Box,
  List,
  ListItem,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const PRIORITY_COLORS = {
  LOW: "grey",
  NORMAL: "greenAccent",
  HIGH: "blueAccent",
  URGENT: "redAccent",
};

/**
 * Sidebar listing all calendar events.
 */
const EventsSidebar = ({
  events,
  loading,
  colors,
  onRefresh,
  onEventClick,
}) => (
  <Box
    flex="1 1 25%"
    backgroundColor={colors.primary[400]}
    p="15px"
    borderRadius="4px"
    sx={{ overflowY: "auto", maxHeight: "85vh" }}
  >
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h5">Svi Događaji ({events.length})</Typography>
      <Tooltip title="Osveži događaje">
        <IconButton onClick={onRefresh} disabled={loading} sx={{ color: colors.grey[100] }}>
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
      {events.map((event) => {
        const start = new Date(event.start);
        const end = new Date(event.end);
        const priority = event.extendedProps.priority;
        const priorityColor =
          colors[PRIORITY_COLORS[priority] || "greenAccent"]?.[500] || colors.greenAccent[500];

        return (
          <ListItem
            key={event.id}
            sx={{
              backgroundColor: priorityColor,
              margin: "10px 0",
              borderRadius: "4px",
              flexDirection: "column",
              alignItems: "flex-start",
              cursor: "pointer",
              "&:hover": { opacity: 0.8 },
            }}
            onClick={() => {
              const clickInfo = {
                event: {
                  id: event.id,
                  title: event.title,
                  start: event.start,
                  end: event.end,
                  extendedProps: event.extendedProps,
                },
              };
              onEventClick(clickInfo);
            }}
          >
            <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
              <Typography variant="h6">{event.title}</Typography>
              <Chip
                label={priority}
                size="small"
                sx={{ bgcolor: colors.grey[700], color: colors.grey[100] }}
              />
            </Box>

            <Typography variant="body2" sx={{ mt: 1 }}>
              {start.toLocaleDateString("sr-RS", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>

            <Typography variant="caption">
              {start.toLocaleTimeString("sr-RS", { hour: "2-digit", minute: "2-digit" })} -{" "}
              {end.toLocaleTimeString("sr-RS", { hour: "2-digit", minute: "2-digit" })}
            </Typography>

            {event.extendedProps.teamName && (
              <Typography variant="caption" sx={{ fontStyle: "italic", mt: 0.5 }}>
                👥 {event.extendedProps.teamName}
              </Typography>
            )}

            {event.extendedProps.createdByUserName && (
              <Typography variant="caption" sx={{ fontStyle: "italic", mt: 0.5 }}>
                👤 Kreirao: {event.extendedProps.createdByUserName}
              </Typography>
            )}

            {event.extendedProps.description && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {event.extendedProps.description}
              </Typography>
            )}

            <Box display="flex" flexDirection="column" gap={1} mt={1} width="100%">
              {event.extendedProps.participants?.length > 0 && (
                <Box display="flex" flexWrap="wrap" gap={1}>
                  <Typography variant="caption" sx={{ alignSelf: "center" }}>
                    Učesnici:
                  </Typography>
                  {event.extendedProps.participants.slice(0, 3).map((participant) => (
                    <Chip
                      key={participant.userId}
                      avatar={
                        <Avatar
                          sx={{
                            bgcolor: colors.blueAccent[500],
                            width: 20,
                            height: 20,
                            fontSize: "0.7rem",
                          }}
                        >
                          {participant.userName
                            ? participant.userName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : "?"}
                        </Avatar>
                      }
                      label={participant.userName}
                      size="small"
                      sx={{ height: 24 }}
                    />
                  ))}
                  {event.extendedProps.participants.length > 3 && (
                    <Typography variant="caption" sx={{ alignSelf: "center" }}>
                      +{event.extendedProps.participants.length - 3} još
                    </Typography>
                  )}
                </Box>
              )}

              {event.extendedProps.teamName && (
                <Box display="flex" flexWrap="wrap" gap={1}>
                  <Typography variant="caption" sx={{ alignSelf: "center" }}>
                    Tim:
                  </Typography>
                  <Chip label={event.extendedProps.teamName} size="small" color="primary" sx={{ height: 24 }} />
                </Box>
              )}
            </Box>
          </ListItem>
        );
      })}
    </List>
  </Box>
);

export default EventsSidebar;
