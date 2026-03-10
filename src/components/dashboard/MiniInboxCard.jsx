import { Box, Typography, Avatar, Chip, Badge, keyframes } from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";

const shimmerAnim = keyframes`
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
`;

const ShimmerBlock = ({ colors, width = "100%", height = "12px", borderRadius = "4px", sx = {} }) => (
  <Box
    sx={{
      width,
      height,
      borderRadius,
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
      ...sx,
    }}
  />
);

const MiniInboxCard = ({ colors, lastMessage, onInboxClick }) => (
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
    onClick={onInboxClick}
  >
    {/* Header */}
    <Box display="flex" alignItems="center" justifyContent="space-between" mb="12px">
      <Box display="flex" alignItems="center" gap={1.5}>
        <Box
          sx={{
            backgroundColor: `${colors.greenAccent[700]}60`,
            borderRadius: "50%",
            p: 0.9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${colors.greenAccent[600]}50`,
          }}
        >
          <MessageIcon sx={{ color: colors.greenAccent[400], fontSize: "1.1rem" }} />
        </Box>
        <Typography variant="h6" fontWeight="600" color={colors.grey[100]} sx={{ fontSize: "0.9rem" }}>
          Inbox
        </Typography>
      </Box>
      {lastMessage?.unreadCount > 0 && (
        <Badge
          badgeContent={lastMessage.unreadCount}
          color="error"
          sx={{ "& .MuiBadge-badge": { fontSize: "0.65rem", minWidth: "18px", height: "18px" } }}
        />
      )}
    </Box>

    {/* Content */}
    <Box flex={1}>
      {lastMessage ? (
        <Box>
          <Box
            display="flex"
            alignItems="center"
            gap={1.5}
            mb={1.2}
            sx={{
              p: "8px 10px",
              borderRadius: "8px",
              bgcolor: `${colors.primary[600]}60`,
              border: `1px solid ${colors.primary[600]}80`,
            }}
          >
            <Avatar
              sx={{
                bgcolor: colors.greenAccent[600],
                width: 34,
                height: 34,
                fontSize: "0.85rem",
                fontWeight: "bold",
                flexShrink: 0,
              }}
            >
              {lastMessage.sender?.[0]?.toUpperCase() || "?"}
            </Avatar>
            <Box flex={1} minWidth={0}>
              <Box display="flex" alignItems="center" justifyContent="space-between" gap={0.5}>
                <Typography
                  variant="subtitle2"
                  color={colors.grey[100]}
                  fontWeight="600"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: "0.82rem",
                  }}
                >
                  {lastMessage.sender}
                </Typography>
                {lastMessage.unread && (
                  <MarkEmailUnreadIcon sx={{ fontSize: "0.85rem", color: colors.redAccent[400], flexShrink: 0 }} />
                )}
              </Box>
              <Box display="flex" alignItems="center" gap={0.4}>
                <AccessTimeIcon sx={{ fontSize: "0.65rem", color: colors.grey[400] }} />
                <Typography variant="caption" color={colors.grey[400]} sx={{ fontSize: "0.68rem" }}>
                  {lastMessage.timestamp}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Typography
            variant="body2"
            color={colors.grey[300]}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              lineHeight: 1.5,
              fontSize: "0.8rem",
              px: 0.5,
            }}
          >
            {lastMessage.content}
          </Typography>

          {lastMessage.unread && (
            <Box mt={1.5}>
              <Chip
                label="Nova poruka"
                size="small"
                color="error"
                sx={{ fontSize: "0.65rem", height: "18px" }}
              />
            </Box>
          )}
        </Box>
      ) : (
        <Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={1.5}
            mb={1}
          >
            <MessageIcon sx={{ fontSize: "2rem", color: colors.grey[500], mb: 1 }} />
            <Typography color={colors.grey[400]} variant="body2" sx={{ fontSize: "0.78rem" }}>
              Nema novih poruka
            </Typography>
          </Box>
          <ShimmerBlock colors={colors} height="36px" borderRadius="8px" sx={{ mb: 1 }} />
          <ShimmerBlock colors={colors} height="11px" width="80%" sx={{ mb: 0.7 }} />
          <ShimmerBlock colors={colors} height="11px" width="60%" />
        </Box>
      )}
    </Box>

    {/* Footer */}
    <Box mt={1.5} pt={1.2} borderTop={`1px solid ${colors.primary[600]}80`}>
      <Typography variant="caption" color={colors.greenAccent[400]} fontWeight="600" sx={{ fontSize: "0.72rem" }}>
        Otvori inbox →
      </Typography>
    </Box>
  </Box>
);

export default MiniInboxCard;
