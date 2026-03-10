import { Box, Typography, Chip, keyframes } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AssignmentReturnOutlinedIcon from "@mui/icons-material/AssignmentReturnOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import { useNavigate } from "react-router-dom";

const shimmerAnim = keyframes`
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
`;

const ShimmerRow = ({ colors, width = "100%" }) => (
  <Box
    sx={{
      width,
      height: "11px",
      borderRadius: "4px",
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
    }}
  />
);

const CONFIGS = {
  requests: {
    title: "Zahtevi za inventar",
    subtitle: "Zahtevi na čekanju",
    icon: Inventory2OutlinedIcon,
    accentKey: "greenAccent",
    dotWidths: ["70%", "55%", "80%"],
  },
  returns: {
    title: "Povrati inventara",
    subtitle: "Povrati na obradi",
    icon: AssignmentReturnOutlinedIcon,
    accentKey: "redAccent",
    dotWidths: ["65%", "75%", "50%"],
  },
  stock: {
    title: "Stanje zaliha",
    subtitle: "Pregled nivoa zaliha",
    icon: AssessmentOutlinedIcon,
    accentKey: "blueAccent",
    dotWidths: ["60%", "85%", "45%"],
  },
};

const InventoryQuickCard = ({ colors, type = "requests" }) => {
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
      }}
      onClick={() => navigate("/inventory")}
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
        color={colors.grey[100]}
        mb={0.3}
        fontWeight="600"
        sx={{ fontSize: "0.85rem" }}
      >
        {cfg.title}
      </Typography>
      <Typography
        variant="caption"
        color={colors.grey[400]}
        mb={1.5}
        sx={{ fontSize: "0.72rem", display: "block" }}
      >
        {cfg.subtitle}
      </Typography>

      {cfg.dotWidths.map((w, i) => (
        <Box key={i} display="flex" alignItems="center" gap={1} mb={1}>
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              bgcolor: accent[500],
              flexShrink: 0,
              opacity: 0.8,
            }}
          />
          <ShimmerRow colors={colors} width={w} />
        </Box>
      ))}
    </Box>
  );
};

export default InventoryQuickCard;
