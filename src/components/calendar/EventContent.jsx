import { Box, Typography, Avatar } from "@mui/material";

const PRIORITY_COLORS = {
  LOW: "grey",
  NORMAL: "greenAccent",
  HIGH: "blueAccent",
  URGENT: "redAccent",
};

/**
 * Custom event content renderer for FullCalendar.
 */
const EventContent = ({ eventInfo, colors }) => {
  const startTime =
    eventInfo.event.start?.toLocaleTimeString("sr-RS", {
      hour: "2-digit",
      minute: "2-digit",
    }) || "";

  const priority = eventInfo.event.extendedProps.priority;
  const priorityColor =
    colors[PRIORITY_COLORS[priority] || "greenAccent"]?.[500] || colors.greenAccent[500];

  return (
    <Box
      sx={{
        p: 0.5,
        backgroundColor: priorityColor,
        borderRadius: "4px",
        color: colors.grey[100],
        margin: "2px",
      }}
    >
      <Typography variant="caption" display="block">
        {startTime}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {eventInfo.event.title}
      </Typography>
      {eventInfo.event.extendedProps.teamName && (
        <Typography variant="caption" display="block" sx={{ fontStyle: "italic" }}>
          👥 {eventInfo.event.extendedProps.teamName}
        </Typography>
      )}
      {eventInfo.event.extendedProps.description && (
        <Typography
          variant="caption"
          display="block"
          sx={{ whiteSpace: "normal", lineHeight: 1.2 }}
        >
          {eventInfo.event.extendedProps.description}
        </Typography>
      )}
      <Box display="flex" gap={0.5} mt={0.5}>
        {eventInfo.event.extendedProps.participants?.slice(0, 3).map((participant) => (
          <Avatar
            key={participant.userId}
            sx={{
              width: 20,
              height: 20,
              fontSize: "0.7rem",
              bgcolor: colors.blueAccent[500],
            }}
          >
            {participant.userName
              ? participant.userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              : "?"}
          </Avatar>
        ))}
        {eventInfo.event.extendedProps.participants?.length > 3 && (
          <Typography variant="caption" sx={{ alignSelf: "center", ml: 0.5 }}>
            +{eventInfo.event.extendedProps.participants.length - 3}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default EventContent;
