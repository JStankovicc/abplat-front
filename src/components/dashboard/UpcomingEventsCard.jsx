import { Box, Typography, Chip, keyframes } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";
import { useCalendarEvents } from "../../hooks/useCalendarEvents";

const shimmerAnim = keyframes`
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
`;

const ShimmerRow = ({ colors, width = "100%" }) => (
  <Box
    sx={{
      width,
      height: "12px",
      borderRadius: "4px",
      backgroundColor: colors.primary[600],
      position: "relative",
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0, left: 0, width: "100%", height: "100%",
        background: `linear-gradient(90deg, transparent, ${colors.primary[400]}70, transparent)`,
        animation: `${shimmerAnim} 1.8s infinite`,
      },
    }}
  />
);

const formatEventDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (date.toDateString() === now.toDateString()) return "Danas";
  if (date.toDateString() === tomorrow.toDateString()) return "Sutra";
  return date.toLocaleDateString("sr-RS", { day: "2-digit", month: "short" });
};

const getPriorityColor = (priority, colors) => {
  switch ((priority || "").toUpperCase()) {
    case "HIGH": return colors.redAccent[400];
    case "MEDIUM": return "#f5a623";
    default: return colors.greenAccent[500];
  }
};

const UpcomingEventsCard = ({ colors }) => {
  const navigate = useNavigate();
  const { currentEvents, loading } = useCalendarEvents();

  const upcomingEvents = currentEvents
    .filter((e) => new Date(e.start) >= new Date())
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 4);

  return (
    <Box
      sx={{
        backgroundColor: colors.primary[400],
        borderRadius: "12px",
        p: "15px",
        cursor: "pointer",
        transition: "all 0.25s ease",
        "&:hover": {
          backgroundColor: colors.primary[300],
          transform: "translateY(-3px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        },
        background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: { xs: 200, md: 240 },
      }}
      onClick={() => navigate("/calendar")}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb="12px">
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              backgroundColor: `${colors.blueAccent[600]}80`,
              borderRadius: "50%",
              p: 0.9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${colors.blueAccent[500]}50`,
            }}
          >
            <CalendarTodayIcon sx={{ color: colors.blueAccent[300], fontSize: "1.1rem" }} />
          </Box>
          <Typography variant="h6" fontWeight="600" color={colors.grey[100]} sx={{ fontSize: "0.9rem" }}>
            Nadolazeći događaji
          </Typography>
        </Box>
        {!loading && upcomingEvents.length > 0 && (
          <Chip
            label={upcomingEvents.length}
            size="small"
            sx={{
              bgcolor: `${colors.blueAccent[700]}60`,
              color: colors.blueAccent[200],
              fontWeight: 700,
              fontSize: "0.7rem",
              height: "20px",
              border: `1px solid ${colors.blueAccent[600]}50`,
            }}
          />
        )}
      </Box>

      {/* Content */}
      <Box flex={1}>
        {loading ? (
          [1, 2, 3].map((i) => (
            <Box key={i} display="flex" alignItems="center" gap={1.5} mb={1.5}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "8px",
                  backgroundColor: colors.primary[600],
                  position: "relative",
                  overflow: "hidden",
                  flexShrink: 0,
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0, left: 0, width: "100%", height: "100%",
                    background: `linear-gradient(90deg, transparent, ${colors.primary[400]}70, transparent)`,
                    animation: `${shimmerAnim} 1.8s infinite`,
                  },
                }}
              />
              <Box flex={1}>
                <ShimmerRow colors={colors} width={`${65 + i * 8}%`} />
                <Box mt={0.6}>
                  <ShimmerRow colors={colors} width="40%" />
                </Box>
              </Box>
            </Box>
          ))
        ) : upcomingEvents.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={3}
            flex={1}
          >
            <EventBusyIcon sx={{ fontSize: "2.2rem", color: colors.grey[500], mb: 1 }} />
            <Typography color={colors.grey[400]} variant="body2" textAlign="center" sx={{ fontSize: "0.8rem" }}>
              Nema nadolazećih događaja
            </Typography>
          </Box>
        ) : (
          upcomingEvents.map((event) => (
            <Box
              key={event.id}
              display="flex"
              alignItems="center"
              gap={1.5}
              mb={1.2}
              sx={{
                p: "7px 10px",
                borderRadius: "8px",
                bgcolor: `${colors.primary[600]}60`,
                borderLeft: `3px solid ${getPriorityColor(event.extendedProps?.priority, colors)}`,
                transition: "background 0.2s",
                "&:hover": { bgcolor: `${colors.primary[600]}90` },
              }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "8px",
                  bgcolor: `${colors.blueAccent[900]}80`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  border: `1px solid ${colors.blueAccent[700]}50`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    color: colors.blueAccent[300],
                    lineHeight: 1.1,
                    textAlign: "center",
                  }}
                >
                  {formatEventDate(event.start)}
                </Typography>
              </Box>
              <Box flex={1} minWidth={0}>
                <Typography
                  variant="body2"
                  color={colors.grey[100]}
                  fontWeight="500"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: "0.8rem",
                  }}
                >
                  {event.title}
                </Typography>
                <Box display="flex" alignItems="center" gap={0.4} mt={0.2}>
                  <AccessTimeIcon sx={{ fontSize: "0.65rem", color: colors.grey[400] }} />
                  <Typography variant="caption" color={colors.grey[400]} sx={{ fontSize: "0.68rem" }}>
                    {new Date(event.start).toLocaleTimeString("sr-RS", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Box>

      {/* Footer */}
      <Box mt={1.5} pt={1.2} borderTop={`1px solid ${colors.primary[600]}80`}>
        <Typography variant="caption" color={colors.blueAccent[400]} fontWeight="600" sx={{ fontSize: "0.72rem" }}>
          Otvori kalendar →
        </Typography>
      </Box>
    </Box>
  );
};

export default UpcomingEventsCard;
