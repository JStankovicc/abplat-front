import { Box, Typography, Chip, keyframes } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { useNavigate } from "react-router-dom";

const shimmerAnim = keyframes`
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
`;

const ShimmerBlock = ({ colors, width = "100%", height = "14px", borderRadius = "6px", sx = {} }) => (
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
        background: `linear-gradient(90deg, transparent, ${colors.primary[400]}80, transparent)`,
        animation: `${shimmerAnim} 1.8s infinite`,
      },
      ...sx,
    }}
  />
);

const FleetQuickCard = ({ colors }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundColor: colors.primary[400],
        borderRadius: "12px",
        p: "16px",
        cursor: "pointer",
        transition: "all 0.25s ease",
        "&:hover": {
          backgroundColor: colors.primary[300],
          transform: "translateY(-3px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        },
        background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
      }}
      onClick={() => navigate("/fleet")}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box
          sx={{
            backgroundColor: `${colors.greenAccent[700]}50`,
            borderRadius: "50%",
            p: 0.9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${colors.greenAccent[600]}50`,
          }}
        >
          <DirectionsCarIcon sx={{ color: colors.greenAccent[400], fontSize: "1.15rem" }} />
        </Box>
        <Chip
          label="U pripremi"
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
      <Typography variant="body2" color={colors.grey[100]} mb={0.3} fontWeight="600" sx={{ fontSize: "0.85rem" }}>
        Vozni park
      </Typography>
      <Typography variant="caption" color={colors.grey[400]} mb={1.5} sx={{ fontSize: "0.72rem", display: "block" }}>
        Vozila i vozači
      </Typography>
      <ShimmerBlock colors={colors} height="26px" width="75%" sx={{ mb: 0.8 }} />
      <ShimmerBlock colors={colors} height="11px" width="55%" />
    </Box>
  );
};

export default FleetQuickCard;
