import { Box, Typography, Avatar, Chip, Badge } from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Shimmer from "../Shimmer";

/**
 * Mini inbox card showing last message preview.
 */
const MiniInboxCard = ({ colors, lastMessage, onInboxClick }) => (
  <Box
    sx={{
      gridColumn: "span 4",
      gridRow: "span 3",
      backgroundColor: colors.primary[400],
      borderRadius: "12px",
      p: "15px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: colors.primary[300],
        transform: "translateY(-2px)",
        boxShadow: 6,
      },
      background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
    }}
    onClick={onInboxClick}
  >
    <Box display="flex" alignItems="center" mb="10px">
      <Box
        sx={{
          backgroundColor: colors.greenAccent[500],
          borderRadius: "50%",
          p: 1,
          mr: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MessageIcon sx={{ color: colors.grey[100], fontSize: "1.2rem" }} />
      </Box>
      <Typography variant="h6" fontWeight="600" color={colors.grey[100]}>
        Poslednje poruke
      </Typography>
      {lastMessage?.unreadCount > 0 && (
        <Badge badgeContent={lastMessage.unreadCount} color="error" sx={{ ml: "auto" }} />
      )}
    </Box>

    {lastMessage ? (
      <Box>
        <Box display="flex" alignItems="center" mb="8px">
          <Avatar
            sx={{
              bgcolor: colors.greenAccent[500],
              width: 36,
              height: 36,
              mr: 2,
              fontSize: "0.9rem",
              fontWeight: "bold",
            }}
          >
            {lastMessage.sender[0]}
          </Avatar>
          <Box flex={1}>
            <Typography variant="subtitle1" color={colors.grey[100]} fontWeight="500">
              {lastMessage.sender}
            </Typography>
            <Box display="flex" alignItems="center">
              <AccessTimeIcon sx={{ fontSize: "0.8rem", mr: 0.5, color: colors.grey[300] }} />
              <Typography variant="caption" color={colors.grey[300]}>
                {lastMessage.timestamp}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Typography
          variant="body2"
          color={colors.grey[200]}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.4,
          }}
        >
          {lastMessage.content}
        </Typography>
        <Box
          mt={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          onClick={onInboxClick}
          sx={{ cursor: "pointer" }}
        >
          <Typography variant="caption" color={colors.greenAccent[500]} fontWeight="500">
            Kliknite da otvorite inbox →
          </Typography>
          {lastMessage.unread && (
            <Chip
              label="Nova"
              size="small"
              color="error"
              sx={{ fontSize: "0.7rem", height: "20px" }}
            />
          )}
        </Box>
      </Box>
    ) : (
      <Box textAlign="center" py={2}>
        <MessageIcon sx={{ fontSize: "3rem", color: colors.grey[400], mb: 2 }} />
        <Typography color={colors.grey[300]} variant="body1">
          Nema poruka
        </Typography>
        <Box mt={2}>
          <Shimmer width="120px" height="12px" sx={{ mx: "auto", mb: 1 }} />
          <Shimmer width="80px" height="10px" sx={{ mx: "auto", mb: 1 }} />
          <Shimmer width="100px" height="10px" sx={{ mx: "auto" }} />
        </Box>
      </Box>
    )}
  </Box>
);

export default MiniInboxCard;
