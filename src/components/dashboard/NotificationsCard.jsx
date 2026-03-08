import { Box, Typography, Chip } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Lock as LockIcon } from "@mui/icons-material";

/**
 * Locked notifications section with "Coming soon" overlay.
 */
const NotificationsCard = ({ colors }) => (
  <Box
    sx={{
      gridColumn: "span 8",
      gridRow: "span 3",
      backgroundColor: colors.primary[400],
      borderRadius: "12px",
      p: "15px",
      background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
      overflow: "hidden",
      position: "relative",
      height: "100%",
    }}
  >
    <Box display="flex" alignItems="center" justifyContent="space-between" mb="15px">
      <Box display="flex" alignItems="center">
        <Box
          sx={{
            backgroundColor: colors.grey[600],
            borderRadius: "50%",
            p: 1,
            mr: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <NotificationsIcon sx={{ color: colors.grey[400], fontSize: "1.2rem" }} />
        </Box>
        <Typography variant="h6" fontWeight="600" color={colors.grey[400]}>
          Obaveštenja
        </Typography>
      </Box>
      <Chip
        label="Uskoro"
        size="small"
        sx={{
          bgcolor: colors.grey[700],
          color: colors.grey[300],
          fontSize: "0.7rem",
        }}
      />
    </Box>

    <Box
      sx={{
        height: "calc(100% - 60px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Blurred background content */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.15,
          filter: "blur(2px)",
        }}
      >
        {[1, 2, 3, 4].map((item) => (
          <Box
            key={item}
            sx={{
              display: "flex",
              alignItems: "center",
              p: 2,
              mb: 1,
              borderRadius: "8px",
              bgcolor: colors.primary[500],
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: colors.grey[600],
                mr: 2,
              }}
            />
            <Box flex={1}>
              <Box
                sx={{
                  height: 12,
                  width: "60%",
                  bgcolor: colors.grey[600],
                  borderRadius: 1,
                  mb: 1,
                }}
              />
              <Box
                sx={{
                  height: 8,
                  width: "80%",
                  bgcolor: colors.grey[700],
                  borderRadius: 1,
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>

      {/* Lock icon and text */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          bgcolor: `${colors.primary[500]}E0`,
          borderRadius: 3,
          p: 4,
          backdropFilter: "blur(4px)",
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            bgcolor: colors.grey[700],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <LockIcon sx={{ fontSize: 32, color: colors.grey[400] }} />
        </Box>
        <Typography variant="h6" color={colors.grey[300]} fontWeight="500" mb={1}>
          Funkcionalnost u izradi
        </Typography>
        <Typography variant="body2" color={colors.grey[500]} textAlign="center">
          Obaveštenja će biti dostupna uskoro
        </Typography>
      </Box>
    </Box>
  </Box>
);

export default NotificationsCard;
