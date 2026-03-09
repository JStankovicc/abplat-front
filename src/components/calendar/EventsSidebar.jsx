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
  useTheme,
  useMediaQuery,
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
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
  <Box
    flex={{ xs: "1 1 auto", md: "1 1 25%" }}
    minWidth={{ xs: "100%", md: 200 }}
    maxWidth={{ md: 320 }}
    minHeight={{ xs: 300, md: 0 }}
    backgroundColor={isMobile ? "transparent" : colors.primary[400]}
    p={{ xs: 2.5, md: "15px" }}
    borderRadius={isMobile ? 0 : 4}
    sx={{
      overflowY: "auto",
      maxHeight: { xs: "none", md: "85vh" },
      pb: isMobile ? 16 : 0,
    }}
  >
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={isMobile ? 2.5 : 2}
      flexWrap="wrap"
      gap={1}
    >
      <Typography
        variant="h5"
        sx={{
          fontSize: isMobile ? "1.125rem" : "1.25rem",
          fontWeight: 600,
          color: colors.grey[100],
          letterSpacing: "-0.01em",
        }}
      >
        Događaji
        <Typography
          component="span"
          sx={{
            ml: 0.75,
            fontSize: "0.875rem",
            fontWeight: 500,
            color: colors.grey[200],
          }}
        >
          ({events.length})
        </Typography>
      </Typography>
      <Tooltip title="Osveži" enterDelay={400}>
        <IconButton
          onClick={onRefresh}
          disabled={loading}
          size="small"
          sx={{
            color: colors.grey[200],
            minWidth: 40,
            minHeight: 40,
            "&:hover": { color: colors.grey[100], backgroundColor: "rgba(255,255,255,0.08)" },
          }}
        >
          <RefreshIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>
    </Box>

    {loading && (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress size={28} thickness={4} />
      </Box>
    )}

    {!loading && events.length === 0 && (
      <Box
        sx={{
          py: 6,
          px: 2,
          textAlign: "center",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: colors.grey[200],
            fontSize: "1rem",
            lineHeight: 1.5,
            fontWeight: 500,
          }}
        >
          Nema zakazanih događaja.
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 1,
            color: colors.grey[400],
            fontSize: "0.875rem",
          }}
        >
          Koristite dugme ispod da dodate novi.
        </Typography>
      </Box>
    )}

    {!loading && events.length > 0 && (
    <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: isMobile ? 1.25 : 0 }}>
      {events.map((event) => {
        const start = new Date(event.start);
        const end = new Date(event.end);
        const priority = event.extendedProps.priority;
        const priorityColor =
          colors[PRIORITY_COLORS[priority] || "greenAccent"]?.[500] || colors.greenAccent[500];
        const priorityBorder = colors[PRIORITY_COLORS[priority] || "greenAccent"]?.[400] || colors.greenAccent[400];

        return (
          <ListItem
            key={event.id}
            disablePadding
            sx={{
              backgroundColor: isMobile ? colors.primary[400] : priorityColor,
              margin: isMobile ? 0 : "10px 0",
              borderRadius: isMobile ? 10 : 4,
              flexDirection: "column",
              alignItems: "flex-start",
              cursor: "pointer",
              p: isMobile ? 1.75 : 2,
              minHeight: isMobile ? 76 : "auto",
              borderLeft: isMobile ? `5px solid ${priorityBorder}` : "none",
              boxShadow: isMobile
                ? "0 1px 4px rgba(0,0,0,0.2)"
                : "none",
              transition: "box-shadow 0.2s ease, transform 0.15s ease",
              "&:hover": {
                boxShadow: isMobile ? "0 4px 12px rgba(0,0,0,0.18)" : "none",
                opacity: isMobile ? 1 : 0.9,
              },
              "&:active": isMobile ? { transform: "scale(0.99)" } : {},
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
            <Box display="flex" justifyContent="space-between" width="100%" alignItems="flex-start" gap={1}>
              <Typography
                variant="h6"
                sx={{
                  flex: 1,
                  fontSize: isMobile ? "1rem" : undefined,
                  fontWeight: 600,
                  lineHeight: 1.35,
                  color: colors.grey[100],
                }}
              >
                {event.title}
              </Typography>
              <Chip
                label={priority}
                size="small"
                sx={{
                  bgcolor: isMobile ? priorityColor : colors.grey[700],
                  color: isMobile ? "#fff" : colors.grey[100],
                  flexShrink: 0,
                  fontSize: isMobile ? "0.7rem" : undefined,
                  fontWeight: 600,
                }}
              />
            </Box>

            <Typography
              variant="body2"
              sx={{
                mt: 1,
                fontSize: isMobile ? "0.875rem" : undefined,
                color: colors.grey[100],
                fontWeight: 500,
              }}
            >
              {start.toLocaleDateString("sr-RS", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 0.5,
                fontSize: isMobile ? "0.8125rem" : undefined,
                color: colors.grey[200],
                fontWeight: 500,
              }}
            >
              {start.toLocaleTimeString("sr-RS", { hour: "2-digit", minute: "2-digit" })} –{" "}
              {end.toLocaleTimeString("sr-RS", { hour: "2-digit", minute: "2-digit" })}
            </Typography>

            {event.extendedProps.teamName && (
              <Typography variant="caption" sx={{ fontStyle: "italic", mt: 0.5, color: colors.grey[200], fontSize: "0.75rem" }}>
                👥 {event.extendedProps.teamName}
              </Typography>
            )}

            {event.extendedProps.createdByUserName && (
              <Typography variant="caption" sx={{ fontStyle: "italic", mt: 0.5, color: colors.grey[200], fontSize: "0.75rem" }}>
                👤 Kreirao: {event.extendedProps.createdByUserName}
              </Typography>
            )}

            {event.extendedProps.description && (
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  fontSize: isMobile ? "0.8125rem" : undefined,
                  color: colors.grey[200],
                  ...(isMobile && {
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }),
                }}
              >
                {event.extendedProps.description}
              </Typography>
            )}

            {!isMobile && (
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
            )}
          </ListItem>
        );
      })}
    </List>
    )}
  </Box>
  );
};

export default EventsSidebar;
