import { Box, Typography, Chip, keyframes } from "@mui/material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import CircleIcon from "@mui/icons-material/Circle";

const shimmerAnim = keyframes`
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
`;

const ShimmerBlock = ({ colors, width = "100%", height = "12px", borderRadius = "6px", sx = {} }) => (
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

const MOCK_NOTIF_WIDTHS = [
  { avatar: true, title: "72%", body: "55%" },
  { avatar: true, title: "60%", body: "80%" },
  { avatar: true, title: "85%", body: "65%" },
  { avatar: false, title: "68%", body: "50%" },
];

const NotificationsCard = ({ colors }) => (
  <Box
    sx={{
      backgroundColor: colors.primary[400],
      borderRadius: "12px",
      p: "15px",
      background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      minHeight: { xs: 200, md: 240 },
    }}
  >
    {/* Header */}
    <Box display="flex" alignItems="center" justifyContent="space-between" mb="12px">
      <Box display="flex" alignItems="center" gap={1.5}>
        <Box
          sx={{
            backgroundColor: `${colors.grey[600]}80`,
            borderRadius: "50%",
            p: 0.9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${colors.grey[600]}50`,
          }}
        >
          <NotificationsOutlinedIcon sx={{ color: colors.grey[300], fontSize: "1.1rem" }} />
        </Box>
        <Typography variant="h6" fontWeight="600" color={colors.grey[300]} sx={{ fontSize: "0.9rem" }}>
          Obaveštenja
        </Typography>
      </Box>
      <Chip
        label="Uskoro"
        size="small"
        sx={{
          bgcolor: `${colors.grey[700]}80`,
          color: colors.grey[400],
          fontSize: "0.63rem",
          height: "18px",
          border: `1px solid ${colors.grey[600]}50`,
        }}
      />
    </Box>

    {/* Shimmer notification items */}
    <Box flex={1} sx={{ opacity: 0.5 }}>
      {MOCK_NOTIF_WIDTHS.map((item, i) => (
        <Box
          key={i}
          display="flex"
          alignItems="flex-start"
          gap={1.5}
          mb={1.2}
          sx={{
            p: "8px 10px",
            borderRadius: "8px",
            bgcolor: `${colors.primary[600]}40`,
          }}
        >
          {item.avatar && (
            <ShimmerBlock
              colors={colors}
              width="30px"
              height="30px"
              borderRadius="50%"
              sx={{ flexShrink: 0 }}
            />
          )}
          {!item.avatar && (
            <Box sx={{ width: 30, height: 30, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CircleIcon sx={{ fontSize: "0.5rem", color: colors.grey[600] }} />
            </Box>
          )}
          <Box flex={1}>
            <ShimmerBlock colors={colors} width={item.title} height="11px" sx={{ mb: 0.7 }} />
            <ShimmerBlock colors={colors} width={item.body} height="9px" />
          </Box>
        </Box>
      ))}
    </Box>

    {/* Footer lock notice */}
    <Box mt={1.5} pt={1.2} borderTop={`1px solid ${colors.primary[600]}80`}>
      <Typography variant="caption" color={colors.grey[500]} sx={{ fontSize: "0.72rem" }}>
        Funkcionalnost u izradi
      </Typography>
    </Box>
  </Box>
);

export default NotificationsCard;
