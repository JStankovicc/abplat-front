import { Box, Typography, Chip, keyframes } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
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

const CONFIGS = {
  revenue: {
    title: "Prihod ovog meseca",
    icon: TrendingUpIcon,
    accentKey: "greenAccent",
    bigValue: "XX.XXX RSD",
    subValue: "+X% vs prošlog meseca",
  },
  leads: {
    title: "Aktivni leadovi",
    icon: PeopleOutlineIcon,
    accentKey: "blueAccent",
    bigValue: "XXX",
    subValue: "X novih ove sedmice",
  },
  goal: {
    title: "Cilj meseca",
    icon: TrackChangesIcon,
    accentKey: "redAccent",
    bigValue: "XX%",
    subValue: "Završeno od cilja",
  },
};

const SalesQuickCard = ({ colors, type = "revenue" }) => {
  const navigate = useNavigate();
  const cfg = CONFIGS[type];
  const Icon = cfg.icon;
  const accent = colors[cfg.accentKey];

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
        position: "relative",
        overflow: "hidden",
      }}
      onClick={() => navigate("/sales")}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box
          sx={{
            backgroundColor: `${accent[700]}50`,
            borderRadius: "50%",
            p: 0.9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${accent[600]}50`,
          }}
        >
          <Icon sx={{ color: accent[400], fontSize: "1.15rem" }} />
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

      <Typography
        variant="body2"
        color={colors.grey[300]}
        mb={1.2}
        sx={{ fontSize: "0.78rem", fontWeight: 500 }}
      >
        {cfg.title}
      </Typography>

      <ShimmerBlock colors={colors} height="26px" width="75%" borderRadius="6px" sx={{ mb: 0.8 }} />
      <ShimmerBlock colors={colors} height="11px" width="55%" borderRadius="4px" />
    </Box>
  );
};

export default SalesQuickCard;
