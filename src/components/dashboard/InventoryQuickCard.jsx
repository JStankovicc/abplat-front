import { Box, Typography, keyframes } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import wmsService from "../../services/wmsService";

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
  stock: { title: "Stanje zaliha", subtitle: "Ukupne jedinice", icon: Inventory2OutlinedIcon, accentKey: "blueAccent" },
  lowStock: { title: "Niske zalihe", subtitle: "SKU ispod praga", icon: WarningAmberOutlinedIcon, accentKey: "redAccent" },
  tasks: { title: "Aktivni taskovi", subtitle: "WMS operacije", icon: AssignmentTurnedInOutlinedIcon, accentKey: "greenAccent" },
  processing: { title: "Orders u obradi", subtitle: "Čekaju fulfillment", icon: LocalShippingOutlinedIcon, accentKey: "orangeAccent" },
};

const InventoryQuickCard = ({ colors, type = "stock" }) => {
  const navigate = useNavigate();
  const cfg = CONFIGS[type] || CONFIGS.stock;
  const Icon = cfg.icon;
  const accentPalette = colors?.[cfg.accentKey] || {};
  const accent = {
    400: accentPalette[400] || colors?.greenAccent?.[400] || "#4cceac",
    500: accentPalette[500] || colors?.greenAccent?.[500] || "#4cceac",
    600: accentPalette[600] || accentPalette[500] || "#4cceac",
    700: accentPalette[700] || accentPalette[600] || accentPalette[500] || "#4cceac",
  };
  const [value, setValue] = useState("-");

  useEffect(() => {
    const load = async () => {
      const response = await wmsService.getDashboard();
      const data = response.data;
      const mappedValue = {
        stock: data.inventory?.totalUnits ?? 0,
        lowStock: data.inventory?.lowStockSkus ?? 0,
        tasks: data.tasks?.active ?? 0,
        processing: data.orders?.inProcessing ?? 0,
      }[type];
      setValue(mappedValue);
    };
    load();
  }, [type]);

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
        <Typography variant="caption" color={colors.grey[300]}>{cfg.subtitle}</Typography>
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
      <Typography variant="h4" color={colors.grey[100]} sx={{ mb: 1.5 }}>{value}</Typography>

      {["72%", "55%", "80%"].map((w, i) => (
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
